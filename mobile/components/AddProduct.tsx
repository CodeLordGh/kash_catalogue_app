import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AddProduct = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Product</Text>
      {/* Form to add a product */}
      <Text>Form to add a new product will go here.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default AddProduct;