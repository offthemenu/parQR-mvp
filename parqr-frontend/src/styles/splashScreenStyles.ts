import { StyleSheet } from 'react-native';

export const splashScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 100,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'white',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  tagline: {
    fontSize: 18,
    color: 'white',
    fontWeight: '300',
  },
  loadingContainer: {
    marginBottom: 50,
  },
  loadingText: {
    color: 'white',
    fontSize: 16,
    opacity: 0.8,
  },
});