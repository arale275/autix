"use client";

import { useState, useEffect, useCallback } from "react";
import { authApi } from "@/lib/api/auth";
import { handleApiError, isAuthError } from "@/lib/api/client";
import { storage } from "@/lib/localStorage";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import type {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  BuyerStats,
  DealerStats,
} from "@/lib/api/types";

interface UseProfileOptions {
  /**
   * Auto-fetch profile on mount
   * @default true
   */
  autoFetch?: boolean;

  /**
   * Callback when profile is updated
   */
  onProfileUpdate?: (user: User) => void;

  /**
   * Callback when error occurs
   */
  onError?: (error: string) => void;
}

interface UseProfileReturn {
  // Profile data
  profile: User | null;

  // State
  loading: boolean;
  updating: boolean;
  error: string | null;

  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<boolean>;
  changePassword: (passwords: ChangePasswordRequest) => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  refetch: () => Promise<void>;
  clearError: () => void;

  // Helper flags
  isOutdated: boolean;
}

/**
 * Hook for managing user profile data
 */
export function useProfile(options: UseProfileOptions = {}): UseProfileReturn {
  const { autoFetch = true, onProfileUpdate, onError } = options;

  const router = useRouter();
  const { user: authUser } = useAuth();
  const [profile, setProfile] = useState<User | null>(authUser || null);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const profileData = await authApi.getProfile();
      setProfile(profileData);

      // Update localStorage
      storage.setUser(profileData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);

      if (isAuthError(err)) {
        router.push("/auth/login");
      }

      if (onError) {
        onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [router, onError]);

  const updateProfile = useCallback(
    async (data: UpdateProfileRequest): Promise<boolean> => {
      try {
        setUpdating(true);
        setError(null);

        const updatedProfile = await authApi.updateProfile(data);
        setProfile(updatedProfile);

        // Update localStorage
        storage.setUser(updatedProfile);

        if (onProfileUpdate) {
          onProfileUpdate(updatedProfile);
        }

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        if (onError) {
          onError(errorMessage);
        }

        return false;
      } finally {
        setUpdating(false);
      }
    },
    [router, onProfileUpdate, onError]
  );

  const changePassword = useCallback(
    async (passwords: ChangePasswordRequest): Promise<boolean> => {
      try {
        setUpdating(true);
        setError(null);

        await authApi.changePassword(passwords);

        return true;
      } catch (err) {
        const errorMessage = handleApiError(err);
        setError(errorMessage);

        if (isAuthError(err)) {
          router.push("/auth/login");
        }

        if (onError) {
          onError(errorMessage);
        }

        return false;
      } finally {
        setUpdating(false);
      }
    },
    [router, onError]
  );

  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      setUpdating(true);
      setError(null);

      await authApi.deleteAccount();

      // Clear all local data
      storage.clearAuth();

      // Redirect to home
      router.push("/");

      return true;
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);

      if (onError) {
        onError(errorMessage);
      }

      return false;
    } finally {
      setUpdating(false);
    }
  }, [router, onError]);

  const refetch = useCallback(() => {
    return fetchProfile();
  }, [fetchProfile]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Check if profile data is outdated compared to auth context
  const isOutdated = useCallback(() => {
    if (!profile || !authUser) return false;

    return (
      profile.firstName !== authUser.firstName ||
      profile.lastName !== authUser.lastName ||
      profile.email !== authUser.email ||
      profile.phone !== authUser.phone
    );
  }, [profile, authUser]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch && !profile) {
      fetchProfile();
    }
  }, [autoFetch, profile, fetchProfile]);

  // Sync with auth context
  useEffect(() => {
    if (authUser && !profile) {
      setProfile(authUser);
    }
  }, [authUser, profile]);

  return {
    profile,
    loading,
    updating,
    error,
    fetchProfile,
    updateProfile,
    changePassword,
    deleteAccount,
    refetch,
    clearError,
    isOutdated: isOutdated(),
  };
}

/**
 * Hook for profile statistics (buyer or dealer specific)
 */
export function useProfileStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState<BuyerStats | DealerStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Different endpoints based on user type
      let statsData;
      if (user.userType === "buyer") {
        // For now, calculate from localStorage until backend provides stats endpoint
        const savedCars = storage.getSavedCars();
        statsData = {
          totalRequests: 0, // Would come from API
          activeRequests: 0, // Would come from API
          totalInquiries: 0, // Would come from API
          savedCars: savedCars.length,
        } as BuyerStats;
      } else {
        // Dealer stats would come from API
        statsData = {
          totalCars: 0,
          activeCars: 0,
          soldCars: 0,
          totalInquiries: 0,
          newInquiries: 0,
        } as DealerStats;
      }

      setStats(statsData);
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}

/**
 * Hook for form validation and management
 */
export function useProfileForm(initialData?: Partial<UpdateProfileRequest>) {
  const [formData, setFormData] = useState<UpdateProfileRequest>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    ...initialData,
  });
  const [errors, setErrors] = useState<Partial<UpdateProfileRequest>>({});
  const [isDirty, setIsDirty] = useState(false);

  const updateField = useCallback(
    (field: keyof UpdateProfileRequest, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setIsDirty(true);

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<UpdateProfileRequest> = {};

    if (!formData.firstName?.trim()) {
      newErrors.firstName = "שם פרטי נדרש";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "שם משפחה נדרש";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "אימייל נדרש";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "פורמט אימייל לא תקין";
    }

    if (
      formData.phone &&
      !/^05\d{8}$/.test(formData.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "מספר טלפון לא תקין";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback((data?: Partial<UpdateProfileRequest>) => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      ...data,
    });
    setErrors({});
    setIsDirty(false);
  }, []);

  return {
    formData,
    errors,
    isDirty,
    updateField,
    validateForm,
    resetForm,
    isValid: Object.keys(errors).length === 0,
  };
}

/**
 * Hook for password change form
 */
export function usePasswordForm() {
  const [formData, setFormData] = useState<
    ChangePasswordRequest & { confirmPassword: string }
  >({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const updateField = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear error for this field
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const togglePasswordVisibility = useCallback(
    (field: keyof typeof showPasswords) => {
      setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
    },
    []
  );

  const validateForm = useCallback((): boolean => {
    const newErrors: Partial<typeof formData> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "סיסמה נוכחית נדרשת";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "סיסמה חדשה נדרשת";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "סיסמה חייבת להכיל לפחות 6 תווים";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "אישור סיסמה נדרש";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "הסיסמאות לא תואמות";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
  }, []);

  const getPasswordData = useCallback((): ChangePasswordRequest => {
    return {
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    };
  }, [formData]);

  return {
    formData,
    errors,
    showPasswords,
    updateField,
    togglePasswordVisibility,
    validateForm,
    resetForm,
    getPasswordData,
    isValid: Object.keys(errors).length === 0,
  };
}

export default useProfile;
