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
});