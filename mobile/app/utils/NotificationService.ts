import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

const requestUserPermission = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  return (
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL
  );
};

const getFCMToken = async (): Promise<string | null> => {
  try {
    const token = await messaging().getToken();
    await AsyncStorage.setItem('fcmToken', token);
    return token;
  } catch (error) {
    console.error('Failed to get FCM token:', error);
    return null;
  }
};

const registerForPushNotifications = async (): Promise<string | null> => {
  if (Platform.OS === 'ios') {
    const authStatus = await requestUserPermission();
    if (!authStatus) {
      console.log('User notification permission denied');
      return null;
    }
  }
  return getFCMToken();
};

const setBackgroundMessageHandler = () => {
  messaging().setBackgroundMessageHandler(async (remoteMessage: any) => {
    console.log('Message handled in the background!', remoteMessage);
  });
};

const setNotificationHandler = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

export const NotificationService = {
  registerForPushNotifications,
  setBackgroundMessageHandler,
  setNotificationHandler,
};
