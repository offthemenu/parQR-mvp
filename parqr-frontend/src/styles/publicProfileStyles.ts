import { StyleSheet } from 'react-native';

export const publicProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
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