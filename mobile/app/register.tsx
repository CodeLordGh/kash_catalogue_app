import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { useNavigation } from "@react-navigation/native";

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface storeIdProps {
  storeId: string;
  setStoreId: Function;
}

interface sellerRegisProps {
  email: string;
  password: string;
  fullName: string;
  busynessName: string;
  setEmail: Function;
  setPassword: Function;
  setFullname: Function;
  setBusinessName: Function;
}

const StoreIdRegis: React.FC<storeIdProps> = ({ storeId, setStoreId }) => (
  <TextInput
    style={styles.input}
    placeholder="Enter StoreID"
    value={storeId}
    onChangeText={(e) => setStoreId(e)}
  />
);

const SellerRegis: React.FC<sellerRegisProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  busynessName,
  setBusinessName,
  fullName,
  setFullname,
}) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        value={fullName}
        onChangeText={(e) => setFullname(e)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Busyness name"
        value={busynessName}
        onChangeText={(e) => setBusinessName(e)}
        keyboardType="ascii-capable"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(e) => setEmail(e)}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(e) => setPassword(e)}
        secureTextEntry
      />
    </View>
  );
};

const RegisterScreen = () => {
  const [storeId, setStoreId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullname] = useState("");
  const [busynessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [option, setActiveOption] = useState("storeId");
  const [isLoading, setisLoading] = useState(false);
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  // RegisterScreen component
  const handleRegister = async () => {
    console.log(storeId)
    try {
      if (option === "storeId") {
        // Register with storeId
        setisLoading(true);
        await axios
          .post("https://czc9hkp8-3000.uks1.devtunnels.ms/api/register", {
            storeId: storeId,
          })
          .then((response) => {
            console.log("Registration successful:", response.data);
            setisLoading(false);
            return navigation.navigate("BuyerMainScreen");
          });
      } else if (option === "seller") {
        // Register as a seller
        setisLoading(true);
        await axios
          .post("https://czc9hkp8-3000.uks1.devtunnels.ms/seller/register", {
            fullName: fullName,
            businessName: busynessName,
            email: email,
            password: password,
          })
          .then(() => {
            setisLoading(false);
            return navigation.navigate("SellerMainScreen");
          });
      }
    } catch (error: any) {
      console.error("Registration failed:", error.response);
      setisLoading(false);
      Alert.alert("Error", "Store not found!");
    }
  };

  const componentRender = () => {
    const navigation = useNavigation()
    switch (option) {
      case "storeId":
        return <StoreIdRegis storeId={storeId} setStoreId={setStoreId} />;
      case "seller":
        return (
          <SellerRegis
            email={email}
            password={password}
            fullName={fullName}
            busynessName={busynessName}
            setEmail={setEmail}
            setPassword={setPassword}
            setFullname={setFullname}
            setBusinessName={setBusinessName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>EZURU</Text>
      <View  style={{
          backgroundColor: "#fff",
          borderRadius: 15,
          paddingHorizontal: 20,
          paddingBottom: 40
        }}
        >
        <Text style={styles.title}>Sign Up</Text>

        {componentRender()}

        <TouchableOpacity style={styles.button} onPress={() =>handleRegister()}>
          <Text style={styles.buttonText}>
            {isLoading ? "Loading..." : "Register"}
          </Text>
        </TouchableOpacity>

        {option === "storeId" ? (
          <Text onPress={() => setActiveOption("seller")}>
            Register as a seller
          </Text>
        ) : (
          <Text onPress={() => setActiveOption("storeId")}>
            Register with a store
          </Text>
        )}

        <View style={styles.signInContainer}>
          <Text>Already have an account? </Text>
          <TouchableOpacity onPressIn={()=> navigation.navigate("Login")}>
            <Text style={styles.signInText}>Sign In</Text>
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
    marginBottom: 20,
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
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    color: "blue",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  footerText: {
    color: "#fff",
    fontSize: 15
  },
});

export default RegisterScreen;
