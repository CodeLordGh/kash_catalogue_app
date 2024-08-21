import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const ProductsCatalog = () => {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>

<View style={styles.header}>
        <TouchableOpacity onPress={()=> navigation.goBack() } >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Back</Text>
      </View>
      <Text style={styles.title}>Products Catalog</Text>
      {/* List of products */}
      <Text>Product 1: Item A - $10</Text>
      <Text>Product 2: Item B - $15</Text>
    </View>
  );
};

const styles = StyleSheet.create({

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
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