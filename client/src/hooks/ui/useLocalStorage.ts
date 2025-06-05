"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook for managing localStorage with React state synchronization
 * @param key - localStorage key
 * @param initialValue - default value if key doesn't exist
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      // Save state
      setStoredValue(valueToStore);

      // Save to localStorage
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the value from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}

/**
 * Hook for managing favorites in localStorage
 * @returns [favorites, addToFavorites, removeFromFavorites, isFavorite]
 */
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<number[]>(
    "autix_favorites",
    []
  );

  const addToFavorites = (carId: number) => {
    setFavorites((prev) => [...prev.filter((id) => id !== carId), carId]);
  };

  const removeFromFavorites = (carId: number) => {
    setFavorites((prev) => prev.filter((id) => id !== carId));
  };

  const isFavorite = (carId: number) => {
    return favorites.includes(carId);
  };

  const toggleFavorite = (carId: number) => {
    if (isFavorite(carId)) {
      removeFromFavorites(carId);
    } else {
      addToFavorites(carId);
    }
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}
