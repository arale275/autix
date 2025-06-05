import type { Car } from "./types";

export interface CarFromAPI {
  id: number;
  dealer_id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  description?: string;
  status: "active" | "sold" | "deleted"; // ← תקן את זה
  created_at: string;
  updated_at: string;
  city?: string;
  engine_size?: string;
  is_available: boolean;
  is_featured: boolean;
  hand?: string;
  images?: any[];
}

export function normalizeCarFromAPI(apiCar: CarFromAPI): Car {
  return {
    id: apiCar.id,
    dealer_user_id: apiCar.dealer_id, // ← תקן את זה
    make: apiCar.make,
    model: apiCar.model,
    year: apiCar.year,
    price: apiCar.price,
    mileage: apiCar.mileage,
    fuelType: apiCar.fuel_type,
    transmission: apiCar.transmission,
    color: apiCar.color,
    description: apiCar.description,
    status: apiCar.status, // ← עכשיו זה יעבוד
    createdAt: apiCar.created_at,
    updatedAt: apiCar.updated_at,
    city: apiCar.city,
    engineSize: apiCar.engine_size,
    isAvailable: apiCar.is_available, // ⭐ הנרמול החשוב
    isFeatured: apiCar.is_featured, // ⭐ הנרמול החשוב
    hand: apiCar.hand,
    images: apiCar.images,
  };
}

export function normalizeCarsResponse(apiResponse: any) {
  return {
    cars: apiResponse.cars.map(normalizeCarFromAPI),
    pagination: apiResponse.pagination,
  };
}
