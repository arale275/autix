"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useClientStorage } from "@/lib/localStorage";
import { ROUTES } from "@/lib/constants";
import type { Car } from "@/lib/api/types";

type UserType = "buyer" | "dealer" | "any";

interface ProtectedRouteOptions {
  /**
   * Required user type to access the route
   * @default 'any'
   */
  requiredUserType?: UserType;

  /**
   * Custom redirect path if access is denied
   */
  redirectTo?: string;

  /**
   * Allow unauthenticated users
   * @default false
   */
  allowUnauthenticated?: boolean;

  /**
   * Show loading state while checking auth
   * @default true
   */
  showLoading?: boolean;

  /**
   * Custom callback when access is denied
   */
  onAccessDenied?: (reason: string) => void;

  /**
   * Skip redirect and only return access status
   * @default false
   */
  skipRedirect?: boolean;

  // ✨ הוסף את השדות החדשים:
  /**
   * Car to check ownership/status for
   */
  car?: Car | null;

  /**
   * Check if user owns the car (for dealers)
   * @default false
   */
  checkCarOwnership?: boolean;

  /**
   * Required car status
   */
  requiredCarStatus?: "active" | "sold" | "deleted";
}

interface ProtectedRouteReturn {
  /**
   * Whether the user has access to this route
   */
  hasAccess: boolean;

  /**
   * Whether auth check is still loading
   */
  isLoading: boolean;

  /**
   * The authenticated user (if any)
   */
  user: any;

  /**
   * Whether user is authenticated
   */
  isAuthenticated: boolean;

  /**
   * Reason for access denial (if any)
   */
  accessDeniedReason?: string;
}

/**
 * Hook for protecting routes based on authentication and user type
 *
 * @example
 * // Protect route for buyers only
 * function BuyerPage() {
 *   const { hasAccess, isLoading } = useProtectedRoute({
 *     requiredUserType: 'buyer'
 *   });
 *
 *   if (isLoading) return <LoadingState />;
 *   if (!hasAccess) return null; // Will redirect automatically
 *
 *   return <div>Buyer content</div>;
 * }
 *
 * @example
 * // Check access without redirecting
 * function ConditionalContent() {
 *   const { hasAccess } = useProtectedRoute({
 *     requiredUserType: 'dealer',
 *     skipRedirect: true
 *   });
 *
 *   return hasAccess ? <DealerFeature /> : <PublicContent />;
 * }
 */
