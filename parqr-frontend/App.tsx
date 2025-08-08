import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from './src/screens/SplashScreen';
import { SignInScreen } from './src/screens/SignInScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { CarRegistrationScreen } from './src/screens/CarRegistrationScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { RootStackParamList } from './src/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007AFF',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="SignIn" 
          component={SignInScreen}
          options={{ 
            title: 'Welcome',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ 
            title: 'parQR Registration',
            headerBackTitle: ' '
          }}
        />
        <Stack.Screen 
          name="CarRegistration" 
          component={CarRegistrationScreen}
          options={{ 
            title: 'Add Your Car',
            headerLeft: () => null, // Remove back button
            gestureEnabled: false // Disable swipe back
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'parQR',
            headerLeft: () => null, // Remove back button
            gestureEnabled: false // Disable swipe back
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ 
            title: 'Profile'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}