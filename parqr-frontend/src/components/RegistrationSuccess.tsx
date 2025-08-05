import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RegisterUserResponse, RootStackParamList } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { ActionButton } from '../components/ActionButton';
import { registrationSuccessStyles } from '../styles/registrationSuccessStyles';

interface RegistrationSuccessProps {
  userData: RegisterUserResponse;
  selectedCountry: string;
  onStartOver: () => void;
}

type RegistrationSuccessNavigationProp = StackNavigationProp<RootStackParamList>;

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  userData,
  selectedCountry,
  onStartOver,
}) => {
  const navigation = useNavigation<RegistrationSuccessNavigationProp>();

  const getCountryName = (countryCode: string): string => {
    return countryCode === 'KR' ? 'South Korea' : countryCode;
  };

  const handleContinueToHome = () => {
    // Navigate to home screen with user data
    navigation.replace('Home', { user: userData });
  };

  return (
    <ScrollView contentContainerStyle={registrationSuccessStyles.container}>
      <View style={registrationSuccessStyles.successContainer}>
        <Text style={registrationSuccessStyles.title}>Registration Complete!</Text>
        
        <View style={registrationSuccessStyles.userInfoContainer}>
          <Text style={registrationSuccessStyles.userInfoTitle}>Your Details:</Text>
          <Text style={registrationSuccessStyles.userInfoText}>User Code: {userData.user_code}</Text>
          <Text style={registrationSuccessStyles.userInfoText}>Country: {getCountryName(selectedCountry)}</Text>
        </View>

        <View style={registrationSuccessStyles.qrContainer}>
          <Text style={registrationSuccessStyles.qrTitle}>Your QR Code:</Text>
          <QRCodeDisplay
            qrCodeId={userData.qr_code_id}
            size={200}
            showId={true}
          />
        </View>

        {/* Primary action - Continue to app */}
        <ActionButton
          title="Continue to App"
          onPress={handleContinueToHome}
          variant="primary"
        />

        {/* Secondary action - Register another user */}
        <ActionButton
          title="Register Another User"
          onPress={onStartOver}
          variant="secondary"
        />
      </View>
    </ScrollView>
  );
};