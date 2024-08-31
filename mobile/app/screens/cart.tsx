import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity, clearCart } from './actionSlice';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { baseUrl } from '@/baseUrl';
import { useNavigation } from '@react-navigation/native';

interface CartItemProps {
  id: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  index: number;
}

interface UserInfo {
  fullName: string;
  phoneNumber: string;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, color, size, quantity, price }) => {
  const dispatch = useDispatch();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRemove = () => {
    dispatch(removeFromCart(`${name}-${color}-${size}`));
  };

  const cartItemId = `${name}-${color}-${size}`;
  const handleIncrement = () => {
    dispatch(updateCartItemQuantity({ cartItemId, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateCartItemQuantity({ cartItemId, quantity: quantity - 1 }));
    }
  };

  return (
    <Animated.View style={[styles.cartItem, { opacity: fadeAnim }]}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{name}</Text>
        <Text style={styles.itemSubtitle}>Color: {color} | Size: {size}</Text>
        <Text style={styles.itemPrice}>${(price * quantity).toFixed(2)}</Text>
      </View>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
          <Ionicons name="remove" size={20} color="#6200EE" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
          <Ionicons name="add" size={20} color="#6200EE" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </Animated.View>
  );
};

const CartFragment: React.FC = () => {
  const cartItems = useSelector((state: any) => state.action.cart);
  const userInfo = useSelector((state: any) => state.user.userInfo);
  const dispatch = useDispatch();
  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [userDetails, setUserDetails] = useState<UserInfo>({
    fullName: userInfo.fullName || '',
    phoneNumber: userInfo.phoneNumber || '',
  });
  const navigation = useNavigation()

  const totalPrice = cartItems.reduce((sum: number, item: CartItemProps) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (!userDetails.fullName || !userDetails.phoneNumber) {
      setCheckoutModalVisible(true);
    } else {
      proceedToPayment();
    }
  };

  const proceedToPayment = async () => {
    try {
      const response = await axios.post(
        `${baseUrl}/api/checkout`,
        {
          cartItems: cartItems.map((item:any) => ({
            product: item.product._id,
            quantity: item.quantity
          })),
          userDetails: {
            deliveryAddress: userDetails.deliveryAddress,
            phoneNumber: userDetails.phoneNumber // Make sure to collect this from the user
          },
          totalPrice
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.userAuth}`,
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.success) {
        Alert.alert('Payment Initiated', 'Please check your phone for the M-Pesa payment prompt.');
        dispatch(clearCart());
        // Navigate to a payment confirmation screen
        navigation.navigate('PaymentConfirmation', { 
          orderId: response.data.orderId,
          checkoutRequestID: response.data.checkoutRequestID
        });
      } else {
        throw new Error(response.data.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      if (axios.isAxiosError(error) && error.response) {
        Alert.alert('Error', error.response.data.message || 'Failed to process your order. Please try again.');
      } else {
        Alert.alert('Error', 'An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      <ScrollView style={styles.cartList}>
        {cartItems.map((item: CartItemProps, index: number) => (
          <CartItem
            key={`${item.name}-${item.color}-${item.size}-${index}`}
            {...item}
            index={index}
          />
        ))}
      </ScrollView>
      <View style={styles.totalSection}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalPrice}>${totalPrice.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>

      <Modal
        visible={isCheckoutModalVisible}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Complete Your Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={userDetails.fullName}
              onChangeText={(text) => setUserDetails({ ...userDetails, fullName: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={userDetails.phoneNumber}
              onChangeText={(text) => setUserDetails({ ...userDetails, phoneNumber: text })}
              keyboardType="phone-pad"
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setCheckoutModalVisible(false);
                proceedToPayment();
              }}
            >
              <Text style={styles.modalButtonText}>Proceed to Payment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setCheckoutModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6200EE',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: "center",
    color: '#fff',
    marginBottom: 20,
    marginTop: 20,
  },
  cartList: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 15,
    marginHorizontal: 5,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    padding: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    color: '#333',
    fontSize: 16,
    marginHorizontal: 10,
  },
  removeButton: {
    marginLeft: 15,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  checkoutButton: {
    backgroundColor: '#03DAC6',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  checkoutButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#6200EE',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  modalButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#FF3B30',
  },
});

export default CartFragment;
