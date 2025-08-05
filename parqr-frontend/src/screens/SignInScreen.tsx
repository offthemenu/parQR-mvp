import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { ActionButton } from '../components/ActionButton';
import { signInScreenStyles } from '../styles/signInScreenStyles';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignIn'>;

export const SignInScreen: React.FC = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const handleSignUp = () => {
    navigation.navigate('Register');
  };

  const handleSignIn = () => {
    // TODO: Implement sign-in logic in future sprint
    alert('Sign-in functionality will be implemented in a future sprint');
  };

  return (
    <View style={signInScreenStyles.container}>
      <View style={signInScreenStyles.header}>
        <Text style={signInScreenStyles.title}>Welcome Back</Text>
        <Text style={signInScreenStyles.subtitle}>Sign in to access your parQR account</Text>
      </View>

      <View style={signInScreenStyles.buttonContainer}>
        <ActionButton
          title="Sign In"
          onPress={handleSignIn}
          variant="primary"
        />

        <ActionButton
          title="Create New Account"
          onPress={handleSignUp}
          variant="secondary"
        />
      </View>

      <View style={signInScreenStyles.footer}>
        <Text style={signInScreenStyles.footerText}>
          New to parQR? Create an account to get started with smart parking.
        </Text>
      </View>
    </View>
  );
};