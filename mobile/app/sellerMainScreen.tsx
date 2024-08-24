import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Messages from '@/components/Messages';
import Account from '@/components/Account';
import ProductsNavigator from '@/components/ProductsNavigator';
import SellerDashboard from '@/components/SellerDashboard';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const SellerMainScreen = () => {
  return (
    <Tab.Navigator initialRouteName='Dashboard' screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Dashboard" component={SellerDashboard} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Messages" component={Messages} options={{ tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" size={size} color={color} />
          ),
        }} />
      <Tab.Screen name="Products" component={ProductsNavigator} options={{ tabBarStyle: { display: 'none' } , tabBarIcon: ({color, size}) => {
          return <Ionicons name="cart" size={size} color={color} />
        }}} // Hide tab bar when ProductsNavigator is active
         />
      <Tab.Screen 
        name="Account" 
        component={ Account} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
        
         />
    </Tab.Navigator>
  );
};

export default SellerMainScreen;