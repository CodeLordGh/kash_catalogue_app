import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Messages from '@/components/Messages';
import Account from '@/components/Account';
import ProductsNavigator from '@/components/ProductsNavigator';
import SellerDashboard from '@/components/SellerDashboard';


const Tab = createBottomTabNavigator();

const SellerMainScreen = () => {
  return (
      <Tab.Navigator>
        <Tab.Screen name="Dashboard" component={SellerDashboard} />
        <Tab.Screen name="Messages" component={Messages} />
        <Tab.Screen name="Account" component={Account} />
        <Tab.Screen name="Products" component={ProductsNavigator} />
      </Tab.Navigator>
  );
};

export default SellerMainScreen;