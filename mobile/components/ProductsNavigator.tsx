import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsCatalog from './ProductsCatalog';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();

const ProductsNavigator = () => {

  return (
    <View style={{flex: 1}} >
      <Tab.Navigator initialRouteName='Add Product' screenOptions={{headerShown: false}} >
      <Tab.Screen name="Catalog" component={ProductsCatalog} />
      <Tab.Screen name="Add Product" component={AddProduct} />
      <Tab.Screen name="Delete Product" component={DeleteProduct} />
    </Tab.Navigator>

    </View>
  );
};

export default ProductsNavigator;