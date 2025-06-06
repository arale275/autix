"use client";

import { useState, useEffect, useCallback } from "react";
import { inquiriesApi } from "@/lib/api/inquiries";
import { handleApiError, isAuthError } from "@/lib/api/client";
import { useRouter } from "next/navigation";
import type {
  Inquiry,
  InquiriesResponse,
  CreateInquiryRequest,
  InquiriesSearchParams,
} from "@/lib/api/types";

// ✅ Global cache invalidation system (בדיוק כמו ברכבים)
let globalInquiryListCallbacks: Array<() => void> = [];
let globalInquiryCallbacks: Array<{ inquiryId: number; callback: () => void }> =
  [];

const registerInquiryListCallback = (callback: () => void) => {
  globalInquiryListCallbacks.push(callback);
  return () => {
    globalInquiryListCallbacks = globalInquiryListCallbacks.filter(
      (cb) => cb !== callback
    );
  };
};

const registerInquiryCallback = (inquiryId: number, callback: () => void) => {
  globalInquiryCallbacks.push({ inquiryId, callback });
  return () => {
    globalInquiryCallbacks = globalInquiryCallbacks.filter(
      (cb) => cb.callback !== callback
    );
  };
};

// ✅ Cache invalidation functions
export const invalidateInquiryCache = (inquiryId?: number) => {
  // רענון כל רשימות הפניות
  globalInquiryListCallbacks.forEach((callback) => callback());

  // רענון פנייה ספציפית אם יש ID
  if (inquiryId) {
    globalInquiryCallbacks
      .filter((cb) => cb.inquiryId === inquiryId)
      .forEach((cb) => cb.callback());
  }
};

export const invalidateAllInquiryCaches = () => {
  globalInquiryListCallbacks.forEach((callback) => callback());
  globalInquiryCallbacks.forEach((cb) => cb.callback());
};

interface UseInquiriesOptions {
  /**
   * Auto-fetch on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Type of inquiries to fetch
   * @default 'sent' for buyers, 'received' for dealers
   */
  type?: "sent" | "received";

  /**
   * Initial search parameters
   */
  initialParams?: InquiriesSearchParams;

  /**
   * Refresh interval in milliseconds
   */
  refreshInterval?: number;

  /**
   * Callback when data changes
   */
  onDataChange?: (inquiries: Inquiry[]) => void;

  /**
   * Callback when error occurs
   */
  onError?: (error: string) => void;
}

interface UseInquiriesReturn {
  // Data
  inquiries: Inquiry[];
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
  fetchInquiries: (params?: InquiriesSearchParams) => Promise<void>;
  refetch: () => Promise<void>;
  sendInquiry: (data: CreateInquiryRequest) => Promise<Inquiry | null>;
  markAsResponded: (id: number) => Promise<boolean>;
  closeInquiry: (id: number) => Promise<boolean>;
  deleteInquiry: (id: number) => Promise<boolean>;
  clearError: () => void;

  // Current params
  currentParams: InquiriesSearchParams;

  // Helper stats
  newCount: number;
  respondedCount: number;
  closedCount: number;
}

/**
 * Hook for managing inquiries data
 */
