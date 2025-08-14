import { StyleSheet } from 'react-native';

export const chatScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  participantName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  userCode: {
    fontSize: 14,
    color: '#007AFF',
    marginTop: 2,
  },
  messagesContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  moveCarButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 15,
  },
  moveCarButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  messageButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  messageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});