import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  FlatList,
  Animated,
  ImageBackground,
} from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { RootStackParamList } from '../types';
import { setSelectedProduct } from './actionSlice';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: { color: string }[];
  sizes: string[];
  updatedAt: string;
  images: Array<string>
}

const ItemSelectionFragment: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const shop = useSelector((state: any) => state.user.shop);
  const catalogProducts = useSelector((state: any) => state.user.catalogProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(catalogProducts);

  useEffect(() => {
    const filtered = catalogProducts.filter((product: Product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery, catalogProducts]);

  const ItemCard: React.FC<{ product: Product }> = ({ product }) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }, []);

    const getColorStyle = (color: string) => {
      const lowerColor = color.toLowerCase();
      const commonColors: { [key: string]: string } = {
        red: '#FF0000',
        blue: '#0000FF',
        green: '#008000',
        yellow: '#FFFF00',
        purple: '#800080',
        orange: '#FFA500',
        pink: '#FFC0CB',
        brown: '#A52A2A',
        gray: '#808080',
        black: '#000000',
        white: '#FFFFFF',
      };

      return {
        color: commonColors[lowerColor] || lowerColor,
        fontWeight: 'bold' as const,
      };
    };

    return (
      <TouchableOpacity
        onPress={() => {
          dispatch(setSelectedProduct(product));
          navigation.navigate('ProductPage');
        }}
        style={{width: '45%', marginHorizontal: 10, marginBottom: 20}}
      >
        <Animated.View style={[styles.itemCard, { opacity: fadeAnim }]}>
          <Image source={product.images ? {uri: product.images[0]} : require('../../assets/images/downloa.png')} style={styles.itemImage} />
          <Text style={styles.itemTitle} numberOfLines={2}>{product.name}</Text>
          <Text style={styles.availableColors}>
            Available in: {product.stock.map((colorObj, index) => (
              <Text key={index} style={getColorStyle(colorObj.color)}>
                {colorObj.color}{index < product.stock.length - 1 ? ', ' : ''}
              </Text>
            ))}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../../assets/images/store-banner.jpg')}
        style={styles.banner}
      >
        <View style={styles.overlay} />
        <Text style={styles.headerTitle}>{shop.businessName}</Text>
      </ImageBackground>
      <View style={styles.content}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        {filteredProducts.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Ionicons name="alert-circle-outline" size={64} color="#6200EE" />
            <Text style={styles.noResultsText}>No items found</Text>
          </View>
        ) : (
          <FlatList
            data={filteredProducts}
            renderItem={({ item }) => <ItemCard product={item} />}
            keyExtractor={(item) => item._id}
            numColumns={2}
            contentContainerStyle={styles.itemsContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  banner: {
    height: 150,
    justifyContent: 'flex-end',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    zIndex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#333',
    fontSize: 16,
    padding: 10,
  },
  itemsContainer: {
    paddingHorizontal: 10,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  itemTitle: {
    color: '#333',
    fontSize: 14,
    padding: 10,
    height: 50,
  },
  availableColors: {
    fontSize: 12,
    color: '#666',
    padding: 10,
    paddingTop: 0,
  },
  noResultsContainer: {
    flex: 1,
    // justifyContent: 'space-between',
    // alignItems: 'center',
  },
  noResultsText: {
    fontSize: 18,
    color: '#666',
    marginTop: 16,
  },
});

export default ItemSelectionFragment;
