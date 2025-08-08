import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { RegisterUserResponse, KOREAN_PHONE_CONFIG } from '../types';
import { 
  validatePhoneNumber, 
  formatPhoneNumber, 
  formatPhoneForAPI 
} from '../utils/validation';
import { PhoneNumberInput } from '../components/PhoneNumberInput';
import { RegistrationSuccess } from '../components/RegistrationSuccess';
import { registerScreenStyles } from '../styles/registerScreenStyles';

export const RegisterScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState<RegisterUserResponse | null>(null);
  const [showQR, setShowQR] = useState<boolean>(false);

  // Hardcoded to South Korea for MVP
  const selectedCountry = KOREAN_PHONE_CONFIG.COUNTRY_ISO;

  const handlePhoneNumberChange = (text: string) => {
    // Format phone number as user types based on selected country
    const formatted = formatPhoneNumber(text, selectedCountry);
    setPhoneNumber(formatted);
  };

  const handleRegister = async () => {
    // Validate phone number
    const phoneValidation = validatePhoneNumber(phoneNumber, { countryCode: selectedCountry });

    if (!phoneValidation.isValid) {
      Alert.alert('Invalid Phone Number', phoneValidation.message || 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number for API call (raw format: 010XXXXXXXX)
      const apiFormattedPhone = formatPhoneForAPI(phoneNumber, selectedCountry);
      const response = await UserService.registerUser(apiFormattedPhone, KOREAN_PHONE_CONFIG.COUNTRY_ISO);
      
      // Store user code in AsyncStorage
      await AuthService.storeUserCode(response.user_code);
      
      setUserData(response);
      setShowQR(true);
      
      Alert.alert(
        'Registration Successful!', 
        `Welcome! Your user code is: ${response.user_code}`
      );
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (showQR && userData) {
    return (
      <RegistrationSuccess
        userData={userData}
        selectedCountry={selectedCountry}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={registerScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={registerScreenStyles.formContainer}>
        <Text style={registerScreenStyles.title}>Welcome to parQR</Text>
        <Text style={registerScreenStyles.subtitle}>Enter your Korean phone number</Text>

        <PhoneNumberInput
          phoneNumber={phoneNumber}
          selectedCountry={selectedCountry}
          isLoading={isLoading}
          onPhoneNumberChange={handlePhoneNumberChange}
        />

        <TouchableOpacity
          style={[registerScreenStyles.button, (!validatePhoneNumber(phoneNumber, { countryCode: selectedCountry }).isValid || isLoading) && registerScreenStyles.buttonDisabled]}
          onPress={handleRegister}
          disabled={!validatePhoneNumber(phoneNumber, { countryCode: selectedCountry }).isValid || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={registerScreenStyles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

