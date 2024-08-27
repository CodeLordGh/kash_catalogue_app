import { retrieveToken } from "@/app/token";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

const ProductsCatalog = () => {
  const navigation = useNavigation();
  const [catalogData, setCatalogData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const token = await retrieveToken();
      try {
        setIsLoading(true);
        await axios
          .get("https://czc9hkp8-3000.uks1.devtunnels.ms/api/products", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((data) => {
            setCatalogData(data.data);
            console.log(catalogData);
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
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
          {isLoading ? (
            <Text>Loading...</Text>
          ) : catalogData.length >= 1 ? (
            catalogData.map((data: any, index: any) => (
              <View key={data._id} style={styles.productItem} >
                <Text style={{color: "#fff"}} >
                  Product {index + 1}: {data.name} - ${data.price}
                </Text>
                {/* Image goes here */}
              </View>
            ))
          ) : (
            <Text>No product found!</Text>
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
