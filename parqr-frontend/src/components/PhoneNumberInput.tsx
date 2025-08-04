import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { phoneInputStyles } from '../styles/phoneInputStyles';

interface PhoneNumberInputProps {
  phoneNumber: string;
  selectedCountry: string;
  isLoading: boolean;
  onPhoneNumberChange: (text: string) => void;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  phoneNumber,
  selectedCountry,
  isLoading,
  onPhoneNumberChange,
}) => {
  return (
    <View style={phoneInputStyles.inputContainer}>
      <Text style={phoneInputStyles.inputLabel}>Phone Number</Text>
      <TextInput
        style={phoneInputStyles.input}
        value={phoneNumber}
        onChangeText={onPhoneNumberChange}
        placeholder={selectedCountry === 'KR' ? '010-1234-5678' : '(555) 123-4567'}
        keyboardType="phone-pad"
        maxLength={selectedCountry === 'KR' ? 13 : 14}
        editable={!isLoading}
      />
    </View>
  );
};