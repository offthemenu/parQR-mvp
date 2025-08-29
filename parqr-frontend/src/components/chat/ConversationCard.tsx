import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { conversationCardStyles } from '../../styles/chat/conversationCardStyles';
import { ChatConversationResponse } from '../../types';
import { formatChatListTime } from '../../utils/timeUtils';

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
    // Remove the old formatTimestamp function since we're using the utility now

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
    
    // Debug: Log what this ConversationCard is actually rendering
    console.log(`💬 ConversationCard Debug - User: ${conversation.participant_user_code}`);
    console.log(`💬   Last message ID: ${lastMessage?.id}`);
    console.log(`💬   Last message content: "${lastMessage?.message_content}"`);
    console.log(`💬   Last message created_at: ${lastMessage?.created_at}`);
    console.log(`💬   Last activity: ${conversation.last_activity}`);
    
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
                        {formatChatListTime(conversation.last_activity)}
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