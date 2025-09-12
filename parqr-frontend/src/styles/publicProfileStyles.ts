import { StyleSheet } from 'react-native';

export const publicProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  
  // ID Card Header Section
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  userCode: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  carInfo: {
    fontSize: 18,
    color: '#555',
    marginTop: 8,
  },
  parkingStatus: {
    fontSize: 16,
    marginTop: 4,
    color: '#666',
    textTransform: 'capitalize',
  },
  publicMessage: {
    fontSize: 14,
    marginTop: 8,
    color: '#333',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  
  // Request Section
  requestSection: {
    padding: 20,
  },
  instruction: {
    fontSize: 16,
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  licensePlateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButton: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Legacy styles (keeping for backward compatibility)
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  carSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  carBrand: {
    fontSize: 22,
    fontWeight: '600',
    color: '#555',
    marginBottom: 8,
  },
  carModel: {
    fontSize: 20,
    color: '#777',
  },
  noCarText: {
    fontSize: 18,
    color: '#999',
    fontStyle: 'italic',
  },
  buttonSection: {
    width: '100%',
    gap: 15,
  },
  actionButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButtonDisabled: {
    backgroundColor: '#E5E5EA',
    opacity: 0.6,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  actionButtonTextDisabled: {
    color: '#999',
    opacity: 0.7,
  },
  chatButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  chatButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});