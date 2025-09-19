import { apiClient } from '../config/api';
import { 
  RegisterUserRequest, 
  RegisterUserResponse, 
  ServicingCountriesResponse,
  User,
  UserLookupResponse,
  UserWithCarsResponse
} from '../types';

export class UserService {
  /**
   * Get list of countries that parQR services
   */
  static async getServicingCountries(): Promise<ServicingCountriesResponse> {
    try {
      const response = await apiClient.get<ServicingCountriesResponse>(
        '/v01/signup/servicing-countries'
      );
      return response.data;
    } catch (error: any) {
      console.error('Error fetching servicing countries:', error);
      throw new Error(
        error.response?.data?.detail || 
        'Failed to retrieve servicing countries. Please try again.'
      );
    }
  }

  /**
   * Register a new user
   */
  static async registerUser(
    phoneNumber: string, 
    countryIso: string
  ): Promise<RegisterUserResponse> {
    try {
      const requestData: RegisterUserRequest = {
        phone_number: phoneNumber,
        signup_country_iso: countryIso
      };

      const response = await apiClient.post<RegisterUserResponse>(
        '/v01/user/register',
        requestData
      );

      return response.data;
    } catch (error: any) {
      console.error('Registration error:', error);
      throw new Error(
        error.response?.data?.detail || 
        'Failed to register user. Please try again.'
      );
    }
  }

  /**
   * Get user profile (requires authentication)
   */
  static async getUserProfile(): Promise<User> {
    try {
      const response = await apiClient.get<User>('/v01/user/profile');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user profile:', error);
      throw new Error(
        error.response?.data?.detail || 
        'Failed to retrieve user profile. Please try again.'
      );
    }
  }

  /**
   * Look up user by user_code for sign-in
   */
  static async lookupUser(userCode: string): Promise<UserLookupResponse> {
    try {
      const response = await apiClient.get(`/v01/user/lookup/${userCode.toUpperCase()}`);
      return response.data;
    } catch (error: any) {
      console.error('User lookup error:', error.response?.data || error.message);
      throw error;
    }
  }
  
  /**
   * Regenerate QR code for current user
   */
  static async regenerateQRCode(): Promise<User> {
    try {
      const response = await apiClient.post<User>('/v01/user/regenerate-qr');
      return response.data;
    } catch (error: any) {
      console.error('Error regenerating QR code:', error);
      throw new Error(
        error.response?.data?.detail || 
        'Failed to regenerate QR code. Please try again.'
      );
    }
  }
}