import { StyleSheet } from 'react-native';

export const messageBubbleStyles = StyleSheet.create({
  container: {
    marginVertical: 2,
    paddingHorizontal: 15,
  },
  sentContainer: {
    alignItems: 'flex-end',
  },
  receivedContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    marginVertical: 2,
  },
  sentBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  receivedBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: 'white',
  },
  receivedText: {
    color: '#000',
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
  },
  sentTimestamp: {
    color: 'rgba(255,255,255,0.7)',
  },
  receivedTimestamp: {
    color: '#666',
  },
  readStatus: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 4,
  },
});