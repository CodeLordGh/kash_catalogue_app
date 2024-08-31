import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import { baseUrl } from '@/baseUrl';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

const PaymentConfirmation: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId, checkoutRequestID } = route.params as { orderId: string; checkoutRequestID: string };
  const userInfo = useSelector((state: any) => state.user.userInfo);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/payment-status/${orderId}/${checkoutRequestID}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.userAuth}`,
            },
          }
        );

        if (response.data.status === 'completed') {
          setPaymentStatus('completed');
          setOrderDetails(response.data.orderDetails);
        } else if (response.data.status === 'failed') {
          setPaymentStatus('failed');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
      }
    };

    const interval = setInterval(checkPaymentStatus, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, [orderId, checkoutRequestID, userInfo.userAuth]);

  const renderPaymentStatus = () => {
    switch (paymentStatus) {
      case 'pending':
        return (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color="#6200EE" />
            <Text style={styles.statusText}>Waiting for M-Pesa payment confirmation...</Text>
          </View>
        );
      case 'completed':
        return (
          <View style={styles.statusContainer}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
            <Text style={styles.statusText}>Payment Successful!</Text>
            {orderDetails && (
              <View style={styles.orderDetails}>
                <Text style={styles.orderTitle}>Order Details:</Text>
                <Text>Order ID: {orderDetails.orderId}</Text>
                <Text>Total Amount: ${orderDetails.totalAmount.toFixed(2)}</Text>
                {orderDetails.items.map((item: any, index: number) => (
                  <View key={index} style={styles.itemContainer}>
                    <Text>{item.name}</Text>
                    <Text>Color: {item.color}, Size: {item.size}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <Text>Price: ${item.price.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      case 'failed':
        return (
          <View style={styles.statusContainer}>
            <Ionicons name="close-circle" size={64} color="#F44336" />
            <Text style={styles.statusText}>Payment Failed</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.retryButtonText}>Retry Payment</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Confirmation</Text>
      {renderPaymentStatus()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  statusText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  orderDetails: {
    marginTop: 20,
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    borderRadius: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#6200EE',
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default PaymentConfirmation;