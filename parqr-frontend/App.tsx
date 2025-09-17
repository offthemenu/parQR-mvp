import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SplashScreen } from './src/screens/SplashScreen';
import { SignInScreen } from './src/screens/SignInScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { CarRegistrationScreen } from './src/screens/CarRegistrationScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { QRScannerScreen } from './src/screens/QRScannerScreen';
import { PublicProfileScreen } from './src/screens/PublicProfileScreen';
import { ChatScreen } from './src/screens/ChatScreen';         
import { ChatListScreen } from './src/screens/ChatListScreen'; 
import { ParkOutHistoryScreen } from './src/screens/ParkOutHistoryScreen';
import { ParkingHistoryScreen } from './src/screens/ParkingHistoryScreen';
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
            title: 'Sign In',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen}
          options={{ 
            title: 'Create Account',
            headerBackTitle: 'Back'
          }}
        />
        <Stack.Screen 
          name="CarRegistration" 
          component={CarRegistrationScreen}
          options={{ 
            title: 'Add Your Car',
            headerLeft: () => null,
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ 
            title: 'parQR',
            headerLeft: () => null,
            gestureEnabled: false
          }}
        />
        <Stack.Screen 
          name="Profile" 
          component={ProfileScreen}
          options={{ 
            title: 'Profile'
          }}
        />
        <Stack.Screen 
          name="QRScanner" 
          component={QRScannerScreen}
          options={{ 
            title: 'Scan QR Code',
            headerStyle: {
              backgroundColor: 'black',
            }
          }}
        />
        <Stack.Screen 
          name="PublicProfile" 
          component={PublicProfileScreen}
          options={{ 
            title: 'User Profile'
          }}
        />
        <Stack.Screen 
          name="Chat" 
          component={ChatScreen}
          options={({ route }) => ({ 
            title: route.params.recipientDisplayName
          })}
        />
        <Stack.Screen 
          name="ChatList" 
          component={ChatListScreen}
          options={{ 
            title: 'Messages'
          }}
        />
        <Stack.Screen
          name="ParkOutHistory"
          component={ParkOutHistoryScreen}
          options={{
            title: 'Park-Out History',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="ParkingHistory"
          component={ParkingHistoryScreen}
          options={{
            title: 'Parking History',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
          }}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
}