export const useProtectedRoute = (
  options: ProtectedRouteOptions = {}
): ProtectedRouteReturn => {
  const {
    requiredUserType = "any",
    redirectTo,
    allowUnauthenticated = false,
    showLoading = true,
    onAccessDenied,
    skipRedirect = false,
    car,
    checkCarOwnership = false,
    requiredCarStatus,
  } = options;

  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { isClient } = useClientStorage();

  const getDefaultRedirect = (): string => {
    if (!isAuthenticated) {
      return ROUTES.LOGIN;
    }

    if (user?.userType === "buyer") {
      return ROUTES.BUYER_HOME;
    }

    if (user?.userType === "dealer") {
      return ROUTES.DEALER_HOME;
    }

    return ROUTES.HOME;
  };

  const checkAccess = (): {
    hasAccess: boolean;
    reason?: string;
  } => {
    // Allow access during loading if showLoading is true
    if (isLoading && showLoading) {
      return { hasAccess: true };
    }

    // Check authentication requirement
    if (!allowUnauthenticated && !isAuthenticated) {
      return {
        hasAccess: false,
        reason: "authentication_required",
      };
    }

    // Check user type requirement
    if (
      isAuthenticated &&
      user &&
      requiredUserType !== "any" &&
      user.userType !== requiredUserType
    ) {
      return {
        hasAccess: false,
        reason: `wrong_user_type_expected_${requiredUserType}_got_${user.userType}`,
      };
    }
    // Check car ownership
    if (
      checkCarOwnership &&
      car &&
      isAuthenticated &&
      user?.userType === "dealer"
    ) {
      if (car.dealer_user_id !== user.id) {
        return {
          hasAccess: false,
          reason: "not_car_owner",
        };
      }
    }

    // Check car status
    if (requiredCarStatus && car) {
      if (car.status !== requiredCarStatus) {
        return {
          hasAccess: false,
          reason: `wrong_car_status_expected_${requiredCarStatus}_got_${car.status}`,
        };
      }
    }

    return { hasAccess: true };
  };

  const { hasAccess, reason } = checkAccess();

  useEffect(() => {
    // Don't redirect on server side or while loading
    if (!isClient || (isLoading && showLoading)) {
      return;
    }

    // Skip redirect if explicitly requested
    if (skipRedirect) {
      return;
    }

    // Handle access denial
    if (!hasAccess && reason) {
      const targetRedirect = redirectTo || getDefaultRedirect();

      console.log(
        `🚪 Access denied: ${reason}, redirecting to ${targetRedirect}`
      );

      // Call custom callback if provided
      if (onAccessDenied) {
        onAccessDenied(reason);
      }

      // Perform redirect
      router.push(targetRedirect);
      return;
    }

    // Log successful access
    if (hasAccess && !isLoading) {
      console.log("✅ Route access granted", {
        requiredUserType,
        userType: user?.userType,
        isAuthenticated,
      });
    }
  }, [
    isClient,
    isLoading,
    hasAccess,
    reason,
    skipRedirect,
    redirectTo,
    onAccessDenied,
    router,
    showLoading,
    requiredUserType,
    user?.userType,
    isAuthenticated,
  ]);

  return {
    hasAccess,
    isLoading: isLoading && showLoading,
    user,
    isAuthenticated,
    accessDeniedReason: reason,
  };
};

/**
 * Simplified hooks for common use cases
 */

/**
 * Hook for buyer-only routes
 */
export const useBuyerRoute = (
  options: Omit<ProtectedRouteOptions, "requiredUserType"> = {}
) => {
  return useProtectedRoute({
    ...options,
    requiredUserType: "buyer",
  });
};

/**
 * Hook for dealer-only routes
 */
export const useDealerRoute = (
  options: Omit<ProtectedRouteOptions, "requiredUserType"> = {}
) => {
  return useProtectedRoute({
    ...options,
    requiredUserType: "dealer",
  });
};

/**
 * Hook for authenticated routes (any user type)
 */
export const useAuthenticatedRoute = (
  options: Omit<
    ProtectedRouteOptions,
    "requiredUserType" | "allowUnauthenticated"
  > = {}
) => {
  return useProtectedRoute({
    ...options,
    requiredUserType: "any",
    allowUnauthenticated: false,
  });
};

/**
 * Hook for checking permissions without redirecting
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuth();

  return {
    isBuyer: isAuthenticated && user?.userType === "buyer",
    isDealer: isAuthenticated && user?.userType === "dealer",
    isAuthenticated,
    user,

    // Permission checks
    canViewBuyerPages: isAuthenticated && user?.userType === "buyer",
    canViewDealerPages: isAuthenticated && user?.userType === "dealer",
    canCreateCars: isAuthenticated && user?.userType === "dealer",
    canCreateRequests: isAuthenticated && user?.userType === "buyer",
    canSendInquiries: isAuthenticated && user?.userType === "buyer",
    canReceiveInquiries: isAuthenticated && user?.userType === "dealer",
  };
};

/**
Hook for car-specific route protection
 */
export const useCarRoute = (
  car: Car | null,
  options: {
    checkOwnership?: boolean;
    requiredStatus?: "active" | "sold" | "deleted";
    redirectTo?: string;
  } = {}
) => {
  const { checkOwnership = false, requiredStatus, redirectTo } = options;

  return useProtectedRoute({
    requiredUserType: "dealer",
    car,
    checkCarOwnership: checkOwnership,
    requiredCarStatus: requiredStatus,
    redirectTo: redirectTo || "/dealer/cars",
  });
};

export default useProtectedRoute;
