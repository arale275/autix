import type { Car, CreateCarRequest, UpdateCarRequest } from "./types";

// ✅ מיפוי מעברית לאנגלית
const FUEL_TYPE_MAPPING: Record<string, string> = {
  בנזין: "gasoline",
  דיזל: "diesel",
  היברידי: "hybrid",
  חשמלי: "electric",
  גז: "lpg",
  // אנגלית נשארת כמו שהיא
  gasoline: "gasoline",
  diesel: "diesel",
  hybrid: "hybrid",
  electric: "electric",
  lpg: "lpg",
};

const TRANSMISSION_MAPPING: Record<string, string> = {
  ידני: "manual",
  אוטומטי: "automatic",
  CVT: "cvt",
  // אנגלית נשארת כמו שהיא
  manual: "manual",
  automatic: "automatic",
  cvt: "cvt",
};

const CONDITION_MAPPING: Record<string, string> = {
  חדש: "new",
  דמו: "demo",
  מעולה: "excellent",
  "טוב מאוד": "very_good",
  טוב: "good",
  בינוני: "fair",
  "דורש תיקון": "needs_repair",
  תאונה: "accident",
  לחלקים: "for_parts",
  // אנגלית נשארת כמו שהיא
  new: "new",
  demo: "demo",
  excellent: "excellent",
  very_good: "very_good",
  good: "good",
  fair: "fair",
  needs_repair: "needs_repair",
  accident: "accident",
  for_parts: "for_parts",
};

const BODY_TYPE_MAPPING: Record<string, string> = {
  סדאן: "sedan",
  "האצ'בק": "hatchback",
  SUV: "suv",
  קרוסאובר: "crossover",
  סטיישן: "station_wagon",
  קופה: "coupe",
  קבריולט: "convertible",
  טנדר: "pickup",
  ואן: "van",
  מיניוואן: "minivan",
  MPV: "mpv",
  רודסטר: "roadster",
  טרגה: "targa",
  לימוזין: "limousine",
  אחר: "other",
  // אנגלית נשארת כמו שהיא
  sedan: "sedan",
  hatchback: "hatchback",
  suv: "suv",
  crossover: "crossover",
  station_wagon: "station_wagon",
  coupe: "coupe",
  convertible: "convertible",
  pickup: "pickup",
  van: "van",
  minivan: "minivan",
  mpv: "mpv",
  roadster: "roadster",
  targa: "targa",
  limousine: "limousine",
  other: "other",
};

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

// ✅ NEW: המרה מהקליינט לשרת עם תרגום מעברית לאנגלית
export function normalizeCarForAPI(carData: any): any {
  return {
    make: carData.make,
    model: carData.model,
    year: carData.year,
    price: carData.price,
    mileage: carData.mileage,
    fuel_type: FUEL_TYPE_MAPPING[carData.fuelType] || carData.fuelType, // ✅ תרגום
    transmission:
      TRANSMISSION_MAPPING[carData.transmission] || carData.transmission, // ✅ תרגום
    color: carData.color,
    description: carData.description,
    status: carData.status,
    city: carData.city,
    engine_size: carData.engineSize, // camelCase → snake_case
    is_available: carData.isAvailable, // camelCase → snake_case
    is_featured: carData.isFeatured, // camelCase → snake_case
    hand: carData.hand,
    condition: CONDITION_MAPPING[carData.condition] || carData.condition, // ✅ תרגום
    body_type: BODY_TYPE_MAPPING[carData.bodyType] || carData.bodyType, // ✅ תרגום
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
