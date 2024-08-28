import { setLoading, setProducts } from "@/app/screens/userSlice";
import { baseUrl } from "@/baseUrl";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

const ProductsCatalog = () => {
  const navigation = useNavigation();
  const catalog = useSelector((state:any) => state.user.products);
  const dispatch = useDispatch()
  const loading = useSelector((state:any) => state.user.loading)
const token = useSelector((state:any) => state.user.userInfo.userAuth)


  useEffect(() => {
    const getProducts = async () => {
      
      try {
        dispatch(setLoading(true));
        const res = await axios
          .get(`${baseUrl}/api/products`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            dispatch(setProducts(res.data));
            console.log("line 32 ",catalog);
            dispatch(setLoading(false));

      } catch (error:any) {
        dispatch(setLoading(false))
        Alert.alert("Error retreiving product data!");
      }
    };

    getProducts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Products Catalog</Text>
      </View>

        <View style={styles.productsContainer}>
          <ScrollView>
          {loading ? (
            <Text style={{color: "#fff", fontWeight: "bold"}}>Loading...</Text>
          ) : catalog.length >= 1 ? (
            catalog.map((data: any, index: any) => (
              <View key={data._id} style={styles.productItem} >
                <Text style={{color: "#fff"}} >
                  Product {index + 1}: {data.name} - ${data.price}
                </Text>
                {/* Image goes here */}
              </View>
            ))
          ) : (
            <Text style={{color: "#fff", fontWeight: "bold"}} >No product found!</Text>
          )}
          </ScrollView>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: "#6200EE",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 50,
    color: "white",
  },
  productsContainer: {
    flex: 1,
    backgroundColor: "#151515",
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  productItem: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#343434',
    borderRadius: 5,
  },
});

export default ProductsCatalog;
