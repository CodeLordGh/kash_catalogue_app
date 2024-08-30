import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { setLoading, setOrders } from '@/app/screens/userSlice';
import { baseUrl } from '@/baseUrl';

const SellerDashboard = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const orders = [] as any //useSelector((state:any) => state.user.orders);
  const loading = useSelector((state:any) => state.user.loading);
  const token = useSelector((state:any) => state.user.userInfo.userAuth);

  useEffect(() => {
    const getOrders = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(`${baseUrl}/api/orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(setOrders(res.data));
        dispatch(setLoading(false));
      } catch (error) {
        dispatch(setLoading(false));
        Alert.alert('Error', 'Unable to retrieve order data. Please try again.');
      }
    };

    getOrders();
  }, []);

  const renderOrderItem = ({ item }:any) => (
    <TouchableOpacity style={styles.orderItem} onPress={() => {}}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={[styles.orderStatus, { color: getStatusColor(item.status) }]}>
          {item.status}
        </Text>
      </View>
      <Text style={styles.orderDate}>{new Date(item.date).toLocaleDateString()}</Text>
      <Text style={styles.orderProducts}>{item.products.join(', ')}</Text>
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        <Ionicons name="chevron-forward" size={24} color="#6200EE" />
      </View>
    </TouchableOpacity>
  );

  const getStatusColor = (status:string) => {
    switch (status.toLowerCase()) {
      case 'shipped':
        return '#4CAF50';
      case 'processing':
        return '#FFC107';
      case 'cancelled':
        return '#F44336';
      default:
        return '#6200EE';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Recent Orders</Text>
      </View>

      <View style={styles.ordersContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#6200EE" />
        ) : orders.length >= 1 ? (
          <FlatList
            data={orders}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#6200EE" />
            <Text style={styles.emptyStateText}>No orders found</Text>
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
  ordersContainer: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  orderItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  orderProducts: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
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
});

export default SellerDashboard;