import React, { useState, useEffect } from 'react';
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
import { Picker } from '@react-native-picker/picker';
import QRCode from 'react-native-qrcode-svg';
import { UserService } from '../services/userService';
import { RegisterUserResponse, CountryInfo } from '../types';
import { 
  validatePhoneNumber, 
  formatPhoneNumber, 
  formatPhoneForAPI,
  validateRequired 
} from '../utils/validation';

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

  const getSelectedCountryInfo = (): CountryInfo | undefined => {
    return countries.find(country => country.iso_code === selectedCountry);
  };

  if (showQR && userData) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.successContainer}>
          <Text style={styles.title}>Registration Complete!</Text>
          
          <View style={styles.userInfoContainer}>
            <Text style={styles.userInfoTitle}>Your Details:</Text>
            <Text style={styles.userInfoText}>User Code: {userData.user_code}</Text>
            <Text style={styles.userInfoText}>Country: {getSelectedCountryInfo()?.country_name || selectedCountry}</Text>
          </View>

          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Your QR Code:</Text>
            <QRCode
              value={userData.qr_code_id}
              size={200}
              backgroundColor="white"
              color="black"
            />
            <Text style={styles.qrSubtext}>QR ID: {userData.qr_code_id}</Text>
          </View>

          <TouchableOpacity 
            style={styles.button} 
            onPress={handleStartOver}
          >
            <Text style={styles.buttonText}>Register Another User</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.formContainer}>
        <Text style={styles.title}>Welcome to parQR</Text>
        <Text style={styles.subtitle}>Select your country and enter your phone number</Text>

        {isLoadingCountries ? (
          <ActivityIndicator size="large" color="#007AFF" style={styles.loadingIndicator} />
        ) : (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Country</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={selectedCountry}
                  onValueChange={(itemValue: string) => {
                    setSelectedCountry(itemValue);
                    setPhoneNumber(''); // Clear phone number when country changes
                  }}
                  style={styles.picker}
                  enabled={!isLoading}
                >
                  {countries.map((country) => (
                    <Picker.Item
                      key={country.iso_code}
                      label={`${country.flag_emoji} ${country.country_name}`}
                      value={country.iso_code}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                placeholder={selectedCountry === 'KR' ? '010-1234-5678' : '(555) 123-4567'}
                keyboardType="phone-pad"
                maxLength={selectedCountry === 'KR' ? 13 : 14} // Formatted length
                editable={!isLoading}
              />
            </View>

            <TouchableOpacity
              style={[styles.button, (!validatePhoneNumber(phoneNumber, { countryCode: selectedCountry }).isValid || isLoading) && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={!validatePhoneNumber(phoneNumber, { countryCode: selectedCountry }).isValid || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.buttonText}>Register</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: 'white',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  userInfoContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    width: '100%',
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  userInfoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  qrSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 10,
    textAlign: 'center',
  },
  loadingIndicator: {
    marginVertical: 40,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
});