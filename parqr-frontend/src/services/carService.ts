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

  // Update a selected car for the current user
  static async updateCar(carId: number, carData: {
    license_plate: string;
    car_brand: string;
    car_model: string;
  }): Promise<CarOwnerResponse> {
    try {
      const response = await apiClient.put(`/v01/car/update/${carId}`, carData);
      return response.data;
    } catch (error: any) {
      console.error("update car error:", error.response?.data || error.message);

      // Handle specific error cases
      if (error.response?.status === 400) {
        throw new Error("Invalid car details. Please check your input.");
      }
      if (error.response?.status === 404) {
        throw new Error("Car not found or not authorized to edit.");
      }
      if (error.response?.status === 409) {
        throw new Error("License plate already exists. Please use a different license plate");
      }

      throw new Error("Failed to update car. Please try again.");
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
