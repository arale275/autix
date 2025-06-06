"use client";
export interface CarImage {
  id: number;
  car_id: number;
  image_url: string;
  thumbnail_url?: string;
  is_main: boolean;
  display_order: number;
  original_filename?: string;
  file_size?: number;
  content_type?: string;
  created_at: string;
  updated_at: string;
}

// Base API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Pagination structure
export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error response structure
export interface ApiError {
  success: false;
  message: string;
  code?: string;
  details?: any;
}

// User types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: "buyer" | "dealer";
  createdAt: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Dealer specific
export interface Dealer {
  id: number;
  userId: number;
  businessName: string;
  licenseNumber?: string;
  address?: string;
  city?: string;
  description?: string;
  verified: boolean;
  rating: number;
  createdAt: string;
}

// Buyer specific
export interface Buyer {
  id: number;
  userId: number;
  preferences?: any;
  budgetMin?: number;
  budgetMax?: number;
  createdAt: string;
}

export interface Car {
  id: number;
  dealerId?: number;
  dealer_user_id?: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;

  // שדות לתצוגה (עברית)
  fuelType?: string;
  transmission?: string;
  condition?: string; // ✅ חדש - מצב הרכב (חדש/משומש/מעולה וכו')
  bodyType?: string; // ✅ חדש - סוג מרכב (סדאן/SUV/האצ'בק וכו')

  // ✅ שדות מקוריים לטפסים (אנגלית)
  fuelTypeOriginal?: string;
  transmissionOriginal?: string;
  conditionOriginal?: string;
  bodyTypeOriginal?: string;

  color?: string;
  description?: string;
  images?: string[] | CarImage[];
  status: "active" | "sold" | "deleted";
  city?: string;
  engineSize?: string;
  hand?: string; // ✅ קיים - יד ראשונה/שנייה/שלישית+
  isAvailable: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt?: string;
  features?: string[];

  // Joined data
  dealer?: {
    id: number;
    businessName: string;
    city?: string;
    phone?: string;
  };
}

export interface CarsResponse {
  cars: Car[];
  pagination: Pagination;
}

// Car Request types
export interface CarRequest {
  id: number;
  buyerId: number;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMax?: number;
  requirements?: string;
  status: "active" | "closed";
  createdAt: string;
  updatedAt?: string;
  // Joined data
  buyer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

export interface CarRequestsResponse {
  requests: CarRequest[];
  pagination?: Pagination;
}

// Inquiry types
export interface Inquiry {
  id: number;
  buyerId: number;
  dealerId: number;
  carId?: number;
  message: string;
  status: "new" | "responded" | "closed";
  createdAt: string;
  updatedAt?: string;
  // Joined data
  buyer?: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  dealer?: {
    businessName: string;
    phone?: string;
  };
  car?: {
    make: string;
    model: string;
    year: number;
    price: number;
  };
}

export interface InquiriesResponse {
  inquiries: Inquiry[];
  pagination?: Pagination;
}

// Request/Response types for specific endpoints
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: "buyer" | "dealer";
  // Dealer specific
  businessName?: string;
  licenseNumber?: string;
  address?: string;
  city?: string;
  description?: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  // Dealer specific
  businessName?: string;
  address?: string;
  city?: string;
  description?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface CreateCarRequest {
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
  hand?: string; // ✅ השדה החדש
  images?: string[] | CarImage[];
  isFeatured?: boolean;
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  isAvailable?: boolean;
  status?: "active" | "sold" | "deleted";
}

export interface CreateCarRequestRequest {
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMax?: number;
  requirements?: string;
}

export interface CreateInquiryRequest {
  dealerId: number;
  carId?: number;
  message: string;
}

export interface UpdateInquiryStatusRequest {
  status: "responded" | "closed";
}

// Search/Filter parameters
export interface CarsSearchParams {
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
  sortBy?: "price" | "year" | "created_at" | "mileage";
  sortOrder?: "asc" | "desc";
}

export interface RequestsSearchParams {
  page?: number;
  limit?: number;
  make?: string;
  status?: "active" | "closed";
  sortBy?: "created_at";
  sortOrder?: "asc" | "desc";
}

export interface InquiriesSearchParams {
  page?: number;
  limit?: number;
  status?: "new" | "responded" | "closed";
  carId?: number;
  sortBy?: "created_at";
  sortOrder?: "asc" | "desc";
}

// Statistics/Dashboard types
export interface BuyerStats {
  totalRequests: number;
  activeRequests: number;
  totalInquiries: number;
  savedCars: number;
}

export interface DealerStats {
  totalCars: number;
  activeCars: number;
  soldCars: number;
  totalInquiries: number;
  newInquiries: number;
}

// HTTP Error types
export interface HttpError extends Error {
  status: number;
  code?: string;
  details?: any;
}
