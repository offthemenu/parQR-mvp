// Default development configuration
const DEFAULT_DEV_CONFIG = {
  // Default fallback URL (works for iOS Simulator and some Android setups)
  EXPO_PUBLIC_LOCAL_API_BASE_URL: 'http://localhost:8010/api',
  ENABLE_LOGGING: __DEV__,
};

// Try to load local development config (machine-specific, gitignored)
let localConfig = {};
try {
  localConfig = require('./development.local').LOCAL_DEV_CONFIG;
} catch (error) {
  // development.local.ts doesn't exist - that's fine, use defaults
  console.log('No local development config found. Copy development.local.example.ts to development.local.ts and customize for your machine.');
}

// Merge default config with local overrides
export const DEV_CONFIG = {
  ...DEFAULT_DEV_CONFIG,
  ...localConfig,
};