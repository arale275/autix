// Car Request Types
export interface CarRequest {
  id: number;
  buyer_id: number;
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_max?: number;
  requirements?: string;
  status: "active" | "fulfilled" | "cancelled";
  created_at: Date;
}

export interface CreateCarRequestData {
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_max?: number;
  requirements?: string;
}

export interface UpdateCarRequestData {
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_max?: number;
  requirements?: string;
  status?: "active" | "fulfilled" | "cancelled";
}

export interface CarRequestResponse extends CarRequest {
  buyer_name?: string;
  buyer_phone?: string;
  buyer_email?: string;
}

export interface CarRequestFilters {
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  status?: string;
  page?: number;
  limit?: number;
}
