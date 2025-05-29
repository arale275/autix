export interface Car {
  id: number;
  dealer_id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: "gasoline" | "diesel" | "hybrid" | "electric";
  transmission: "manual" | "automatic";
  color: string;
  description?: string;
  image_urls?: string[];
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCarRequest {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: "gasoline" | "diesel" | "hybrid" | "electric";
  transmission: "manual" | "automatic";
  color: string;
  description?: string;
  image_urls?: string[];
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  is_available?: boolean;
}

export interface CarFilters {
  make?: string;
  model?: string;
  year_min?: number;
  year_max?: number;
  price_min?: number;
  price_max?: number;
  mileage_max?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  dealer_id?: number;
  is_available?: boolean;
}
