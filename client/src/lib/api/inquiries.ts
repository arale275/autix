// lib/api/inquiries.ts - Inquiries API Functions
"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "../constants";
import type {
  Inquiry,
  InquiriesResponse,
  CreateInquiryRequest,
  UpdateInquiryStatusRequest,
  InquiriesSearchParams,
} from "./types";

/**
 * Inquiries API Functions
 * Contains all inquiry/message-related API calls between buyers and dealers
 */
export const inquiriesApi = {
  /**
   * Send inquiry to dealer (buyer only)
   * Buyers can send messages to dealers about specific cars or general inquiries
   */
  sendInquiry: async (inquiryData: CreateInquiryRequest): Promise<Inquiry> => {
    const response = await apiClient.post<Inquiry>(
      API_ENDPOINTS.INQUIRIES,
      inquiryData
    );

    console.log(`✅ Sent inquiry to dealer ${inquiryData.dealerId}`);
    return response;
  },

  /**
   * Get sent inquiries (buyer only)
   * Buyers can see inquiries they've sent
   */
  getSentInquiries: async (
    params: InquiriesSearchParams = {}
  ): Promise<InquiriesResponse> => {
    const response = await apiClient.getWithParams<InquiriesResponse>(
      API_ENDPOINTS.SENT_INQUIRIES,
      params
    );

    console.log(`✅ Fetched ${response.inquiries.length} sent inquiries`);
    return response;
  },

  /**
   * Get received inquiries (dealer only)
   * Dealers can see inquiries they've received from buyers
   */
  getReceivedInquiries: async (
    params: InquiriesSearchParams = {}
  ): Promise<InquiriesResponse> => {
    const response = await apiClient.getWithParams<InquiriesResponse>(
      API_ENDPOINTS.RECEIVED_INQUIRIES,
      params
    );

    console.log(`✅ Fetched ${response.inquiries.length} received inquiries`);
    return response;
  },

  /**
   * Get specific inquiry by ID
   */
  getInquiry: async (id: number): Promise<Inquiry> => {
    const response = await apiClient.get<Inquiry>(
      API_ENDPOINTS.INQUIRY_BY_ID(id)
    );

    console.log(`✅ Fetched inquiry ${id}`);
    return response;
  },

  /**
   * Update inquiry status (dealer only)
   * Dealers can mark inquiries as responded or closed
   */
  updateInquiryStatus: async (
    id: number,
    statusData: UpdateInquiryStatusRequest
  ): Promise<Inquiry> => {
    const response = await apiClient.put<Inquiry>(
      API_ENDPOINTS.INQUIRY_STATUS(id),
      statusData
    );

    console.log(`✅ Updated inquiry ${id} status to ${statusData.status}`);
    return response;
  },

  /**
   * Mark inquiry as responded (dealer only)
   */
  markAsResponded: async (id: number): Promise<Inquiry> => {
    return inquiriesApi.updateInquiryStatus(id, { status: "responded" });
  },

  /**
   * Close inquiry (both buyer and dealer)
   */
  closeInquiry: async (id: number): Promise<Inquiry> => {
    return inquiriesApi.updateInquiryStatus(id, { status: "closed" });
  },

  /**
   * Delete inquiry (buyer only, own inquiries)
   */
  deleteInquiry: async (id: number): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.INQUIRY_BY_ID(id));

    console.log(`✅ Deleted inquiry ${id}`);
  },

  /**
   * Get new inquiries count (dealer only)
   * For notification badges
   */
  getNewInquiriesCount: async (): Promise<{ count: number }> => {
    const response = await apiClient.get<{ count: number }>(
      "/api/inquiries/new/count"
    );

    console.log(`✅ Fetched new inquiries count: ${response.count}`);
    return response;
  },

  /**
   * Get inquiries by car (dealer only)
   * See all inquiries for a specific car
   */
  getInquiriesByCar: async (
    carId: number,
    params: Partial<InquiriesSearchParams> = {}
  ): Promise<InquiriesResponse> => {
    const searchParams = {
      ...params,
      carId,
    };

    const response = await apiClient.getWithParams<InquiriesResponse>(
      API_ENDPOINTS.RECEIVED_INQUIRIES,
      searchParams
    );

    console.log(
      `✅ Fetched ${response.inquiries.length} inquiries for car ${carId}`
    );
    return response;
  },

  /**
   * Get recent inquiries (for dealer dashboard)
   */
  getRecentInquiries: async (limit: number = 5): Promise<Inquiry[]> => {
    const response = await apiClient.getWithParams<InquiriesResponse>(
      API_ENDPOINTS.RECEIVED_INQUIRIES,
      {
        limit,
        sortBy: "created_at",
        sortOrder: "desc",
      }
    );

    console.log(`✅ Fetched ${response.inquiries.length} recent inquiries`);
    return response.inquiries;
  },

  /**
   * Search inquiries
   */
  searchInquiries: async (
    query: string,
    type: "sent" | "received" = "received",
    params: Partial<InquiriesSearchParams> = {}
  ): Promise<InquiriesResponse> => {
    const endpoint =
      type === "sent"
        ? API_ENDPOINTS.SENT_INQUIRIES
        : API_ENDPOINTS.RECEIVED_INQUIRIES;

    const searchParams = {
      ...params,
      search: query,
    };

    const response = await apiClient.getWithParams<InquiriesResponse>(
      endpoint,
      searchParams
    );

    console.log(
      `✅ Search for "${query}" returned ${response.inquiries.length} inquiries`
    );
    return response;
  },

  /**
   * Get inquiry statistics (for dashboards)
   */
  getInquiryStats: async (): Promise<{
    total: number;
    new: number;
    responded: number;
    closed: number;
    thisWeek: number;
    thisMonth: number;
    responseRate: number;
  }> => {
    const response = await apiClient.get<{
      total: number;
      new: number;
      responded: number;
      closed: number;
      thisWeek: number;
      thisMonth: number;
      responseRate: number;
    }>("/api/inquiries/stats");

    console.log("✅ Fetched inquiry statistics");
    return response;
  },

  /**
   * Bulk update inquiries status (dealer only)
   * Mark multiple inquiries as responded/closed
   */
  bulkUpdateStatus: async (
    inquiryIds: number[],
    status: "responded" | "closed"
  ): Promise<{ updated: number }> => {
    const response = await apiClient.put<{ updated: number }>(
      "/api/inquiries/bulk-status",
      { inquiryIds, status }
    );

    console.log(`✅ Bulk updated ${response.updated} inquiries to ${status}`);
    return response;
  },

  /**
   * Get inquiry thread/conversation (for future chat implementation)
   */
  getInquiryThread: async (
    inquiryId: number
  ): Promise<{
    inquiry: Inquiry;
    messages: Array<{
      id: number;
      message: string;
      sender: "buyer" | "dealer";
      createdAt: string;
    }>;
  }> => {
    const response = await apiClient.get<{
      inquiry: Inquiry;
      messages: Array<{
        id: number;
        message: string;
        sender: "buyer" | "dealer";
        createdAt: string;
      }>;
    }>(`/api/inquiries/${inquiryId}/thread`);

    console.log(`✅ Fetched inquiry thread for ${inquiryId}`);
    return response;
  },

  /**
   * Reply to inquiry (for future chat implementation)
   */
  replyToInquiry: async (
    inquiryId: number,
    message: string
  ): Promise<{
    id: number;
    message: string;
    sender: "buyer" | "dealer";
    createdAt: string;
  }> => {
    const response = await apiClient.post<{
      id: number;
      message: string;
      sender: "buyer" | "dealer";
      createdAt: string;
    }>(`/api/inquiries/${inquiryId}/reply`, { message });

    console.log(`✅ Replied to inquiry ${inquiryId}`);
    return response;
  },
};

export default inquiriesApi;
