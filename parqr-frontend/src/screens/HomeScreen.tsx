import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { ActionButton } from '../components/ActionButton';
import { homeScreenStyles } from '../styles/homeScreenStyles';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { user } = route.params;

  const handleQRScan = () => {
    navigation.navigate('QRScanner');
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile', { user });
  };

  const handleViewChats = () => {
    navigation.navigate('ChatList');
  };

  return (
    <ScrollView style={homeScreenStyles.container}>
      {/* Header Section */}
      <View style={homeScreenStyles.header}>
        <View style={homeScreenStyles.headerContent}>
          <Text style={homeScreenStyles.welcomeText}>
            Welcome back, {'profile_display_name' in user ? (user.profile_display_name || user.user_code) : user.user_code}!
          </Text>
          
          {/* Chat and Profile buttons in header */}
          <View style={homeScreenStyles.headerButtons}>
            <TouchableOpacity 
              style={homeScreenStyles.headerButton}
              onPress={handleViewChats}
            >
              <Text style={homeScreenStyles.headerButtonText}>💬</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={homeScreenStyles.headerButton}
              onPress={handleViewProfile}
            >
              <Text style={homeScreenStyles.headerButtonText}>👤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* QR Code Section */}
      <View style={homeScreenStyles.qrSection}>
        <Text style={homeScreenStyles.sectionTitle}>Your QR Code</Text>
        <QRCodeDisplay
          qrCodeId={user.qr_code_id}
          size={200}
          showId={true}
        />
        <Text style={homeScreenStyles.qrDescription}>
          Share this QR code so others can connect with you
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={homeScreenStyles.actionsSection}>
        {/* <Text style={homeScreenStyles.sectionTitle}>Quick Actions</Text> */}
        
        <ActionButton
          title="📷 Scan QR Code"
          onPress={handleQRScan}
          variant="primary"
        />
        
        {/* <ActionButton
          title="💬 View Messages"
          onPress={handleViewChats}
          variant="secondary"
        /> */}

      </View>

      {/* Cars Section */}
      {'cars' in user && user.cars && user.cars.length > 0 && (
        <View style={homeScreenStyles.carsSection}>
          <Text style={homeScreenStyles.sectionTitle}>Your Vehicles</Text>
          {user.cars.map((car, index) => (
            <View key={car.id} style={homeScreenStyles.carCard}>
              <Text style={homeScreenStyles.carInfo}>
                🚗 {car.car_brand} {car.car_model}
              </Text>
              {/* Note: license_plate excluded from CarResponse for privacy */}
              <Text style={homeScreenStyles.licensePlate}>
                Registered Vehicle #{index + 1}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};