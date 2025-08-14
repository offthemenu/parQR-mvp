import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { chatScreenStyles } from '../styles/chatScreenStyles';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

export const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const { recipientUserCode, recipientDisplayName, sendMoveCarRequest } = route.params;

  const handleSendMessage = () => {
    Alert.alert(
      'Coming Soon',
      'Individual chat functionality will be implemented in the next sprint.',
      [{ text: 'OK' }]
    );
  };

  const handleSendMoveCarRequest = () => {
    Alert.alert(
      'Move Car Request',
      `Send a move car request to ${recipientDisplayName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: () => {
            Alert.alert(
              'Request Sent!',
              `Move car request sent to ${recipientDisplayName}. This will be fully functional in the next sprint.`
            );
          }
        }
      ]
    );
  };

  return (
    <View style={chatScreenStyles.container}>
      <View style={chatScreenStyles.header}>
        <Text style={chatScreenStyles.participantName}>
          {recipientDisplayName}
        </Text>
        <Text style={chatScreenStyles.userCode}>
          @{recipientUserCode}
        </Text>
      </View>

      <View style={chatScreenStyles.messagesContainer}>
        <View style={chatScreenStyles.emptyState}>
          <Text style={chatScreenStyles.emptyMessage}>
            💬 Start a conversation with {recipientDisplayName}
          </Text>
          
          {sendMoveCarRequest && (
            <TouchableOpacity 
              style={chatScreenStyles.moveCarButton}
              onPress={handleSendMoveCarRequest}
            >
              <Text style={chatScreenStyles.moveCarButtonText}>
                🚗 Send Move Car Request
              </Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity 
            style={chatScreenStyles.messageButton}
            onPress={handleSendMessage}
          >
            <Text style={chatScreenStyles.messageButtonText}>
              💬 Send Message (Coming Soon)
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};