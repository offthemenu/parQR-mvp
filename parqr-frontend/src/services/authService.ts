import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserWithCarsResponse } from '../types';

const USER_CODE_KEY = '@parqr_user_code';
const USER_DATA_KEY = '@parqr_user_data';

export class AuthService {
  /**
   * Store user code after successful registration or sign-in
   */
  static async storeUserCode(userCode: string): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_CODE_KEY, userCode);
    } catch (error) {
      console.error('Failed to store user code:', error);
      throw error;
    }
  }

  /**
   * Store complete user data after successful authentication
   */
  static async storeUserData(userData: UserWithCarsResponse): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (error) {
      console.error('Failed to store user data:', error);
      throw error;
    }
  }

  /**
   * Get stored user code
   */
  static async getUserCode(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(USER_CODE_KEY);
    } catch (error) {
      console.error('Failed to get user code:', error);
      return null;
    }
  }

  /**
   * Get stored user data
   */
  static async getUserData(): Promise<UserWithCarsResponse | null> {
    try {
      const data = await AsyncStorage.getItem(USER_DATA_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Failed to get user data:', error);
      return null;
    }
  }

  /**
   * Clear all auth data (sign out)
   */
  static async clearAuthData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([USER_CODE_KEY, USER_DATA_KEY]);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
      throw error;
    }
  }

  /**
   * Check if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const userCode = await this.getUserCode();
    return userCode !== null;
  }
}
