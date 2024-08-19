import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

interface CartItemProps {
  title: string;
  price: number;
  quantity: number;
  imageSource: any;  // Using 'any' for simplicity, but ideally use a more specific type
  onIncrement: () => void;
  onDecrement: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ title, price, quantity, imageSource, onIncrement, onDecrement }) => (
  <View style={styles.cartItem}>
    <Image source={imageSource} style={styles.itemImage} />
    <View style={styles.itemDetails}>
      <Text style={styles.itemTitle}>{title}</Text>
      <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={onDecrement} style={styles.quantityButton}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity onPress={onIncrement} style={styles.quantityButton}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const CartFragment: React.FC = () => {
  // This would typically come from a state management solution or props
  const cartItems = [
    { id: 1, title: "Anime Figure A", price: 29.99, quantity: 2, imageSource: require('../../assets/images/downloa.jpeg') },
    { id: 2, title: "Anime Figure B", price: 34.99, quantity: 1, imageSource: require('../../assets/images/download.jpeg') },
  ];

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Cart</Text>
      <ScrollView style={styles.cartList}>
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            title={item.title}
            price={item.price}
            quantity={item.quantity}
            imageSource={item.imageSource}
            onIncrement={() => console.log('Increment', item.id)}
            onDecrement={() => console.log('Decrement', item.id)}
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
});

export default CartFragment;