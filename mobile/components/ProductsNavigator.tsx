import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ProductsCatalog from './ProductsCatalog';
import AddProduct from './AddProduct';
import DeleteProduct from './DeleteProduct';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const ProductsNavigator = () => {
  return (
    <View style={{flex: 1}}>
      <Tab.Navigator 
        initialRouteName='Add Product' 
        screenOptions={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube" size={size} color={color} />
          ),
        }}
      >
        <Tab.Screen 
          name="Catalog" 
          component={ProductsCatalog} 
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="list" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Add Product" 
          component={AddProduct}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="add-circle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen 
          name="Delete Product" 
          component={DeleteProduct}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="trash" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default ProductsNavigator;
