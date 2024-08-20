import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductsCatalog = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products Catalog</Text>
      {/* List of products */}
      <Text>Product 1: Item A - $10</Text>
      <Text>Product 2: Item B - $15</Text>
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

export default ProductsCatalog;