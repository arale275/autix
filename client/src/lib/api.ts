// client/src/lib/api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: "buyer" | "dealer";
  createdAt: string;
  dealerProfile?: {
    id: number;
    businessName: string;
    licenseNumber?: string;
    address?: string;
    city?: string;
    description?: string;
    verified: boolean;
    rating: number;
  };
}

export interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuelType?: string;
  transmission?: string;
  color?: string;
  description?: string;
  images?: string[];
  city?: string;
  engineSize?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  dealerId: number;
  createdAt: string;
  dealer?: {
    businessName: string;
    city?: string;
    phone?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

// API Client Class
class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    // Get token from localStorage
    const token =
      typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;

    // Debug log
    console.log("🔑 API Request:", {
      endpoint,
      hasToken: !!token,
      tokenPreview: token ? token.substring(0, 20) + "..." : "none",
    });

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    // Debug headers
    console.log("📤 Request headers:", config.headers);

    try {
      const response = await fetch(url, config);

      // Handle different response types
      if (!response.ok) {
        let errorMessage = "Something went wrong";

        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }

        if (response.status === 401) {
          errorMessage = "גישה נדחתה - לא נמצא טוקן";
        } else if (response.status === 403) {
          errorMessage = "אין הרשאה לפעולה זו";
        }

        console.log("❌ API Error:", {
          status: response.status,
          message: errorMessage,
        });
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("✅ API Success:", endpoint, data.success);
      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  // Authentication
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    userType: "buyer" | "dealer";
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async getProfile(): Promise<ApiResponse<User>> {
    return this.request("/api/auth/profile");
  }

  // Cars
  async getCars(filters?: {
    page?: number;
    limit?: number;
    make?: string;
    model?: string;
    yearFrom?: number;
    yearTo?: number;
    priceFrom?: number;
    priceTo?: number;
    fuelType?: string;
    transmission?: string;
    city?: string;
    search?: string;
  }): Promise<ApiResponse<Car[]>> {
    const queryString = filters
      ? new URLSearchParams(
          Object.entries(filters)
            .filter(([_, value]) => value !== undefined && value !== "")
            .map(([key, value]) => [key, String(value)])
        ).toString()
      : "";

    return this.request(`/api/cars${queryString ? `?${queryString}` : ""}`);
  }

  async getCarById(id: number): Promise<ApiResponse<Car>> {
    return this.request(`/api/cars/${id}`);
  }

  async addCar(carData: {
    make: string;
    model: string;
    year: number;
    price: number;
    mileage?: number;
    fuelType?: string;
    transmission?: string;
    color?: string;
    description?: string;
    city?: string;
    engineSize?: string;
  }): Promise<ApiResponse<Car>> {
    return this.request("/api/cars", {
      method: "POST",
      body: JSON.stringify(carData),
    });
  }

  async updateCar(
    id: number,
    carData: Partial<Car>
  ): Promise<ApiResponse<Car>> {
    return this.request(`/api/cars/${id}`, {
      method: "PUT",
      body: JSON.stringify(carData),
    });
  }

  async deleteCar(id: number): Promise<ApiResponse<void>> {
    return this.request(`/api/cars/${id}`, {
      method: "DELETE",
    });
  }

  async getMyCars(): Promise<ApiResponse<Car[]>> {
    return this.request("/api/cars/my/cars");
  }

  async getDealerCars(dealerId: number): Promise<ApiResponse<Car[]>> {
    return this.request(`/api/cars/dealer/${dealerId}`);
  }

  // Health check
  async healthCheck(): Promise<
    ApiResponse<{ status: string; timestamp: string }>
  > {
    return this.request("/api/health");
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Utility functions for token management
export const tokenManager = {
  setToken: (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  },

  getToken: () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  },

  removeToken: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  setUser: (user: User) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user));
    }
  },

  getUser: (): User | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  },
};
