import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  FlatList, 
  Text, 
  TextInput,
  RefreshControl,
  Alert,
  AppState,
  AppStateStatus
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, ChatConversationResponse } from '../types';
import { ConversationCard } from '../components/chat/ConversationCard';
import { ChatService } from '../services/chatService';
import { AuthService } from '../services/authService';
import { chatListStyles } from '../styles/chat/chatListStyles';

type ChatListNavigationProp = StackNavigationProp<RootStackParamList, 'ChatList'>;

// Using the ChatConversationResponse type from the API
type Conversation = ChatConversationResponse;

export const ChatListScreen: React.FC = () => {
  const navigation = useNavigation<ChatListNavigationProp>();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentUserCode, setCurrentUserCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  // Polling refs
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);
  const isScreenFocused = useRef(false);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const userCode = await AuthService.getUserCode();
        if (userCode) {
          setCurrentUserCode(userCode);
        } else {
          Alert.alert('Error', 'Unable to identify current user');
        }
        
      } catch (error) {
        Alert.alert('Error', 'Authentication failed');
      }
    };

    getCurrentUser();
  }, []);

  const fetchConversations = async (showRefreshControl = false) => {
    if (!currentUserCode) return;
    
    if (showRefreshControl) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    
    try {
      const conversations = await ChatService.getConversations();
      
      // Debug: Log the raw API response
      console.log('📋 Chat List Debug - Raw conversations from API:', conversations);
      
      // Debug: Log each conversation's last message details
      conversations?.forEach((conv, index) => {
        console.log(`📋 Conversation ${index + 1} - User: ${conv.participant_user_code}`);
        if (conv.last_message) {
          console.log(`📋   Last message ID: ${conv.last_message.id}`);
          console.log(`📋   Last message content: "${conv.last_message.message_content}"`);
          console.log(`📋   Last message created_at: ${conv.last_message.created_at}`);
          console.log(`📋   Last message sender: ${conv.last_message.sender_user_code}`);
        } else {
          console.log(`📋   No last message found for this conversation`);
        }
      });
      
      // Remove duplicates based on participant_user_code
      const uniqueConversations = conversations ? conversations.filter((conv, index, self) => 
        index === self.findIndex(c => c.participant_user_code === conv.participant_user_code)
      ) : [];
      
      console.log('📋 Chat List Debug - Unique conversations after filtering:', uniqueConversations);
      
      setConversations(uniqueConversations);
      setError(null);
    } catch (err) {
      setError('Network error occurred');
      console.error('Conversations fetch error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Polling functions
  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      if (currentUserCode && isScreenFocused.current) {
        console.log('Polling for conversation updates...');
        fetchConversations(false); // Don't show refresh control for automatic polls
      }
    }, 30000); // Poll every 30 seconds
  };

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Handle app state changes (pause polling when app is backgrounded)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        if (currentUserCode && isScreenFocused.current) {
          fetchConversations(false);
          startPolling();
        }
      } else if (nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        stopPolling();
      }
      
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, [currentUserCode]);

  // Handle screen focus and polling
  useFocusEffect(
    React.useCallback(() => {
      isScreenFocused.current = true;
      
      if (currentUserCode) {
        console.log('ChatList screen focused - refreshing conversations and starting polling');
        fetchConversations();
        startPolling();
      }

      return () => {
        isScreenFocused.current = false;
        stopPolling();
      };
    }, [currentUserCode])
  );

  // Cleanup polling when component unmounts
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  // Filter conversations based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conversation => {
        const displayName = conversation.participant_display_name || conversation.participant_user_code;
        const lastMessageContent = conversation.last_message?.message_content || '';
        
        return (
          displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lastMessageContent.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conversation.participant_user_code.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
      setFilteredConversations(filtered);
    }
  }, [conversations, searchQuery]);

  const handleConversationPress = (conversation: Conversation) => {
    navigation.navigate('Chat', {
      recipientUserCode: conversation.participant_user_code,
      recipientDisplayName: conversation.participant_display_name || conversation.participant_user_code
    });
  };

  const renderConversation = ({ item }: { item: Conversation }) => (
    <ConversationCard
      conversation={item}
      currentUserCode={currentUserCode}
      onPress={() => handleConversationPress(item)}
    />
  );

  const renderEmptyState = () => (
    <View style={chatListStyles.emptyState}>
      <Text style={chatListStyles.emptyStateTitle}>No Conversations Yet</Text>
      <Text style={chatListStyles.emptyStateText}>
        Scan someone's QR code to start a conversation
      </Text>
    </View>
  );

  const renderSearchEmptyState = () => (
    <View style={chatListStyles.emptyState}>
      <Text style={chatListStyles.emptyStateTitle}>No Results Found</Text>
      <Text style={chatListStyles.emptyStateText}>
        Try searching with a different term
      </Text>
    </View>
  );

  if (!currentUserCode) {
    return (
      <View style={chatListStyles.loadingContainer}>
        <Text style={chatListStyles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (error && conversations.length === 0) {
    return (
      <View style={chatListStyles.errorContainer}>
        <Text style={chatListStyles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={chatListStyles.container}>
      <View style={chatListStyles.searchContainer}>
        <TextInput
          style={chatListStyles.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
        keyExtractor={(item, index) => `${item.participant_user_code}-${index}`}
        style={chatListStyles.conversationsList}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchConversations(true)}
            tintColor="#007AFF"
          />
        }
        ListEmptyComponent={
          searchQuery.trim() ? renderSearchEmptyState : renderEmptyState
        }
        contentContainerStyle={
          filteredConversations.length === 0 ? { flex: 1 } : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};