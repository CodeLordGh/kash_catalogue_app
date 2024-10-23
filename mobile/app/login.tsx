import React, { useState } from 'react';
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
} from 'react-native';
import { Link } from 'expo-router';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useNavigation } from '@react-navigation/native';
import { setCartProducts, setCatalogProducts, setChatId, setProducts, setShop, setUserInfo } from './screens/userSlice';
import { useDispatch } from 'react-redux';
import { baseUrl } from '@/baseUrl';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

// console.log(baseUrl)

const LoginScreen = () => {
  const [storeId, setStoreId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [option, setActiveOption] = useState('storeId');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch()

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (option === 'storeId') {
      if (!storeId.trim()) newErrors.storeId = 'Store ID is required';
    } else {
      if (!email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
      if (!password) newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (option === 'storeId') {
        // Implement store login logic here
        const res = await axios.post(`${baseUrl}/api/login`, { input: storeId });
                handleBuyerLogin(res.data);
      } else {
        const res = await axios.post(`${baseUrl}/api/seller/login`, { email, password });
        handleSellerLogin(res.data);
      }
    } catch (error: any) {

      console.log(error)
      Alert.alert(
        'Login Failed',
        error.response?.data?.error || 'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleSellerLogin = (data: any) => {
        dispatch(setUserInfo({
          userId: data.user.storeId,
          userAuth: data.accessToken,
          User: 'Seller',
          email: data.user.email,
          fullName: data.user.fullName,
          deliveryAddress: data.user.deliveryAdress
        }));
        dispatch(setChatId(data.user.chatId));
        dispatch(setProducts(data.products));
        dispatch(setShop({
          businessName: data.user.businessName,
          storeId: data.user.storeId,
        }));
        navigation.replace('SellerMainScreen');
      };
    
      const handleBuyerLogin = ( data: any) => {
        dispatch(setChatId(data.user.chatId));
        dispatch(setCartProducts(data.user.cart));
        dispatch(setCatalogProducts(data.user.catalog.products));
        dispatch(setUserInfo({
          User: data.user.type,
          userId: data.user.buyerId,
          fullName: data.user.fullName,
          email: data.user.email,
          phoneNumber: data.user.phoneNumber,
          userAuth: data.accessToken,
          deliveryAddress: data.user.deliveryAdress
        }));
        dispatch(setShop({
          businessName: data.user.seller.businessName,
          storeId: data.user.seller.storeId,
        }));
        navigation.navigate('BuyerMainScreen');
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.logo}>EZURU</Text>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Sign In</Text>

          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={[styles.optionButton, option === 'storeId' && styles.activeOption]}
              onPress={() => setActiveOption('storeId')}
            >
              <Text style={[styles.optionText, option === 'storeId' && styles.activeOptionText]}>
                My Account
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, option === 'seller' && styles.activeOption]}
              onPress={() => setActiveOption('seller')}
            >
              <Text style={[styles.optionText, option === 'seller' && styles.activeOptionText]}>
                My Store
              </Text>
            </TouchableOpacity>
          </View>

          {option === 'storeId'
            ? renderInput('Enter User ID', storeId, setStoreId, errors.storeId)
            : (
              <>
                {renderInput('Email', email, setEmail, errors.email)}
                {renderInput('Password', password, setPassword, errors.password, true)}
              </>
            )
          }

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          {option === 'seller' && (
            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
          )}

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <Link href={{ pathname: '/register' }}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </Link>
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
    backgroundColor: '#6200EE',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE',
  },
  optionContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#E0E0E0',
  },
  activeOption: {
    borderBottomColor: '#6200EE',
  },
  optionText: {
    fontSize: 16,
    color: '#757575',
  },
  activeOptionText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#6200EE',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#6200EE',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 16,
    color: '#757575',
  },
  signUpLink: {
    fontSize: 16,
    color: '#6200EE',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  footerText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default LoginScreen;
