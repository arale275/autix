// app-new/(dashboard)/buyer/cars/page.tsx - Cars Listing Page for Buyers
"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Grid3X3,
  List,
  ArrowUpDown,
  Car as CarIcon,
  RefreshCw,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import CarCard from "@/components/cards/CarCard";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useCars } from "@/hooks/api/useCars";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Car, CarsSearchParams } from "@/lib/api/types";

// Filter Options - Moved to top
const MAKES = [
  "טויוטה",
  "הונדה",
  "מזדה",
  "ניסאן",
  "היונדאי",
  "קיא",
  "פורד",
  "שברולט",
  "פולקסווגן",
  "אאודי",
  "במוו",
  "מרצדס",
];

const FUEL_TYPES = [
  { value: "gasoline", label: "בנזין" },
  { value: "diesel", label: "דיזל" },
  { value: "hybrid", label: "היברידי" },
  { value: "electric", label: "חשמלי" },
];

const TRANSMISSION_TYPES = [
  { value: "manual", label: "ידני" },
  { value: "automatic", label: "אוטומטי" },
];

const CITIES = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "ראשון לציון",
  "פתח תקווה",
  "אשדוד",
  "נתניה",
  "באר שבע",
  "בני ברק",
  "רמת גן",
];

const SORT_OPTIONS = [
  { value: "created_at:desc", label: "חדשים ביותר" },
  { value: "price:asc", label: "מחיר: נמוך לגבוה" },
  { value: "price:desc", label: "מחיר: גבוה לנמוך" },
  { value: "year:desc", label: "שנה: חדש לישן" },
  { value: "year:asc", label: "שנה: ישן לחדש" },
  { value: "mileage:asc", label: "קילומטראז': נמוך לגבוה" },
];

