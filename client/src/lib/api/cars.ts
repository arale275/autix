// lib/api/cars.ts - Cars API Functions
"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "../constants";
import type {
  Car,
  CarsResponse,
  CreateCarRequest,
  UpdateCarRequest,
  CarsSearchParams,
} from "./types";

/**
 * Cars API Functions
 * Contains all car-related API calls
 */
export const carsApi = {
  /**
   * Get all cars with optional search/filter parameters
   * Public endpoint - no auth required
   */
  getCars: async (params: CarsSearchParams = {}): Promise<CarsResponse> => {
    const response = await apiClient.getWithParams<CarsResponse>(
      API_ENDPOINTS.CARS,
      params,
      { skipAuth: true } // Public endpoint
    );

    console.log(`✅ Fetched ${response.cars.length} cars`);
    return response;
  },

  /**
   * Get a specific car by ID
   * Public endpoint - no auth required
   */
  getCar: async (id: number): Promise<Car> => {
    const response = await apiClient.get<Car>(
      API_ENDPOINTS.CAR_BY_ID(id),
      { skipAuth: true } // Public endpoint
    );

    console.log(`✅ Fetched car ${id}`);
    return response;
  },

  /**
   * Get cars by dealer ID
   * Public endpoint - no auth required
   */
  getCarsByDealer: async (
    dealerId: number,
    params: Partial<CarsSearchParams> = {}
  ): Promise<CarsResponse> => {
    const response = await apiClient.getWithParams<CarsResponse>(
      API_ENDPOINTS.CARS_BY_DEALER(dealerId),
      params,
      { skipAuth: true } // Public endpoint
    );

    console.log(
      `✅ Fetched ${response.cars.length} cars for dealer ${dealerId}`
    );
    return response;
  },

  /**
   * Get my cars (dealer only)
   * Requires authentication
   */
  getMyCars: async (
    params: Partial<CarsSearchParams> = {}
  ): Promise<CarsResponse> => {
    const response = await apiClient.getWithParams<CarsResponse>(
      API_ENDPOINTS.MY_CARS,
      params
    );

    console.log(`✅ Fetched ${response.cars.length} of my cars`);
    return response;
  },

  /**
   * Add new car (dealer only)
   * Requires authentication and dealer role
   */
  addCar: async (carData: CreateCarRequest): Promise<Car> => {
    const response = await apiClient.post<Car>(API_ENDPOINTS.CARS, carData);

    console.log(`✅ Added new car: ${carData.make} ${carData.model}`);
    return response;
  },

  /**
   * Update existing car (dealer only)
   * Requires authentication and ownership
   */
  updateCar: async (id: number, carData: UpdateCarRequest): Promise<Car> => {
    const response = await apiClient.put<Car>(
      API_ENDPOINTS.CAR_BY_ID(id),
      carData
    );

    console.log(`✅ Updated car ${id}`);
    return response;
  },

  /**
   * Delete car (dealer only)
   * Requires authentication and ownership
   * This is usually a soft delete (status = 'deleted')
   */
  deleteCar: async (id: number): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.CAR_BY_ID(id));

    console.log(`✅ Deleted car ${id}`);
  },

  /**
   * Mark car as sold (dealer only)
   */
  markCarAsSold: async (id: number): Promise<Car> => {
    const response = await apiClient.put<Car>(API_ENDPOINTS.CAR_BY_ID(id), {
      status: "sold",
      isAvailable: false,
    });

    console.log(`✅ Marked car ${id} as sold`);
    return response;
  },

  /**
   * Toggle car availability (dealer only)
   */
  toggleCarAvailability: async (
    id: number,
    isAvailable: boolean
  ): Promise<Car> => {
    const response = await apiClient.put<Car>(API_ENDPOINTS.CAR_BY_ID(id), {
      isAvailable,
    });

    console.log(`✅ Toggled car ${id} availability to ${isAvailable}`);
    return response;
  },

  /**
   * Toggle car featured status (dealer only)
   */
  toggleCarFeatured: async (id: number, isFeatured: boolean): Promise<Car> => {
    const response = await apiClient.put<Car>(API_ENDPOINTS.CAR_BY_ID(id), {
      isFeatured,
    });

    console.log(`✅ Toggled car ${id} featured status to ${isFeatured}`);
    return response;
  },

  /**
   * Search cars with text query
   * Public endpoint with enhanced search capabilities
   */
  searchCars: async (
    query: string,
    params: Partial<CarsSearchParams> = {}
  ): Promise<CarsResponse> => {
    const searchParams = {
      ...params,
      search: query,
    };

    const response = await apiClient.getWithParams<CarsResponse>(
      API_ENDPOINTS.CARS,
      searchParams,
      { skipAuth: true }
    );

    console.log(
      `✅ Search for "${query}" returned ${response.cars.length} cars`
    );
    return response;
  },

  /**
   * Get featured cars (for homepage)
   * Public endpoint
   */
  getFeaturedCars: async (limit: number = 6): Promise<Car[]> => {
    const response = await apiClient.getWithParams<CarsResponse>(
      API_ENDPOINTS.CARS,
      {
        limit,
        // Could add featured filter if backend supports it
        // featured: true
      },
      { skipAuth: true }
    );

    console.log(`✅ Fetched ${response.cars.length} featured cars`);
    return response.cars;
  },

  /**
   * Get car statistics (for dealer dashboard)
   */
  getCarStats: async (): Promise<{
    total: number;
    active: number;
    sold: number;
    views: number;
    inquiries: number;
  }> => {
    const response = await apiClient.get<{
      total: number;
      active: number;
      sold: number;
      views: number;
      inquiries: number;
    }>("/api/cars/stats");

    console.log("✅ Fetched car statistics");
    return response;
  },

  /**
   * Upload car images (for future implementation)
   */
  uploadCarImages: async (
    carId: number,
    images: File[]
  ): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image_${index}`, image);
    });

    const response = await apiClient.upload<{ urls: string[] }>(
      `/api/cars/${carId}/images`,
      formData
    );

    console.log(`✅ Uploaded ${images.length} images for car ${carId}`);
    return response;
  },

  /**
   * Delete car image (for future implementation)
   */
  deleteCarImage: async (carId: number, imageUrl: string): Promise<void> => {
    await apiClient.delete<void>(
      `/api/cars/${carId}/images?url=${encodeURIComponent(imageUrl)}`
    );

    console.log(`✅ Deleted image for car ${carId}`);
  },

  /**
   * Get similar cars (based on make, model, price range)
   */
  getSimilarCars: async (carId: number, limit: number = 4): Promise<Car[]> => {
    const response = await apiClient.getWithParams<{ cars: Car[] }>(
      `/api/cars/${carId}/similar`,
      { limit },
      { skipAuth: true }
    );

    console.log(
      `✅ Fetched ${response.cars.length} similar cars for car ${carId}`
    );
    return response.cars;
  },
};

export default carsApi;