export function useInquiries(
  options: UseInquiriesOptions = {}
): UseInquiriesReturn {
  const {
    autoFetch = true,
    type = "sent", // Default to 'sent' for buyers
    initialParams = {},
    refreshInterval,
    onDataChange,
    onError,
  } = options;

  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
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
    useState<InquiriesSearchParams>(initialParams);

  const fetchInquiries = useCallback(
    async (params: InquiriesSearchParams = currentParams) => {
      try {
        setLoading(true);
        setError(null);

        let response: InquiriesResponse;

        if (type === "sent") {
          response = await inquiriesApi.getSentInquiries(params);
        } else {
          response = await inquiriesApi.getReceivedInquiries(params);
        }

        setInquiries(response.inquiries);
        if (response.pagination) {
          setPagination(response.pagination);
        }
        setCurrentParams(params);

        // Call data change callback
        if (onDataChange) {
          onDataChange(response.inquiries);
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
    return fetchInquiries(currentParams);
  }, [fetchInquiries, currentParams]);

  const sendInquiry = useCallback(
    async (data: CreateInquiryRequest): Promise<Inquiry | null> => {
      try {
        setActionLoading((prev) => ({ ...prev, send: true }));
        setError(null);

        const newInquiry = await inquiriesApi.sendInquiry(data);

        // Add to list if we're viewing sent inquiries
        if (type === "sent") {
          setInquiries((prev) => [newInquiry, ...prev]);
        }

        return newInquiry;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        return null;
      } finally {
        setActionLoading((prev) => ({ ...prev, send: false }));
      }
    },
    [router, type]
  );

  const markAsResponded = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        setError(null);

        const updatedInquiry = await inquiriesApi.markAsResponded(id);
        setInquiries((prev) =>
          prev.map((inquiry) => (inquiry.id === id ? updatedInquiry : inquiry))
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

  const closeInquiry = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        setError(null);

        const closedInquiry = await inquiriesApi.closeInquiry(id);
        setInquiries((prev) =>
          prev.map((inquiry) => (inquiry.id === id ? closedInquiry : inquiry))
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

  const deleteInquiry = useCallback(
    async (id: number): Promise<boolean> => {
      try {
        setActionLoading((prev) => ({ ...prev, [id]: true }));
        setError(null);

        await inquiriesApi.deleteInquiry(id);
        setInquiries((prev) => prev.filter((inquiry) => inquiry.id !== id));

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
      fetchInquiries();
    }
  }, [autoFetch]); // Only run on mount

  // Refresh interval
  useEffect(() => {
    if (!refreshInterval) return;

    const interval = setInterval(() => {
      fetchInquiries();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, fetchInquiries]);

  // Calculate status counts
  const newCount = inquiries.filter(
    (inquiry) => inquiry.status === "new"
  ).length;
  const respondedCount = inquiries.filter(
    (inquiry) => inquiry.status === "responded"
  ).length;
  const closedCount = inquiries.filter(
    (inquiry) => inquiry.status === "closed"
  ).length;

  // ✅ Register for cache invalidation
  useEffect(() => {
    return registerInquiryListCallback(refetch);
  }, [refetch]);

  return {
    inquiries,
    pagination,
    loading,
    error,
    actionLoading,
    fetchInquiries,
    refetch,
    sendInquiry,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    clearError,
    currentParams,
    newCount,
    respondedCount,
    closedCount,
  };
}

/**
 * Hook for buyer's sent inquiries
 */
export function useSentInquiries() {
  return useInquiries({
    type: "sent",
    autoFetch: true,
  });
}

/**
 * Hook for dealer's received inquiries
 */
export function useReceivedInquiries() {
  return useInquiries({
    type: "received",
    autoFetch: true,
  });
}

/**
 * Hook for managing a single inquiry
 */
export function useInquiry(inquiryId: number | null) {
  const [inquiry, setInquiry] = useState<Inquiry | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchInquiry = useCallback(async () => {
    if (!inquiryId) return;

    try {
      setLoading(true);
      setError(null);

      const inquiryData = await inquiriesApi.getInquiry(inquiryId);
      setInquiry(inquiryData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);

      if (isAuthError(err)) {
        router.push("/auth/login");
      }
    } finally {
      setLoading(false);
    }
  }, [inquiryId, router]);

  useEffect(() => {
    if (inquiryId) {
      fetchInquiry();
    }
  }, [inquiryId, fetchInquiry]);

  // ✅ Register for cache invalidation
  useEffect(() => {
    if (!inquiryId) return;
    return registerInquiryCallback(inquiryId, fetchInquiry);
  }, [inquiryId, fetchInquiry]);

  return {
    inquiry,
    loading,
    error,
    refetch: fetchInquiry,
  };
}

/**
 * Hook for inquiries by car (dealer only)
 */
export function useInquiriesByCar(carId: number | null) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInquiriesByCar = useCallback(async () => {
    if (!carId) return;

    try {
      setLoading(true);
      setError(null);

      const response = await inquiriesApi.getInquiriesByCar(carId);
      setInquiries(response.inquiries);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [carId]);

  useEffect(() => {
    if (carId) {
      fetchInquiriesByCar();
    }
  }, [carId, fetchInquiriesByCar]);

  return {
    inquiries,
    loading,
    error,
    refetch: fetchInquiriesByCar,
  };
}

/**
 * Hook for recent inquiries (for dealer dashboard)
 */
export function useRecentInquiries(limit: number = 5) {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentInquiries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const recentInquiries = await inquiriesApi.getRecentInquiries(limit);
      setInquiries(recentInquiries);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchRecentInquiries();
  }, [fetchRecentInquiries]);

  return {
    inquiries,
    loading,
    error,
    refetch: fetchRecentInquiries,
  };
}

/**
 * Hook for new inquiries count (for notification badges)
 */
export function useNewInquiriesCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchCount = useCallback(async () => {
    try {
      setLoading(true);
      const response = await inquiriesApi.getNewInquiriesCount();
      setCount(response.count);
    } catch (err) {
      console.error("Error fetching new inquiries count:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCount();

    // Refresh count every minute
    const interval = setInterval(fetchCount, 60000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  return {
    count,
    loading,
    refetch: fetchCount,
  };
}

export default useInquiries;
