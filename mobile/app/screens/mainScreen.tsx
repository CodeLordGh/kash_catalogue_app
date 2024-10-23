import React, { useState, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import ItemSelectionFragment from './itemsSelection';
import CartFragment from './cart';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Account from '@/components/Account';
import Messages from '@/components/Messages';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import Chat from '../chat';
import { RouteProp, useRoute } from '@react-navigation/native';
import { setCartProducts, setCatalogProducts, setChatId, setShop, setUserInfo } from './userSlice';

const Tab = createBottomTabNavigator()

type MainScreenRouteProp = RouteProp<{ MainScreen: { userData: any } }, 'MainScreen'>;

const MainScreen = () => {
  const dispatch = useDispatch();
  const route = useRoute<MainScreenRouteProp>();
  const user = useSelector((state:any) => state.user.userInfo);

  useEffect(() => {
    if (route.params?.userData) {
      const { userData } = route.params;
      dispatch(setChatId(userData.user.chatId));
      dispatch(setCartProducts(userData.user.cart));
      dispatch(setCatalogProducts(userData.user.catalog.products));
      dispatch(setUserInfo({
        User: userData.user.type,
        userId: userData.user.buyerId,
        fullName: userData.user.fullName,
        email: userData.user.email,
        phoneNumber: userData.user.phoneNumber,
        userAuth: userData.accessToken,
        deliveryAddress: userData.user.deliveryAdress
      }));
      dispatch(setShop({
        businessName: userData.user.seller.businessName,
        storeId: userData.user.seller.storeId,
      }));
    }
    // If userData is not provided, we'll rely on the existing state
  }, [route.params, dispatch]);

  return (
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName="Cart"
          screenOptions={{ headerShown: false }}
        >
          <Tab.Screen name="Shop" component={ItemSelectionFragment} options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront" size={size} color={color} />
          ),
        }} />
          <Tab.Screen name="Messages" component={user.User === 'User'? Chat : Messages} options ={{
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
        
      </SafeAreaView>
  );
};


export default MainScreen;
