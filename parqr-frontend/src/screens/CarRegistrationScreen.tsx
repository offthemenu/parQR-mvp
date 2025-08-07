import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import {
  RootStackParamList,
  CarRegistrationRequest,
  KOREAN_CAR_BRANDS,
  KOREAN_LICENSE_PLATE_REGEX
} from '../types';
import { CarService } from '../services/carService';
import { AuthService } from '../services/authService';
import { carRegistrationStyles } from '../styles/carRegistrationStyles';

type CarRegistrationScreenRouteProp = RouteProp<RootStackParamList, 'CarRegistration'>;
type CarRegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CarRegistration'>;

export const CarRegistrationScreen: React.FC = () => {
  const route = useRoute<CarRegistrationScreenRouteProp>();
  const navigation = useNavigation<CarRegistrationScreenNavigationProp>();
  const { user } = route.params;

  const [licensePlate, setLicensePlate] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [carModel, setCarModel] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateLicensePlate = (plate: string): boolean => {
    return KOREAN_LICENSE_PLATE_REGEX.test(plate);
  };

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    // License plate validation
    if (!licensePlate.trim()) {
      newErrors.licensePlate = 'License plate is required';
    } else if (!validateLicensePlate(licensePlate)) {
      newErrors.licensePlate = 'Please enter valid Korean license plate (예: 123가4567)';
    }

    // Brand validation
    if (!selectedBrand) {
      newErrors.brand = 'Please select a car brand';
    }

    // Model validation
    if (!carModel.trim()) {
      newErrors.model = 'Car model is required';
    } else if (carModel.trim().length < 2) {
      newErrors.model = 'Car model must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLicensePlateChange = (text: string) => {
    // Remove any non-Korean characters and format
    const cleaned = text.replace(/[^0-9가-힣]/g, '');
    setLicensePlate(cleaned);

    // Clear error when user starts typing
    if (errors.licensePlate) {
      setErrors(prev => ({ ...prev, licensePlate: '' }));
    }
  };

  const handleCarRegistration = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const carData: CarRegistrationRequest = {
        license_plate: licensePlate,
        car_brand: selectedBrand,
        car_model: carModel.trim(),
      };

      const registeredCar = await CarService.registerCar(carData);

      Alert.alert(
        'Car Registered Successfully!',
        `${registeredCar.car_brand} ${registeredCar.car_model} (${registeredCar.license_plate}) has been added to your account.`,
        [
          {
            text: 'Continue',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Home', params: { user } }],
              });
            }
          }
        ]
      );

    } catch (error: any) {
      console.error('Car registration failed:', error);

      let errorMessage = 'Registration failed. Please try again.';

      if (error.response?.data?.detail) {
        if (typeof error.response.data.detail === 'object') {
          errorMessage = error.response.data.detail.message || errorMessage;
        } else {
          errorMessage = error.response.data.detail;
        }
      }

      Alert.alert('Registration Failed', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipForNow = () => {
    Alert.alert(
      'Skip Car Registration?',
      'You can add your car later from the profile screen.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home', params: { user } }],
            });
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={carRegistrationStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={carRegistrationStyles.scrollContainer}>
        <View style={carRegistrationStyles.formContainer}>
          <Text style={carRegistrationStyles.title}>Register Your Car</Text>
          <Text style={carRegistrationStyles.subtitle}>
            Add your vehicle to complete your parQR setup
          </Text>

          {/* License Plate Input */}
          <View style={carRegistrationStyles.inputContainer}>
            <Text style={carRegistrationStyles.label}>License Plate</Text>
            <TextInput
              style={[
                carRegistrationStyles.input,
                errors.licensePlate && carRegistrationStyles.inputError
              ]}
              value={licensePlate}
              onChangeText={handleLicensePlateChange}
              placeholder="123가4567"
              placeholderTextColor="#999"
              autoCapitalize="none"
              maxLength={8}
            />
            {errors.licensePlate && (
              <Text style={carRegistrationStyles.errorText}>{errors.licensePlate}</Text>
            )}
          </View>

          {/* Car Brand Picker */}
          <View style={carRegistrationStyles.inputContainer}>
            <Text style={carRegistrationStyles.label}>Car Brand</Text>
            <View style={[
              carRegistrationStyles.pickerContainer,
              errors.brand && carRegistrationStyles.inputError
            ]}>
              <Picker
                selectedValue={selectedBrand}
                onValueChange={(itemValue) => {
                  setSelectedBrand(itemValue);
                  if (errors.brand) {
                    setErrors(prev => ({ ...prev, brand: '' }));
                  }
                }}
                style={carRegistrationStyles.picker}
              >
                <Picker.Item label="Select car brand..." value="" />
                {KOREAN_CAR_BRANDS.map(brand => (
                  <Picker.Item key={brand} label={brand} value={brand} />
                ))}
              </Picker>
            </View>
            {errors.brand && (
              <Text style={carRegistrationStyles.errorText}>{errors.brand}</Text>
            )}
          </View>

          {/* Car Model Input */}
          <View style={carRegistrationStyles.inputContainer}>
            <Text style={carRegistrationStyles.label}>Car Model</Text>
            <TextInput
              style={[
                carRegistrationStyles.input,
                errors.model && carRegistrationStyles.inputError
              ]}
              value={carModel}
              onChangeText={(text) => {
                setCarModel(text);
                if (errors.model) {
                  setErrors(prev => ({ ...prev, model: '' }));
                }
              }}
              placeholder="e.g., Sonata, Camry, 320i"
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
            {errors.model && (
              <Text style={carRegistrationStyles.errorText}>{errors.model}</Text>
            )}
          </View>

          {/* Buttons */}
          <TouchableOpacity
            style={[
              carRegistrationStyles.button,
              (!licensePlate || !selectedBrand || !carModel || isLoading) &&
              carRegistrationStyles.buttonDisabled
            ]}
            onPress={handleCarRegistration}
            disabled={!licensePlate || !selectedBrand || !carModel || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={carRegistrationStyles.buttonText}>Register Car</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={carRegistrationStyles.skipButton}
            onPress={handleSkipForNow}
            disabled={isLoading}
          >
            <Text style={carRegistrationStyles.skipButtonText}>Skip for now</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

