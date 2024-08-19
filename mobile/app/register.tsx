import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Link } from "expo-router";
import axios from "axios";



interface storeIdProps {
  storeId: string;
  setStoreId: Function;
}

interface sellerRegisProps {
  email: string;
  password: string;
  fullName: string;
  busynessname: string;
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

const SellerRegis: React.FC<sellerRegisProps> = ({email, setEmail, password, setPassword, busynessname, setBusinessName, fullName, setFullname}) => {
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
        value={busynessname}
        onChangeText={(e) => setBusinessName(e)}
        secureTextEntry
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

  const handleRegister = async () => {
    try {
      if (option === "storeId") {
        // Register with storeId
        const response = await axios.post('https://vendex-9taw.onrender.com/api/register', {
          storeId: storeId,
        });
        console.log('Registration successful:', response.data);
      } else if (option === "seller") {
        // Register as a seller
        const response = await axios.post('https://vendex-9taw.onrender.com/api/seller/register', {
          fullName: fullName,
          businessName: busynessName,
          email: email,
          password: password,
        });
        console.log('Seller registration successful:', response.data);
      }
    } catch (error: any) {
      console.error('Registration failed:', error.response ? error.response.data : error.message);
    }
  };

  const componentRender = () => {
    switch (option) {
      case 'storeId':
        return <StoreIdRegis storeId={storeId} setStoreId={setStoreId} />;
      case 'seller':
        return <SellerRegis email={email} password={password} fullName={fullName} busynessname={busynessName} setEmail={setEmail} setPassword={setPassword} setFullname={setFullname} setBusinessName={setBusinessName} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>VendEx</Text>
      <Text style={styles.title}>Sign Up</Text>

      {componentRender()}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      {option === "storeId" ? <Text onPress={() => setActiveOption("seller")}>Register as a seller</Text> : <Text onPress={() => setActiveOption("storeId")}>Register with a store</Text>}
      <View style={styles.signInContainer}>
        <Text>Already have an account? </Text>
        <Link href={{ pathname: "/login" }}>
          <Text style={styles.signInText}>Sign In</Text>
        </Link>
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
    color: "gray",
  },
});

export default RegisterScreen;
