import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
  FlatList,
  Animated,
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { RootStackParamList } from "../types";
import { setSelectedProduct } from "./actionSlice";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native";

// Define interfaces for component props
interface HeaderProps {}

interface SearchBarProps {}

interface ItemCardProps {
  imageSource: ImageSourcePropType;
  product: {
    _id: string;
    name: string;
    price: number;
    stock: string[];
    sizes: string[];
    updatedAt: string;
  }
}

interface CartSummaryItemProps {
  item: string;
  price: number;
}
const Header: React.FC<HeaderProps> = () => {
  const shop = useSelector((state:any) => state.user.shop)
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>{`${shop.businessName} Shop`}</Text>
      <TouchableOpacity style={styles.settingsButton}>
        <Ionicons name="settings-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  ); 
}

const SearchBar: React.FC<SearchBarProps> = () => (
  <View style={styles.searchBar}>
    <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
    <TextInput style={styles.searchInput} placeholder="Search for items..." placeholderTextColor="#666" />
  </View>
);

const ItemCard: React.FC<ItemCardProps> = ({ product, imageSource }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.itemCard, { opacity: fadeAnim }]}>
      <Image source={imageSource} style={styles.itemImage} />
      <Text style={styles.itemTitle}>{product.name}</Text>
      <Text style={styles.itemPrice}>${product.price.toFixed(2)}</Text>
      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => {
          dispatch(setSelectedProduct(product));
          navigation.navigate("ProductPage");
        }}
      >
        <Text style={styles.addToCartText}>View Details</Text>
      </TouchableOpacity>
      <View style={styles.colorOptions}>
        <Text style={styles.colorOptionsText}>Colors:</Text>
        {product.stock.map((color:any, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.colorOption, { backgroundColor: color.color }]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const ItemSelectionFragment: React.FC = () => {
  const catalogProducts = useSelector((state: any) => state.user.catalogProducts);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.content}>
        <SearchBar />
        <FlatList
          data={catalogProducts}
          renderItem={({ item }) => (
            <ItemCard
              product={item}
              imageSource={require("../../assets/images/downloa.png")}
            />
          )}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.itemsContainer}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6200EE",
  },
  content: {
    flex: 1,
    backgroundColor: "#151515",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  settingsButton: {
    padding: 5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    padding: 10,
  },
  itemsContainer: {
    paddingHorizontal: 10,
  },
  itemCard: {
    backgroundColor: "#222",
    borderRadius: 15,
    padding: 15,
    margin: 10,
    alignItems: "center",
    width: '45%',
  },
  itemImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 10,
  },
  itemTitle: {
    color: "#fff",
    fontSize: 16,
    overflow: "hidden",
    textAlign: "center",
    marginBottom: 5,
  },
  itemPrice: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginTop: 5,
  },
  addToCartText: {
    color: "white",
    fontWeight: "bold",
  },
  colorOptions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  colorOptionsText: {
    color: "#ccc",
    marginRight: 5,
  },
  colorOption: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "#444",
  },
});

export default ItemSelectionFragment;


// import { NavigationProp, useNavigation } from "@react-navigation/native";
// import React from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TextInput,
//   Image,
//   TouchableOpacity,
//   ImageSourcePropType,
// } from "react-native";
// import { useDispatch, useSelector } from "react-redux";
// import { RootStackParamList } from "../types";
// import { setSelectedProduct } from "./actionSlice";

// // Define interfaces for component props
// interface HeaderProps {}

// interface SearchBarProps {}

// interface ItemCardProps {
//   imageSource: ImageSourcePropType;
//   product: {
//     _id: string;
//     name: string;
//     price: number;
//     stock: string[];
//     sizes: string[];
//     updatedAt: string;
//   }
// }

// interface CartSummaryItemProps {
//   item: string;
//   price: number;
// }

// const Header: React.FC<HeaderProps> = () => {
//   const shop = useSelector((state:any) => state.user.shop)
//  return (
//   <View style={styles.header}>
//       <Text style={styles.headerTitle}>{`${shop.businessName} shop`}</Text>
//       <TouchableOpacity style={styles.settingsButton}>
//         <Text>⚙️</Text>
//       </TouchableOpacity>
//     </View>
//   ); 
// }
// const SearchBar: React.FC<SearchBarProps> = () => (
//   <View style={styles.searchBar}>
//     <TextInput style={styles.searchInput} placeholder="Search for items..." />
//   </View>
// );

