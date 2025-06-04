// lib/api/client.ts - API Client ראשי
"use client";

import { storage } from "../localStorage";
import type { ApiResponse, HttpError } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

// Custom Error Classes
export class ApiError extends Error implements HttpError {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class AuthError extends ApiError {
  constructor(message: string = "נדרשת התחברות מחדש") {
    super(message, 401, "AUTH_ERROR");
    this.name = "AuthError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: any) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class NetworkError extends ApiError {
  constructor(message: string = "בעיית חיבור לשרת. בדוק את החיבור לאינטרנט") {
    super(message, 0, "NETWORK_ERROR");
    this.name = "NetworkError";
  }
}

// Request options interface
interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
  timeout?: number;
}

// Main API Client Class
class ApiClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string, timeout: number = 10000) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  // Core request method
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const {
      skipAuth = false,
      timeout = this.defaultTimeout,
      headers = {},
      ...fetchOptions
    } = options;

    const url = `${this.baseURL}${endpoint}`;
    const method = fetchOptions.method || "GET";

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    // Add other headers
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (typeof value === "string") {
          requestHeaders[key] = value;
        }
      });
    }

    // Add authentication if not skipped
    if (!skipAuth) {
      const token = storage.getValidToken();
      if (token) {
        requestHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    // Log request for debugging
    console.log(`🔄 API Request: ${method} ${endpoint}`);
    if (fetchOptions.body && typeof fetchOptions.body === "string") {
      try {
        const bodyData = JSON.parse(fetchOptions.body);
        console.log("📤 Request body:", bodyData);
      } catch {
        // Body is not JSON, skip logging
      }
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log(`📡 API Response: ${response.status} ${endpoint}`);

      // Handle different status codes
      await this.handleResponseStatus(response);

      // Parse JSON response
      const data: ApiResponse<T> = await response.json();
      console.log("📥 Response data:", data);

      // Check if API response indicates success
      if (!data.success) {
        throw new ApiError(
          data.message || "שגיאה לא ידועה",
          response.status,
          "API_ERROR"
        );
      }

      return data.data as T;
    } catch (error) {
      clearTimeout(timeoutId);

      // Handle different error types
      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw new NetworkError("הבקשה נכשלה עקב timeout");
        }

        if (error.message.includes("fetch")) {
          throw new NetworkError();
        }
      }

      // Unknown error
      throw new ApiError("שגיאה לא צפויה", 0, "UNKNOWN_ERROR");
    }
  }

  // Handle HTTP response status codes
  private async handleResponseStatus(response: Response): Promise<void> {
    if (response.ok) return;

    const status = response.status;

    // Handle different status codes
    switch (status) {
      case 401:
        storage.clearAuth();
        throw new AuthError("תם תוקף ההתחברות. אנא התחבר שוב");

      case 403:
        throw new ApiError("אין לך הרשאה לפעולה זו", 403, "FORBIDDEN");

      case 404:
        throw new ApiError("המשאב המבוקש לא נמצא", 404, "NOT_FOUND");

      case 422:
        // Try to get validation errors
        try {
          const errorData = await response.json();
          throw new ValidationError(
            errorData.message || "שגיאת validation",
            errorData.details || errorData.errors
          );
        } catch {
          throw new ValidationError("שגיאת validation");
        }

      case 429:
        throw new ApiError("יותר מדי בקשות. אנא המתן מעט", 429, "RATE_LIMIT");

      case 500:
      case 502:
      case 503:
      case 504:
        throw new ApiError(
          "שגיאת שרת. אנא נסה שוב מאוחר יותר",
          status,
          "SERVER_ERROR"
        );

      default:
        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new ApiError(
            errorData.message || `שגיאה ${status}`,
            status,
            "HTTP_ERROR"
          );
        } catch {
          throw new ApiError(`שגיאה ${status}`, status, "HTTP_ERROR");
        }
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options: RequestOptions = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  // File upload method (for future use)
  async upload<T>(
    endpoint: string,
    formData: FormData,
    options: RequestOptions = {}
  ): Promise<T> {
    const { headers = {}, ...restOptions } = options;

    // Create headers object without Content-Type for FormData
    const uploadHeaders: Record<string, string> = {};

    // Add other headers except Content-Type
    if (headers) {
      Object.entries(headers).forEach(([key, value]) => {
        if (key.toLowerCase() !== "content-type" && typeof value === "string") {
          uploadHeaders[key] = value;
        }
      });
    }

    // Add auth token if not skipped
    if (!restOptions.skipAuth) {
      const token = storage.getValidToken();
      if (token) {
        uploadHeaders["Authorization"] = `Bearer ${token}`;
      }
    }

    return this.request<T>(endpoint, {
      ...restOptions,
      method: "POST",
      headers: uploadHeaders,
      body: formData,
    });
  }

  // Build query string from object
  buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.append(key, value.toString());
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : "";
  }

  // GET request with query parameters
  async getWithParams<T>(
    endpoint: string,
    params: Record<string, any> = {},
    options: RequestOptions = {}
  ): Promise<T> {
    const queryString = this.buildQueryString(params);
    return this.get<T>(`${endpoint}${queryString}`, options);
  }
}

// Create singleton instance
export const apiClient = new ApiClient(API_URL);

// Export the instance as default
export default apiClient;

// Helper function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof AuthError) {
    // Will redirect to login in the error boundary
    return error.message;
  }

  if (error instanceof ValidationError) {
    return error.message;
  }

  if (error instanceof NetworkError) {
    return error.message;
  }

  if (error instanceof ApiError) {
    return error.message;
  }

  console.error("Unhandled error:", error);
  return "שגיאה לא צפויה. אנא נסה שוב";
};

// Type guard functions
export const isAuthError = (error: unknown): error is AuthError => {
  return error instanceof AuthError;
};

export const isValidationError = (error: unknown): error is ValidationError => {
  return error instanceof ValidationError;
};

export const isNetworkError = (error: unknown): error is NetworkError => {
  return error instanceof NetworkError;
};
