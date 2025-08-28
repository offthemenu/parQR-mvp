import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { QRCodeDisplay } from '../components/QRCodeDisplay';
import { ActionButton } from '../components/ActionButton';
import { homeScreenStyles } from '../styles/homeScreenStyles';
import { useChatNotifications } from '../hooks/useChatNotifications';
import { NotificationBadge } from '../components/home/NotificationBadge';
import { ParkingService } from '../services/parkingService';
import { ParkingSessionCard } from '../components/home/ParkingSessionCard';
import { ParkingSession } from '../types';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { user } = route.params;
  const { totalUnreadCount } = useChatNotifications({
    currentUserCode: user.user_code,
    enabled: true,
    pollInterval: 30000
  })
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleQRScan = () => {
    navigation.navigate('QRScanner');
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile', { user });
  };

  const handleViewChats = () => {
    navigation.navigate('ChatList');
  };

  // state for parking session
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [isLoadingParking, setIsLoadingParking] = useState(true);

  // useEffect to fetch active parking session
  useEffect(() => {
    const fetchActiveSession = async () => {
      try {
        const activeSessions = await ParkingService.getActiveSessions();
        if (activeSessions.length > 0) {
          setActiveSession(activeSessions[0]); // Take the first active session
        }
      } catch (error) {
        console.error("Error fetching active session:", error);
      } finally {
        setIsLoadingParking(false);
      }
    };

    fetchActiveSession();
  }, []);

  // parking session handlers
  const handleStartParking = async () => {
    // Check if user has cars property (UserLookupResponse vs RegisterUserResponse)
    if (!('cars' in user) || !user.cars || user.cars.length === 0) {
      Alert.alert('No Cars', 'Please register a car before starting a parking session.');
      return;
    }

    // For now, use the first car. In a full implementation, show car selection
    const carId = user.cars[0].id;
    
    setIsLoadingParking(true);
    
    try {
      const parkingSession = await ParkingService.startParkingSession({ car_id: carId });
      
      setActiveSession(parkingSession);
      Alert.alert('Parking Started', 'Your parking session has begun.');
    } catch (error) {
      Alert.alert('Error', 'Unable to start parking session. Please try again.');
    } finally {
      setIsLoadingParking(false);
    }
  };

  const handleSessionEnded = () => {
    setActiveSession(null);
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
              <NotificationBadge count={totalUnreadCount} />
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

      {activeSession && (
        <ParkingSessionCard
          session={activeSession}
          onSessionEnded={handleSessionEnded}
          userCountryISO={user.signup_country_iso}
        />
      )}

      {!activeSession && (
        <View style={homeScreenStyles.parkingSection}>
          <ActionButton
            title="🚗 Start Parking"
            onPress={handleStartParking}
            variant="secondary"
          />
        </View>
      )}

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