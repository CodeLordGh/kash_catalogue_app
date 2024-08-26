import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementQuantity, incrementQuantity, setSelectedColor, setSelectedSize } from '@/app/screens/actionSlice';
import { useNavigation } from '@react-navigation/native';


const ProductDetails: React.FC = () => {
  const navigation = useNavigation()
  const dispatch = useDispatch();
  const { product, selectedColor, selectedSize, quantity, selectedProduct, cart } = useSelector((state:any) => state.action);
  
  const handleColorSelect = (color:any) => {
    dispatch(setSelectedColor(color));
  };

  const handleSizeSelect = (size:any) => {
    dispatch(setSelectedSize(size));
  };

  const handleIncrement = () => {
    dispatch(incrementQuantity());
  };

  const handleDecrement = () => {
    dispatch(decrementQuantity());
  };

  const handleAddToCart = () => {
    dispatch(addToCart());
    navigation.navigate("Cart")
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPressIn={() => navigation.goBack()} style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" />
        <Ionicons name="heart-outline" size={24} color="black" />
      </TouchableOpacity>

      <ScrollView>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://example.com/nike-air-max-2022.jpg' }}
          style={styles.productImage}
        />
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{selectedProduct.name}</Text>
        <View style={styles.ratingContainer}>
          <Text style={styles.soldText}>423 SOLD</Text>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>4.3 (53 reviews)</Text>
        </View>

        <Text style={styles.descriptionTitle}>Description</Text>
        <Text style={styles.descriptionText}>{selectedProduct.description}</Text>

        <Text style={styles.sizeTitle}>Size</Text>
        <View style={styles.sizeContainer}>
        {product.sizes.map((size:string) => (
          <TouchableOpacity
            key={size}
            style={[
              styles.sizeButton,
              selectedSize === size && styles.selectedSizeButton,
            ]}
            onPress={() => handleSizeSelect(size)}
          >
            <Text style={styles.sizeButtonText}>{size}</Text>
          </TouchableOpacity>
        ))}
      </View>


        <Text style={styles.colorTitle}>Color</Text>
        <View style={styles.colorContainer}>
        {selectedProduct.stock.map((color:any) => (
          <TouchableOpacity
            key={color.color}
            style={[
              styles.colorButton,
              { backgroundColor: color.color },
              selectedColor === color.color && styles.selectedColorButton,
            ]}
            onPress={() => handleColorSelect(color.color)}
          />
        ))}
      </View>
{/* <View style={styles.sizeContainer}>
          {['32', '40', '42', '44'].map((size) => (
            <TouchableOpacity key={size} style={styles.sizeButton}>
              <Text style={styles.sizeButtonText}>{size}</Text>
            </TouchableOpacity>
          ))}
        </View> */}
      
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityTitle}>Quantity</Text>
        <View style={styles.quantityControls}>
          <TouchableOpacity onPress={handleDecrement}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncrement}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalPriceLabel}>TOTAL PRICE</Text>
          <Text style={styles.totalPriceValue}>${(product.price * quantity).toFixed(2)}</Text>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartButtonText}>ADD TO CART</Text>
          <Ionicons name="cart-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCFF90',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  imageContainer: {
    height: 300,
    backgroundColor: '#CCFF90',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  productInfo: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  soldText: {
    fontSize: 12,
    color: 'gray',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 4,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  descriptionText: {
    fontSize: 14,
    color: 'gray',
    marginTop: 8,
  },
  sizeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  sizeContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  sizeButton: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
  },
  sizeButtonText: {
    fontSize: 14,
  },
  colorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
  },
  colorContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: 'black',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  quantityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 24,
    paddingHorizontal: 10,
  },
  quantityText: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  totalPriceLabel: {
    fontSize: 12,
    color: 'gray',
  },
  totalPriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: 'black',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  selectedSizeButton: {
    // add styles for selected size button here
    borderBlockColor: "black"
  },
});

export default ProductDetails;