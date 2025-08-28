import React, { useEffect, useRef, useState } from 'react';
import { 
  View, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  RefreshControl,
  Alert,
  Text
} from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { MessageBubble } from '../components/chat/MessageBubble';
import { ChatInput } from '../components/chat/ChatInput';
import { useMessagePolling } from '../hooks/useMessagePolling';
import { ChatService } from '../services/chatService';
import { AuthService } from '../services/authService';
import { chatScreenStyles } from '../styles/chat/chatScreenStyles';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'Chat'>;
type ChatScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Chat'>;

export const ChatScreen: React.FC = () => {
  const route = useRoute<ChatScreenRouteProp>();
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const flatListRef = useRef<FlatList>(null);
  
  const { recipientUserCode, recipientDisplayName, sendMoveCarRequest } = route.params;
  
  const [currentUserCode, setCurrentUserCode] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userCode = await AuthService.getUserCode();
        if (userCode) {
          setCurrentUserCode(userCode);
        } else {
          Alert.alert('Error', 'Unable to identify current user');
          navigation.goBack();
        }
      } catch (error) {
        Alert.alert('Error', 'Authentication failed');
        navigation.goBack();
      } finally {
        setIsInitializing(false);
      }
    };

    getCurrentUser();
  }, [navigation]);

  // Initialize chat polling
  const { messages, isLoading, error, refreshMessages } = useMessagePolling({
    recipientUserCode,
    currentUserCode,
    enabled: !isInitializing && !!currentUserCode,
    pollInterval: 15000
  });

  // Send move car request if specified
  useEffect(() => {
    if (sendMoveCarRequest && currentUserCode) {
      const sendMoveRequest = async () => {
        try {
          await ChatService.sendMoveCarRequest(recipientUserCode);
          // The request message will appear through polling
        } catch (error) {
          Alert.alert('Error', 'Failed to send move car request');
        }
      };
      
      sendMoveRequest();
    }
  }, [sendMoveCarRequest, recipientUserCode, currentUserCode]);

  // Mark messages as read when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      if (currentUserCode && messages.length > 0) {
        const markAsRead = async () => {
          try {
            // Get unread messages sent by recipient to current user
            const unreadMessages = messages.filter(
              msg => msg.sender_user_code === recipientUserCode && !msg.is_read
            );
            
            console.log(`🔍 Chat Screen Debug - Total messages: ${messages.length}`);
            console.log(`🔍 Chat Screen Debug - Unread messages found: ${unreadMessages.length}`);
            console.log(`🔍 Chat Screen Debug - Recipient user code: ${recipientUserCode}`);
            console.log(`🔍 Chat Screen Debug - Current user code: ${currentUserCode}`);
            
            if (unreadMessages.length > 0) {
              const messageIds = unreadMessages.map(msg => msg.id);
              console.log(`🔍 Chat Screen Debug - Marking messages as read: ${messageIds}`);
              const result = await ChatService.markMessagesAsRead(messageIds);
              console.log(`🔍 Chat Screen Debug - Mark as read result:`, result);
              
              // Refresh the messages to reflect read status
              await refreshMessages();
            }
          } catch (error) {
            // Silent fail for read status
            console.log('Failed to mark messages as read:', error);
          }
        };
        
        markAsRead();
      }
    }, [recipientUserCode, currentUserCode, messages])
  );

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async (messageContent: string) => {
    try {
      console.log('🚀 Sending message to', recipientUserCode, `(${messageContent.length} chars)`);
      
      await ChatService.sendMessage({
        recipient_user_code: recipientUserCode,
        message_content: messageContent,
        message_type: 'text'
      });

      console.log('✅ Message sent successfully, refreshing in 1 second...');
      
      // Message will appear through polling
      setTimeout(() => {
        console.log('🔄 Refreshing messages after send...');
        refreshMessages();
      }, 1000); // Small delay to ensure backend processing
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      throw error; // Let ChatInput handle the error display
    }
  };

  const renderMessage = ({ item }: { item: any }) => (
    <MessageBubble
      message={item}
      currentUserCode={currentUserCode}
      senderDisplayName={
        item.sender_user_code === currentUserCode 
          ? 'You' 
          : recipientDisplayName || item.sender_user_code
      }
    />
  );

  const renderEmptyState = () => (
    <View style={chatScreenStyles.emptyState}>
      <Text style={chatScreenStyles.emptyStateText}>
        Start a conversation with {recipientDisplayName || recipientUserCode}
      </Text>
    </View>
  );

  if (isInitializing) {
    return (
      <View style={chatScreenStyles.loadingContainer}>
        <Text style={chatScreenStyles.loadingText}>Loading chat...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={chatScreenStyles.errorContainer}>
        <Text style={chatScreenStyles.errorText}>
          Unable to load messages: {error}
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={chatScreenStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id.toString()}
        style={chatScreenStyles.messagesList}
        contentContainerStyle={messages.length === 0 ? { flex: 1 } : undefined}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshMessages}
            tintColor="#007AFF"
          />
        }
        onContentSizeChange={() => {
          if (messages.length > 0) {
            flatListRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </KeyboardAvoidingView>
  );
};