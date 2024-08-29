import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, SafeAreaView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateCartItemQuantity } from './actionSlice';
import { Ionicons } from '@expo/vector-icons';

interface CartItemProps {
  id: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  index: number;
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
  const cartItemId = `${name}-${color}-${size}`
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
          <Ionicons name="remove" size={20} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
          <Ionicons name="add" size={20} color="#007AFF" />
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
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((sum: number, item: CartItemProps) => sum + item.price * item.quantity, 0);

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
      <TouchableOpacity style={styles.checkoutButton}>
        <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity style={styles.clearCartButton} onPress={() => dispatch(clearCart())}>
        <Text style={styles.clearCartButtonText}>Clear Cart</Text>
      </TouchableOpacity> */}
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
  },
  cartList: {
    flex: 1,
    backgroundColor: '#151515',
    borderBottomLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 15,
    marginHorizontal:5
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    padding: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    color: '#fff',
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
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearCartButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  clearCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartFragment;