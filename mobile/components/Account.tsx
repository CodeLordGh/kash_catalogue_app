import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Animated } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo vector icons

const Account = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const [profileImage, setProfileImage] = useState('https://via.placeholder.com/150');
  const [editMode, setEditMode] = useState(false);
  const [editedInfo, setEditedInfo] = useState({ ...userInfo });

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleImageUpload = () => {
    console.log('Image upload functionality to be implemented');
  };

  const handleSave = () => {
    // Dispatch action to update user info in Redux store
    // dispatch(updateUserInfo(editedInfo));
    setEditMode(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Account Management</Text>
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
            onChangeText={(text:string) => setEditedInfo({ ...editedInfo, User: text })}
          />
          <InfoItem
            label="Full Name"
            value={editedInfo.fullName || ''}
            editMode={editMode}
            onChangeText={(text:string) => setEditedInfo({ ...editedInfo, fullName: text })}
          />
          <InfoItem
            label="Email"
            value={editedInfo.email || ''}
            editMode={editMode}
            onChangeText={(text:string) => setEditedInfo({ ...editedInfo, email: text })}
          />
          <InfoItem
            label="Phone Number"
            value={editedInfo.phoneNumber || ''}
            editMode={editMode}
            onChangeText={(text:string) => setEditedInfo({ ...editedInfo, phoneNumber: text })}
          />
          <InfoItem
            label="User ID"
            value={editedInfo.userId}
            editable={false}
            editMode={editMode}
          />
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => editMode ? handleSave() : setEditMode(true)}
        >
          <Text style={styles.editButtonText}>
            {editMode ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const InfoItem = ({ label, value, editMode, editable = true, onChangeText }:any) => (
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
      <Text style={styles.value}>{value || 'Not provided'}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#6200EE",
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "#fff",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#151515",
    flex: 1,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  uploadIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 8,
  },
  infoContainer: {
    backgroundColor: '#222',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  label: {
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 16,
  },
  value: {
    color: '#ccc',
    fontSize: 16,
  },
  input: {
    color: '#fff',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#007AFF',
    padding: 5,
    width: '60%',
  },
  editButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Account;