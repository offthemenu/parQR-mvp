import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { publicProfileStyles } from '../styles/publicProfileStyles';
import { ChatService } from '../services/chatService';

type PublicProfileScreenRouteProp = RouteProp<RootStackParamList, 'PublicProfile'>;
type PublicProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PublicProfile'>;

export const PublicProfileScreen: React.FC = () => {
  const route = useRoute<PublicProfileScreenRouteProp>();
  const navigation = useNavigation<PublicProfileScreenNavigationProp>();
  const { userCode, userData, isWebView = false } = route.params;
  const [isLoading, setIsLoading] = useState(false);

  const handleSendChat = () => {
    setIsLoading(true);

    try {
      navigation.navigate('Chat', {
        recipientUserCode: userCode,
        recipientDisplayName: userData.profile_display_name || userCode
      });
    } catch (error) {
      Alert.alert('Error', 'Unable to open chat. Please try again.');
      console.error('Chat navigation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestMovecar = async () => {
    setIsLoading(true);

    try {
      // Send move car request through chat system
      await ChatService.sendMoveCarRequest(userCode);

      Alert.alert(
        'Request Sent',
        'Your request to move the car has been sent.',
        [
          {
            text: 'Open Chat',
            onPress: () => {
              navigation.navigate('Chat', {
                recipientUserCode: userCode,
                recipientDisplayName: userData.profile_display_name || userCode,
                sendMoveCarRequest: false // Since we already sent it
              });
            }
          },
          { text: 'OK' }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Unable to send request. Please check your connection.');
      console.error('Move car request error:', error);
    } finally {
      setIsLoading(false);
    }
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
        <TouchableOpacity
          style={[
            publicProfileStyles.actionButton,
            isLoading && publicProfileStyles.actionButtonDisabled
          ]}
          onPress={handleRequestMovecar}
          disabled={isLoading}
        >
          <Text style={[
            publicProfileStyles.actionButtonText,
            isLoading && publicProfileStyles.actionButtonTextDisabled
          ]}>
            {isLoading ? 'Sending...' : '🚗 Request to Move Car'}
          </Text>
        </TouchableOpacity>

        {!isWebView && (
          <TouchableOpacity
            style={[
              publicProfileStyles.chatButton,
              isLoading && publicProfileStyles.actionButtonDisabled
            ]}
            onPress={handleSendChat}
            disabled={isLoading}
          >
            <Text style={[
              publicProfileStyles.chatButtonText,
              isLoading && publicProfileStyles.actionButtonTextDisabled
            ]}>
              {isLoading ? 'Opening...' : '💬 Send Chat'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};