// src/lib/mockData.ts
export interface Car {
  id: number;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  engineSize: string;
  color: string;
  hand: string;
  status: "active" | "sold" | "pending";
  views: number;
  inquiries: number;
  favorites: number;
  createdAt: string;
  images: string[];
  description: string;
  dealerId: number;
  dealerName: string;
  dealerPhone: string;
  location: string;
}

export const mockCars: Car[] = [
  {
    id: 1,
    manufacturer: "טויוטה",
    model: "קורולה",
    year: 2021,
    price: 89000,
    mileage: 45000,
    transmission: "אוטומט",
    fuelType: "בנזין",
    engineSize: "1.6",
    color: "לבן",
    hand: "יד שנייה",
    status: "active",
    views: 156,
    inquiries: 8,
    favorites: 12,
    createdAt: "2024-12-15T10:30:00Z",
    images: ["/cars/toyota-corolla-1.jpg", "/cars/toyota-corolla-2.jpg"],
    description: "רכב במצב מעולה, שירות מלא בטויוטה, לא מעורב בתאונות",
    dealerId: 1,
    dealerName: "מוטורס תל אביב",
    dealerPhone: "03-1234567",
    location: "תל אביב",
  },
  {
    id: 2,
    manufacturer: "יונדאי",
    model: "טוסון",
    year: 2022,
    price: 135000,
    mileage: 30000,
    transmission: "אוטומט",
    fuelType: "בנזין",
    engineSize: "1.8",
    color: "כסף",
    hand: "יד ראשונה",
    status: "active",
    views: 203,
    inquiries: 15,
    favorites: 23,
    createdAt: "2024-12-14T14:20:00Z",
    images: ["/cars/hyundai-tucson-1.jpg", "/cars/hyundai-tucson-2.jpg"],
    description: "יונדאי טוסון 2022 במצב חדש, אחריות יצרן",
    dealerId: 2,
    dealerName: "אאודי סנטר",
    dealerPhone: "09-8765432",
    location: "פתח תקווה",
  },
  {
    id: 3,
    manufacturer: "סקודה",
    model: "אוקטביה",
    year: 2020,
    price: 78000,
    mileage: 60000,
    transmission: "אוטומט",
    fuelType: "בנזין",
    engineSize: "2.0",
    color: "שחור",
    hand: "יד שנייה",
    status: "active",
    views: 89,
    inquiries: 4,
    favorites: 7,
    createdAt: "2024-12-13T09:15:00Z",
    images: ["/cars/skoda-octavia-1.jpg", "/cars/skoda-octavia-2.jpg"],
    description: "סקודה אוקטביה בירושלים, במצב טוב",
    dealerId: 3,
    dealerName: "רכבי פרימיום",
    dealerPhone: "02-5555555",
    location: "ירושלים",
  },
  {
    id: 4,
    manufacturer: "BMW",
    model: "320i",
    year: 2023,
    price: 195000,
    mileage: 15000,
    transmission: "אוטומט",
    fuelType: "בנזין",
    engineSize: "2.0",
    color: "כחול",
    hand: "יד ראשונה",
    status: "active",
    views: 245,
    inquiries: 18,
    favorites: 31,
    createdAt: "2024-12-12T16:45:00Z",
    images: ["/cars/bmw-320i-1.jpg", "/cars/bmw-320i-2.jpg"],
    description: "BMW 320i 2023 חדש מהסלון, מפרט מלא",
    dealerId: 1,
    dealerName: "מוטורס תל אביב",
    dealerPhone: "03-1234567",
    location: "תל אביב",
  },
  {
    id: 5,
    manufacturer: "מרצדס",
    model: "C200",
    year: 2021,
    price: 165000,
    mileage: 40000,
    transmission: "אוטומט",
    fuelType: "בנזין",
    engineSize: "1.5",
    color: "אפור",
    hand: "יד שנייה",
    status: "sold",
    views: 312,
    inquiries: 25,
    favorites: 45,
    createdAt: "2024-12-10T11:00:00Z",
    images: ["/cars/mercedes-c200-1.jpg", "/cars/mercedes-c200-2.jpg"],
    description: "מרצדס C200 נמכר - במצב מעולה",
    dealerId: 4,
    dealerName: "יוקרה אוטו",
    dealerPhone: "04-7777777",
    location: "חיפה",
  },
  {
    id: 6,
    manufacturer: "קיה",
    model: "ספורטאז'",
    year: 2022,
    price: 115000,
    mileage: 25000,
    transmission: "אוטומט",
    fuelType: "היברידי",
    engineSize: "1.6",
    color: "אדום",
    hand: "יד ראשונה",
    status: "pending",
    views: 178,
    inquiries: 12,
    favorites: 19,
    createdAt: "2024-12-11T13:30:00Z",
    images: ["/cars/kia-sportage-1.jpg", "/cars/kia-sportage-2.jpg"],
    description: "קיה ספורטאז' היברידי 2022, ממתין לאישור",
    dealerId: 2,
    dealerName: "אאודי סנטר",
    dealerPhone: "09-8765432",
    location: "פתח תקווה",
  },
  {
    id: 7,
    manufacturer: "הונדה",
    model: "סיוויק",
    year: 2020,
    price: 85000,
    mileage: 55000,
    transmission: "ידני",
    fuelType: "בנזין",
    engineSize: "1.5",
    color: "לבן",
    hand: "יד שלישית",
    status: "active",
    views: 134,
    inquiries: 6,
    favorites: 9,
    createdAt: "2024-12-09T08:20:00Z",
    images: ["/cars/honda-civic-1.jpg", "/cars/honda-civic-2.jpg"],
    description: "הונדה סיוויק 2020, תיבת הילוכים ידנית",
    dealerId: 5,
    dealerName: "רכב נקי",
    dealerPhone: "08-9999999",
    location: "באר שבע",
  },
  {
    id: 8,
    manufacturer: "פולקסווגן",
    model: "גולף",
    year: 2023,
    price: 125000,
    mileage: 18000,
    transmission: "אוטומט",
    fuelType: "בנזין",
    engineSize: "1.4",
    color: "כסף",
    hand: "יד ראשונה",
    status: "active",
    views: 267,
    inquiries: 21,
    favorites: 34,
    createdAt: "2024-12-08T15:10:00Z",
    images: ["/cars/vw-golf-1.jpg", "/cars/vw-golf-2.jpg"],
    description: "פולקסווגן גולף 2023 במצב חדש",
    dealerId: 3,
    dealerName: "רכבי פרימיום",
    dealerPhone: "02-5555555",
    location: "ירושלים",
  },
];

