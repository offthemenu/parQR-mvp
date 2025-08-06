// Try to load local development config, fallback to default
let localConfig = null;
try {
  localConfig = require('./development.local').LOCAL_DEV_CONFIG;
} catch (e) {
  // development.local.ts doesn't exist, use defaults
}

export const DEV_CONFIG = {
  // Default configuration - override with development.local.ts for machine-specific settings
  // For Expo development - use your computer's IP address for physical device testing
  // For iOS Simulator: localhost works
  // For Android Emulator: 10.0.2.2 or localhost works  
  // For Physical Device: Use your computer's actual IP address
  EXPO_PUBLIC_LOCAL_API_BASE_URL: 'http://localhost:8010/api', // Default fallback
  
  ENABLE_LOGGING: __DEV__,
  
  // Override with local config if available
  ...localConfig,
};