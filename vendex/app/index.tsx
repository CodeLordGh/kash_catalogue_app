import React from 'react';
import LoginScreen from "./login";
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from './register';
import MainScreen from './screens/mainScreen';
import { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export default function Index() {
  return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        <Stack.Screen name="MainScreen" component={MainScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
      </Stack.Navigator>
  );
}