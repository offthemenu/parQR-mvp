import { StyleSheet } from 'react-native';

export const parkingSessionCardStyles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  content: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  duration: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    flex: 2,
    textAlign: 'right',
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  endButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  endButtonDisabled: {
    backgroundColor: '#FFB3B3',
  },
  endButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  endButtonTextDisabled: {
    color: '#FFF',
    opacity: 0.7,
  },
});