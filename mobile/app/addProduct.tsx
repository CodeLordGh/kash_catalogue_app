import React, { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const AddItemScreen = () => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');
  const [itemNumber, setItemNumber] = useState('');

  const handleUploadPhoto = () => {
    // Implement photo upload logic
  };

  const handlePublish = () => {
    // Implement publish logic
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Add Item</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/downloa.jpeg')} style={styles.image} />
        <Image source={require('../assets/images/download.jpeg')} style={styles.image} />
      </View>
      
      <TouchableOpacity style={styles.uploadButton} onPress={handleUploadPhoto}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>
      
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />
      </View>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Size"
          value={size}
          onChangeText={setSize}
        />
        <TextInput
          style={[styles.input, styles.halfWidth]}
          placeholder="Item Number"
          value={itemNumber}
          onChangeText={setItemNumber}
        />
      </View>
      
      <View style={styles.colorSection}>
        <Text style={styles.colorTitle}>Color Red</Text>
        <Text style={styles.colorQuantity}>Qty: 10</Text>
      </View>
      <View style={styles.colorSection}>
        <Text style={styles.colorTitle}>Color Blue</Text>
        <Text style={styles.colorQuantity}>Qty: 15</Text>
      </View>
      <View style={styles.colorSection}>
        <Text style={styles.colorTitle}>Color Green</Text>
        <Text style={styles.colorQuantity}>Qty: 8</Text>
      </View>
      
      <TouchableOpacity style={styles.publishButton} onPress={handlePublish}>
        <Text style={styles.publishButtonText}>Publish</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  colorQuantity: {  // Added this missing style
    color: '#555',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  uploadButton: {
    backgroundColor: '#8a2be2',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    width: '48%',
  },
  colorSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  colorTitle: {
    fontWeight: 'bold',
  },
  publishButton: {
    backgroundColor: '#8a2be2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  publishButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddItemScreen;