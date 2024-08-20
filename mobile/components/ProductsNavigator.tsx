import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsCatalog from './ProductsCatalog';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';

const Tab = createBottomTabNavigator();

const ProductsNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Catalog" component={ProductsCatalog} />
      <Tab.Screen name="Add Product" component={AddProduct} />
      <Tab.Screen name="Delete Product" component={DeleteProduct} />
    </Tab.Navigator>
  );
};

export default ProductsNavigator;