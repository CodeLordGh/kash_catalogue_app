import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, FlatList, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, deleteProduct, updateProduct } from '@/app/screens/userSlice';
import { baseUrl } from '@/baseUrl';

const DeleteProduct = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.user.userInfo.userAuth);
  const loading = useSelector((state: any) => state.user.loading);
  const products = useSelector((state: any) => state.user.products);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const [updatedPrice, setUpdatedPrice] = useState('');

  const handleDelete = async (id: string) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              dispatch(setLoading(true));
              await axios.delete(`${baseUrl}/api/product/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              dispatch(deleteProduct(id));
              dispatch(setLoading(false));
            } catch (error) {
              dispatch(setLoading(false));
              Alert.alert('Error', 'Failed to delete the product. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleUpdate = (product: any) => {
    setSelectedProduct(product);
    setUpdatedName(product.name);
    setUpdatedPrice(product.price.toString());
    setUpdateModalVisible(true);
  };

  const submitUpdate = async () => {
    if (!updatedName || !updatedPrice) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      dispatch(setLoading(true));
      const updatedProduct = {
        ...(selectedProduct as any),
        name: updatedName,
        price: parseFloat(updatedPrice),
      };
      await axios.put(
        `${baseUrl}/api/product/${(selectedProduct as any)._id}`,
        updatedProduct,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      dispatch(updateProduct(updatedProduct));
      setUpdateModalVisible(false);
      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      Alert.alert('Error', 'Failed to update the product. Please try again.');
    }
  };

  const renderProductItem = ({ item }: any) => (
    <View style={styles.productItem}>
      <Image
        source={{ uri: item.images[0] || 'https://via.placeholder.com/60' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity onPress={() => handleUpdate(item)} style={styles.updateButton}>
          <Ionicons name="create-outline" size={24} color="#6200EE" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Manage Products</Text>
      </View>

      <View style={styles.productsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProductItem}
            keyExtractor={(item: any) => item._id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={64} color="#6200EE" />
            <Text style={styles.emptyStateText}>No products found</Text>
          </View>
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={updateModalVisible}
        onRequestClose={() => setUpdateModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Product</Text>
            <TextInput
              style={styles.input}
              value={updatedName}
              onChangeText={setUpdatedName}
              placeholder="Product Name"
            />
            <TextInput
              style={styles.input}
              value={updatedPrice}
              onChangeText={setUpdatedPrice}
              placeholder="Product Price"
              keyboardType="numeric"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setUpdateModalVisible(false)} style={styles.cancelButton}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={submitUpdate} style={styles.submitButton}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 20,
  },
  productsContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 14,
    color: '#6200EE',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  updateButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 8,
    width: '45%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default DeleteProduct;
