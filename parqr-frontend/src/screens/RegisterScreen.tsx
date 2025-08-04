import React, { useState, useEffect } from 'react';
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
import { RegisterUserResponse, CountryInfo } from '../types';
import { 
  validatePhoneNumber, 
  formatPhoneNumber, 
  formatPhoneForAPI,
  validateRequired 
} from '../utils/validation';
import { CountryPicker } from '../components/CountryPicker';
import { PhoneNumberInput } from '../components/PhoneNumberInput';
import { RegistrationSuccess } from '../components/RegistrationSuccess';
import { registerScreenStyles } from '../styles/registerScreenStyles';

export const RegisterScreen: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>('KR');
  const [countries, setCountries] = useState<CountryInfo[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState<boolean>(true);
  const [userData, setUserData] = useState<RegisterUserResponse | null>(null);
  const [showQR, setShowQR] = useState<boolean>(false);

  // Load countries on component mount
  useEffect(() => {
    loadCountries();
  }, []);

  const loadCountries = async () => {
    try {
      const response = await UserService.getServicingCountries();
      setCountries(response.countries);
      // Set default to first country if available
      if (response.countries.length > 0) {
        setSelectedCountry(response.countries[0].iso_code);
      }
    } catch (error: any) {
      Alert.alert('Error', 'Failed to load countries. Please try again.');
    } finally {
      setIsLoadingCountries(false);
    }
  };

  const handlePhoneNumberChange = (text: string) => {
    // Format phone number as user types based on selected country
    const formatted = formatPhoneNumber(text, selectedCountry);
    setPhoneNumber(formatted);
  };

  const handleRegister = async () => {
    // Validate required fields
    const phoneValidation = validatePhoneNumber(phoneNumber, { countryCode: selectedCountry });
    const countryValidation = validateRequired(selectedCountry, 'Country');

    if (!phoneValidation.isValid) {
      Alert.alert('Invalid Phone Number', phoneValidation.message || 'Please enter a valid phone number');
      return;
    }

    if (!countryValidation.isValid) {
      Alert.alert('Country Required', countryValidation.message || 'Please select a country');
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number for API call
      const apiFormattedPhone = formatPhoneForAPI(phoneNumber, selectedCountry);
      const response = await UserService.registerUser(apiFormattedPhone, selectedCountry);
      
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

  const handleStartOver = () => {
    setPhoneNumber('');
    setSelectedCountry(countries.length > 0 ? countries[0].iso_code : 'KR');
    setUserData(null);
    setShowQR(false);
  };


  if (showQR && userData) {
    return (
      <RegistrationSuccess
        userData={userData}
        selectedCountry={selectedCountry}
        countries={countries}
        onStartOver={handleStartOver}
      />
    );
  }

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setPhoneNumber('');
  };

  return (
    <KeyboardAvoidingView
      style={registerScreenStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={registerScreenStyles.formContainer}>
        <Text style={registerScreenStyles.title}>Welcome to parQR</Text>
        <Text style={registerScreenStyles.subtitle}>Select your country and enter your phone number</Text>

        <CountryPicker
          selectedCountry={selectedCountry}
          countries={countries}
          isLoading={isLoading}
          isLoadingCountries={isLoadingCountries}
          onCountryChange={handleCountryChange}
        />

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

