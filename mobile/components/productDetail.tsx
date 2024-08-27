import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decrementQuantity, incrementQuantity, setSelectedColor, setSelectedSize } from '@/app/screens/actionSlice';
import { useNavigation } from '@react-navigation/native';

const ProductDetails: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { product, selectedColor, selectedSize, quantity, selectedProduct } = useSelector((state:any) => state.action);
  
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

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
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="heart-outline" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
          <Image
            source={{ uri: 'https://example.com/nike-air-max-2022.jpg' }}
            style={styles.productImage}
          />
        </Animated.View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{selectedProduct.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.soldText}>423 SOLD</Text>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>4.3 (53 reviews)</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{selectedProduct.description}</Text>

          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionsContainer}>
            {product.sizes.map((size:string) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.optionButton,
                  selectedSize === size && styles.selectedOptionButton,
                ]}
                onPress={() => handleSizeSelect(size)}
              >
                <Text style={[styles.optionButtonText, selectedSize === size && styles.selectedOptionButtonText]}>{size}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.optionsContainer}>
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
      
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={handleDecrement}>
                <Ionicons name="remove" size={24} color="#007AFF" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
                <Ionicons name="add" size={24} color="#007AFF" />
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
    backgroundColor: '#6200EE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#151515',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#222',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  productImage: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
  productInfo: {
    padding: 20,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  soldText: {
    fontSize: 14,
    color: '#999',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#ccc',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOptionButton: {
    backgroundColor: '#007AFF',
  },
  optionButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  selectedOptionButtonText: {
    color: '#fff',
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: '#fff',
  },
  quantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    borderRadius: 20,
    padding: 5,
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 18,
    color: '#fff',
    paddingHorizontal: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  totalPriceLabel: {
    fontSize: 14,
    color: '#999',
  },
  totalPriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  addToCartButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});

export default ProductDetails;