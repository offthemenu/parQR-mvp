import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { CountryInfo } from '../types';
import { countryPickerStyles } from '../styles/countryPickerStyles';

interface CountryPickerProps {
  selectedCountry: string;
  countries: CountryInfo[];
  isLoading: boolean;
  isLoadingCountries: boolean;
  onCountryChange: (countryCode: string) => void;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  countries,
  isLoading,
  isLoadingCountries,
  onCountryChange,
}) => {
  if (isLoadingCountries) {
    return <ActivityIndicator size="large" color="#007AFF" style={countryPickerStyles.loadingIndicator} />;
  }

  return (
    <View style={countryPickerStyles.inputContainer}>
      <Text style={countryPickerStyles.inputLabel}>Country</Text>
      <View style={countryPickerStyles.pickerContainer}>
        <Picker
          selectedValue={selectedCountry}
          onValueChange={onCountryChange}
          style={countryPickerStyles.picker}
          enabled={!isLoading}
        >
          {countries.map((country, index) => (
            <Picker.Item
              key={`${country.iso_code}-${index}`}
              label={`${country.flag_emoji} ${country.country_name}`}
              value={country.iso_code}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};