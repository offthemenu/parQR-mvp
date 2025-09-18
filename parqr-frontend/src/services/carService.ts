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

  static async removeCar(carId: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/v01/car/remove/${carId}`);
      return response.data
    } catch (error: any) {
      console.error("Remove car error:", error.response?.data || error.message);

      // Handle specific error cases for better UX
      if (error.response?.status === 400) {
        throw new Error("Cannot remove your only car. Please register another car first.");
      }
      if (error.response?.status === 404) {
        throw new Error("Car not found or not authorized to remove.");
      }

      throw new Error("Failed to remove car. Please try again.");
    }
  } 
}
