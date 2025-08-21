import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { ActionButton } from '../components/ActionButton';
import { publicProfileStyles } from '../styles/publicProfileStyles';

type PublicProfileScreenRouteProp = RouteProp<RootStackParamList, 'PublicProfile'>;
type PublicProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PublicProfile'>;

export const PublicProfileScreen: React.FC = () => {
  const route = useRoute<PublicProfileScreenRouteProp>();
  const navigation = useNavigation<PublicProfileScreenNavigationProp>();
  const { userCode, userData, isWebView = false } = route.params;

  const handleSendMessage = () => {
    navigation.navigate('Chat', {
      recipientUserCode: userCode,
      recipientDisplayName: userData.profile_display_name || userCode,
      sendMoveCarRequest: false
    });
  };

  const handleRequestCarMove = () => {
    navigation.navigate('Chat', {
      recipientUserCode: userCode,
      recipientDisplayName: userData.profile_display_name || userCode,
      sendMoveCarRequest: true
    });
  };

  const handleCloseProfile = () => {
    navigation.goBack();
  };

  // Get the first registered car (primary car)
  const primaryCar = userData.cars && userData.cars.length > 0 ? userData.cars[0] : null;

  return (
    <SafeAreaView style={publicProfileStyles.container}>
      {/* Close Button (In-App Only) */}
      {!isWebView && (
        <TouchableOpacity 
          style={publicProfileStyles.closeButton}
          onPress={handleCloseProfile}
        >
          <Text style={publicProfileStyles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      )}

      {/* Content Container */}
      <View style={publicProfileStyles.content}>
        {/* User Display Name */}
        <Text style={publicProfileStyles.displayName}>
          {userData.profile_display_name || userData.user_code}
        </Text>

        {/* Car Information */}
        {primaryCar ? (
          <View style={publicProfileStyles.carSection}>
            <Text style={publicProfileStyles.carBrand}>{primaryCar.car_brand}</Text>
            <Text style={publicProfileStyles.carModel}>{primaryCar.car_model}</Text>
          </View>
        ) : (
          <View style={publicProfileStyles.carSection}>
            <Text style={publicProfileStyles.noCarText}>No vehicle registered</Text>
          </View>
        )}

        {/* Action Buttons */}
        <View style={publicProfileStyles.buttonSection}>
          <ActionButton
            title="🚗 Request to Move Car"
            onPress={handleRequestCarMove}
            variant="primary"
          />
          
          {/* Send Chat Button (In-App Only) */}
          {!isWebView && (
            <ActionButton
              title="💬 Send Chat"
              onPress={handleSendMessage}
              variant="secondary"
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};