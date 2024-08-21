import { retrieveToken } from "@/app/token";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";

const ProductsCatalog = () => {
  const navigation = useNavigation();
  const [catalogData, setCatalogData] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getProducts = async () => {
      const token = await retrieveToken()
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
            console.log(catalogData)
            // setCatalogData((prevData: any) => ({ ...prevData, ...data.data }));
            setIsLoading(false);
          });
      } catch (error) {
        setIsLoading(false);
        Alert.alert("Error retreiving product data!");
      }
    };

    // setInterval(() => {
      getProducts();
    // }, 5000);

    getProducts();
  }, []);

  return (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Back</Text>
        </View>
        <Text style={styles.title}>Products Catalog</Text>
        {isLoading ? (
            <Text>Loading...</Text>
        ) : (
            catalogData.map((data: any, index: any) => (
                <View key={data._id}>
                    <Text>Product {index + 1}: {data.name} - ${data.price}</Text>
                </View>
            ))
        )}
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
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default ProductsCatalog;