// const ItemCard: React.FC<ItemCardProps> = ({
//   product,
//   imageSource,
// }) => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList>>()
//   const dispatch = useDispatch()
//   // console.log(product.updatedAt) 
//   return(
//   <View style={styles.itemCard}>
//     <Image source={imageSource} style={styles.itemImage} />
//     <Text style={styles.itemTitle}>{product.name}</Text>
//     <Text style={styles.itemPrice}>${product.price.toFixed(2)}</Text>
//     <TouchableOpacity style={styles.addToCartButton} onPressIn={()=> {
//       dispatch(setSelectedProduct(product))
//       navigation.navigate("ProductPage")
//     }}>
//       <Text style={styles.addToCartText}>Add to Cart</Text>
//     </TouchableOpacity>
//     <View style={styles.colorOptions}>
//       <Text style={{textAlign: "left"}}>colors:</Text>
//       {product.stock.map((color:any, index) => (
//         <TouchableOpacity
//           key={index}
//           style={[styles.colorOption, { backgroundColor: color.color }]}
//         />
//       ))}
//     </View>
//   </View>
// )}

// const CartSummaryItem: React.FC<CartSummaryItemProps> = ({ item, price }) => (
//   <View style={styles.cartSummaryItem}>
//     <Text>{item}</Text>
//     <Text>Price: ${price.toFixed(2)}</Text>
//     <TouchableOpacity style={styles.editButton}>
//       <Text style={styles.editButtonText}>Edit</Text>
//     </TouchableOpacity>
//   </View>
// );

// const checkout = () => {
//   return (
//     <View style={styles.checkoutSection}>
//       <Text style={styles.checkoutTitle}>Checkout</Text>
//       <CartSummaryItem item="Red T-shirt, Size M" price={25} />
//       <CartSummaryItem item="Blue Jeans, Size 32" price={45} />
//     </View>
//   );
// };

// const ItemSelectionFragment: React.FC = () => {
//   const catalogProducts = useSelector(
//     (state: any) => state.user.catalogProducts
//   );

//   // console.log(catalogProducts[0]);

//   return (
//     <View style={styles.container}>
//       <Header />
//       <SearchBar />
//       <View style={styles.itemsContainer}>
//         {catalogProducts.map((product: any) => (
//           <ItemCard
//             key={product._id}
//             product={product}
//             imageSource={require("../../assets/images/downloa.jpeg")}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//   },
//   content: {
//     flex: 1,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     padding: 10,
//   },
//   headerTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   settingsButton: {
//     padding: 5,
//   },
//   searchBar: {
//     padding: 10,
//   },
//   searchInput: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//   },
//   itemsContainer: {
//     flexDirection: "row",
//     justifyContent: "flex-start",
//     padding: 10,
//   },
//   itemCard: {
//     alignItems: "center",
//     width: "45%",
//   },
//   itemImage: {
//     width: 100,
//     height: 100,
//     resizeMode: "contain",
//   },
//   itemTitle: {
//     marginTop: 5,
//     textAlign: "center",
//     paddingHorizontal: 10
//   },
//   itemPrice: {
//     fontWeight: "bold",
//   },
//   addToCartButton: {
//     backgroundColor: "#6200ee",
//     padding: 5,
//     borderRadius: 5,
//     marginTop: 5,
//   },
//   addToCartText: {
//     color: "white",
//   },
//   colorOptions: {
//     flexDirection: "row",
//     marginTop: 5,
//   },
//   colorOption: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     marginHorizontal: 2,
//   },
//   checkoutSection: {
//     padding: 10,
//   },
//   checkoutTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   cartSummaryItem: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 5,
//   },
//   editButton: {
//     backgroundColor: "#6200ee",
//     padding: 5,
//     borderRadius: 5,
//   },
//   editButtonText: {
//     color: "white",
//   },
// });

// export default ItemSelectionFragment;