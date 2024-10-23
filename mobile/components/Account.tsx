import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Animated, TouchableOpacity, Alert, ScrollView, Modal } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logoutUser, setLoading } from '@/app/screens/userSlice';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from '@/baseUrl';
import * as Clipboard from 'expo-clipboard';
import { clearCart } from '@/app/screens/actionSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { updateUserInfo } from '@/app/screens/userSlice';

// Add this type definition at the top of your file
type RootStackParamList = {
  Login: undefined;
  // Add other screen names and their param types here
};

const Account = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [serviceProvider, setServiceProvider] = useState(userInfo.serviceProvider || '');
  const [registeredName, setRegisteredName] = useState('');
  const [showProviderModal, setShowProviderModal] = useState(false);

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleImageUpload = () => {
    Alert.alert('Feature Coming Soon', 'Image upload functionality will be implemented in a future update.');
  };

  const handleSave = async () => {
    console.log("saving...");
    console.log(editedInfo);
    try {
      dispatch(setLoading(true));
      const endpoint = userInfo.User === "User" ? '/api/buyer/profile' : '/api/seller/profile';
      const response = await axios.put(`${baseUrl}${endpoint}`, {
        ...editedInfo,
        serviceProvider
      }, {
        headers: { Authorization: `Bearer ${userInfo.userAuth}` },
      });
      
      console.log("Update response:", response.data);
      
      if (response.status === 200) {
        dispatch(updateUserInfo({...editedInfo, serviceProvider}));
        setEditMode(false);
        Alert.alert('Success', 'Your information has been updated.');
      } else {
        throw new Error('Unexpected response status: ' + response.status);
      }
    } catch (error) {
      console.error("Error in handleSave:", error);
      
      if (axios.isAxiosError(error)) {
        console.error("Axios error response:", error.response?.data);
        if (error.response?.status === 400 && error.response.data.registeredName) {
          setRegisteredName(error.response.data.registeredName);
          Alert.alert(
            'Name Mismatch',
            'The provided name does not match the name registered with the phone number. Please use the registered name or contact your service provider to update your information.',
            [
              { text: 'OK', onPress: () => setEditedInfo({...editedInfo, fullName: error.response?.data.registeredName}) }
            ]
          );
        } else {
          Alert.alert('Error', error.response?.data?.message || 'Failed to update your information. Please try again.');
        }
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleLogout = async () => {
    try {
      dispatch(setLoading(true));
      if (userInfo.User === "User") {
        await axios.post(`${baseUrl}/api/logout`, null, {
          headers: { Authorization: `Bearer ${userInfo.userAuth}` },
        });
      }else {
        await axios.post(`${baseUrl}/api/seller/logout`, null, {
          headers: { Authorization: `Bearer ${userInfo.userAuth}` },
        });
      }

      dispatch(clearCart())
      dispatch(logoutUser());
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const copyToClipboard = async (text: string) => {
    await Clipboard.setStringAsync(text);
    Alert.alert('Copied', 'ID copied to clipboard');
  };

  const handleProviderSelect = (provider: string) => {
    setServiceProvider(provider);
    setShowProviderModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Account</Text>
      </View>
      <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
        <TouchableOpacity onPress={handleImageUpload} style={styles.imageContainer}>
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
          <View style={styles.uploadIconContainer}>
            <Ionicons name="camera" size={24} color="white" />
          </View>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <InfoItem
            label="Username"
            value={editedInfo.User}
            editable={false}
            editMode={editMode}
            onChangeText={(text: string) => setEditedInfo({ ...editedInfo, User: text })}
          />
          {userInfo.User === "User" && (
            <>
              <InfoItem
                label="Full Name"
                value={editedInfo.fullName || ''}
                editMode={editMode}
                onChangeText={(text: string) => setEditedInfo({ ...editedInfo, fullName: text })}
              />
              <InfoItem
                label="Phone Number"
                value={editedInfo.phoneNumber || ''}
                editMode={editMode}
                onChangeText={(text: string) => setEditedInfo({ ...editedInfo, phoneNumber: text })}
              />
              {editMode && (
                <TouchableOpacity onPress={() => setShowProviderModal(true)} style={styles.providerButton}>
                  <Text style={styles.providerButtonText}>
                    {serviceProvider || 'Select Service Provider'}
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {userInfo.User === "Seller" && (
            <InfoItem
              label="Business Name"
              value={editedInfo.businessName || ''}
              editMode={editMode}
              onChangeText={(text: string) => setEditedInfo({ ...editedInfo, businessName: text })}
            />
          )}
          <InfoItem
            label="Email"
            value={editedInfo.email || ''}
            editMode={editMode}
            onChangeText={(text: string) => setEditedInfo({ ...editedInfo, email: text })}
          />
          <InfoItem
            label={editedInfo.User === "Seller" ? "Store ID" : "User ID"}
            value={editedInfo.userId}
            editable={false}
            editMode={editMode}
            onPress={() => copyToClipboard(editedInfo.userId)}
          />
        </View>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => editMode ? handleSave() : setEditMode(true)}
        >
          <Text style={styles.actionButtonText}>
            {editMode ? 'Save' : 'Edit Profile'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout} style={[styles.actionButton, styles.logoutButton]}>
          <Text style={styles.actionButtonText}>Logout</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={showProviderModal}
          onRequestClose={() => setShowProviderModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Service Provider</Text>
              {['MTN', 'Vodafone', 'AirtelTigo'].map((provider) => (
                <TouchableOpacity
                  key={provider}
                  style={styles.providerOption}
                  onPress={() => handleProviderSelect(provider)}
                >
                  <Text style={styles.providerOptionText}>{provider}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[styles.providerOption, styles.cancelOption]}
                onPress={() => setShowProviderModal(false)}
              >
                <Text style={styles.cancelOptionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </ScrollView>
  );
};

const InfoItem = ({ label, value, editMode, editable = true, onChangeText, onPress }: any) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}:</Text>
    {editMode && editable ? (
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label.toLowerCase()}`}
      />
    ) : (
      <TouchableOpacity onPress={onPress} disabled={!onPress}>
        <Text style={[styles.value, onPress && styles.copyableValue]}>{value || 'Not provided'}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6200EE",
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  card: {
    backgroundColor: "#F5F5F5",
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6200EE',
  },
  uploadIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#6200EE',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  value: {
    color: '#666',
    fontSize: 16,
  },
  copyableValue: {
    color: '#6200EE',
    textDecorationLine: 'underline',
  },
  input: {
    color: '#333',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#6200EE',
    padding: 5,
    width: '60%',
  },
  actionButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  providerButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  providerButtonText: {
    color: '#333',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  providerOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  providerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  cancelOption: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  cancelOptionText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default Account;
