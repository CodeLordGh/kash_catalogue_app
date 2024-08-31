
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setLoading, setProducts } from '@/app/screens/userSlice';
import { baseUrl } from '@/baseUrl';

const ProductsCatalog = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const catalog = useSelector((state:any) => state.user.products);
  const loading = useSelector((state:any) => state.user.loading);
  const token = useSelector((state:any) => state.user.userInfo.userAuth);

  useEffect(() => {
    const getProducts = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${baseUrl}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setProducts(res.data));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        Alert.alert('Error', 'Unable to retrieve product data. Please try again.');
      }
    };

    getProducts();
  }, []);

  const renderProductItem = ({ item, index }:any) => (
    <TouchableOpacity style={styles.productItem} onPress={() => {}}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/100' }}
        style={styles.productImage}
      />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#6200EE" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Products Catalog</Text>
      </View>

      <View style={styles.productsContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : catalog.length >= 1 ? (
          <FlatList
            data={catalog}
            renderItem={renderProductItem}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="basket-outline" size={64} color="#6200EE" />
            <Text style={styles.emptyStateText}>No products found</Text>
            <TouchableOpacity style={styles.addProductButton} onPress={() => navigation.navigate("Add Product")}>
              <Text style={styles.addProductButtonText}>Add a Product</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  addProductButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  addProductButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductsCatalog;
