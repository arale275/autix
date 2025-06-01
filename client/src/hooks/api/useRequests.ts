// hooks/api/useRequests.ts - Car Requests Hook
"use client";

import { useState, useEffect, useCallback } from "react";
import { requestsApi } from "@/lib/api/requests";
import { handleApiError, isAuthError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import type {
  CarRequest,
  CarRequestsResponse,
  CreateCarRequestRequest,
  RequestsSearchParams,
} from "@/lib/api/types";

interface UseRequestsOptions {
  /**
   * Auto-fetch on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Type of requests to fetch
   * @default 'all' for dealers, 'my' for buyers
   */
  type?: "all" | "my";

  /**
   * Initial search parameters
   */
  initialParams?: RequestsSearchParams;

  /**
   * Refresh interval in milliseconds
   */
  refreshInterval?: number;

  /**
   * Callback when data changes
   */
  onDataChange?: (requests: CarRequest[]) => void;

  /**
   * Callback when error occurs
   */
  onError?: (error: string) => void;
}

interface UseRequestsReturn {
  // Data
  requests: CarRequest[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };

  // State
  loading: boolean;
  error: string | null;
  actionLoading: { [key: number]: boolean };

  // Actions
  fetchRequests: (params?: RequestsSearchParams) => Promise<void>;
  refetch: () => Promise<void>;
  createRequest: (data: CreateCarRequestRequest) => Promise<CarRequest | null>;
  updateRequest: (
    id: number,
    data: Partial<CreateCarRequestRequest>
  ) => Promise<CarRequest | null>;
  deleteRequest: (id: number) => Promise<boolean>;
  closeRequest: (id: number) => Promise<boolean>;
  reopenRequest: (id: number) => Promise<boolean>;
  clearError: () => void;

  // Current params
  currentParams: RequestsSearchParams;
}

/**
 * Hook for managing car requests data
 */
export function useRequests(
  options: UseRequestsOptions = {}
): UseRequestsReturn {
  const {
    autoFetch = true,
    type = "my", // Default to 'my' requests for buyers
    initialParams = {},
    refreshInterval,
    onDataChange,
    onError,
  } = options;

  const router = useRouter();
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    [key: number]: boolean;
  }>({});
  const [currentParams, setCurrentParams] =
    useState<RequestsSearchParams>(initialParams);

  const fetchRequests = useCallback(
    async (params: RequestsSearchParams = currentParams) => {
      try {
        setLoading(true);
        setError(null);

        let response: CarRequestsResponse;

        if (type === "my") {
          response = await requestsApi.getMyRequests(params);
        } else {
          response = await requestsApi.getAllRequests(params);
        }

        setRequests(response.requests);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        setCurrentParams(params);

        // Call data change callback
        if (onDataChange) {
          onDataChange(response.requests);
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
    [currentParams, type, onDataChange, onError, router]
  );

  const refetch = useCallback(() => {
    return fetchRequests(currentParams);
  }, [fetchRequests, currentParams]);

  const createRequest = useCallback(
    async (data: CreateCarRequestRequest): Promise<CarRequest | null> => {
      try {
        setActionLoading((prev) => ({ ...prev, create: true }));
        setError(null);

        const newRequest = await requestsApi.createRequest(data);
        setRequests((prev) => [newRequest, ...prev]);

        return newRequest;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        return null;
      } finally {
        setActionLoading((prev) => ({ ...prev, create: false }));
      }
    },
    [router]
  );

  const updateRequest = useCallback(
    async (
      id: number,
      data: Partial<CreateCarRequestRequest>
    ): Promise<CarRequest | null> => {
      try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        setError(null);

        const updatedRequest = await requestsApi.updateRequest(id, data);
        setRequests((prev) =>
          prev.map((request) => (request.id === id ? updatedRequest : request))
        );

        return updatedRequest;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        return null;
      } finally {
        setActionLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [router]
  );

  const deleteRequest = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        setError(null);

        await requestsApi.deleteRequest(id);
        setRequests((prev) => prev.filter((request) => request.id !== id));

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        return false;
      } finally {
        setActionLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [router]
  );

  const closeRequest = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        setError(null);

        const closedRequest = await requestsApi.closeRequest(id);
        setRequests((prev) =>
          prev.map((request) => (request.id === id ? closedRequest : request))
        );

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        return false;
      } finally {
        setActionLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [router]
  );

  const reopenRequest = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        setError(null);

        const reopenedRequest = await requestsApi.reopenRequest(id);
        setRequests((prev) =>
          prev.map((request) => (request.id === id ? reopenedRequest : request))
        );

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        return false;
      } finally {
        setActionLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [router]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchRequests();
    }
  }, [autoFetch]); // Only run on mount

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchRequests();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchRequests]);

  return {
    requests,
    pagination,
    loading,
    error,
    actionLoading,
    fetchRequests,
    refetch,
    createRequest,
    updateRequest,
    deleteRequest,
    closeRequest,
    reopenRequest,
    clearError,
    currentParams,
  };
}

/**
 * Hook for buyer's car requests
 */
export function useMyRequests() {
  return useRequests({
    type: "my",
    autoFetch: true,
  });
}

/**
 * Hook for dealer to see all requests
 */
export function useAllRequests() {
  return useRequests({
    type: "all",
    autoFetch: true,
  });
}

/**
 * Hook for managing a single request
 */
export function useRequest(requestId: number | null) {
  const [request, setRequest] = useState<CarRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchRequest = useCallback(async () => {
    if (!requestId) return;

    try {
      setLoading(true);
      setError(null);

      const requestData = await requestsApi.getRequest(requestId);
      setRequest(requestData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);

      if (isAuthError(err)) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [requestId, router]);

  useEffect(() => {
    if (requestId) {
      fetchRequest();
    }
  }, [requestId, fetchRequest]);

  return {
    request,
    loading,
    error,
    refetch: fetchRequest,
  };
}

/**
 * Hook for recent requests (for dealer dashboard)
 */
export function useRecentRequests(limit: number = 5) {
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const recentRequests = await requestsApi.getRecentRequests(limit);
      setRequests(recentRequests);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecentRequests();
  }, [fetchRecentRequests]);

  return {
    requests,
    loading,
    error,
    refetch: fetchRecentRequests,
  };
}

/**
 * Hook for matching requests with dealer inventory
 */
export function useMatchingRequests(
  carFilters: {
    make?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    priceMax?: number;
  } = {}
) {
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchingRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const matchingRequests = await requestsApi.getMatchingRequests(
        carFilters
      );
      setRequests(matchingRequests);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [carFilters]);

  useEffect(() => {
    fetchMatchingRequests();
  }, [fetchMatchingRequests]);

  return {
    requests,
    loading,
    error,
    refetch: fetchMatchingRequests,
  };
}

export default useRequests;
