import { useEffect, useState, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { ChatService } from '../services/chatService';

interface UseChatNotificationsProps {
    currentUserCode: string;
    enabled: boolean;
    pollInterval?: number;
}

export const useChatNotifications = ({
    currentUserCode,
    enabled,
    pollInterval = 30000
}: UseChatNotificationsProps) => {
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const appState = useRef(AppState.currentState);

    const fetchUnreadCount = async () => {
        if (!enabled || !currentUserCode) return;

        try {
            const conversations = await ChatService.getConversations();

            // Calculate total unread count from conversations
            const unreadCount = conversations.reduce(
                (total, conversation) => total + (conversation.unread_count || 0),
                0
            );
            
            console.log(`🔔 Notification Debug - Found ${conversations.length} conversations`);
            conversations.forEach((conv, index) => {
                console.log(`🔔 Conversation ${index + 1}: ${conv.participant_user_code} - Unread: ${conv.unread_count}`);
            });
            console.log(`🔔 Notification Debug - Total unread count: ${unreadCount}`);
            
            setTotalUnreadCount(unreadCount);
        } catch (error) {
            console.error('Error fetching unread count:', error);
        }
    };

    const startPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            fetchUnreadCount();
        }, pollInterval);
    };

    const stopPolling = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };

    // Handling app state changes
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (appState.current.match(/inactive|background/) && nextAppState === "active") {
                // Bring the app to the foreground
                if (enabled) {
                    fetchUnreadCount();
                    startPolling();
                }
            } else if (nextAppState.match(/inactive|background/)) {
                // App goes to the background
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
        if (enabled && currentUserCode) {
            fetchUnreadCount();
            startPolling();
        } else {
            stopPolling();
        }

        return () => {
            stopPolling();
        };
    }, [enabled, currentUserCode, pollInterval]);

    const refreshUnreadCount = async () => {
        setIsLoading(true);
        await fetchUnreadCount();
        setIsLoading(false);
    };

    return {
        totalUnreadCount,
        isLoading,
        refreshUnreadCount
    };
};