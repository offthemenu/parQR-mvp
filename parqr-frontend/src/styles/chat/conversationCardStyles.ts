import { StyleSheet } from 'react-native';

export const conversationCardStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5E5EA',
  },
  avatarContainer: {
    marginRight: 12,
    justifyContent: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  displayName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginRight: 8,
  },
  timestamp: {
    fontSize: 14,
    color: '#666',
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lastMessage: {
    flex: 1,
    fontSize: 15,
    color: '#666',
    lineHeight: 20,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: '500',
    color: '#000',
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});