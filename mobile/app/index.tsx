import React from 'react';
import { View } from "react-native";
import LoginScreen from "./screens/login";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>
      <LoginScreen />
    </View>
  );
}