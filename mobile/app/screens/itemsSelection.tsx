import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, TouchableOpacity, ImageSourcePropType } from 'react-native';

// Define interfaces for component props
interface HeaderProps {}

interface SearchBarProps {}

interface ItemCardProps {
  title: string;
  price: number;
  imageSource: ImageSourcePropType;
  colors: string[];
}

interface CartSummaryItemProps {
  item: string;
  price: number;
}

const Header: React.FC<HeaderProps> = () => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Item Selection</Text>
    <TouchableOpacity style={styles.settingsButton}>
      <Text>⚙️</Text>
    </TouchableOpacity>
  </View>
);

const SearchBar: React.FC<SearchBarProps> = () => (
  <View style={styles.searchBar}>
    <TextInput 
      style={styles.searchInput}
      placeholder="Search for items..."
    />
  </View>
);

const ItemCard: React.FC<ItemCardProps> = ({ title, price, imageSource, colors }) => (
  <View style={styles.itemCard}>
    <Image source={imageSource} style={styles.itemImage} />
    <Text style={styles.itemTitle}>{title}</Text>
    <Text style={styles.itemPrice}>${price.toFixed(2)}</Text>
    <TouchableOpacity style={styles.addToCartButton}>
      <Text style={styles.addToCartText}>Add to Cart</Text>
    </TouchableOpacity>
    <View style={styles.colorOptions}>
      {colors.map((color, index) => (
        <TouchableOpacity key={index} style={[styles.colorOption, { backgroundColor: color }]} />
      ))}
    </View>
  </View>
);

const CartSummaryItem: React.FC<CartSummaryItemProps> = ({ item, price }) => (
  <View style={styles.cartSummaryItem}>
    <Text>{item}</Text>
    <Text>Price: ${price.toFixed(2)}</Text>
    <TouchableOpacity style={styles.editButton}>
      <Text style={styles.editButtonText}>Edit</Text>
    </TouchableOpacity>
  </View>
);

const ItemSelectionFragment: React.FC = () => {
  return (
    <View style={styles.container}>
      <Header />
      <SearchBar />
      <View style={styles.itemsContainer}>
        <ItemCard 
          title="Anime Figure A" 
          price={29.99} 
          imageSource={require('../../assets/images/downloa.jpeg')}
          colors={['red', 'blue', 'green']}
        />
        <ItemCard 
          title="Anime Figure B" 
          price={34.99} 
          imageSource={require('../../assets/images/download.jpeg')}
          colors={['black', 'white', 'yellow']}
        />
      </View>
      <View style={styles.checkoutSection}>
        <Text style={styles.checkoutTitle}>Checkout</Text>
        <CartSummaryItem item="Red T-shirt, Size M" price={25} />
        <CartSummaryItem item="Blue Jeans, Size 32" price={45} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 5,
  },
  searchBar: {
    padding: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
  itemsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  itemCard: {
    alignItems: 'center',
    width: '45%',
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  itemTitle: {
    marginTop: 5,
  },
  itemPrice: {
    fontWeight: 'bold',
  },
  addToCartButton: {
    backgroundColor: '#6200ee',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  addToCartText: {
    color: 'white',
  },
  colorOptions: {
    flexDirection: 'row',
    marginTop: 5,
  },
  colorOption: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 2,
  },
  checkoutSection: {
    padding: 10,
  },
  checkoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cartSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  editButton: {
    backgroundColor: '#6200ee',
    padding: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
  },
});

export default ItemSelectionFragment;