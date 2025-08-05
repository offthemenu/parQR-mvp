import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { UserInfoCard } from '../components/UserInfoCard';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { ActionButton } from '../components/ActionButton';
import { profileScreenStyles } from '../styles/profileScreenStyles';

type ProfileScreenRouteProp = RouteProp<RootStackParamList, 'Profile'>;
type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export const ProfileScreen: React.FC = () => {
  const route = useRoute<ProfileScreenRouteProp>();
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const { user } = route.params;

  const handleRegenerateQR = () => {
    Alert.alert(
      'Regenerate QR Code',
      'QR code regeneration will be implemented in a future sprint',
      [{ text: 'OK' }]
    );
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          }
        }
      ]
    );
  };

  const handleActionPress = (action: string) => {
    Alert.alert('Coming Soon', `${action} will be implemented in a future sprint`);
  };

  return (
    <ScrollView style={profileScreenStyles.container}>
      {/* User Info Section */}
      <View style={profileScreenStyles.section}>
        <Text style={profileScreenStyles.sectionTitle}>Account Information</Text>
        
        <UserInfoCard
          label="User Code"
          value={user.user_code}
        />
        
        <UserInfoCard
          label="Country"
          value={user.signup_country_iso === 'KR' ? 'South Korea' : user.signup_country_iso}
        />
        
        <UserInfoCard
          label="Member Since"
          value={new Date(user.created_at).toLocaleDateString()}
          isLast={true}
        />
      </View>

      {/* QR Code Section */}
      <View style={profileScreenStyles.section}>
        <Text style={profileScreenStyles.sectionTitle}>Your QR Code</Text>
        <View style={profileScreenStyles.qrContainer}>
          <QRCodeDisplay
            qrCodeId={user.qr_code_id}
            size={200}
            showId={true}
          />
          
          <TouchableOpacity style={profileScreenStyles.regenerateButton} onPress={handleRegenerateQR}>
            <Text style={profileScreenStyles.regenerateButtonText}>Regenerate QR Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Actions Section */}
      <View style={profileScreenStyles.section}>
        <Text style={profileScreenStyles.sectionTitle}>Account Actions</Text>
        
        <TouchableOpacity 
          style={profileScreenStyles.actionButton}
          onPress={() => handleActionPress('Manage Cars')}
        >
          <Text style={profileScreenStyles.actionButtonText}>🚗 Manage Cars</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={profileScreenStyles.actionButton}
          onPress={() => handleActionPress('App Settings')}
        >
          <Text style={profileScreenStyles.actionButtonText}>📱 App Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={profileScreenStyles.actionButton}
          onPress={() => handleActionPress('Help & Support')}
        >
          <Text style={profileScreenStyles.actionButtonText}>❓ Help & Support</Text>
        </TouchableOpacity>
      </View>

      {/* Sign Out Section */}
      <View style={profileScreenStyles.section}>
        <ActionButton
          title="Sign Out"
          onPress={handleSignOut}
          variant="danger"
        />
      </View>
    </ScrollView>
  );
};