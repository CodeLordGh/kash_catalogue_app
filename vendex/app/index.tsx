import React from "react";
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

const Stack = createStackNavigator<RootStackParamList>();

export default function Index() {
  // console.log('Store:', store);
  // console.log('Persistor:', persistor);
  return (
    <Provider store={store}>
      <PersistGate  persistor={persistor}>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="Login"
        >
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="BuyerMainScreen" component={BuyerMainScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SellerMainScreen" component={SellerMainScreen} />
          <Stack.Screen name="ProductPage" component={ProductDetails} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </PersistGate>
    </Provider>
  );
}
