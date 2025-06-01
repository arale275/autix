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
  Loader2,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { storage, useClientStorage, STORAGE_KEYS } from "@/lib/localStorage";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

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
  const { user, isAuthenticated, isLoading } = useAuth();

  // ✅ השתמש ב-useClientStorage hook החדש
  const { isClient } = useClientStorage();

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

  // ✅ בדיקת client-side - מונע SSR issues (מעודכן)
  useEffect(() => {
    if (!isClient) return;

    console.log("🔍 BuyerCarsPage Debug:", {
      isAuthenticated,
      isLoading,
      user: user ? `${user.firstName} ${user.lastName}` : null,
      userType: user?.userType,
      localStorage_token: storage.getValidToken()
        ? "exists and valid"
        : "missing or invalid",
    });
  }, [isClient, isAuthenticated, isLoading, user]);

  // ✅ בדיקת authentication נכונה (מהפרופיל)
  useEffect(() => {
    if (!isClient) return;

    console.log("🔍 Auth check:", { isLoading, isAuthenticated });

    // חכה שהאימות יסתיים
    if (isLoading) return;

    // אם לא מחובר - הפנה להתחברות
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // בדיקת סוג משתמש
    if (user?.userType !== "buyer") {
      console.log("❌ Not a buyer, redirecting");
      router.push("/dealer/home");
      return;
    }

    console.log("✅ Authentication OK, loading cars");
  }, [isClient, isLoading, isAuthenticated, user, router]);

  // ✅ Fetch cars from API - עם localStorage מתוקן
  const fetchCars = async () => {
    if (!isClient || isLoading || !isAuthenticated || !user) {
      return; // עדיין ממתין או לא מחובר
    }

    setLoading(true);
    setError(null);

    try {
      // Build query params
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add search
      if (searchTerm.trim()) {
        params.append("search", searchTerm.trim());
      }

      // Add filters - רק אם יש ערך אמיתי
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.toString().trim()) {
          params.append(key, value.toString().trim());
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

      console.log("🔗 API URL:", API_URL);
      console.log("📝 Query params:", params.toString());

      // ✅ השתמש בפונקציה החדשה לקבלת טוקן תקף
      const token = storage.getValidToken();

      if (!token) {
        console.log("❌ No valid token found or token expired");
        setError("תם תוקף ההתחברות. אנא התחבר שוב.");
        setTimeout(() => router.push("/auth/login"), 2000);
        return;
      }

      console.log("🔑 Using valid token:", token.substring(0, 20) + "...");

      const response = await fetch(`${API_URL}/api/cars?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        // ✅ טיפול מפורט בסטטוס codes
        if (response.status === 401) {
          console.log("❌ 401 Unauthorized - token invalid");
          storage.clearAuth();
          setError("תם תוקף ההתחברות. אנא התחבר שוב.");
          setTimeout(() => router.push("/auth/login"), 2000);
          return;
        } else if (response.status === 403) {
          setError("אין לך הרשאה לצפות ברכבים");
          return;
        } else if (response.status >= 500) {
          setError("שגיאת שרת. אנא נסה שוב מאוחר יותר.");
          return;
        }

        const errorText = await response.text().catch(() => "שגיאה לא ידועה");
        throw new Error(`שגיאת שרת (${response.status}): ${errorText}`);
      }

      const data: ApiResponse = await response.json();
      console.log("✅ API Response:", data);

      if (data.success && data.data) {
        setCars(data.data.cars || []);
        setPagination((prev) => ({
          ...prev,
          total: data.data.pagination?.total || 0,
          totalPages: data.data.pagination?.totalPages || 1,
        }));
        console.log(`📊 Loaded ${data.data.cars?.length || 0} cars`);
      } else {
        throw new Error(data.message || "לא ניתן לטעון את הרכבים");
      }
    } catch (error) {
      console.error("💥 Error fetching cars:", error);

      // ✅ טיפול מפורט בסוגי שגיאות (מהפרופיל)
      if (error instanceof TypeError && error.message.includes("fetch")) {
        setError(
          "בעיית חיבור לשרת. אנא בדוק את החיבור לאינטרנט או נסה שוב מאוחר יותר."
        );
      } else if (error instanceof Error) {
        // בדיקה אם השגיאה קשורה ל-localStorage
        if (
          error.message.includes("localStorage") ||
          error.message.includes("storage")
        ) {
          setError("בעיה במידע שמור במחשב. אנא התחבר שוב.");
          storage.clearAuth();
          setTimeout(() => router.push("/auth/login"), 2000);
        } else if (error.message.includes("401")) {
          setError("תם תוקף ההתחברות. אנא התחבר שוב.");
          storage.clearAuth();
          setTimeout(() => router.push("/auth/login"), 2000);
        } else {
          setError(error.message);
        }
      } else {
        setError("שגיאה לא ידועה בטעינת הרכבים");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load cars on mount and when filters change (רק אחרי authentication)
  useEffect(() => {
    if (!isClient || isLoading || !isAuthenticated || !user) {
      return; // עדיין ממתין או לא מחובר
    }

    // Debounce לחיפוש
    const timeoutId = setTimeout(
      () => {
        fetchCars();
      },
      searchTerm ? 500 : 0
    ); // חיכוי של חצי שנייה לחיפוש, מיידי לשאר

    return () => clearTimeout(timeoutId);
  }, [
    isClient,
    isLoading,
    isAuthenticated,
    user,
    pagination.page,
    searchTerm,
    filters,
    sortBy,
  ]);

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

  // ✅ Safe date handling
  const getTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) return "אתמול";
      if (diffDays < 7) return `לפני ${diffDays} ימים`;
      if (diffDays < 30) return `לפני ${Math.ceil(diffDays / 7)} שבועות`;
      return `לפני ${Math.ceil(diffDays / 30)} חודשים`;
    } catch (error) {
      return "לא ידוע";
    }
  };

  // ✅ Safe number formatting
  const formatPrice = (price: number) => {
    if (!price || isNaN(price)) return "לא צוין";
    return `₪${price.toLocaleString("he-IL")}`;
  };

  const formatMileage = (mileage: number) => {
    if (!mileage || isNaN(mileage)) return "לא צוין";
    return `${mileage.toLocaleString("he-IL")} ק"מ`;
  };

  // ✅ Save car function משופר (משתמש בקובץ החדש)
  const handleSaveCar = (carId: number) => {
    if (!isClient) return;

    const success = storage.addSavedCar(carId);
    if (success) {
      console.log(`💾 Car ${carId} saved successfully`);
      // יכול להוסיף toast notification כאן
    }
  };

  // ✅ בדיקה האם רכב שמור (משתמש בקובץ החדש)
  const isCarSaved = (carId: number): boolean => {
    if (!isClient) return false;
    return storage.isCarSaved(carId);
  };

  // ✅ קבלת רכבים שמורים (משתמש בקובץ החדש)
  const getSavedCars = (): number[] => {
    if (!isClient) return [];
    return storage.getSavedCars();
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
            {formatPrice(car.price)}
          </span>
        </div>

        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p>
            🔧 {car.engine_size || "לא צוין"} ליטר,{" "}
            {car.transmission || "לא צוין"}
          </p>
          <p>
            ⛽ {car.fuel_type || "לא צוין"} | 🎨 {car.color || "לא צוין"}
          </p>
          <p>📊 {formatMileage(car.mileage)}</p>
          <p>
            📍 {car.city || "לא צוין"} | 🏪{" "}
            {car.dealer?.business_name || "לא צוין"}
          </p>
        </div>

        {car.description && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">
            {car.description}
          </p>
        )}

        <div className="flex gap-2">
          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
            <Eye className="w-4 h-4 ml-1" />
            צפה בפרטים
          </Button>
          <Button
            variant={isCarSaved(car.id) ? "default" : "outline"}
            size="sm"
            onClick={(e) => {
              e.stopPropagation(); // מונע פתיחת הדף
              handleSaveCar(car.id);
            }}
            className={
              isCarSaved(car.id) ? "bg-green-600 hover:bg-green-700" : ""
            }
          >
            {isCarSaved(car.id) ? "💚" : "💾"}
          </Button>
        </div>
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
                {formatPrice(car.price)}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-2">
              <span>
                🔧 {car.engine_size || "?"} {car.transmission || "לא צוין"}
              </span>
              <span>⛽ {car.fuel_type || "לא צוין"}</span>
              <span>📊 {formatMileage(car.mileage)}</span>
              <span>📍 {car.city || "לא צוין"}</span>
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

              <div className="flex gap-2">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Eye className="w-4 h-4 ml-1" />
                  צפה בפרטים
                </Button>
                <Button
                  variant={isCarSaved(car.id) ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSaveCar(car.id);
                  }}
                  className={
                    isCarSaved(car.id) ? "bg-green-600 hover:bg-green-700" : ""
                  }
                >
                  {isCarSaved(car.id) ? "💚" : "💾"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // ✅ SSR Safe - לא מרנדר עד שהclient מוכן (מהפרופיל)
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // ✅ Loading state מסודר (מהפרופיל)
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">בודק אימות...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state (מהפרופיל)
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            שגיאה בטעינת הרכבים
          </h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <div className="space-y-2">
            <Button onClick={fetchCars} variant="outline" className="w-full">
              נסה שוב
            </Button>
            <Button onClick={clearFilters} variant="ghost" size="sm">
              נקה מסננים
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ רק אחרי שהאימות הסתיים (מהפרופיל)
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            נדרשת התחברות
          </h1>
          <p className="text-gray-600 mb-4">אנא התחבר כדי לראות את הרכבים</p>
          <Button onClick={() => router.push("/auth/login")}>התחבר</Button>
        </div>
      </div>
    );
  }

  // ✅ Loading של נתונים (אחרי אימות מוצלח)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען רכבים...</p>
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
          שלום {user?.firstName || user?.email?.split("@")[0] || "אורח"}, נמצאו{" "}
          {pagination.total} רכבים
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
