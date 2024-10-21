import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ItemSelectionFragment from '../screens/itemsSelection';
import CartFragment from '../screens/cart';
import Account from '@/components/Account';
import Messages from '@/components/Messages';
import Chat from '../chat';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  const user = useSelector((state:any) => state.user.userInfo);

  return (
    <Tab.Navigator
      initialRouteName="Shop"
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Shop" component={ItemSelectionFragment} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="storefront" size={size} color={color} />
        ),
      }} />
      <Tab.Screen name="Messages" component={user.User === 'User' ? Chat : Messages} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name='chatbubbles' size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Cart" component={CartFragment} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name="cart" size={size} color={color} />
        )
      }} />
      <Tab.Screen name="Account" component={Account} options={{
        tabBarIcon: ({ color, size }) => (
          <Ionicons name='person' size={size} color={color} />
        )
      }} />
    </Tab.Navigator>
  );
}
