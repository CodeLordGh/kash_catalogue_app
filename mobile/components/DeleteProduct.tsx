import { setLoading } from "@/app/screens/userSlice";
import { baseUrl } from "@/baseUrl";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";

const DeleteProduct = () => {
  const navigation = useNavigation();
  const [catalogData, setCatalogData] = useState([]);
const token = useSelector((state:any) => state.user.userInfo.userAuth)
  const loading = useSelector((state:any)=> state.user.loading)
  const dispatch = useDispatch()


  useEffect(() => {
    const getProducts = async () => {
      
      try {
        dispatch(setLoading(true));
        await axios
          .get(`${baseUrl}/api/products`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((data) => {
            setCatalogData(data.data);
            dispatch(setLoading(false));
          });
      } catch (error) {
        dispatch(setLoading(false));
        Alert.alert("Error retreiving product data!");
      }
    };

    getProducts();
  }, []);

  const handleDelete = async (id:any) => {
    try {
      dispatch(setLoading(true));
      await axios
        .delete(`https://czc9hkp8-3000.uks1.devtunnels.ms/api/product/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((data) => {
          console.log(data);
        });
      dispatch(setLoading(false));
    } catch (error:any) {
      console.log(error.response);
      dispatch(setLoading(false));
      Alert.alert("Error retreiving product data!");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>Delete Products</Text>
      </View>

        <View style={styles.productsContainer}>
          <ScrollView>
          {loading ? (
            <Text>Loading...</Text>
          ) : catalogData.length >= 1 ? (
            catalogData.map((data: any, index: any) => (
              <View key={data._id} style={styles.productItem} >
                <Text style={{color: "#fff"}} >
                  Product {index + 1}: {data.name}
                </Text>
                <TouchableOpacity onPress={()=> handleDelete(data._id)} >
                  <Text style={{backgroundColor: "red", color: "white", paddingHorizontal: 10, paddingVertical: 5}} >Delete</Text>
                </TouchableOpacity>
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
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: '#343434',
    borderRadius: 5,
  },
});

export default DeleteProduct;
