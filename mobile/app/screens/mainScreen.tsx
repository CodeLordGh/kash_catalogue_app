import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ItemSelectionFragment from './itemsSelection';
import CartFragment from './cart';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Account from '@/components/Account';
import Messages from '@/components/Messages';

const Tab = createBottomTabNavigator()

const MainScreen = () => {
  return (
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Cart"
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Shop" component={ItemSelectionFragment} />
          <Tab.Screen name="Messages" component={Messages} />
          <Tab.Screen name="Cart" component={CartFragment} />
          
          
          <Tab.Screen name="Account" component={Account} />
        </Tab.Navigator>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  placeholderContent: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
});

export default MainScreen;