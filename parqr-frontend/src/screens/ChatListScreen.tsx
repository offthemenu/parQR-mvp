import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { chatListStyles } from '../styles/chatListStyles';

type ChatListNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<ChatListNavigationProp>();

  const handleComingSoon = () => {
    Alert.alert(
      'Coming Soon',
      'Chat functionality will be fully implemented in the next sprint. For now, use the QR scanner to connect with other users.',
      [
        {
          text: 'Scan QR Code',
          onPress: () => navigation.navigate('QRScanner')
        },
        {
          text: 'OK',
          style: 'cancel'
        }
      ]
    );
  };

  return (
    <View style={chatListStyles.container}>
      <View style={chatListStyles.emptyState}>
        <Text style={chatListStyles.emptyTitle}>💬 Messages</Text>
        <Text style={chatListStyles.emptyMessage}>
          Chat with other parQR users to request car moves or just say hi!
        </Text>
        
        <TouchableOpacity 
          style={chatListStyles.scanButton}
          onPress={() => navigation.navigate('QRScanner')}
        >
          <Text style={chatListStyles.scanButtonText}>📷 Scan QR Code to Connect</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={chatListStyles.comingSoonButton}
          onPress={handleComingSoon}
        >
          <Text style={chatListStyles.comingSoonText}>
            Full chat features coming soon!
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};