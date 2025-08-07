import { CarRegistrationRequest, CarOwnerResponse } from '../types';
import { apiClient } from '../config/api';

export class CarService {
  /**
   * Register a new car for the current user
   * Returns full car data including license plate for owner confirmation
   */
  static async registerCar(carData: CarRegistrationRequest): Promise<CarOwnerResponse> {
    try {
      const response = await apiClient.post('/v01/car/register', carData);
      return response.data;
    } catch (error: any) {
      console.error('Car registration error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Get user's registered cars
   * Returns full car data including license plates since user owns the cars
   */
  static async getUserCars(): Promise<CarOwnerResponse[]> {
    try {
      const response = await apiClient.get('/v01/car/my-cars');
      return response.data;
    } catch (error: any) {
      console.error('Get user cars error:', error.response?.data || error.message);
      throw error;
    }
  }
}
