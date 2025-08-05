export const DEV_CONFIG = {
  // For Expo development - use your computer's IP address for physical device testing
  // For iOS Simulator: localhost works
  // For Android Emulator: 10.0.2.2 or localhost works  
  // For Physical Device: Use your computer's actual IP address
  EXPO_PUBLIC_LOCAL_API_BASE_URL: 'http://192.168.1.30:8010/api', // Change this to your IP if testing on device
  
  // Alternative URLs for different scenarios:
  // EXPO_PUBLIC_LOCAL_API_BASE_URL: 'http://192.168.1.XXX:8010/api', // Replace XXX with your IP
  // EXPO_PUBLIC_LOCAL_API_BASE_URL: 'http://10.0.0.XXX:8010/api',     // Alternative IP range
  
  ENABLE_LOGGING: __DEV__,
};