// Helper functions for filtering and searching
export const filterCars = (cars: Car[], filters: any) => {
  return cars.filter((car) => {
    if (filters.manufacturer && car.manufacturer !== filters.manufacturer)
      return false;
    if (filters.yearFrom && car.year < parseInt(filters.yearFrom)) return false;
    if (filters.yearTo && car.year > parseInt(filters.yearTo)) return false;
    if (filters.priceFrom && car.price < parseInt(filters.priceFrom))
      return false;
    if (filters.priceTo && car.price > parseInt(filters.priceTo)) return false;
    if (filters.mileageFrom && car.mileage < parseInt(filters.mileageFrom))
      return false;
    if (filters.mileageTo && car.mileage > parseInt(filters.mileageTo))
      return false;
    if (filters.transmission && car.transmission !== filters.transmission)
      return false;
    if (filters.fuelType && car.fuelType !== filters.fuelType) return false;
    if (filters.color && car.color !== filters.color) return false;
    if (filters.hand && car.hand !== filters.hand) return false;

    return true;
  });
};

export const searchCars = (cars: Car[], searchTerm: string) => {
  if (!searchTerm) return cars;

  const term = searchTerm.toLowerCase();
  return cars.filter(
    (car) =>
      car.manufacturer.toLowerCase().includes(term) ||
      car.model.toLowerCase().includes(term) ||
      car.description.toLowerCase().includes(term) ||
      car.dealerName.toLowerCase().includes(term) ||
      car.location.toLowerCase().includes(term)
  );
};

// Get featured cars (for homepage)
export const getFeaturedCars = (limit: number = 3) => {
  return mockCars
    .filter((car) => car.status === "active")
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
};
