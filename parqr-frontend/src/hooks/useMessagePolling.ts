import { useEffect, useRef, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { ChatService } from "../services/chatService";
import { ChatMessageResponse } from "../types";

interface UseMessagePollingProps {
  recipientUserCode: string;
  currentUserCode: string;
  enabled: boolean;
  pollInterval?: number;
}


export const useMessagePolling = ({
  recipientUserCode,
  currentUserCode,
  enabled,
  pollInterval = 15000 // 15 seconds
}: UseMessagePollingProps) => {
  const [messages, setMessages] = useState<ChatMessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessageId, setLastMessageId] = useState<number>(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const appState = useRef(AppState.currentState);

  const fetchMessages = async (showLoadingState = false) => {
    if (!enabled) return;
    
    if (showLoadingState) {
      setIsLoading(true);
    }
    
    try {
      const newMessages = await ChatService.getConversationMessages(recipientUserCode);
      
      // Sort messages by created_at timestamp, with message ID as fallback
      const sortedMessages = newMessages.sort((a, b) => {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        
        // Primary sort: by timestamp (oldest first)
        if (dateA !== dateB) {
          return dateA - dateB;
        }
        
        // Fallback sort: by message ID (older IDs first)
        return a.id - b.id;
      });
      
      console.log('🔍 DEBUG: Raw messages from API:');
      newMessages.forEach((m, index) => {
        console.log(`${index}: ID=${m.id}, Sender=${m.sender_user_code}, Time=${m.created_at}, Length=${m.message_content.length}chars`);
      });
      
      console.log('🔍 DEBUG: Messages after sorting:');
      sortedMessages.forEach((m, index) => {
        const date = new Date(m.created_at);
        console.log(`${index}: ID=${m.id}, Sender=${m.sender_user_code}, Time=${m.created_at} (${date.toLocaleString()}), Length=${m.message_content.length}chars`);
      });
      
      setMessages(sortedMessages);
      
      // Track the latest message ID for efficient polling
      if (sortedMessages.length > 0) {
        const latestId = Math.max(...sortedMessages.map((m: ChatMessageResponse) => m.id));
        if (latestId > lastMessageId) {
          setLastMessageId(latestId);
        }
      }
      
      setError(null);
    } catch (err) {
      setError('Network error occurred');
      console.error('Message polling error:', err);
    } finally {
      if (showLoadingState) {
        setIsLoading(false);
      }
    }
  };

  const startPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(() => {
      fetchMessages(false); // Don't show loading state for polls
    }, pollInterval);
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
        if (enabled) {
          fetchMessages(false);
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
  }, [enabled]);

  // Main polling effect
  useEffect(() => {
    if (enabled && recipientUserCode && currentUserCode) {
      // Initial load
      fetchMessages(true);
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, recipientUserCode, currentUserCode, pollInterval]);

  const refreshMessages = async () => {
    await fetchMessages(true);
  };

  return {
    messages,
    isLoading,
    error,
    refreshMessages
  };
};

