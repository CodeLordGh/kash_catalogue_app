import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DeleteProduct = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delete Product</Text>
      {/* Form to delete a product */}
      <Text>Form to delete a product will go here.</Text>
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

export default DeleteProduct;