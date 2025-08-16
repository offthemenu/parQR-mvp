import { StyleSheet } from 'react-native';

export const chatInputStyles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 80,
    minHeight: 40,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    color: '#999',
  },
  charCount: {
    position: 'absolute',
    right: 80,
    bottom: 5,
    fontSize: 12,
    color: '#999',
    backgroundColor: 'white',
    paddingHorizontal: 4,
  },
  charCountWarning: {
    color: '#FF3B30',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sendButtonTextDisabled: {
    color: '#999',
  },
});