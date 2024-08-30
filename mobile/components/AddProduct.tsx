
import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/app/screens/userSlice';
import { baseUrl } from '@/baseUrl';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const AddProduct = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.user.loading);
  const token = useSelector((state: any) => state.user.userInfo.userAuth);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState('');
  const [images, setImages] = useState([]);
const [variants, setVariants] = useState<{ color: string; qty: number }[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);
  const handleAddVariant = () => {
    if (color && qty) {
      setVariants([...variants, { color, qty: parseInt(qty) }]);
      setColor('');
      setQty('');
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } else {
      Alert.alert('Invalid Input', 'Please enter both color and quantity.');
    }
  };

  const handleRemoveVariant = (index:number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleUploadPhoto = () => {
    // Implement image picker logic here
    Alert.alert('Upload Photo', 'Image picker functionality to be implemented.');
  };

  const handlePublish = async () => {
    if (!name || !description || !price || variants.length === 0) {
      Alert.alert('Invalid Input', 'Please fill all fields and add at least one variant.');
      return;
    }

    try {
      dispatch(setLoading(true));
      const response = await axios.post(
        `${baseUrl}/api/product`,
        {
          name,
          description,
          price: parseFloat(price),
          stock: variants,
          // Add image upload logic here
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(setLoading(false));
      Alert.alert('Success', response.data.message);
      navigation.goBack();
    } catch (error) {
      dispatch(setLoading(false));
      Alert.alert('Error', 'Failed to add product. Please try again.');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      // keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Product</Text>
      </View>

      <ScrollView 
        style={styles.content}
        ref={scrollViewRef}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.imageContainer}>
          {images.length > 0 ? (
            images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={40} color="#6200EE" />
              <Text style={styles.imagePlaceholderText}>No images</Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
          <Ionicons name="cloud-upload-outline" size={24} color="white" />
          <Text style={styles.uploadButtonText}>Upload Photos</Text>
        </TouchableOpacity>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Product Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            placeholderTextColor="#888"
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#888"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <View style={styles.variantContainer}>
            <Text style={styles.variantTitle}>Variants</Text>
            <View style={styles.variantInputContainer}>
              <TextInput
                style={[styles.input, styles.variantInput]}
                placeholder="Color"
                placeholderTextColor="#888"
                value={color}
                onChangeText={setColor}
              />
              <TextInput
                style={[styles.input, styles.variantInput]}
                placeholder="Quantity"
                placeholderTextColor="#888"
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.addVariantButton} onPress={handleAddVariant}>
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {variants.map((variant, index) => (
            <View key={index} style={styles.variantItem}>
              <Text style={styles.variantText}>
                {variant.color} - Qty: {variant.qty}
              </Text>
              <TouchableOpacity onPress={() => handleRemoveVariant(index)}>
                <Ionicons name="close-circle-outline" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.publishButton}
        onPress={handlePublish}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.publishButtonText}>Publish Product</Text>
        )}
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200EE',
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    color: '#6200EE',
    marginTop: 5,
  },
  uploadButton: {
    backgroundColor: '#6200EE',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  variantContainer: {
    marginTop: 20,
  },
  variantTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  variantInputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  variantInput: {
    flex: 1,
    marginRight: 10,
    marginBottom: 0,
  },
  addVariantButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
    padding: 15,
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 15,
    marginTop: 10,
  },
  variantText: {
    fontSize: 16,
  },
  publishButton: {
    backgroundColor: '#6200EE',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0
  },
  publishButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    margin: 0,
  },
});

export default AddProduct;
