import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { RegisterUserResponse, CountryInfo } from '../types';
import { registrationSuccessStyles } from '../styles/registrationSuccessStyles';

interface RegistrationSuccessProps {
  userData: RegisterUserResponse;
  selectedCountry: string;
  countries: CountryInfo[];
  onStartOver: () => void;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
  userData,
  selectedCountry,
  countries,
  onStartOver,
}) => {
  const getSelectedCountryInfo = (): CountryInfo | undefined => {
    return countries.find(country => country.iso_code === selectedCountry);
  };

  return (
    <ScrollView contentContainerStyle={registrationSuccessStyles.container}>
      <View style={registrationSuccessStyles.successContainer}>
        <Text style={registrationSuccessStyles.title}>Registration Complete!</Text>
        
        <View style={registrationSuccessStyles.userInfoContainer}>
          <Text style={registrationSuccessStyles.userInfoTitle}>Your Details:</Text>
          <Text style={registrationSuccessStyles.userInfoText}>User Code: {userData.user_code}</Text>
          <Text style={registrationSuccessStyles.userInfoText}>Country: {getSelectedCountryInfo()?.country_name || selectedCountry}</Text>
        </View>

        <View style={registrationSuccessStyles.qrContainer}>
          <Text style={registrationSuccessStyles.qrTitle}>Your QR Code:</Text>
          <QRCode
            value={userData.qr_code_id}
            size={200}
            backgroundColor="white"
            color="black"
          />
          <Text style={registrationSuccessStyles.qrSubtext}>QR ID: {userData.qr_code_id}</Text>
        </View>

        <TouchableOpacity 
          style={registrationSuccessStyles.button} 
          onPress={onStartOver}
        >
          <Text style={registrationSuccessStyles.buttonText}>Register Another User</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};