"use client";

import { apiClient } from "./client";
import { API_ENDPOINTS } from "../constants";
import type {
  AuthResponse,
  User,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "./types";

/**
 * Auth API Functions
 * Contains all authentication-related API calls
 */
export const authApi = {
  /**
   * Login user
   */
  login: async (credentials: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.LOGIN,
      credentials,
      { skipAuth: true } // No auth needed for login
    );

    console.log("✅ Login successful");
    return response;
  },

  /**
   * Register new user
   */
  register: async (userData: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.REGISTER,
      userData,
      { skipAuth: true } // No auth needed for registration
    );

    console.log("✅ Registration successful");
    return response;
  },

  /**
   * Get current user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>(API_ENDPOINTS.PROFILE);

    console.log("✅ Profile fetched");
    return response;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: UpdateProfileRequest): Promise<User> => {
    const response = await apiClient.put<User>(
      API_ENDPOINTS.UPDATE_PROFILE,
      userData
    );

    console.log("✅ Profile updated");
    return response;
  },

  /**
   * Change password
   */
  changePassword: async (passwords: ChangePasswordRequest): Promise<void> => {
    await apiClient.post<void>(API_ENDPOINTS.CHANGE_PASSWORD, passwords);

    console.log("✅ Password changed");
  },

  /**
   * Delete user account
   */
  deleteAccount: async (): Promise<void> => {
    await apiClient.delete<void>(API_ENDPOINTS.DELETE_ACCOUNT);

    console.log("✅ Account deleted");
  },

  /**
   * Check if email exists (for registration validation)
   */
  checkEmail: async (email: string): Promise<{ exists: boolean }> => {
    const response = await apiClient.post<{ exists: boolean }>(
      "/api/auth/check-email",
      { email },
      { skipAuth: true }
    );

    return response;
  },

  /**
   * Request password reset (for future implementation)
   */
  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/api/auth/forgot-password",
      { email },
      { skipAuth: true }
    );

    console.log("✅ Password reset requested");
    return response;
  },

  /**
   * Reset password with token (for future implementation)
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<{ message: string }> => {
    const response = await apiClient.post<{ message: string }>(
      "/api/auth/reset-password",
      { token, newPassword },
      { skipAuth: true }
    );

    console.log("✅ Password reset");
    return response;
  },

  /**
   * Refresh JWT token (for future implementation)
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await apiClient.post<{ token: string }>(
      "/api/auth/refresh-token"
    );

    console.log("✅ Token refreshed");
    return response;
  },

  /**
   * Logout (clear server-side session if needed)
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post<void>("/api/auth/logout");
      console.log("✅ Logout successful");
    } catch (error) {
      // Even if server logout fails, we'll clear client-side data
      console.warn("⚠️ Server logout failed, but clearing client data");
    }
  },
};

export default authApi;
