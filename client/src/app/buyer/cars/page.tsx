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
import {
  Search,
  Grid,
  List,
  Filter,
  Eye,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

// API Car interface (matching backend response)
interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuel_type: string;
  transmission: string;
  color: string;
  description: string;
  city: string;
  engine_size: string;
  is_available: boolean;
  is_featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  // Dealer info (joined from API)
  dealer?: {
    id: number;
    business_name: string;
    city: string;
  };
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: {
    cars: Car[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export default function BuyerCarsPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  // States
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    make: "",
    priceFrom: "",
    priceTo: "",
    yearFrom: "",
    yearTo: "",
    city: "",
    fuelType: "",
    transmission: "",
  });
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Fetch cars from API
  const fetchCars = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add search
      if (searchTerm) {
        params.append("search", searchTerm);
      }

      // Add filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      // Add sorting
      if (sortBy === "priceLow") {
        params.append("sortBy", "price");
        params.append("sortOrder", "asc");
      } else if (sortBy === "priceHigh") {
        params.append("sortBy", "price");
        params.append("sortOrder", "desc");
      } else if (sortBy === "newest") {
        params.append("sortBy", "created_at");
        params.append("sortOrder", "desc");
      } else if (sortBy === "oldest") {
        params.append("sortBy", "created_at");
        params.append("sortOrder", "asc");
      }

      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";
      const response = await fetch(`${API_URL}/api/cars?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse = await response.json();

      if (data.success) {
        setCars(data.data.cars);
        setPagination((prev) => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages,
        }));
      } else {
        throw new Error(data.message || "Failed to fetch cars");
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
      setError(error instanceof Error ? error.message : "שגיאה בטעינת הרכבים");
    } finally {
      setLoading(false);
    }
  };

  // Load cars on mount and when filters change
  useEffect(() => {
    fetchCars();
  }, [pagination.page, searchTerm, filters, sortBy]);

  // Auth check
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilters({
      make: "",
      priceFrom: "",
      priceTo: "",
      yearFrom: "",
      yearTo: "",
      city: "",
      fuelType: "",
      transmission: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
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
          <Badge
            variant="default"
            className={
              car.is_available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }
          >
            {car.is_available ? "זמין" : "לא זמין"}
          </Badge>
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="outline" className="bg-white/90">
            {car.year}
          </Badge>
        </div>
        {car.is_featured && (
          <div className="absolute top-8 left-2">
            <Badge
              variant="default"
              className="bg-yellow-500 text-white text-xs"
            >
              מומלץ
            </Badge>
          </div>
        )}
        <div className="absolute bottom-2 right-2">
          <Badge variant="outline" className="bg-black/70 text-white text-xs">
            <Clock className="w-3 h-3 ml-1" />
            {getTimeAgo(car.created_at)}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {car.make} {car.model}
          </h3>
          <span className="text-xl font-bold text-blue-600">
            ₪{car.price.toLocaleString()}
          </span>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>
            🔧 {car.engine_size} ליטר, {car.transmission}
          </p>
          <p>
            ⛽ {car.fuel_type} | 🎨 {car.color}
          </p>
          <p>📊 {car.mileage?.toLocaleString()} ק"מ</p>
          <p>
            📍 {car.city} | 🏪 {car.dealer?.business_name || "לא צוין"}
          </p>
        </div>

        {car.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {car.description}
          </p>
        )}

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
                {getTimeAgo(car.created_at)}
              </Badge>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-gray-800">
                  {car.make} {car.model} ({car.year})
                </h3>
                {car.is_featured && (
                  <Badge
                    variant="default"
                    className="bg-yellow-500 text-white text-xs"
                  >
                    מומלץ
                  </Badge>
                )}
              </div>
              <span className="text-xl font-bold text-blue-600">
                ₪{car.price.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
              <span>
                🔧 {car.engine_size}L {car.transmission}
              </span>
              <span>⛽ {car.fuel_type}</span>
              <span>📊 {car.mileage?.toLocaleString()} ק"מ</span>
              <span>📍 {car.city}</span>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex gap-4 text-xs text-gray-500">
                <span>🏪 {car.dealer?.business_name || "לא צוין"}</span>
                <Badge
                  variant="outline"
                  className={
                    car.is_available ? "text-green-600" : "text-red-600"
                  }
                >
                  {car.is_available ? "זמין" : "לא זמין"}
                </Badge>
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

  // Loading state
  if (loading && cars.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען רכבים...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            שגיאה בטעינת הרכבים
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={fetchCars} variant="outline">
            נסה שוב
          </Button>
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
          שלום {user?.firstName}, נמצאו {pagination.total} רכבים
        </p>
      </div>

      {/* Search and Controls */}
      <div className="space-y-4 mb-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="חפש לפי יצרן, דגם, מיקום או תיאור..."
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
                <Input
                  placeholder="טויוטה, הונדה..."
                  value={filters.make}
                  onChange={(e) => handleFilterChange("make", e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מחיר מינימלי
                </label>
                <Input
                  type="number"
                  placeholder="50000"
                  value={filters.priceFrom}
                  onChange={(e) =>
                    handleFilterChange("priceFrom", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  מחיר מקסימלי
                </label>
                <Input
                  type="number"
                  placeholder="200000"
                  value={filters.priceTo}
                  onChange={(e) =>
                    handleFilterChange("priceTo", e.target.value)
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  עיר
                </label>
                <Input
                  placeholder="תל אביב, חיפה..."
                  value={filters.city}
                  onChange={(e) => handleFilterChange("city", e.target.value)}
                />
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
      {cars.length === 0 ? (
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
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {cars.map((car) =>
              viewMode === "grid" ? (
                <CarCard key={car.id} car={car} />
              ) : (
                <CarListItem key={car.id} car={car} />
              )
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <Button
                variant="outline"
                disabled={pagination.page === 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                }
              >
                הקודם
              </Button>

              <span className="px-4 py-2 text-sm text-gray-600">
                עמוד {pagination.page} מתוך {pagination.totalPages}
              </span>

              <Button
                variant="outline"
                disabled={pagination.page === pagination.totalPages}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                }
              >
                הבא
              </Button>
            </div>
          )}
        </>
      )}

      {/* Loading overlay during API calls */}
      {loading && cars.length > 0 && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">מעדכן...</p>
          </div>
        </div>
      )}
    </div>
  );
}
