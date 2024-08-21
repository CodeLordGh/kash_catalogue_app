import React from 'react';
import LoginScreen from "./login";
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './register';
import BuyerMainScreen from './screens/mainScreen';
import { RootStackParamList } from './types';
import SellerMainScreen from './sellerMainScreen';

const Stack = createStackNavigator<RootStackParamList>();

    export default function Index() {
  return (
      <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName="Login">
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="BuyerMainScreen" component={BuyerMainScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='SellerMainScreen' component={SellerMainScreen} />
      </Stack.Navigator>
  );
}