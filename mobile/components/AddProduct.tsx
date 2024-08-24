import { retrieveToken } from "@/app/token";
import axios from "axios";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  Button,
  Alert,
} from "react-native";

const AddProduct = () => {
  const [color, setColor] = useState("");
  const [qty, setQty] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [products, setProducts] = useState<{ color: string; qty: string }[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleAddProduct = () => {
    if (color || qty) {
      setProducts([...products, { color, qty }]);
    }
    setColor("");
    setQty("");
  };

  const handlePupblish = async () => {
    const token = await retrieveToken();
    // console.log(token)
    try {
      setIsLoading(true);

      await axios
        .post(
          "https://czc9hkp8-3000.uks1.devtunnels.ms/api/product",
          {
            stock: products,
            description: description,
            name: name,
            price: price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((data) => {
          setName("");
          setPrice("");
          setDescription("");
          setProducts([]);
          setIsLoading(false);
          // console.log(data.data);
          Alert.alert(data.data.message);
        });
    } catch (er: any) {
      setIsLoading(false);
      Alert.alert("Error adding product!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Item</Text>
      </View>
      <View
        style={{
          backgroundColor: "#151515",
          paddingHorizontal: 20,
          paddingTop: 15,
          borderTopEndRadius: 40,
          borderTopStartRadius: 40
        }}
      >
        
        <ScrollView>

          <View style={styles.imageContainer}>
          <Image
            source={require("../assets/images/download.jpeg")}
            style={styles.image}
          />
          <Image
            source={require("../assets/images/downloa.jpeg")}
            style={styles.image}
          />
        </View>
        <TouchableOpacity style={styles.uploadButton}>
          <Text style={styles.uploadButtonText}>Upload Photo</Text>
        </TouchableOpacity>
          <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Product Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Enter Product Name"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={styles.input}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter Description"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Price</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Enter Price"
            />
          </View>
          <View>
            <View style={styles._inputContainer}>
              <TextInput
                style={styles._input}
                placeholder="Color"
                value={color}
                onChangeText={setColor}
              />
              <TextInput
                style={styles._input}
                placeholder="Quantity"
                value={qty}
                onChangeText={setQty}
                keyboardType="numeric"
              />
            </View>
            <Button title="Add" onPress={handleAddProduct} />
            <View style={styles.productsContainer}>
              {products.map((product, index) => (
                <Text key={index} style={styles.product}>
                  Color: {product.color}, Quantity: {product.qty}
                </Text>
              ))}
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={() => handlePupblish()}
        >
          <Text style={styles.publishButtonText}>
            {isLoading ? "Publishing..." : "Publish"}
          </Text>
        </TouchableOpacity>
        </ScrollView>
        
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6200EE",
    paddingTop: 20,
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#f5f5f5"
  },
  imageContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 20,
    overflow: "scroll",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  uploadButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  formContainer: {
    backgroundColor: "#343434",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
    color: "#888"
  },
  input: {
    backgroundColor: "#151515",
    color: "#fff",
    borderRadius: 5,
    padding: 10,
  },
  variantContainer: {
    marginTop: 20,
  },
  variantItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  variantLabel: {
    fontSize: 14,
  },
  variantQuantity: {
    fontSize: 14,
  },
  publishButton: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 10,
    marginBottom: 60
  },
  publishButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
  _inputContainer: {
    flexDirection: "row",
    marginBottom: 10,
    gap: 10,
  },
  _input: {
    flex: 1,
    backgroundColor: "#151515",
    color: "#fff",
    padding: 10,
    borderRadius: 5
  },
  productsContainer: {
    marginTop: 20,
  },
  product: {
    marginBottom: 5,
  },
});

export default AddProduct;
