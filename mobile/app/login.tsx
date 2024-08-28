import React, { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { setCartProducts, setCatalogProducts, setChatId, setLoading, setProducts, setShop, setUserInfo } from "./screens/userSlice";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState("")
  const [option, setOption] = useState("buyer");
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();

  // const cartProducts = useSelector((state:any) => state.user.cartProducts)
  const loading = useSelector((state:any) => state.user.loading)


  const handleSignIn = async () => {
    if (option === "seller") {
      try {
        dispatch(setLoading(true));
        await axios
          .post("https://czc9hkp8-3000.uks1.devtunnels.ms/api/seller/login", {
            email,
            password,
          })
          .then((res) => {
            console.log(res.data)
            dispatch(setUserInfo({
              userId: res.data.user.storeId,
              userAuth: res.data.accessToken,
              User: 'Seller',
              email: res.data.user.email,
              fullName: res.data.user.fullName
            }))
            dispatch(setChatId(res.data.user.chatId))
            dispatch(setProducts(res.data.products))
            dispatch(setLoading(false));
            return navigation.replace("SellerMainScreen");
          });
      } catch (error) {
        dispatch(setLoading(false));
        throw error;
      }
    } else if (option === "buyer") {
      try {
        dispatch(setLoading(true));
        const response = await axios.post('https://czc9hkp8-3000.uks1.devtunnels.ms/api/login', { input: login });
        const data = response.data;
  
        // Dispatch actions to update the Redux store
        dispatch(setChatId(data.user.chatId));
        dispatch(setCartProducts(data.user.cart));
        dispatch(setCatalogProducts(data.user.catalog.products));
        dispatch(setUserInfo({
          User: data.user.type,
          userId: data.user.buyerId,
          fullName: data.user.fullName,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
          userAuth: data.accessToken
        }));
        dispatch(setShop({
          businessName: data.user.seller.businessName,
          storeId: data.user.seller.storeId,
        }));
        dispatch(setLoading(false));
        // console.log(data.accessToken)
        return navigation.navigate("BuyerMainScreen");
      } catch (error:any) {
        console.log(error);
        dispatch(setLoading(false));
        Alert.alert("Error logging in", "Please check your credentials and try again.");
      }
    }
  };

  // console.log(useSelector((state:any) => state.user.userInfo.userAuth))

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
            placeholder="User Id or Phone number"
            value={login}
            onChangeText={setLogin}
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
      <Text style={styles.logo}>Ezuru</Text>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 15,
          paddingHorizontal: 20,
          paddingBottom: 40
        }}
      >
        <Text style={styles.title}>Sign In</Text>
        {formDisplay()}

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>
            {loading ? "Loading..." : "Sign In"}
          </Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text>Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("RegisterScreen")}
          >
            <Text style={styles.signUpText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: "space-between",
    padding: 20,
    backgroundColor: "#6200EE",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 0,
    color: "#f5f5f5",
    marginTop:60
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
  },
  input: {
    height: 40,
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#6200EE",
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
    color: "white",
    fontSize: 15
  },
});

export default LoginScreen;
