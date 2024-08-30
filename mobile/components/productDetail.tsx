import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  decrementQuantity,
  incrementQuantity,
  setSelectedColor,
  setSelectedSize,
} from '@/app/screens/actionSlice';
import { useNavigation } from '@react-navigation/native';

const ProductDetails: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { selectedColor, selectedSize, quantity, selectedProduct } = useSelector((state: any) => state.action);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const handleColorSelect = (color: string) => {
    dispatch(setSelectedColor(color));
  };

  const handleSizeSelect = (size: string) => {
    dispatch(setSelectedSize(size));
  };

  const handleIncrement = () => {
    if (quantity < 10) {
      dispatch(incrementQuantity());
    } else {
      Alert.alert('Maximum Quantity', 'You can\'t add more than 10 items.');
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      dispatch(decrementQuantity());
    }
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      Alert.alert('Selection Required', 'Please select both color and size before adding to cart.');
      return;
    }
    dispatch(addToCart());
    Alert.alert('Success', 'Item added to cart!', [
      { text: 'Continue Shopping', style: 'cancel' },
      { text: 'Go to Cart', onPress: () => navigation.navigate('Cart') },
    ]);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement favorite logic in backend
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleFavorite}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Animated.View style={[styles.imageContainer, { opacity: fadeAnim }]}>
          <Image
            source={{ uri: selectedProduct.imageUrl || 'https://example.com/placeholder.jpg' }}
            style={styles.productImage}
          />
        </Animated.View>

        <View style={styles.productInfo}>
          <Text style={styles.productName}>{selectedProduct.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.soldText}>{selectedProduct.soldCount || 0} SOLD</Text>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{selectedProduct.rating || 0} ({selectedProduct.reviewCount || 0} reviews)</Text>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.descriptionText}>{selectedProduct.description || 'No description available.'}</Text>

          <Text style={styles.sectionTitle}>Size</Text>
          <View style={styles.optionsContainer}>
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
              selectedProduct.sizes.map((size: string) => (
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
              ))
            ) : (
              <Text style={styles.unavailableText}>Size not available! Contact 
                <TouchableOpacity style={styles.vendorButton} onPress={() => navigation.navigate("Chat")}>
                  <Text style={styles.vendorButtonText}>Vendor</Text>
                </TouchableOpacity>
              </Text>
            )}
          </View>

          <Text style={styles.sectionTitle}>Color</Text>
          <View style={styles.optionsContainer}>
            {selectedProduct.stock && selectedProduct.stock.length > 0 ? (
              selectedProduct.stock.map((color: any) => (
                <TouchableOpacity
                  key={color.color}
                  style={[
                    styles.colorButton,
                    { backgroundColor: color.color },
                    selectedColor === color.color && styles.selectedColorButton,
                  ]}
                  onPress={() => handleColorSelect(color.color)}
                />
              ))
            ) : (
              <Text style={styles.unavailableText}>Colors not available</Text>
            )}
          </View>
      
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity style={styles.quantityButton} onPress={handleDecrement}>
                <Ionicons name="remove" size={24} color="#6200EE" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{quantity}</Text>
              <TouchableOpacity style={styles.quantityButton} onPress={handleIncrement}>
                <Ionicons name="add" size={24} color="#6200EE" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <View>
              <Text style={styles.totalPriceLabel}>TOTAL PRICE</Text>
              <Text style={styles.totalPriceValue}>${(selectedProduct.price * quantity).toFixed(2)}</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200EE',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  imageContainer: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    color: '#333',
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  soldText: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    borderWidth: 1,
    borderColor: '#6200EE',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedOptionButton: {
    backgroundColor: '#6200EE',
  },
  optionButtonText: {
    color: '#6200EE',
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
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: '#6200EE',
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
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  quantityButton: {
    padding: 5,
  },
  quantityText: {
    fontSize: 18,
    color: '#333',
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
    color: '#666',
  },
  totalPriceValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  addToCartButton: {
    backgroundColor: '#6200EE',
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
  unavailableText: {
    color: '#666',
    fontSize: 16,
  },
  vendorButton: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    marginLeft: 5,
  },
  vendorButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProductDetails;
