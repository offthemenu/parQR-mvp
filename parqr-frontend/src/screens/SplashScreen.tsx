import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { splashScreenStyles } from '../styles/splashScreenStyles';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    // Simulate splash delay and check for existing user
    const timer = setTimeout(() => {
      // TODO: Check if user is already registered/signed in
      // For now, always go to SignIn screen
      navigation.replace('SignIn');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={splashScreenStyles.container}>
      <View style={splashScreenStyles.logoContainer}>
        <View style={splashScreenStyles.logoPlaceholder}>
          <Text style={splashScreenStyles.logoText}>parQR</Text>
        </View>
        <Text style={splashScreenStyles.tagline}>Smart Parking Made Simple</Text>
      </View>
      
      <View style={splashScreenStyles.loadingContainer}>
        <Text style={splashScreenStyles.loadingText}>Loading...</Text>
      </View>
    </View>
  );
};