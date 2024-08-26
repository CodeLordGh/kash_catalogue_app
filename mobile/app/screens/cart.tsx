import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeFromCart, updateCartItemQuantity } from './actionSlice';

interface CartItemProps {
  id: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  index: string;
}
interface CartItem {
  id: string;
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  index: string;
}

const CartItem: React.FC<CartItemProps> = ({ id, name, color, size, quantity, price, index }) => {
  const dispatch = useDispatch();

  const handleRemove = () => {
    dispatch(removeFromCart(`${name}-${color}-${size}`));
  };

  const handleIncrement = () => {
    dispatch(updateCartItemQuantity({ id, quantity: quantity + 1 }));
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(updateCartItemQuantity({ id, quantity: quantity - 1 }));
    }
  };

  return (
    <View style={styles.cartItem}>
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{name}</Text>
        <Text style={styles.itemColor}>Color: {color}</Text>
        <Text style={styles.itemSize}>Size: {size}</Text>
        <View style={styles.quantityControl}>
          <TouchableOpacity onPress={handleDecrement} style={styles.quantityButton}>
            <Text>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncrement} style={styles.quantityButton}>
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.itemPrice}>Price: ${(price * quantity).toFixed(2)}</Text>
        <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartFragment: React.FC = () => {
  const cartItems = useSelector((state: any) => state.action.cart) as CartItem[];
  const dispatch = useDispatch();

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      <ScrollView style={styles.cartList}>
        {cartItems.map((item, index) => (
          <CartItem
            key={`${item.name}-${item.color}-${item.size}-${index}`}
            id={item.id}
            name={item.name}
            color={item.color}
            size={item.size}
            quantity={item.quantity}
            index={index}
            price={item.price}
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
      <TouchableOpacity style={styles.clearCartButton} onPress={()=> dispatch(clearCart())}>
        <Text style={styles.clearCartButtonText}>Clear Cart</Text>
      </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingVertical: 15,
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: '#888',
    marginVertical: 5,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  checkoutButton: {
    backgroundColor: '#6200ee',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  clearCartButton: {
    backgroundColor: 'red', // Change color as needed
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  clearCartButtonText: {
    color: 'white',
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  removeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});

export default CartFragment;