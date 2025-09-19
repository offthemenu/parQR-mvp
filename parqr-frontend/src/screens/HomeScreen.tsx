import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useMoveRequestNotifications } from '../hooks/useMoveRequestNotifications';
import { useFeatureGating } from '../hooks/useFeatureGating';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
// import { QRCodeDisplay } from '../components/QRCodeDisplay'; // Commented out - QR code display moved to separate screen
import { ActionButton } from '../components/ActionButton';
import { homeScreenStyles } from '../styles/homeScreenStyles';
import { useChatNotifications } from '../hooks/useChatNotifications';
import { NotificationBadge } from '../components/home/NotificationBadge';
import { ParkingService } from '../services/parkingService';
import { UserService } from '../services/userService';
import { ParkingSessionCard } from '../components/home/ParkingSessionCard';
import { ParkingSession } from '../types';
import { ParkOutRequestsSection } from '../components/home/ParkOutRequestsSection';
import { ParkingHistorySection } from '../components/home/ParkingHistorySection';
import { RegisteredCarPanel } from '../components/home/RegisteredCarPanel';

type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;
type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
  const route = useRoute<HomeScreenRouteProp>();
  const { user } = route.params;
  const [currentUser, setCurrentUser] = useState(user);
  // feature gating for chat section and car management
  const { canAccessChat, canAddCars } = useFeatureGating(user.user_tier);

  const { totalUnreadCount, refreshUnreadCount } = useChatNotifications({
    currentUserCode: user.user_code,
    enabled: canAccessChat, // Only enable for premium users
    pollInterval: 30000
  })
  // Move request notifications hook
  const { moveRequestsUnreadCount } = useMoveRequestNotifications(user.user_code);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Navigation handlers
  const handleQRScan = () => {
    navigation.navigate('QRScanner');
  };

  const handleViewProfile = () => {
    navigation.navigate('Profile', { user });
  };

  const handleViewChats = () => {
    navigation.navigate('ChatList');
  };

  const handleParkOutHistoryPress = () => {
    navigation.navigate("ParkOutHistory", {
      userCode: user.user_code
    });
  };

  const handleParkingHistoryPress = () => {
    navigation.navigate("ParkingHistory", {
      userCode: user.user_code
    });
  }

  const handleManageCars = () => {
    navigation.navigate("CarManagement")
  }

  // state for parking session
  const [activeSession, setActiveSession] = useState<ParkingSession | null>(null);
  const [isLoadingParking, setIsLoadingParking] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

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

  // Refresh notifications when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      console.log('🏠 HomeScreen focused - refreshing notifications');
      refreshUnreadCount();
    }, [refreshUnreadCount])
  );

  // Refresh user data
  useFocusEffect(
    React.useCallback(() => {
      const refreshUserData = async () => {
        try {
          // Get updated user data with cars
          const updatedUser = await UserService.lookupUser(user.user_code);
          setCurrentUser(updatedUser);
        } catch (error) {
          console.error("Error refreshing user data:", error);
        }
      };
      refreshUserData();
    }, [user.user_code])
  );

  // parking session handlers
  const handleStartParking = async () => {
    // Check if user has cars property (UserLookupResponse vs RegisterUserResponse)
    if (!('cars' in currentUser) || !currentUser.cars || currentUser.cars.length === 0) {
      Alert.alert('No Cars', 'Please register a car before starting a parking session.');
      return;
    }

    // For now, use the first car. In a full implementation, show car selection
    const carId = currentUser.cars[0].id;

    setIsLoadingParking(true);

    try {
      const parkingSession = await ParkingService.startParkingSession({ car_id: carId });

      setActiveSession(parkingSession);
      setRefreshTrigger(prev => prev + 1); // Refresh parking history
      Alert.alert('Parking Started', 'Your parking session has begun.');
    } catch (error) {
      Alert.alert('Error', 'Unable to start parking session. Please try again.');
    } finally {
      setIsLoadingParking(false);
    }
  };

  const handleSessionEnded = () => {
    setActiveSession(null);
    setRefreshTrigger(prev => prev + 1); // Refresh parking history when session ends
  };

  return (
    <View style={homeScreenStyles.container}>
      <ScrollView style={homeScreenStyles.scrollView}>
        {/* Header Section */}
        <View style={homeScreenStyles.header}>
          <View style={homeScreenStyles.headerContent}>
            <Text style={homeScreenStyles.welcomeText}>
              Welcome back, {'profile_display_name' in user ? (user.profile_display_name || user.user_code) : user.user_code}!
            </Text>

            {/* Chat and Profile buttons in header */}
            <View style={homeScreenStyles.headerButtons}>
              {canAccessChat && (
                <TouchableOpacity
                  style={homeScreenStyles.headerButton}
                  onPress={handleViewChats}
                >
                  <Text style={homeScreenStyles.headerButtonText}>💬</Text>
                  <NotificationBadge count={totalUnreadCount} />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={homeScreenStyles.headerButton}
                onPress={handleViewProfile}
              >
                <Text style={homeScreenStyles.headerButtonText}>👤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* RegisteredCarPanel - Active car details */}
        {'cars' in currentUser && currentUser.cars && currentUser.cars.length > 0 ? (
          <RegisteredCarPanel
            car={currentUser.cars[0]}
            onManageCars={handleManageCars}
          />
        ) : (
          <View style={homeScreenStyles.carsSection}>
            <Text style={homeScreenStyles.sectionTitle}>No Registered Vehicle</Text>
            {canAddCars ? (
              <ActionButton
                title="📝 Register a Car"
                onPress={() => navigation.navigate('CarRegistration', { user: currentUser })}
                variant="secondary"
              />
            ) : (
              <View style={homeScreenStyles.premiumPrompt}>
                <Text style={homeScreenStyles.premiumText}>
                  Upgrade to Premium to register multiple cars
                </Text>
              </View>
            )}
          </View>
        )}

        {/* StartParking - Parking controls */}
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

        {/* ParkOutRequests - Move requests (prominent position) */}
        <ParkOutRequestsSection
          userCode={user?.user_code || ''}
          unreadCount={moveRequestsUnreadCount}  // FIXED: Added required unreadCount prop
          onPress={handleParkOutHistoryPress}
        />

        {user?.user_code && (
          <ParkingHistorySection
            userCode={user.user_code}
            onPress={handleParkingHistoryPress}
            refreshTrigger={refreshTrigger}
          />
        )}

        {/* Removed QR scan from main content - now floating */}

        {/* QR Code Display - Your QR code for others to scan */}
        {/* <View style={homeScreenStyles.qrSection}>
        <Text style={homeScreenStyles.sectionTitle}>Your QR Code</Text>
        <QRCodeDisplay
          qrCodeId={user.qr_code_id}
          size={200}
          showId={true}
        />
        <Text style={homeScreenStyles.qrDescription}>
          Share this QR code so others can connect with you
        </Text>
      </View> */}
      </ScrollView>

      {/* Floating QR Scan Button */}
      <TouchableOpacity
        style={homeScreenStyles.floatingButton}
        onPress={handleQRScan}
        activeOpacity={0.8}
      >
        <Text style={homeScreenStyles.floatingButtonText}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
};