"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient, tokenManager, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message?: string }>;
  register: (
    userData: RegisterData
  ) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: "buyer" | "dealer";
}

// ✅ הוסף export כאן!
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const token = tokenManager.getToken();
      const savedUser = tokenManager.getUser();

      if (token && savedUser) {
        // Verify token is still valid by fetching fresh profile
        try {
          const response = await apiClient.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
            tokenManager.setUser(response.data);
          } else {
            // Token is invalid, clear storage
            tokenManager.removeToken();
            setUser(null);
          }
        } catch (error) {
          // Token is invalid, clear storage
          tokenManager.removeToken();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Auth initialization error:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login({ email, password });

      if (response.success && response.data) {
        const { user: userData, token } = response.data;

        // Save to localStorage
        tokenManager.setToken(token);
        tokenManager.setUser(userData);

        // Update state
        setUser(userData);

        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "שגיאה בהתחברות",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "שגיאה בהתחברות",
      };
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiClient.register(userData);

      if (response.success && response.data) {
        const { user: newUser, token } = response.data;

        // Save to localStorage
        tokenManager.setToken(token);
        tokenManager.setUser(newUser);

        // Update state
        setUser(newUser);

        return { success: true };
      } else {
        return {
          success: false,
          message: response.message || "שגיאה ברישום",
        };
      }
    } catch (error) {
      console.error("Register error:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "שגיאה ברישום",
      };
    }
  };

  const logout = () => {
    tokenManager.removeToken();
    setUser(null);
  };

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
        tokenManager.setUser(response.data);
      }
    } catch (error) {
      console.error("Profile refresh error:", error);
      // If profile refresh fails, user might need to login again
      logout();
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// HOC for protected routes
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedUserTypes?: ("buyer" | "dealer")[]
) {
  return function AuthenticatedComponent(props: P) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">טוען...</p>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">נדרשת התחברות</h2>
            <p className="text-gray-600 mb-4">אנא התחבר כדי לגשת לעמוד זה</p>
            <a
              href="/auth/login"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              התחבר
            </a>
          </div>
        </div>
      );
    }

    if (allowedUserTypes && !allowedUserTypes.includes(user.userType)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">אין הרשאה</h2>
            <p className="text-gray-600">אין לך הרשאה לגשת לעמוד זה</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
