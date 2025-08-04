import axios from 'axios';
import { DEV_CONFIG } from './development';

const API_BASE_URL = DEV_CONFIG.EXPO_PUBLIC_LOCAL_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth tokens (future use)
apiClient.interceptors.request.use(
  (config) => {
    // Add auth token when implemented
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (__DEV__) {
      console.log('API Error:', error.response?.data || error.message);
    }
    return Promise.reject(error);
  }
);