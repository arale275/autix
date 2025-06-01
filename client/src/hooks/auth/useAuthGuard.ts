// hooks/ui/useLocalStorage.ts - Enhanced localStorage Hook
"use client";

import { useState, useEffect, useCallback } from "react";

// Re-export the existing useClientStorage for backward compatibility
export { useClientStorage } from "@/lib/localStorage";

/**
 * Enhanced localStorage hook with TypeScript support and better error handling
 *
 * @param key - The localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @param options - Configuration options
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: {
    serialize?: (value: T) => string;
    deserialize?: (value: string) => T;
    syncAcrossTabs?: boolean;
  } = {}
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const {
    serialize = JSON.stringify,
    deserialize = JSON.parse,
    syncAcrossTabs = false,
  } = options;

  // Check if we're on the client side
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get the stored value
  const getStoredValue = useCallback((): T => {
    if (!isClient) return initialValue;

    try {
      const item = localStorage.getItem(key);
      if (item === null) return initialValue;
      return deserialize(item);
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [key, initialValue, deserialize, isClient]);

  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update localStorage when state changes
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      if (!isClient) return;

      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, serialize(valueToStore));

        // Dispatch custom event for cross-tab sync
        if (syncAcrossTabs) {
          window.dispatchEvent(
            new CustomEvent("localStorage-change", {
              detail: { key, value: valueToStore },
            })
          );
        }
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key, serialize, storedValue, syncAcrossTabs, isClient]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (!isClient) return;

    try {
      localStorage.removeItem(key);
      setStoredValue(initialValue);

      if (syncAcrossTabs) {
        window.dispatchEvent(
          new CustomEvent("localStorage-change", {
            detail: { key, value: null },
          })
        );
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue, syncAcrossTabs, isClient]);

  // Listen for storage events (cross-tab sync)
  useEffect(() => {
    if (!isClient || !syncAcrossTabs) return;

    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      let changedKey: string;
      let newValue: string | null;

      if (e instanceof StorageEvent) {
        changedKey = e.key || "";
        newValue = e.newValue;
      } else {
        changedKey = (e as CustomEvent).detail.key;
        newValue = (e as CustomEvent).detail.value;
      }

      if (changedKey === key) {
        try {
          const value =
            newValue === null ? initialValue : deserialize(newValue);
          setStoredValue(value);
        } catch (error) {
          console.error(`Error syncing localStorage key "${key}":`, error);
        }
      }
    };

    // Listen for storage events from other tabs
    window.addEventListener("storage", handleStorageChange);

    // Listen for custom events from same tab
    window.addEventListener(
      "localStorage-change",
      handleStorageChange as EventListener
    );

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "localStorage-change",
        handleStorageChange as EventListener
      );
    };
  }, [key, initialValue, deserialize, syncAcrossTabs, isClient]);

  // Re-sync when component mounts (in case localStorage changed while component was unmounted)
  useEffect(() => {
    if (isClient) {
      setStoredValue(getStoredValue());
    }
  }, [isClient, getStoredValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * Specialized hooks for common localStorage patterns
 */

/**
 * Hook for storing user preferences
 */
export function usePreferences() {
  return useLocalStorage(
    "userPreferences",
    {
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: true,
      theme: "light" as "light" | "dark",
      language: "he" as "he" | "en",
    },
    { syncAcrossTabs: true }
  );
}

/**
 * Hook for managing saved cars
 */
export function useSavedCars() {
  const [savedCars, setSavedCars, removeSavedCars] = useLocalStorage<number[]>(
    "savedCars",
    [],
    { syncAcrossTabs: true }
  );

  const addCar = useCallback(
    (carId: number) => {
      setSavedCars((prev) => {
        if (prev.includes(carId)) return prev;
        return [...prev, carId];
      });
    },
    [setSavedCars]
  );

  const removeCar = useCallback(
    (carId: number) => {
      setSavedCars((prev) => prev.filter((id) => id !== carId));
    },
    [setSavedCars]
  );

  const isCarSaved = useCallback(
    (carId: number) => {
      return savedCars.includes(carId);
    },
    [savedCars]
  );

  const toggleCar = useCallback(
    (carId: number) => {
      if (isCarSaved(carId)) {
        removeCar(carId);
      } else {
        addCar(carId);
      }
    },
    [isCarSaved, removeCar, addCar]
  );

  return {
    savedCars,
    addCar,
    removeCar,
    isCarSaved,
    toggleCar,
    clearAll: removeSavedCars,
  };
}

/**
 * Hook for managing recently viewed items
 */
export function useRecentlyViewed<T extends { id: number }>(
  key: string,
  maxItems: number = 10
) {
  const [items, setItems] = useLocalStorage<T[]>(key, []);

  const addItem = useCallback(
    (item: T) => {
      setItems((prev) => {
        // Remove if already exists
        const filtered = prev.filter((i) => i.id !== item.id);
        // Add to beginning
        const updated = [item, ...filtered];
        // Limit to maxItems
        return updated.slice(0, maxItems);
      });
    },
    [setItems, maxItems]
  );

  const removeItem = useCallback(
    (id: number) => {
      setItems((prev) => prev.filter((item) => item.id !== id));
    },
    [setItems]
  );

  const clearAll = useCallback(() => {
    setItems([]);
  }, [setItems]);

  return {
    items,
    addItem,
    removeItem,
    clearAll,
  };
}

/**
 * Hook for managing search history
 */
export function useSearchHistory(maxItems: number = 10) {
  const [searches, setSearches] = useLocalStorage<string[]>(
    "searchHistory",
    []
  );

  const addSearch = useCallback(
    (query: string) => {
      if (!query.trim()) return;

      setSearches((prev) => {
        const filtered = prev.filter((q) => q !== query);
        const updated = [query, ...filtered];
        return updated.slice(0, maxItems);
      });
    },
    [setSearches, maxItems]
  );

  const removeSearch = useCallback(
    (query: string) => {
      setSearches((prev) => prev.filter((q) => q !== query));
    },
    [setSearches]
  );

  const clearHistory = useCallback(() => {
    setSearches([]);
  }, [setSearches]);

  return {
    searches,
    addSearch,
    removeSearch,
    clearHistory,
  };
}

/**
 * Hook for managing form draft data
 */
export function useFormDraft<T extends Record<string, any>>(
  formKey: string,
  initialData: T
) {
  const [draft, setDraft, removeDraft] = useLocalStorage(
    `formDraft_${formKey}`,
    initialData
  );

  const updateDraft = useCallback(
    (updates: Partial<T>) => {
      setDraft((prev) => ({ ...prev, ...updates }));
    },
    [setDraft]
  );

  const clearDraft = useCallback(() => {
    removeDraft();
  }, [removeDraft]);

  return {
    draft,
    updateDraft,
    clearDraft,
    hasDraft: Object.keys(draft).length > 0,
  };
}

export default useLocalStorage;
