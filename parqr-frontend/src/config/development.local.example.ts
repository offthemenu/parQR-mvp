// Copy this file to development.local.ts and customize for your machine
// development.local.ts is gitignored and won't be committed

export const LOCAL_DEV_CONFIG = {
  // Change this to your computer's IP address for physical device testing
  // For iOS Simulator: use 'localhost' 
  // For Android Emulator: use 'localhost' or '10.0.2.2'
  // For Physical Device: use your computer's actual IP address (e.g., '192.168.1.30')
  EXPO_PUBLIC_LOCAL_API_BASE_URL: 'http://192.168.1.30:8010/api',
  
  // Optional: Override other development settings here
  ENABLE_LOGGING: __DEV__,
};