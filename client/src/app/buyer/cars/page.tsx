"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Grid, List, Filter, Eye, Clock } from "lucide-react";

interface Car {
  id: number;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineSize: number;
  transmission: string;
  fuelType: string;
  color: string;
  hand: string;
  location: string;
  dealerName: string;
  dealerPhone: string;
  views: number;
  inquiries: number;
  status: string;
  createdAt: string;
  description?: string;
}

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  businessName?: string;
  city: string;
}

export default function BuyerCarsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    manufacturer: "",
    priceRange: "",
    yearRange: "",
    location: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in as buyer
    const authToken = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (authToken && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== "buyer") {
          // Redirect non-buyers away from this page
          router.push("/");
          return;
        }
        setUser(parsedUser);
      } catch (error) {
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  // Mock data for cars - available cars from dealers
  const mockCars: Car[] = [
    {
      id: 1,
      manufacturer: "טויוטה",
      model: "קמרי",
      year: 2021,
      price: 185000,
      mileage: 45000,
      engineSize: 2.5,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "לבן",
      hand: "יד ראשונה",
      location: "תל אביב",
      dealerName: "רכבי פרימיום",
      dealerPhone: "050-1234567",
      views: 45,
      inquiries: 3,
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      manufacturer: "הונדה",
      model: "סיוויק",
      year: 2020,
      price: 145000,
      mileage: 58000,
      engineSize: 1.8,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "שחור",
      hand: "יד ראשונה",
      location: "פתח תקווה",
      dealerName: "אוטו דיל",
      dealerPhone: "052-9876543",
      views: 38,
      inquiries: 2,
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 3,
      manufacturer: "מאזדה",
      model: "3",
      year: 2019,
      price: 125000,
      mileage: 65000,
      engineSize: 2.0,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "אדום",
      hand: "יד ראשונה",
      location: "חיפה",
      dealerName: "כרמל רכב",
      dealerPhone: "054-5555555",
      views: 32,
      inquiries: 1,
      status: "active",
      createdAt: "2024-01-08",
    },
    {
      id: 4,
      manufacturer: "BMW",
      model: "320i",
      year: 2020,
      price: 245000,
      mileage: 35000,
      engineSize: 2.0,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "שחור",
      hand: "יד ראשונה",
      location: "תל אביב",
      dealerName: "BMW מרכז",
      dealerPhone: "053-1111111",
      views: 67,
      inquiries: 5,
      status: "active",
      createdAt: "2024-01-12",
    },
    {
      id: 5,
      manufacturer: "מרצדס",
      model: "C200",
      year: 2019,
      price: 220000,
      mileage: 48000,
      engineSize: 1.5,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "לבן",
      hand: "יד ראשונה",
      location: "רמת גן",
      dealerName: "מרצדס ישראל",
      dealerPhone: "050-2222222",
      views: 52,
      inquiries: 4,
      status: "active",
      createdAt: "2024-01-05",
    },
    {
      id: 6,
      manufacturer: "יונדאי",
      model: "i30",
      year: 2022,
      price: 135000,
      mileage: 28000,
      engineSize: 1.4,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "כחול",
      hand: "יד ראשונה",
      location: "באר שבע",
      dealerName: "יונדאי דרום",
      dealerPhone: "050-3333333",
      views: 29,
      inquiries: 2,
      status: "active",
      createdAt: "2024-01-18",
    },
    {
      id: 7,
      manufacturer: "קיה",
      model: "ספורטג'",
      year: 2021,
      price: 165000,
      mileage: 38000,
      engineSize: 1.6,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "אפור",
      hand: "יד ראשונה",
      location: "נתניה",
      dealerName: "קיה מרכז",
      dealerPhone: "050-4444444",
      views: 41,
      inquiries: 3,
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: 8,
      manufacturer: "פולקסווגן",
      model: "גולף",
      year: 2020,
      price: 155000,
      mileage: 52000,
      engineSize: 1.4,
      transmission: "אוטומט",
      fuelType: "בנזין",
      color: "כחול כהה",
      hand: "יד ראשונה",
      location: "ירושלים",
      dealerName: "פולקס ירושלים",
      dealerPhone: "050-5555555",
      views: 35,
      inquiries: 2,
      status: "active",
      createdAt: "2024-01-13",
    },
  ];

  // Filter and search cars
  const filteredCars = useMemo(() => {
    let result = mockCars.filter((car) => car.status === "active");

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (car) =>
          car.manufacturer.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term) ||
          car.location.toLowerCase().includes(term) ||
          car.dealerName.toLowerCase().includes(term)
      );
    }

    // Apply filters
    if (filters.manufacturer) {
      result = result.filter(
        (car) => car.manufacturer === filters.manufacturer
      );
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      result = result.filter((car) => {
        if (max) {
          return car.price >= min && car.price <= max;
        } else {
          return car.price >= min;
        }
      });
    }

    if (filters.yearRange) {
      const year = parseInt(filters.yearRange);
      result = result.filter((car) => car.year >= year);
    }

    if (filters.location) {
      result = result.filter((car) => car.location === filters.location);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case "oldest":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "priceLow":
        result.sort((a, b) => a.price - b.price);
        break;
      case "priceHigh":
        result.sort((a, b) => b.price - a.price);
        break;
      case "mileageLow":
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      case "mileageHigh":
        result.sort((a, b) => b.mileage - a.mileage);
        break;
      default:
        break;
    }

    return result;
  }, [searchTerm, filters, sortBy]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      manufacturer: "",
      priceRange: "",
      yearRange: "",
      location: "",
    });
  };

  const handleViewCar = (carId: number) => {
    router.push(`/buyer/cars/${carId}`);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    if (diffDays < 30) return `לפני ${Math.ceil(diffDays / 7)} שבועות`;
    return `לפני ${Math.ceil(diffDays / 30)} חודשים`;
  };

  const CarCard = ({ car }: { car: Car }) => (
    <Card
      className="hover:shadow-lg transition-all duration-300 group cursor-pointer"
      onClick={() => handleViewCar(car.id)}
    >
      <div className="relative">
        <div className="bg-gray-200 h-48 flex items-center justify-center rounded-t-lg">
          <div className="text-gray-400 text-center">
            <div className="text-4xl mb-2">🚗</div>
            <p className="text-sm">תמונה</p>
          </div>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            זמין
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/90">
            {car.year}
          </Badge>
        </div>
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="bg-black/70 text-white text-xs">
            <Clock className="w-3 h-3 ml-1" />
            {getTimeAgo(car.createdAt)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {car.manufacturer} {car.model}
          </h3>
          <span className="text-xl font-bold text-blue-600">
            ₪{car.price.toLocaleString()}
          </span>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>
            🔧 {car.engineSize} ליטר, {car.transmission}
          </p>
          <p>
            ⛽ {car.fuelType} | 🎨 {car.color}
          </p>
          <p>
            📊 {car.mileage.toLocaleString()} ק"מ | 👤 {car.hand}
          </p>
          <p>
            📍 {car.location} | 🏪 {car.dealerName}
          </p>
        </div>

        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
          <span>👀 {car.views} צפיות</span>
          <span>💬 {car.inquiries} פניות</span>
          <span>🏪 {car.dealerName}</span>
        </div>

        <Button className="w-full bg-blue-600 hover:bg-blue-700">
          <Eye className="w-4 h-4 ml-1" />
          צפה בפרטים ושלח פניה
        </Button>
      </CardContent>
    </Card>
  );

  const CarListItem = ({ car }: { car: Car }) => (
    <Card
      className="hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={() => handleViewCar(car.id)}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="bg-gray-200 w-32 h-24 flex items-center justify-center rounded relative">
            <div className="text-gray-400 text-center">
              <div className="text-2xl mb-1">🚗</div>
            </div>
            <div className="absolute bottom-1 right-1">
              <Badge
                variant="outline"
                className="bg-black/70 text-white text-xs"
              >
                {getTimeAgo(car.createdAt)}
              </Badge>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-gray-800">
                {car.manufacturer} {car.model} ({car.year})
              </h3>
              <span className="text-xl font-bold text-blue-600">
                ₪{car.price.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
              <span>
                🔧 {car.engineSize}L {car.transmission}
              </span>
              <span>⛽ {car.fuelType}</span>
              <span>📊 {car.mileage.toLocaleString()} ק"מ</span>
              <span>📍 {car.location}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>👀 {car.views}</span>
                <span>💬 {car.inquiries}</span>
                <span>🏪 {car.dealerName}</span>
              </div>

              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Eye className="w-4 h-4 ml-1" />
                צפה בפרטים
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Don't render until we verify user
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">חיפוש רכבים</h1>
        <p className="text-gray-600 mt-1">
          שלום {user.name?.split(" ")[0]}, נמצאו {filteredCars.length} רכבים
          מתוך {mockCars.length}
        </p>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="חפש לפי יצרן, דגם, מיקום או סוחר..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              סינון
              {Object.values(filters).filter(Boolean).length > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {Object.values(filters).filter(Boolean).length}
                </Badge>
              )}
            </Button>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="מיין לפי" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">החדשים ביותר</SelectItem>
                <SelectItem value="oldest">הישנים ביותר</SelectItem>
                <SelectItem value="priceLow">מחיר: נמוך לגבוה</SelectItem>
                <SelectItem value="priceHigh">מחיר: גבוה לנמוך</SelectItem>
                <SelectItem value="mileageLow">ק"מ: נמוך לגבוה</SelectItem>
                <SelectItem value="mileageHigh">ק"מ: גבוה לנמוך</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* View Mode */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  יצרן
                </label>
                <Select
                  value={filters.manufacturer}
                  onValueChange={(value) =>
                    handleFilterChange("manufacturer", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="כל היצרנים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל היצרנים</SelectItem>
                    <SelectItem value="טויוטה">טויוטה</SelectItem>
                    <SelectItem value="הונדה">הונדה</SelectItem>
                    <SelectItem value="מאזדה">מאזדה</SelectItem>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="מרצדס">מרצדס</SelectItem>
                    <SelectItem value="יונדאי">יונדאי</SelectItem>
                    <SelectItem value="קיה">קיה</SelectItem>
                    <SelectItem value="פולקסווגן">פולקסווגן</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  טווח מחירים
                </label>
                <Select
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    handleFilterChange("priceRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="כל המחירים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל המחירים</SelectItem>
                    <SelectItem value="0-100000">עד 100,000 ₪</SelectItem>
                    <SelectItem value="100000-150000">
                      100,000-150,000 ₪
                    </SelectItem>
                    <SelectItem value="150000-200000">
                      150,000-200,000 ₪
                    </SelectItem>
                    <SelectItem value="200000-300000">
                      200,000-300,000 ₪
                    </SelectItem>
                    <SelectItem value="300000">מעל 300,000 ₪</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  שנת ייצור
                </label>
                <Select
                  value={filters.yearRange}
                  onValueChange={(value) =>
                    handleFilterChange("yearRange", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="כל השנים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל השנים</SelectItem>
                    <SelectItem value="2023">מ-2023</SelectItem>
                    <SelectItem value="2022">מ-2022</SelectItem>
                    <SelectItem value="2021">מ-2021</SelectItem>
                    <SelectItem value="2020">מ-2020</SelectItem>
                    <SelectItem value="2019">מ-2019</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מיקום
                </label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="כל המיקומים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל המיקומים</SelectItem>
                    <SelectItem value="תל אביב">תל אביב</SelectItem>
                    <SelectItem value="פתח תקווה">פתח תקווה</SelectItem>
                    <SelectItem value="חיפה">חיפה</SelectItem>
                    <SelectItem value="רמת גן">רמת גן</SelectItem>
                    <SelectItem value="באר שבע">באר שבע</SelectItem>
                    <SelectItem value="נתניה">נתניה</SelectItem>
                    <SelectItem value="ירושלים">ירושלים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                נקה מסננים
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            לא נמצאו רכבים
          </h3>
          <p className="text-gray-600 mb-4">
            נסה לשנות את תנאי החיפוש או המסננים
          </p>
          <Button variant="outline" onClick={clearFilters}>
            נקה חיפוש
          </Button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredCars.map((car) =>
            viewMode === "grid" ? (
              <CarCard key={car.id} car={car} />
            ) : (
              <CarListItem key={car.id} car={car} />
            )
          )}
        </div>
      )}
    </div>
  );
}
