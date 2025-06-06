import type { Car, CreateCarRequest, UpdateCarRequest } from "./types";

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
  status: "active" | "sold" | "deleted";
  created_at: string;
  updated_at: string;
  city?: string;
  engine_size?: string;
  is_available: boolean;
  is_featured: boolean;
  hand?: string;
  condition?: string;
  body_type?: string;
  features?: any[];
  images?: any[];
}

// ✅ המרה מהשרת לקליינט (כמו שהיה)
export function normalizeCarFromAPI(apiCar: CarFromAPI): Car {
  return {
    id: apiCar.id,
    dealer_user_id: apiCar.dealer_id,
    make: apiCar.make,
    model: apiCar.model,
    year: apiCar.year,
    price: apiCar.price,
    mileage: apiCar.mileage,
    fuelType: apiCar.fuel_type, // snake_case → camelCase
    transmission: apiCar.transmission,
    color: apiCar.color,
    description: apiCar.description,
    status: apiCar.status,
    createdAt: apiCar.created_at, // snake_case → camelCase
    updatedAt: apiCar.updated_at, // snake_case → camelCase
    city: apiCar.city,
    engineSize: apiCar.engine_size, // snake_case → camelCase
    isAvailable: apiCar.is_available, // snake_case → camelCase
    isFeatured: apiCar.is_featured, // snake_case → camelCase
    hand: apiCar.hand,
    condition: apiCar.condition,
    bodyType: apiCar.body_type, // snake_case → camelCase
    features: apiCar.features,
    images: apiCar.images,
  };
}

export function normalizeCarsResponse(apiResponse: any) {
  return {
    cars: apiResponse.cars.map(normalizeCarFromAPI),
    pagination: apiResponse.pagination,
  };
}

// ✅ NEW: המרה מהקליינט לשרת
export function normalizeCarForAPI(carData: any): any {
  return {
    make: carData.make,
    model: carData.model,
    year: carData.year,
    price: carData.price,
    mileage: carData.mileage,
    fuel_type: carData.fuelType, // camelCase → snake_case
    transmission: carData.transmission,
    color: carData.color,
    description: carData.description,
    status: carData.status,
    city: carData.city,
    engine_size: carData.engineSize, // camelCase → snake_case
    is_available: carData.isAvailable, // camelCase → snake_case
    is_featured: carData.isFeatured, // camelCase → snake_case
    hand: carData.hand,
    condition: carData.condition,
    body_type: carData.bodyType, // camelCase → snake_case
    features: carData.features,
    images: carData.images,
  };
}

// ✅ NEW: פונקציות עזר ספציפיות
export function normalizeCreateCarForAPI(carData: CreateCarRequest): any {
  return normalizeCarForAPI(carData);
}

export function normalizeUpdateCarForAPI(carData: UpdateCarRequest): any {
  return normalizeCarForAPI(carData);
}
