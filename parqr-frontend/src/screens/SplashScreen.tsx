import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { AuthService } from '../services/authService';
import { UserService } from '../services/userService';
import { splashScreenStyles } from '../styles/splashScreenStyles';

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

export const SplashScreen: React.FC = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Check if user has stored credentials
      const userCode = await AuthService.getUserCode();

      if (userCode) {
        console.log('Found stored user code, attempting auto-login...');

        try {
          // Verify user still exists and get fresh data
          const userData = await UserService.lookupUser(userCode);

          // Update stored user data with fresh info
          await AuthService.storeUserData(userData);

          // Navigate based on whether user has cars
          if (userData.cars && userData.cars.length > 0) {
            // User has cars, go to home
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home', params: { user: userData } }],
            });
          } else {
            // User has no cars, go to car registration
            navigation.reset({
              index: 0,
              routes: [{ name: 'CarRegistration', params: { user: userData } }],
            });
          }

        } catch (lookupError) {
          console.log('Auto-login failed, user may no longer exist');
          // Clear invalid credentials and go to sign in
          await AuthService.clearAuthData();
          navigation.replace('SignIn');
        }

      } else {
        // No stored credentials, go to sign in
        console.log('No stored credentials found');
        navigation.replace('SignIn');
      }

    } catch (error) {
      console.error('Auth check failed:', error);
      // On error, default to sign in screen
      navigation.replace('SignIn');
    }
  };

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