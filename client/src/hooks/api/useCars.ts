// hooks/api/useCars.ts - Cars Data Hook עם Cache Invalidation
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { carsApi } from "@/lib/api/cars";
import { handleApiError, isAuthError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import type {
  Car,
  CarsResponse,
  CarsSearchParams,
  CreateCarRequest,
  UpdateCarRequest,
} from "@/lib/api/types";

interface UseCarsOptions {
  /**
   * Auto-fetch on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Initial search parameters
   */
  initialParams?: CarsSearchParams;

  /**
   * Refresh interval in milliseconds
   */
  refreshInterval?: number;

  /**
   * Callback when data changes
   */
  onDataChange?: (cars: Car[]) => void;

  /**
   * Callback when error occurs
   */
  onError?: (error: string) => void;
}

interface UseCarsReturn {
  // Data
  cars: Car[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // State
  loading: boolean;
  error: string | null;

  // Actions
  fetchCars: (params?: CarsSearchParams) => Promise<void>;
  refetch: () => Promise<void>;
  search: (query: string) => Promise<void>;
  updateParams: (params: Partial<CarsSearchParams>) => void;
  clearError: () => void;

  // Current params
  currentParams: CarsSearchParams;
}

// ✅ Global cache invalidation system
let globalCarListCallbacks: Array<() => void> = [];
let globalCarCallbacks: Array<{ carId: number; callback: () => void }> = [];

const registerCarListCallback = (callback: () => void) => {
  globalCarListCallbacks.push(callback);
  return () => {
    globalCarListCallbacks = globalCarListCallbacks.filter(
      (cb) => cb !== callback
    );
  };
};

const registerCarCallback = (carId: number, callback: () => void) => {
  globalCarCallbacks.push({ carId, callback });
  return () => {
    globalCarCallbacks = globalCarCallbacks.filter(
      (cb) => cb.callback !== callback
    );
  };
};

// ✅ Cache invalidation functions
export const invalidateCarCache = (carId?: number) => {
  // רענון כל רשימות הרכבים
  globalCarListCallbacks.forEach((callback) => callback());

  // רענון רכב ספציפי אם יש ID
  if (carId) {
    globalCarCallbacks
      .filter((cb) => cb.carId === carId)
      .forEach((cb) => cb.callback());
  }
};

export const invalidateAllCarCaches = () => {
  globalCarListCallbacks.forEach((callback) => callback());
  globalCarCallbacks.forEach((cb) => cb.callback());
};

/**
 * Hook for managing cars data with search, pagination, and caching
 */
export function useCars(options: UseCarsOptions = {}): UseCarsReturn {
  const {
    autoFetch = true,
    initialParams = {},
    refreshInterval,
    onDataChange,
    onError,
  } = options;

  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentParams, setCurrentParams] =
    useState<CarsSearchParams>(initialParams);

  const fetchCars = useCallback(
    async (params: CarsSearchParams = currentParams) => {
      try {
        setLoading(true);
        setError(null);

        const response: CarsResponse = await carsApi.getCars(params);

        setCars(response.cars);
        setPagination(response.pagination);
        setCurrentParams(params);

        // Call data change callback
        if (onDataChange) {
          onDataChange(response.cars);
        }
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        // Handle auth errors
        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        // Call error callback
        if (onError) {
          onError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    },
    [currentParams, onDataChange, onError, router]
  );

  const refetch = useCallback(() => {
    return fetchCars(currentParams);
  }, [fetchCars, currentParams]);

  const search = useCallback(
    async (query: string) => {
      const searchParams = {
        ...currentParams,
        search: query,
        page: 1, // Reset to first page on search
      };
      return fetchCars(searchParams);
    },
    [fetchCars, currentParams]
  );

  const updateParams = useCallback(
    (newParams: Partial<CarsSearchParams>) => {
      const updatedParams = { ...currentParams, ...newParams };
      setCurrentParams(updatedParams);
      fetchCars(updatedParams);
    },
    [currentParams, fetchCars]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // ✅ Register for cache invalidation
  useEffect(() => {
    return registerCarListCallback(refetch);
  }, [refetch]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchCars();
    }
  }, [autoFetch]); // Only run on mount

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchCars();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchCars]);

  return {
    cars,
    pagination,
    loading,
    error,
    fetchCars,
    refetch,
    search,
    updateParams,
    clearError,
    currentParams,
  };
}

/**
 * Hook for managing a single car
 */
