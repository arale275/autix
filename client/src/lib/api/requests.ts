// lib/api/requests.ts - Car Requests API Functions
"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "../constants";
import type {
  CarRequest,
  CarRequestsResponse,
  CreateCarRequestRequest,
  RequestsSearchParams,
} from "./types";

/**
 * Car Requests API Functions
 * Contains all car request-related API calls
 */
export const requestsApi = {
  /**
   * Get all car requests (dealer only)
   * Dealers can see all buyer requests to match their inventory
   */
  getAllRequests: async (
    params: RequestsSearchParams = {}
  ): Promise<CarRequestsResponse> => {
    const response = await apiClient.getWithParams<CarRequestsResponse>(
      API_ENDPOINTS.CAR_REQUESTS,
      params
    );

    console.log(`✅ Fetched ${response.requests.length} car requests`);
    return response;
  },

  /**
   * Get my car requests (buyer only)
   * Buyers can see their own requests
   */
  getMyRequests: async (
    params: RequestsSearchParams = {}
  ): Promise<CarRequestsResponse> => {
    const response = await apiClient.getWithParams<CarRequestsResponse>(
      API_ENDPOINTS.MY_REQUESTS,
      params
    );

    console.log(`✅ Fetched ${response.requests.length} of my requests`);
    return response;
  },

  /**
   * Get specific car request by ID
   */
  getRequest: async (id: number): Promise<CarRequest> => {
    const response = await apiClient.get<CarRequest>(
      API_ENDPOINTS.CAR_REQUEST_BY_ID(id)
    );

    console.log(`✅ Fetched car request ${id}`);
    return response;
  },

  /**
   * Create new car request (buyer only)
   */
  createRequest: async (
    requestData: CreateCarRequestRequest
  ): Promise<CarRequest> => {
    const response = await apiClient.post<CarRequest>(
      API_ENDPOINTS.CAR_REQUESTS,
      requestData
    );

    console.log(
      `✅ Created car request for ${requestData.make || "any"} ${
        requestData.model || ""
      }`
    );
    return response;
  },

  /**
   * Update car request (buyer only, own requests)
   */
  updateRequest: async (
    id: number,
    requestData: Partial<CreateCarRequestRequest>
  ): Promise<CarRequest> => {
    const response = await apiClient.put<CarRequest>(
      API_ENDPOINTS.CAR_REQUEST_BY_ID(id),
      requestData
    );

    console.log(`✅ Updated car request ${id}`);
    return response;
  },

  /**
   * Delete car request (buyer only, own requests)
   */
  deleteRequest: async (id: number): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.CAR_REQUEST_BY_ID(id));

    console.log(`✅ Deleted car request ${id}`);
  },

  /**
   * Close car request (buyer only)
   * Mark request as closed when buyer found a car
   */
  closeRequest: async (id: number): Promise<CarRequest> => {
    const response = await apiClient.put<CarRequest>(
      API_ENDPOINTS.CAR_REQUEST_BY_ID(id),
      { status: "closed" }
    );

    console.log(`✅ Closed car request ${id}`);
    return response;
  },

  /**
   * Reopen car request (buyer only)
   * Mark closed request as active again
   */
  reopenRequest: async (id: number): Promise<CarRequest> => {
    const response = await apiClient.put<CarRequest>(
      API_ENDPOINTS.CAR_REQUEST_BY_ID(id),
      { status: "active" }
    );

    console.log(`✅ Reopened car request ${id}`);
    return response;
  },

  /**
   * Search car requests (dealer only)
   * Dealers can search for specific requirements
   */
  searchRequests: async (
    query: string,
    params: Partial<RequestsSearchParams> = {}
  ): Promise<CarRequestsResponse> => {
    const searchParams = {
      ...params,
      search: query,
    };

    const response = await apiClient.getWithParams<CarRequestsResponse>(
      API_ENDPOINTS.CAR_REQUESTS,
      searchParams
    );

    console.log(
      `✅ Search for "${query}" returned ${response.requests.length} requests`
    );
    return response;
  },

  /**
   * Get requests by make (dealer only)
   * Find requests for specific car manufacturer
   */
  getRequestsByMake: async (
    make: string,
    params: Partial<RequestsSearchParams> = {}
  ): Promise<CarRequestsResponse> => {
    const searchParams = {
      ...params,
      make,
    };

    const response = await apiClient.getWithParams<CarRequestsResponse>(
      API_ENDPOINTS.CAR_REQUESTS,
      searchParams
    );

    console.log(`✅ Fetched ${response.requests.length} requests for ${make}`);
    return response;
  },

  /**
   * Get recent requests (for dealer dashboard)
   */
  getRecentRequests: async (limit: number = 5): Promise<CarRequest[]> => {
    const response = await apiClient.getWithParams<CarRequestsResponse>(
      API_ENDPOINTS.CAR_REQUESTS,
      {
        limit,
        sortBy: "created_at",
        sortOrder: "desc",
      }
    );

    console.log(`✅ Fetched ${response.requests.length} recent requests`);
    return response.requests;
  },

  /**
   * Get request statistics (for dashboards)
   */
  getRequestStats: async (): Promise<{
    total: number;
    active: number;
    closed: number;
    thisWeek: number;
    thisMonth: number;
  }> => {
    const response = await apiClient.get<{
      total: number;
      active: number;
      closed: number;
      thisWeek: number;
      thisMonth: number;
    }>("/api/car-requests/stats");

    console.log("✅ Fetched request statistics");
    return response;
  },

  /**
   * Match requests with inventory (dealer only)
   * Find requests that match dealer's cars
   */
  getMatchingRequests: async (
    params: {
      make?: string;
      model?: string;
      yearFrom?: number;
      yearTo?: number;
      priceMax?: number;
    } = {}
  ): Promise<CarRequest[]> => {
    const response = await apiClient.getWithParams<{ requests: CarRequest[] }>(
      "/api/car-requests/matching",
      params
    );

    console.log(`✅ Found ${response.requests.length} matching requests`);
    return response.requests;
  },
};

export default requestsApi;
