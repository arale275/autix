// lib/car-utils.ts - Car-related utilities extracted from pages
import type { Car, CarImage } from "@/lib/api/types";

// Status Options - moved from pages
export const STATUS_OPTIONS = [
  { value: "all", label: "כל הסטטוסים", color: "gray" },
  { value: "active", label: "פעיל", color: "green" },
  { value: "sold", label: "נמכר", color: "purple" },
  { value: "deleted", label: "נמחק", color: "red" },
] as const;

export const AVAILABILITY_OPTIONS = [
  { value: "all", label: "הכל" },
  { value: "available", label: "זמין" },
  { value: "unavailable", label: "לא זמין" },
] as const;

export const SORT_OPTIONS = [
  { value: "created_at:desc", label: "חדשים ביותר" },
  { value: "created_at:asc", label: "ישנים ביותר" },
  { value: "price:asc", label: "מחיר: נמוך לגבוה" },
  { value: "price:desc", label: "מחיר: גבוה לנמוך" },
  { value: "year:desc", label: "שנה: חדש לישן" },
  { value: "year:asc", label: "שנה: ישן לחדש" },
] as const;

// Status utility functions
export const getStatusColor = (status: string): string => {
  const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
  const color = statusOption?.color || "gray";
  return `bg-${color}-100 text-${color}-800 border-${color}-200`;
};

export const getStatusLabel = (status: string): string => {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label || "לא ידוע";
};

// Type guard to check if image is CarImage object
export const isCarImageObject = (
  image: string | CarImage
): image is CarImage => {
  return (
    typeof image === "object" &&
    image !== null &&
    "id" in image &&
    "image_url" in image
  );
};

// Helper function to convert images to CarImage format
export const normalizeImages = (
  images: (string | CarImage)[] | undefined,
  carId: number
): { main: CarImage | null; gallery: CarImage[]; count: number } => {
  if (!images || images.length === 0) {
    return { main: null, gallery: [], count: 0 };
  }

  const carImages: CarImage[] = images.map((image, index) => {
    if (isCarImageObject(image)) {
      return image;
    } else {
      return {
        id: index + 1,
        car_id: carId,
        image_url: image,
        thumbnail_url: image,
        is_main: index === 0,
        display_order: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  });

  const main = carImages.find((img) => img.is_main) || carImages[0] || null;
  const gallery = carImages.filter((img) => !img.is_main);

  return {
    main,
    gallery,
    count: carImages.length,
  };
};

// Calculate car statistics
export const calculateCarStats = (cars: Car[]) => {
  const total = cars.length;
  const active = cars.filter((c) => c.status === "active").length;
  const sold = cars.filter((c) => c.status === "sold").length;
  const available = cars.filter((c) => c.isAvailable).length;
  const withoutImages = cars.filter(
    (c) => !c.images || c.images.length === 0
  ).length;

  return {
    total,
    active,
    sold,
    available,
    withoutImages,
    availableProgress: total > 0 ? (available / total) * 100 : 0,
    soldProgress: total > 0 ? (sold / total) * 100 : 0,
  };
};

// Get car age in Hebrew
export const getCarAge = (year: number): string => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age === 0) return "חדש";
  if (age === 1) return "שנה";
  return `${age} שנים`;
};

// Calculate days on market
export const getDaysOnMarket = (createdAt: string): number => {
  return Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );
};

// Filter cars by criteria
export const filterCars = (
  cars: Car[],
  filters: {
    make?: string;
    status?: string;
    availability?: string;
    sortBy?: string;
  }
) => {
  let filtered = [...cars];

  // Filter by make
  if (filters.make && filters.make !== "all") {
    filtered = filtered.filter((car) => car.make === filters.make);
  }

  // Filter by status
  if (filters.status && filters.status !== "all") {
    filtered = filtered.filter((car) => car.status === filters.status);
  }

  // Filter by availability
  if (filters.availability && filters.availability !== "all") {
    if (filters.availability === "available") {
      filtered = filtered.filter((car) => car.isAvailable);
    } else if (filters.availability === "unavailable") {
      filtered = filtered.filter((car) => !car.isAvailable);
    }
  }

  // Sort
  if (filters.sortBy) {
    const [sortField, sortOrder] = filters.sortBy.split(":");
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "created_at":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "year":
          aValue = a.year;
          bValue = b.year;
          break;
        default:
          return 0;
      }

      const modifier = sortOrder === "desc" ? -1 : 1;
      return aValue > bValue ? modifier : aValue < bValue ? -modifier : 0;
    });
  }

  return filtered;
};
