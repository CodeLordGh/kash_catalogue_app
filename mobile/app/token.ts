import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const storeToken = async (access_auth: string, refresh_auth: string) => {
  try {
    await AsyncStorage.setItem('auth_token', access_auth);
    await AsyncStorage.setItem('refresh_token', refresh_auth);
  } catch (error) {
    console.error('Error storing token:', error);
    Alert.alert("Internal error! Please try again")
  }
};

export const retrieveToken = async () => {
  try {
    const token = await AsyncStorage.getItem('auth_token');
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};