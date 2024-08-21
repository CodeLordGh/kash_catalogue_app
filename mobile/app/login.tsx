import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "./types";
import { StackNavigationProp } from "@react-navigation/stack";
import axios from "axios";
import { storeToken } from "./token";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [storeId, setStoreId] = useState("");
  const [loading, setLoading] = useState(false)
  const [option, setOption] = useState("buyer");
  const navigation = useNavigation<LoginScreenNavigationProp>();


  const handleSignIn = async () => {
    if (option === "seller") {
      try {
        setLoading(true)
        await axios.post("https://vendex-9taw.onrender.com/api/seller/login", { email, password })
        .then((data)=> {
          storeToken(data.data.accessToken, data.data.refreshToken)
          setLoading(false)
          return navigation.replace("SellerMainScreen")
        })
      } catch (error) {
        setLoading(false)
        throw error;
      }
    } else if(option === "buyer"){
      try {
        setLoading(true)
      await axios.post("https://vendex-9taw.onrender.com/api/login").then(()=> {
        setLoading(false)
        return navigation.navigate("BuyerMainScreen")
      })
      } catch (error) {
        setLoading(false)
        Alert.alert("Error logging in", "Please check your credentials and try again.")
      }
    }
  };

  const formDisplay = () => {
    if (option === "seller") {
      return (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <TextInput
            style={styles.input}
            placeholder="Store ID"
            value={storeId}
            onChangeText={setStoreId}
            keyboardType="name-phone-pad"
          />
          <TouchableOpacity onPress={() => setOption("seller")}>
            <Text style={styles.option}>Sign in as business owner</Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VendEx</Text>
      <Text style={styles.title}>Sign In</Text>

      {formDisplay()}

      <TouchableOpacity style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>
          {loading ? "Loading..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View style={styles.signUpContainer}>
        <Text>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate("RegisterScreen")}>
          <Text style={styles.signUpText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... styles

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "white",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  forgotPassword: {
    color: "blue",
    textAlign: "right",
    marginBottom: 20,
  },
  option: {
    color: "blue",
    textAlign: "left",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signUpText: {
    color: "blue",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  footerText: {
    color: "gray",
  },
});

export default LoginScreen;
