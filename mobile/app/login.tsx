
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCartProducts,
  setCatalogProducts,
  setChatId,
  setLoading,
  setProducts,
  setShop,
  setUserInfo,
} from './screens/userSlice';
import axios from 'axios';
import { baseUrl } from '@/baseUrl';
import { Ionicons } from '@expo/vector-icons';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList>;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState('');
  const [option, setOption] = useState('buyer');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const dispatch = useDispatch();
  const loading = useSelector((state: any) => state.user.loading);

  const handleSignIn = async () => {
    if (!validateInputs()) return;

    dispatch(setLoading(true));
    try {
      if (option === 'seller') {
        const res = await axios.post(`${baseUrl}/api/seller/login`, { email, password });
        handleSellerLogin(res.data);
      } else {
        const res = await axios.post(`${baseUrl}/api/login`, { input: login });
        handleBuyerLogin(res.data);
      }
    } catch (error: any) {
      handleLoginError(error);
    }
    dispatch(setLoading(false));
  };

  const validateInputs = () => {
    if (option === 'seller' && (!email || !password)) {
      Alert.alert('Invalid Input', 'Please enter both email and password.');
      return false;
    } else if (option === 'buyer' && !login) {
      Alert.alert('Invalid Input', 'Please enter your User ID or Phone number.');
      return false;
    }
    return true;
  };

  const handleSellerLogin = (data: any) => {
    dispatch(setUserInfo({
      userId: data.user.storeId,
      userAuth: data.accessToken,
      User: 'Seller',
      email: data.user.email,
      fullName: data.user.fullName
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
      userAuth: data.accessToken
    }));
    dispatch(setShop({
      businessName: data.user.seller.businessName,
      storeId: data.user.seller.storeId,
    }));
    navigation.navigate('BuyerMainScreen');
  };

  const handleLoginError = (error: any) => {
    console.error('Login error:', error);
    Alert.alert(
      'Login Failed',
      error.response?.data?.message || 'An unexpected error occurred. Please try again.'
    );
  };

  return (
    <ImageBackground
      source={{ uri: '/api/placeholder/1080/1920' }}
      style={styles.background}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>Ezuru</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back</Text>

          {option === 'seller' ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons
                    name={isPasswordVisible ? 'eye-off' : 'eye'}
                    size={24}
                    color="#6200EE"
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="User ID or Phone number"
              value={login}
              onChangeText={setLogin}
              keyboardType="name-phone-pad"
            />
          )}

          <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setOption(option === 'buyer' ? 'seller' : 'buyer')}>
            <Text style={styles.switchOption}>
              {option === 'buyer' ? 'Sign in as business owner' : 'Sign in as buyer'}
            </Text>
          </TouchableOpacity>

          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
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
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  formContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6200EE',
  },
  input: {
    height: 50,
    backgroundColor: '#F0F0F0',
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  forgotPassword: {
    color: '#6200EE',
    textAlign: 'right',
    marginBottom: 20,
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
  switchOption: {
    color: '#6200EE',
    textAlign: 'center',
    marginTop: 15,
    fontSize: 16,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: '#333',
    fontSize: 16,
  },
  signUpLink: {
    color: '#6200EE',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  footerText: {
    color: 'white',
    fontSize: 14,
  },
});

export default LoginScreen;
