import axios from 'axios';
import { DEV_CONFIG } from './development';
import { AuthService } from '../services/authService';

const API_BASE_URL = DEV_CONFIG.EXPO_PUBLIC_LOCAL_API_BASE_URL;

console.log('🌐 API Base URL:', API_BASE_URL); // Debug log

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for debugging and auth
apiClient.interceptors.request.use(
  async (config) => {
    // Add authentication header if user is logged in
    const userCode = await AuthService.getUserCode();
    if (userCode) {
      config.headers['x-user-code'] = userCode;
    }

    if (__DEV__) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
        data: config.data,
        headers: config.headers
      });
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for debugging and error handling
apiClient.interceptors.response.use(
  (response) => {
    if (__DEV__) {
      console.log('✅ API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data
      });
    }
    return response;
  },
  (error) => {
    if (__DEV__) {
      console.error('❌ API Error Details:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestURL: error.config?.url,
        fullURL: `${error.config?.baseURL}${error.config?.url}`
      });
    }
    return Promise.reject(error);
  }
);