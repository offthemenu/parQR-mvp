import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert } from 'react-native';
import { chatInputStyles } from '../../styles/chat/chatInputStyles';

interface ChatInputProps {
  onSendMessage: (message: string) => Promise<void>;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  disabled = false
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const MAX_MESSAGE_LENGTH = 500;

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    
    if (!trimmedMessage) {
      Alert.alert('Empty Message', 'Please enter a message before sending.');
      return;
    }

    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      Alert.alert(
        'Message Too Long', 
        `Please keep messages under ${MAX_MESSAGE_LENGTH} characters.`
      );
      return;
    }

    setIsSending(true);
    
    try {
      await onSendMessage(trimmedMessage);
      setMessage(''); // Clear input after successful send
    } catch (error) {
      Alert.alert('Send Failed', 'Please try sending your message again.');
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmitEditing = () => {
    if (!isSending && !disabled) {
      handleSend();
    }
  };

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;
  const isNearLimit = remainingChars < 50;

  return (
    <View style={chatInputStyles.container}>
      <View style={chatInputStyles.inputContainer}>
        <TextInput
          style={[
            chatInputStyles.textInput,
            disabled && chatInputStyles.disabledInput
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          multiline
          maxLength={MAX_MESSAGE_LENGTH}
          editable={!disabled && !isSending}
          returnKeyType="send"
          onSubmitEditing={handleSubmitEditing}
          submitBehavior='submit'
        />
        
        {isNearLimit && (
          <Text style={[
            chatInputStyles.charCount,
            remainingChars < 20 ? chatInputStyles.charCountWarning : null
          ]}>
            {remainingChars}
          </Text>
        )}
        
        <TouchableOpacity
          style={[
            chatInputStyles.sendButton,
            (!message.trim() || isSending || disabled) && chatInputStyles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!message.trim() || isSending || disabled}
        >
          <Text style={[
            chatInputStyles.sendButtonText,
            (!message.trim() || isSending || disabled) && chatInputStyles.sendButtonTextDisabled
          ]}>
            {isSending ? 'Sending...' : 'Send'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};