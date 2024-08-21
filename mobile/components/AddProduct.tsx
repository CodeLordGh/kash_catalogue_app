import { retrieveToken } from '@/app/token';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, ScrollView, Button } from 'react-native';

const AddProduct = () => {

  const navigation = useNavigation();
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [catalog, setCatalog] = useState("")
  const [products, setProducts] = useState<{ color: string; quantity: string; }[]>([]);

  const handleAddProduct = () => {
    if (color || quantity) {
      setProducts([...products, { color, quantity }]);
    }
    setColor('');
    setQuantity('');
  };

  const handlePupblish = async () => {
    await axios.post("", {
      stock: products,
      description,
      name,
      catalog,
      price
    }, {
      headers: {
        Authorization: `Bearer ${await retrieveToken()}`
      }
    })
  }


  return (
    <ScrollView>
      <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Item</Text>
      </View>
      <View style={styles.imageContainer}>
        <Image source={require('../assets/images/download.jpeg')} style={styles.image} />
        <Image source={require('../assets/images/downloa.jpeg')} style={styles.image} />
      </View>
      <TouchableOpacity style={styles.uploadButton}>
        <Text style={styles.uploadButtonText}>Upload Photo</Text>
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Product Name</Text>
          <TextInput style={styles.input} placeholder="Enter Product Name" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput style={styles.input} placeholder="Enter Description" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Price</Text>
          <TextInput style={styles.input} placeholder="Enter Price" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Size</Text>
          <TextInput style={styles.input} placeholder="Enter Size" />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Category</Text>
          <TextInput style={styles.input} placeholder="Enter Category" />
        </View>
        <View>
      <View style={styles._inputContainer}>
        <TextInput
          style={styles._input}
          placeholder="Color"
          value={color}
          onChangeText={setColor}
        />
        <TextInput
          style={styles._input}
          placeholder="Quantity"
          value={quantity}
          onChangeText={setQuantity}
          keyboardType="numeric"
        />
      </View>
      <Button title="Add" onPress={handleAddProduct} />
      <View style={styles.productsContainer}>
        {products.map((product, index) => (
          <Text key={index} style={styles.product}>
            Color: {product.color}, Quantity: {product.quantity}
          </Text>
        ))}
      </View>
    </View>
      </View>
      <TouchableOpacity style={styles.publishButton} onPress={() => handlePupblish()} >
        <Text style={styles.publishButtonText}>Publish</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical:20
  },
  backArrow: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  formContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  variantContainer: {
    marginTop: 20,
  },
  variantItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  variantLabel: {
    fontSize: 14,
  },
  variantQuantity: {
    fontSize: 14,
  },
  publishButton: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
  },
  publishButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  }, 
  _inputContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    gap:10
  },
  _input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 10,
  },
  productsContainer: {
    marginTop: 20,
  },
  product: {
    marginBottom: 5,
  },
});

export default AddProduct;