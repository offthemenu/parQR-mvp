import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { QuickActionCard } from '../components/QuickActionCard';
import { homeScreenStyles } from '../styles/homeScreenStyles';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const route = useRoute<HomeScreenRouteProp>();

  // Get user data from navigation params
  const { user } = route.params || {};

  const handleViewProfile = () => {
    if (user) {
      navigation.navigate('Profile', { user });
    }
  };

  const handleRegisterCar = () => {
    alert('Car registration will be implemented in Sprint 6');
  };

  const handleStartParking = () => {
    alert('Parking session management will be implemented in a future sprint');
  };

  return (
    <ScrollView style={homeScreenStyles.container}>
      {/* Header */}
      <View style={homeScreenStyles.header}>
        <Text style={homeScreenStyles.welcomeText}>Welcome to parQR</Text>
        {user && (
          <Text style={homeScreenStyles.userCodeText}>Your Code: {user.user_code}</Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={homeScreenStyles.section}>
        <Text style={homeScreenStyles.sectionTitle}>Quick Actions</Text>
        
        <QuickActionCard
          title="🚗 Start Parking"
          subtitle="Begin a new parking session"
          onPress={handleStartParking}
        />

        <QuickActionCard
          title="🔧 Register Car"
          subtitle="Add a new vehicle to your account"
          onPress={handleRegisterCar}
        />

        <QuickActionCard
          title="👤 View Profile"
          subtitle="Manage your account and QR code"
          onPress={handleViewProfile}
        />
      </View>

      {/* QR Code Section */}
      {user && (
        <View style={homeScreenStyles.section}>
          <Text style={homeScreenStyles.sectionTitle}>Your QR Code</Text>
          <View style={homeScreenStyles.qrSection}>
            <Text style={homeScreenStyles.qrText}>QR ID: {user.qr_code_id}</Text>
            <TouchableOpacity style={homeScreenStyles.viewQrButton} onPress={handleViewProfile}>
              <Text style={homeScreenStyles.viewQrButtonText}>View Full QR Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Recent Activity Placeholder */}
      <View style={homeScreenStyles.section}>
        <Text style={homeScreenStyles.sectionTitle}>Recent Activity</Text>
        <View style={homeScreenStyles.emptyState}>
          <Text style={homeScreenStyles.emptyStateText}>No recent parking sessions</Text>
          <Text style={homeScreenStyles.emptyStateSubtext}>
            Start your first parking session to see activity here
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};