export const DEV_CONFIG = {
  // Use your actual local IP address when testing on physical device
  EXPO_PUBLIC_LOCAL_API_BASE_URL: __DEV__ ? 'http://127.0.0.1:8010/api' : 'https://your-production-api.com/api',
  ENABLE_LOGGING: __DEV__,
};