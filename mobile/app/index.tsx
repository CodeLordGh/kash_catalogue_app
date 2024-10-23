import React, { useEffect } from "react";
import LoginScreen from "./login";
import { createStackNavigator } from "@react-navigation/stack";
import RegisterScreen from "./register";
import BuyerMainScreen from "./screens/mainScreen";
import { RootStackParamList } from "./types";
import SellerMainScreen from "./sellerMainScreen";
import Chat from "./chat";
import { PersistGate } from "redux-persist/integration/react"; // Ensure this is imported
import { store, persistor } from "./store";
import { Provider } from "react-redux";
import ProductDetails from "@/components/productDetail";
import PaymentConfirmation from "./screens/paymentConfirmation";
import messaging from '@react-native-firebase/messaging';
import { Linking } from 'react-native';
import { NotificationService } from "./utils/NotificationService";

const Stack = createStackNavigator<RootStackParamList>();

// const handleNotificationOpen = (remoteMessage:any) => {
//   if (remoteMessage && remoteMessage.data && remoteMessage.data.productId) {
//     Linking.openURL(`yourapp://product/${remoteMessage.data.productId}`);
//   }
// };

export default function Index() {
  // useEffect(() => {
  //   const setupNotifications = async () => {
  //     NotificationService.setNotificationHandler();
  //     await NotificationService.registerForPushNotifications();
  //     NotificationService.setBackgroundMessageHandler();

  //     messaging().onNotificationOpenedApp(handleNotificationOpen);

  //     messaging()
  //       .getInitialNotification()
  //       .then(handleNotificationOpen);
  //   };

  //   setupNotifications();
  // }, []);

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          
          <Stack.Screen name="BuyerMainScreen" component={BuyerMainScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="SellerMainScreen" component={SellerMainScreen} />
          <Stack.Screen name="ProductPage" component={ProductDetails} />
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen
            name="PaymentConfirmation"
            component={PaymentConfirmation}
          />
        </Stack.Navigator>
      </PersistGate>
    </Provider>
  );
}
