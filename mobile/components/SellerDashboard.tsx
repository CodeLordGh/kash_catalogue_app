import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SellerDashboard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Orders</Text>
      {/* Sample Order Item */}
      <View style={styles.orderItem}>
        <Text>Order ID: 12345</Text>
        <Text>Date: 2024-08-20</Text>
        <Text>Status: Shipped</Text>
        <Text>Products: Item A, Item B</Text>
      </View>
      {/* Add more order items as needed */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  orderItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});

export default SellerDashboard;