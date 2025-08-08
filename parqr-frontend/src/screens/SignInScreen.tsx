import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { ActionButton } from '../components/ActionButton';
import { signInScreenStyles } from '../styles/signInScreenStyles';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [userCode, setUserCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleSignIn = async () => {
    if (!userCode.trim()) {
      Alert.alert('Invalid Input', 'Please enter your user code');
      return;
    }

    setIsLoading(true);

    try {
      // Look up user by user code
      const userData = await UserService.lookupUser(userCode.trim());

      // Store auth data
      await AuthService.storeUserCode(userData.user_code);
      await AuthService.storeUserData(userData);

      Alert.alert(
        'Welcome Back!',
        `Signed in successfully as ${userData.user_code}`,
        [
          {
            text: 'Continue',
            onPress: () => {
              // Navigate based on whether user has cars
              if (userData.cars && userData.cars.length > 0) {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Home', params: { user: userData } }],
                });
              } else {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'CarRegistration', params: { user: userData } }],
                });
              }
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Sign-in failed:', error);

      let errorMessage = 'Sign-in failed. Please check your user code.';

      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'object') {
          errorMessage = error.response.data.detail.message || errorMessage;
        } else {
          errorMessage = error.response.data.detail;
        }
      }

      Alert.alert('Sign-In Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={signInScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={signInScreenStyles.header}>
        <Text style={signInScreenStyles.title}>Welcome Back</Text>
        <Text style={signInScreenStyles.subtitle}>Enter your user code to sign in</Text>
      </View>

      <View style={signInScreenStyles.formContainer}>
        <View style={signInScreenStyles.inputContainer}>
          <Text style={signInScreenStyles.inputLabel}>User Code</Text>
          <TextInput
            style={signInScreenStyles.input}
            value={userCode}
            onChangeText={setUserCode}
            placeholder="Enter your user code"
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isLoading}
          />
        </View>

        <TouchableOpacity
          style={[
            signInScreenStyles.signInButton,
            (!userCode.trim() || isLoading) && signInScreenStyles.buttonDisabled
          ]}
          onPress={handleSignIn}
          disabled={!userCode.trim() || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={signInScreenStyles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={signInScreenStyles.buttonContainer}>
        <ActionButton
          title="Create New Account"
          onPress={handleSignUp}
          variant="secondary"
          disabled={isLoading}
        />
      </View>

      <View style={signInScreenStyles.footer}>
        <Text style={signInScreenStyles.footerText}>
          New to parQR? Create an account to get started with smart parking.
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};
