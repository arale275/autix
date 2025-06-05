export interface Car {
  id: number;
  dealer_id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: "gasoline" | "diesel" | "hybrid" | "electric" | "lpg";
  transmission: "manual" | "automatic" | "cvt" | "semi-automatic";
  color: string;
  description?: string;
  image_urls?: string[];
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
  features?: string[];
  condition?:
    | "new"
    | "demo"
    | "excellent"
    | "very_good"
    | "good"
    | "fair"
    | "needs_repair"
    | "accident"
    | "for_parts";
  body_type?:
    | "sedan"
    | "hatchback"
    | "suv"
    | "crossover"
    | "station_wagon"
    | "coupe"
    | "convertible"
    | "pickup"
    | "van"
    | "minivan"
    | "mpv"
    | "roadster"
    | "targa"
    | "limousine"
    | "other";
  hand?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10+"
    | "unknown";
}

export interface CreateCarRequest {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: "gasoline" | "diesel" | "hybrid" | "electric" | "lpg";
  transmission: "manual" | "automatic" | "cvt" | "semi-automatic";
  color: string;
  description?: string;
  image_urls?: string[];
  features?: string[];
  condition?:
    | "new"
    | "demo"
    | "excellent"
    | "very_good"
    | "good"
    | "fair"
    | "needs_repair"
    | "accident"
    | "for_parts";
  body_type?:
    | "sedan"
    | "hatchback"
    | "suv"
    | "crossover"
    | "station_wagon"
    | "coupe"
    | "convertible"
    | "pickup"
    | "van"
    | "minivan"
    | "mpv"
    | "roadster"
    | "targa"
    | "limousine"
    | "other";
  hand?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10+"
    | "unknown";
}

export interface Car {
  id: number;
  dealer_id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: "gasoline" | "diesel" | "hybrid" | "electric" | "lpg";
  transmission: "manual" | "automatic" | "cvt" | "semi-automatic";
  color: string;
  description?: string;
  image_urls?: string[];
  city: string; // ✅ הוסף את זה
  engine_size?: string; // ✅ הוסף את זה
  status: "active" | "sold" | "deleted"; // ✅ הוסף את זה
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
  features?: string[];
  condition?:
    | "new"
    | "demo"
    | "excellent"
    | "very_good"
    | "good"
    | "fair"
    | "needs_repair"
    | "accident"
    | "for_parts";
  body_type?:
    | "sedan"
    | "hatchback"
    | "suv"
    | "crossover"
    | "station_wagon"
    | "coupe"
    | "convertible"
    | "pickup"
    | "van"
    | "minivan"
    | "mpv"
    | "roadster"
    | "targa"
    | "limousine"
    | "other";
  hand?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10+"
    | "unknown";
}

export interface CreateCarRequest {
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: "gasoline" | "diesel" | "hybrid" | "electric" | "lpg";
  transmission: "manual" | "automatic" | "cvt" | "semi-automatic";
  color: string;
  description?: string;
  image_urls?: string[];
  city: string; // ✅ הוסף את זה
  engine_size?: string; // ✅ הוסף את זה
  features?: string[];
  condition?:
    | "new"
    | "demo"
    | "excellent"
    | "very_good"
    | "good"
    | "fair"
    | "needs_repair"
    | "accident"
    | "for_parts";
  body_type?:
    | "sedan"
    | "hatchback"
    | "suv"
    | "crossover"
    | "station_wagon"
    | "coupe"
    | "convertible"
    | "pickup"
    | "van"
    | "minivan"
    | "mpv"
    | "roadster"
    | "targa"
    | "limousine"
    | "other";
  hand?:
    | "0"
    | "1"
    | "2"
    | "3"
    | "4"
    | "5"
    | "6"
    | "7"
    | "8"
    | "9"
    | "10+"
    | "unknown";
}

export interface UpdateCarRequest extends Partial<CreateCarRequest> {
  is_available?: boolean;
  status?: "active" | "sold" | "deleted"; // ✅ הוסף את זה גם
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
  city?: string; // ✅ הוסף את זה
  // פילטרים חדשים:
  condition?: string;
  body_type?: string;
  hand?: string;
}