export default function BuyerCarsPage() {
  const { user } = useAuth();

  // View and Filter State
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<CarsSearchParams>({
    page: 1,
    limit: 20,
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Filter Form State
  const [filterForm, setFilterForm] = useState({
    make: "",
    priceMin: "",
    priceMax: "",
    yearMin: "",
    yearMax: "",
    fuelType: "",
    transmission: "",
    city: "",
  });

  // Cars Hook
  const {
    cars,
    pagination,
    loading,
    error,
    fetchCars,
    search,
    updateParams,
    clearError,
    currentParams,
  } = useCars({
    initialParams: activeFilters,
    autoFetch: true,
    onError: (error) => {
      toast.error("שגיאה בטעינת הרכבים", {
        description: error,
      });
    },
  });

  // Search Handler
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);
      if (query.trim()) {
        search(query);
      } else {
        fetchCars({ ...activeFilters, search: undefined });
      }
    },
    [search, fetchCars, activeFilters]
  );

  // Filter Form Handler
  const handleFilterFormChange = useCallback((key: string, value: string) => {
    setFilterForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  // Apply Filters
  const applyFilters = useCallback(() => {
    const newFilters: CarsSearchParams = {
      page: 1,
      limit: 20,
      make: filterForm.make || undefined,
      priceFrom: filterForm.priceMin ? Number(filterForm.priceMin) : undefined,
      priceTo: filterForm.priceMax ? Number(filterForm.priceMax) : undefined,
      yearFrom: filterForm.yearMin ? Number(filterForm.yearMin) : undefined,
      yearTo: filterForm.yearMax ? Number(filterForm.yearMax) : undefined,
      fuelType: filterForm.fuelType || undefined,
      transmission: filterForm.transmission || undefined,
      city: filterForm.city || undefined,
    };

    setActiveFilters(newFilters);
    updateParams(newFilters);
    setShowAdvancedFilters(false);
    toast.success("הפילטרים הוחלו בהצלחה");
  }, [filterForm, updateParams]);

  // Clear Filters
  const clearFilters = useCallback(() => {
    const defaultFilters = { page: 1, limit: 20 };
    setActiveFilters(defaultFilters);
    setFilterForm({
      make: "",
      priceMin: "",
      priceMax: "",
      yearMin: "",
      yearMax: "",
      fuelType: "",
      transmission: "",
      city: "",
    });
    setSearchQuery("");
    updateParams(defaultFilters);
    toast.success("הפילטרים נוקו");
  }, [updateParams]);

  // Sort Handler
  const handleSort = useCallback(
    (sortValue: string) => {
      const [sortBy, sortOrder] = sortValue.split(":");
      updateParams({
        sortBy: sortBy as any,
        sortOrder: sortOrder as "asc" | "desc",
        page: 1,
      });
    },
    [updateParams]
  );

  // Pagination
  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({ page });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [updateParams]
  );

  // Contact Handler
  const handleContact = useCallback(
    (car: Car) => {
      if (!user) {
        toast.error("נדרשת התחברות", {
          description: "אנא התחבר כדי ליצור קשר עם המוכר",
        });
        return;
      }
      window.location.href = `/buyer/cars/${car.id}?contact=true`;
    },
    [user]
  );

  // Memoized values
  const activeFilterCount = useMemo(() => {
    return Object.entries(activeFilters).filter(
      ([key, value]) => key !== "page" && key !== "limit" && value !== undefined
    ).length;
  }, [activeFilters]);

  const currentSort = useMemo(() => {
    const sortBy = currentParams.sortBy || "created_at";
    const sortOrder = currentParams.sortOrder || "desc";
    return `${sortBy}:${sortOrder}`;
  }, [currentParams]);

  // Error State
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-2">שגיאה בטעינת הרכבים</div>
            <p className="text-red-500 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                רענן דף
              </Button>
              <Button onClick={clearError}>נסה שוב</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">חיפוש רכבים</h1>
          <p className="text-gray-600 mt-1">
            מצא את הרכב המושלם עבורך מתוך{" "}
            <span className="font-semibold">{pagination.total}</span> רכבים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/buyer/requests/new">
            <Button variant="outline">
              <Heart className="w-4 h-4 mr-2" />
              פרסם בקשה
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="חפש לפי יצרן, דגם, שנה..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Controls Row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Filters and Sort */}
              <div className="flex items-center gap-2">
                {/* Filters Toggle */}
                <Button
                  variant="outline"
                  className="relative"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  פילטרים
                  {activeFilterCount > 0 && (
                    <Badge className="absolute -top-2 -left-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>

                {/* Clear Filters */}
                {activeFilterCount > 0 && (
                  <Button variant="ghost" onClick={clearFilters} size="sm">
                    נקה פילטרים ({activeFilterCount})
                  </Button>
                )}
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-2">
                {/* Sort */}
                <Select value={currentSort} onValueChange={handleSort}>
                  <SelectTrigger className="w-48">
                    <ArrowUpDown className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters Panel */}
      {showAdvancedFilters && (
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Make Filter */}
              <div className="space-y-2">
                <Label>יצרן</Label>
                <Select
                  value={filterForm.make}
                  onValueChange={(value) =>
                    handleFilterFormChange("make", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל היצרנים</SelectItem>
                    {MAKES.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label>מחיר מינימום</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filterForm.priceMin}
                  onChange={(e) =>
                    handleFilterFormChange("priceMin", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>מחיר מקסימום</Label>
                <Input
                  type="number"
                  placeholder="500,000"
                  value={filterForm.priceMax}
                  onChange={(e) =>
                    handleFilterFormChange("priceMax", e.target.value)
                  }
                />
              </div>

              {/* Year Range */}
              <div className="space-y-2">
                <Label>שנה מינימום</Label>
                <Input
                  type="number"
                  placeholder="2010"
                  value={filterForm.yearMin}
                  onChange={(e) =>
                    handleFilterFormChange("yearMin", e.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label>שנה מקסימום</Label>
                <Input
                  type="number"
                  placeholder={new Date().getFullYear().toString()}
                  value={filterForm.yearMax}
                  onChange={(e) =>
                    handleFilterFormChange("yearMax", e.target.value)
                  }
                />
              </div>

              {/* Fuel Type */}
              <div className="space-y-2">
                <Label>סוג דלק</Label>
                <Select
                  value={filterForm.fuelType}
                  onValueChange={(value) =>
                    handleFilterFormChange("fuelType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוג דלק" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל סוגי הדלק</SelectItem>
                    {FUEL_TYPES.map((fuel) => (
                      <SelectItem key={fuel.value} value={fuel.value}>
                        {fuel.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Transmission */}
              <div className="space-y-2">
                <Label>תיבת הילוכים</Label>
                <Select
                  value={filterForm.transmission}
                  onValueChange={(value) =>
                    handleFilterFormChange("transmission", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תיבת הילוכים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל סוגי התיבות</SelectItem>
                    {TRANSMISSION_TYPES.map((transmission) => (
                      <SelectItem
                        key={transmission.value}
                        value={transmission.value}
                      >
                        {transmission.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City */}
              <div className="space-y-2">
                <Label>עיר</Label>
                <Select
                  value={filterForm.city}
                  onValueChange={(value) =>
                    handleFilterFormChange("city", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר עיר" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל הערים</SelectItem>
                    {CITIES.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Actions */}
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={clearFilters}>
                נקה הכל
              </Button>
              <Button onClick={applyFilters}>החל פילטרים</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">פילטרים פעילים:</span>
          {activeFilters.make && (
            <Badge variant="secondary">יצרן: {activeFilters.make}</Badge>
          )}
          {activeFilters.priceFrom && (
            <Badge variant="secondary">
              מחיר מ: ₪{activeFilters.priceFrom.toLocaleString()}
            </Badge>
          )}
          {activeFilters.priceTo && (
            <Badge variant="secondary">
              מחיר עד: ₪{activeFilters.priceTo.toLocaleString()}
            </Badge>
          )}
          {activeFilters.yearFrom && (
            <Badge variant="secondary">שנה מ: {activeFilters.yearFrom}</Badge>
          )}
          {activeFilters.yearTo && (
            <Badge variant="secondary">שנה עד: {activeFilters.yearTo}</Badge>
          )}
          {activeFilters.fuelType && (
            <Badge variant="secondary">
              דלק:{" "}
              {
                FUEL_TYPES.find((f) => f.value === activeFilters.fuelType)
                  ?.label
              }
            </Badge>
          )}
          {activeFilters.transmission && (
            <Badge variant="secondary">
              תיבה:{" "}
              {
                TRANSMISSION_TYPES.find(
                  (t) => t.value === activeFilters.transmission
                )?.label
              }
            </Badge>
          )}
          {activeFilters.city && (
            <Badge variant="secondary">עיר: {activeFilters.city}</Badge>
          )}
        </div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          מציג {cars.length} מתוך {pagination.total} רכבים
          {pagination.totalPages > 1 && (
            <span>
              {" "}
              (עמוד {pagination.page} מתוך {pagination.totalPages})
            </span>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <LoadingSpinner size="sm" />
            טוען...
          </div>
        )}
      </div>

      {/* Cars Grid/List */}
      {loading && cars.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : cars.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              לא נמצאו רכבים
            </h3>
            <p className="text-gray-600 mb-4">
              נסה לשנות את הפילטרים או את מילות החיפוש
            </p>
            <Button onClick={clearFilters} variant="outline">
              נקה פילטרים
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-4"
          )}
        >
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              viewMode={viewMode}
              onContact={handleContact}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                עמוד {pagination.page} מתוך {pagination.totalPages}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronRight className="w-4 h-4" />
                  הקודם
                </Button>

                {/* Page Numbers */}
                <div className="flex gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNum = Math.max(1, pagination.page - 2) + i;
                      if (pageNum > pagination.totalPages) return null;

                      return (
                        <Button
                          key={pageNum}
                          variant={
                            pageNum === pagination.page ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  ).filter(Boolean)}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  הבא
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
