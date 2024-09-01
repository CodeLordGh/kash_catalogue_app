import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import axios from "axios";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "./types";
import { useNavigation } from "@react-navigation/native";
import { baseUrl } from "@/baseUrl";

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const RegisterScreen = () => {
  const [storeId, setStoreId] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [option, setActiveOption] = useState("storeId");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (option === "storeId" && !storeId.trim()) {
      newErrors.storeId = "Store ID is required";
    }

    if (option === "seller") {
      if (!fullName.trim()) newErrors.fullName = "Full name is required";
      if (!businessName.trim())
        newErrors.businessName = "Business name is required";
      if (!email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(email))
        newErrors.email = "Email is invalid";
      if (!password) newErrors.password = "Password is required";
      else if (password.length < 6)
        newErrors.password = "Password must be at least 6 characters";
      if (password !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (option === "storeId") {
        await axios.post(
          `${baseUrl}/api/register`,
          { storeId }
        );
        navigation.navigate("BuyerMainScreen");
      } else {
        await axios.post(
          `${baseUrl}/api/seller/register`,
          {
            fullName,
            businessName,
            email,
            password,
          }
        );
        navigation.navigate("SellerMainScreen");
      }
    } catch (error: any) {
      Alert.alert(
        "Registration Failed",
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (
    placeholder: string,
    value: string,
    onChangeText: (text: string) => void,
    error?: string,
    secureTextEntry?: boolean
  ) => (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, error ? styles.inputError : {}]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.logo}>EZURU</Text>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign Up</Text>

          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                option === "storeId" && styles.activeOption,
              ]}
              onPress={() => setActiveOption("storeId")}
            >
              <Text
                style={[
                  styles.optionText,
                  option === "storeId" && styles.activeOptionText,
                ]}
              >
                Join Store
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.optionButton,
                option === "seller" && styles.activeOption,
              ]}
              onPress={() => setActiveOption("seller")}
            >
              <Text
                style={[
                  styles.optionText,
                  option === "seller" && styles.activeOptionText,
                ]}
              >
                Seller
              </Text>
            </TouchableOpacity>
          </View>

          {option === "storeId" ? (
            renderInput("Enter Store ID", storeId, setStoreId, errors.storeId)
          ) : (
            <>
              {renderInput("Full Name", fullName, setFullName, errors.fullName)}
              {renderInput(
                "Business Name",
                businessName,
                setBusinessName,
                errors.businessName
              )}
              {renderInput("Email", email, setEmail, errors.email)}
              {renderInput(
                "Password",
                password,
                setPassword,
                errors.password,
                true
              )}
              {renderInput(
                "Confirm Password",
                confirmPassword,
                setConfirmPassword,
                errors.confirmPassword,
                true
              )}
            </>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            
              <TouchableOpacity onPressIn={()=> navigation.goBack()} ><Text style={styles.signInLink}>Sign In</Text></TouchableOpacity >
            
          </View>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Privacy Policy</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Terms of Service</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6200EE",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  formContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#6200EE",
  },
  optionContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
  },
  activeOption: {
    borderBottomColor: "#6200EE",
  },
  optionText: {
    fontSize: 16,
    color: "#757575",
  },
  activeOptionText: {
    color: "#6200EE",
    fontWeight: "bold",
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: "#FF3B30",
    borderWidth: 1,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: "#6200EE",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  signInContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signInText: {
    fontSize: 16,
    color: "#757575",
  },
  signInLink: {
    fontSize: 16,
    color: "#6200EE",
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  footerText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
});

export default RegisterScreen;