export function useCar(carId: number | null) {
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchCar = useCallback(async () => {
    if (!carId) return;

    try {
      setLoading(true);
      setError(null);

      const carData = await carsApi.getCar(carId);
      setCar(carData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);

      if (isAuthError(err)) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [carId, router]);

  // ✅ Register for cache invalidation
  useEffect(() => {
    if (!carId) return;
    return registerCarCallback(carId, fetchCar);
  }, [carId, fetchCar]);

  useEffect(() => {
    if (carId) {
      fetchCar();
    }
  }, [carId, fetchCar]);

  return {
    car,
    loading,
    error,
    refetch: fetchCar,
  };
}

/**
 * Hook for dealer's car management עם Cache Invalidation
 */
export function useDealerCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const router = useRouter();

  const fetchMyCars = useCallback(
    async (params: Partial<CarsSearchParams> = {}) => {
      try {
        setLoading(true);
        setError(null);

        const response = await carsApi.getMyCars(params);
        setCars(response.cars);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // ✅ Register for cache invalidation
  useEffect(() => {
    return registerCarListCallback(fetchMyCars);
  }, [fetchMyCars]);

  // ✅ Helper function for actions with cache invalidation
  const performAction = useCallback(
    async (
      carId: number,
      action: () => Promise<any>,
      successMessage?: string
    ): Promise<boolean> => {
      try {
        setActionLoading((prev) => ({ ...prev, [carId]: true }));

        const result = await action();

        // ✅ Update local state immediately
        if (result) {
          setCars((prev) =>
            prev.map((car) => (car.id === carId ? result : car))
          );
        }

        // ✅ Invalidate cache to sync all components
        invalidateCarCache(carId);

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return false;
      } finally {
        setActionLoading((prev) => ({ ...prev, [carId]: false }));
      }
    },
    []
  );

  const addCar = useCallback(
    async (carData: CreateCarRequest): Promise<Car | null> => {
      try {
        setActionLoading((prev) => ({ ...prev, add: true }));

        const newCar = await carsApi.addCar(carData);
        setCars((prev) => [newCar, ...prev]);

        // ✅ Invalidate cache for new car
        invalidateCarCache();

        return newCar;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
        return null;
      } finally {
        setActionLoading((prev) => ({ ...prev, add: false }));
      }
    },
    []
  );

  const updateCar = useCallback(
    async (carId: number, carData: UpdateCarRequest): Promise<Car | null> => {
      const success = await performAction(carId, async () => {
        return await carsApi.updateCar(carId, carData);
      });

      return success ? cars.find((car) => car.id === carId) || null : null;
    },
    [performAction, cars]
  );

  const deleteCar = useCallback(async (carId: number): Promise<boolean> => {
    try {
      setActionLoading((prev) => ({ ...prev, [carId]: true }));

      await carsApi.deleteCar(carId);
      setCars((prev) => prev.filter((car) => car.id !== carId));

      // ✅ Invalidate cache
      invalidateCarCache(carId);

      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return false;
    } finally {
      setActionLoading((prev) => ({ ...prev, [carId]: false }));
    }
  }, []);

  const markAsSold = useCallback(
    async (carId: number): Promise<boolean> => {
      return await performAction(carId, async () => {
        return await carsApi.markCarAsSold(carId);
      });
    },
    [performAction]
  );

  const toggleAvailability = useCallback(
    async (carId: number, isAvailable: boolean): Promise<boolean> => {
      return await performAction(carId, async () => {
        return await carsApi.toggleCarAvailability(carId, isAvailable);
      });
    },
    [performAction]
  );

  useEffect(() => {
    fetchMyCars();
  }, [fetchMyCars]);

  return {
    cars,
    loading,
    error,
    actionLoading,
    fetchMyCars,
    addCar,
    updateCar,
    deleteCar,
    markAsSold,
    toggleAvailability,
    refetch: fetchMyCars,
  };
}

/**
 * Hook for featured cars (homepage)
 */
export function useFeaturedCars(limit: number = 6) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const featuredCars = await carsApi.getFeaturedCars(limit);
      setCars(featuredCars);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedCars();
  }, [fetchFeaturedCars]);

  return {
    cars,
    loading,
    error,
    refetch: fetchFeaturedCars,
  };
}

/**
 * Hook for car search with debouncing
 */
export function useCarSearch(debounceMs: number = 500) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const search = useCallback(
    async (query: string, params: Partial<CarsSearchParams> = {}) => {
      if (!query.trim()) {
        setCars([]);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await carsApi.searchCars(query, params);
        setCars(response.cars);
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Debounced search effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setCars([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      search(searchQuery);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, search, debounceMs]);

  return {
    cars,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    search,
  };
}

/**
 * Memoized helper hooks
 */

/**
 * Hook that provides car filtering utilities
 */
export function useCarFilters(cars: Car[]) {
  return useMemo(() => {
    const filterByMake = (make: string) =>
      cars.filter((car) => car.make.toLowerCase() === make.toLowerCase());

    const filterByPriceRange = (min: number, max: number) =>
      cars.filter((car) => car.price >= min && car.price <= max);

    const filterByYear = (year: number) =>
      cars.filter((car) => car.year === year);

    const filterByAvailability = (available: boolean = true) =>
      cars.filter((car) => car.isAvailable === available);

    const sortByPrice = (ascending: boolean = true) =>
      [...cars].sort((a, b) =>
        ascending ? a.price - b.price : b.price - a.price
      );

    const sortByYear = (ascending: boolean = false) =>
      [...cars].sort((a, b) => (ascending ? a.year - b.year : b.year - a.year));

    const getUniqueMakes = () =>
      [...new Set(cars.map((car) => car.make))].sort();

    const getPriceRange = () => {
      if (cars.length === 0) return { min: 0, max: 0 };
      const prices = cars.map((car) => car.price);
      return {
        min: Math.min(...prices),
        max: Math.max(...prices),
      };
    };

    return {
      filterByMake,
      filterByPriceRange,
      filterByYear,
      filterByAvailability,
      sortByPrice,
      sortByYear,
      getUniqueMakes,
      getPriceRange,
    };
  }, [cars]);
}

export default useCars;
