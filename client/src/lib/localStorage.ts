"use client";

import { useState, useEffect } from "react";

// Storage keys constants
export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "user_data",
  PREFERENCES: "userPreferences",
  SAVED_CARS: "savedCars",
} as const;

// Default user preferences
const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  smsNotifications: false,
  marketingEmails: true,
};

// Storage utility functions
export const storage = {
  // Check if we're on client side
  isClient: (): boolean => typeof window !== "undefined",

  // Get item from localStorage
  getItem: (key: string, defaultValue: string = ""): string => {
    if (!storage.isClient()) return defaultValue;
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage item ${key}:`, error);
      return defaultValue;
    }
  },

  // Set item in localStorage
  setItem: (key: string, value: string): boolean => {
    if (!storage.isClient()) return false;
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error(`Error setting localStorage item ${key}:`, error);
      return false;
    }
  },

  // Remove item from localStorage
  removeItem: (key: string): boolean => {
    if (!storage.isClient()) return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing localStorage item ${key}:`, error);
      return false;
    }
  },

  // Clear all auth data
  clearAuth: (): void => {
    storage.removeItem(STORAGE_KEYS.TOKEN);
    storage.removeItem(STORAGE_KEYS.USER);
    storage.removeItem(STORAGE_KEYS.PREFERENCES);
    // Keep saved cars - user data we want to preserve
  },

  // Check if token is valid
  isTokenValid: (): boolean => {
    const token = storage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp && payload.exp > currentTime;
    } catch (error) {
      console.error("Error validating token:", error);
      storage.removeItem(STORAGE_KEYS.TOKEN);
      return false;
    }
  },

  // Get valid token (with expiration check)
  getValidToken: (): string | null => {
    if (!storage.isTokenValid()) {
      storage.clearAuth();
      return null;
    }
    return storage.getItem(STORAGE_KEYS.TOKEN) || null;
  },

  // Get user object
  getUser: (): any | null => {
    const userData = storage.getItem(STORAGE_KEYS.USER);
    if (!userData) return null;

    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
      storage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  },

  // Set user object
  setUser: (user: any): boolean => {
    try {
      return storage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error) {
      console.error("Error setting user data:", error);
      return false;
    }
  },

  // Get saved cars
  getSavedCars: (): number[] => {
    const savedCarsData = storage.getItem(STORAGE_KEYS.SAVED_CARS, "[]");
    try {
      const savedCars = JSON.parse(savedCarsData);
      return Array.isArray(savedCars) ? savedCars : [];
    } catch (error) {
      console.error("Error parsing saved cars:", error);
      return [];
    }
  },

  // Add saved car
  addSavedCar: (carId: number): boolean => {
    const savedCars = storage.getSavedCars();
    if (!savedCars.includes(carId)) {
      savedCars.push(carId);
      return storage.setItem(
        STORAGE_KEYS.SAVED_CARS,
        JSON.stringify(savedCars)
      );
    }
    return true; // Already exists
  },

  // Remove saved car
  removeSavedCar: (carId: number): boolean => {
    const savedCars = storage.getSavedCars();
    const updatedCars = savedCars.filter((id) => id !== carId);
    return storage.setItem(
      STORAGE_KEYS.SAVED_CARS,
      JSON.stringify(updatedCars)
    );
  },

  // Check if car is saved
  isCarSaved: (carId: number): boolean => {
    const savedCars = storage.getSavedCars();
    return savedCars.includes(carId);
  },

  // Get preferences
  getPreferences: () => {
    const prefsData = storage.getItem(STORAGE_KEYS.PREFERENCES);
    if (!prefsData) return DEFAULT_PREFERENCES;

    try {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(prefsData) };
    } catch (error) {
      console.error("Error parsing preferences:", error);
      return DEFAULT_PREFERENCES;
    }
  },

  // Set preferences
  setPreferences: (preferences: any): boolean => {
    try {
      return storage.setItem(
        STORAGE_KEYS.PREFERENCES,
        JSON.stringify(preferences)
      );
    } catch (error) {
      console.error("Error setting preferences:", error);
      return false;
    }
  },
};

// Custom hook for client-side storage usage
export const useClientStorage = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return {
    isClient,
    storage: isClient ? storage : null,
  };
};

// API Helper with automatic token management
export const createAuthenticatedFetch = (baseURL: string) => {
  return async (endpoint: string, options: RequestInit = {}) => {
    const token = storage.getValidToken();

    if (!token) {
      throw new Error("No valid token available");
    }

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    };

    return fetch(`${baseURL}${endpoint}`, {
      ...options,
      headers,
    });
  };
};

// Export default for convenience
export default storage;
