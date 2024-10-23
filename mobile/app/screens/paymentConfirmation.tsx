import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import axios from 'axios';
import { baseUrl } from '@/baseUrl';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';

type PaymentConfirmationRouteProp = RouteProp<RootStackParamList, 'PaymentConfirmation'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'PaymentConfirmation'>;

interface PaymentConfirmationProps {
  route: PaymentConfirmationRouteProp;
}

const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ route }) => {
  const { orderId, paymentRequestId } = route.params;
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>('pending');
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/payment-status/${orderId}/${paymentRequestId}`,
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
        } else {
          // If still pending, check again after 5 seconds
          setTimeout(checkPaymentStatus, 5000);
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        setPaymentStatus('failed');
      }
    };

    // Wait 5 seconds before checking the payment status
    setTimeout(checkPaymentStatus, 5000);
  }, [orderId, paymentRequestId, userInfo.userAuth]);

  const handleBackToCart = () => {
    // Navigate to the MainScreen without passing userData
    navigation.navigate('BuyerMainScreen');
  };

  const handleBackToItemSelection = () => {
    // Navigate to the MainScreen without passing userData
    navigation.navigate('BuyerMainScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payment Confirmation</Text>
      {paymentStatus === 'pending' && (
        <View style={styles.pendingContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
          <Text style={styles.pendingText}>Processing your payment...</Text>
        </View>
      )}
      {paymentStatus === 'completed' && orderDetails && (
        <ScrollView style={styles.completedContainer}>
          <Text style={styles.successText}>Payment Successful!</Text>
          <Text style={styles.orderDetail}>Order ID: {orderDetails.orderId}</Text>
          <Text style={styles.orderDetail}>Total Amount: GH₵{orderDetails.totalAmount.toFixed(2)}</Text>
          <Text style={styles.orderDetail}>Transaction ID: {orderDetails.transactionId}</Text>
          <Text style={styles.orderDetail}>Date: {new Date(orderDetails.transactionDate).toLocaleString()}</Text>
          <Text style={styles.itemsHeader}>Items:</Text>
          {orderDetails.items.map((item: any, index: number) => (
            <View key={index} style={styles.itemContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDetail}>Quantity: {item.quantity}</Text>
              <Text style={styles.itemDetail}>Price: GH₵{item.price.toFixed(2)}</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={handleBackToItemSelection}>
            <Text style={styles.buttonText}>Back to Item Selection</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
      {paymentStatus === 'failed' && (
        <View style={styles.failedContainer}>
          <Text style={styles.failedText}>Payment Failed</Text>
          <Text style={styles.failedSubtext}>Please try again or contact support.</Text>
          <TouchableOpacity style={styles.button} onPress={handleBackToCart}>
            <Text style={styles.buttonText}>Back to Cart</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pendingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pendingText: {
    marginTop: 20,
    fontSize: 18,
  },
  completedContainer: {
    flex: 1,
  },
  successText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  orderDetail: {
    fontSize: 16,
    marginBottom: 10,
  },
  itemsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDetail: {
    fontSize: 14,
  },
  failedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  failedText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 10,
  },
  failedSubtext: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PaymentConfirmation;
