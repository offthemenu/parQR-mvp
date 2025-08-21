import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { conversationCardStyles } from '../../styles/chat/conversationCardStyles';
import { ChatConversationResponse } from '../../types';

interface ConversationCardProps {
    conversation: ChatConversationResponse;
    currentUserCode: string;
    onPress: () => void;
}

export const ConversationCard: React.FC<ConversationCardProps> = ({
    conversation,
    currentUserCode,
    onPress
}) => {
    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

        if (diffInHours < 24) {
            return date.toLocaleTimeString('en-US', { weekday: 'short'});
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    const truncateMessage = (message: string, maxLength: number = 50) => {
        return message.length > maxLength 
        ? `${message.substring(0, maxLength)}...` 
        : message;
    };

    const getUserInitials = (displayName: string) => {
        return displayName
        .split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .join('')
        .substring(0, 2);
    };

    const displayName = conversation.participant_display_name || conversation.participant_user_code;
    const lastMessage = conversation.last_message;
    const isFromCurrentUser = lastMessage?.sender_user_code === currentUserCode;
    const messagePrefix = isFromCurrentUser ? 'You: ' : '';
    
    return (
        <TouchableOpacity
            style={conversationCardStyles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={conversationCardStyles.avatarContainer}>
                <View style={conversationCardStyles.avatar}>
                    <Text style={conversationCardStyles.avatarText}>
                        {getUserInitials(displayName)}
                    </Text>
                </View>
            </View>

            <View style={conversationCardStyles.contentContainer}>
                <View style={conversationCardStyles.headerRow}>
                    <Text style={conversationCardStyles.displayName} numberOfLines={1}>
                        {displayName}
                    </Text>
                    <Text style={conversationCardStyles.timestamp}>
                        {formatTimestamp(conversation.last_activity)}
                    </Text>
                </View>

                <View style={conversationCardStyles.messageRow}>
                    <Text
                        style={[
                            conversationCardStyles.lastMessage,
                            conversation.unread_count > 0 && conversationCardStyles.unreadMessage
                        ]}
                        numberOfLines={2}
                    >
                        {lastMessage ? 
                            `${messagePrefix}${truncateMessage(lastMessage.message_content)}` :
                            'No messages yet'
                        }
                    </Text>

                    {conversation.unread_count > 0 && (
                        <View style={conversationCardStyles.unreadBadge}>
                            <Text style={conversationCardStyles.unreadBadgeText}>
                                {conversation.unread_count > 99 ? '99+' : conversation.unread_count}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};