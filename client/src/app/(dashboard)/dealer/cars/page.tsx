// app-new/(dashboard)/dealer/cars/page.tsx - Cars Management Page for Dealers
"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  ArrowUpDown,
  RefreshCw,
  Car as CarIcon,
  AlertTriangle,
  MoreVertical,
  DollarSign,
  Calendar,
  Settings,
  TrendingUp,
  Users,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CarCard from "@/components/cards/CarCard";
import { useDealerCars } from "@/hooks/api/useCars";
import { useAuth } from "@/contexts/AuthContext";
import {
  CAR_MANUFACTURERS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  ISRAELI_CITIES,
} from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/api/types";

// Filter Options - תוקן לחלוטין
const STATUS_OPTIONS = [
  { value: "all", label: "כל הסטטוסים" },
  { value: "active", label: "פעיל" },
  { value: "sold", label: "נמכר" },
  { value: "deleted", label: "נמחק" },
];

const AVAILABILITY_OPTIONS = [
  { value: "all", label: "הכל" },
  { value: "available", label: "זמין" },
  { value: "unavailable", label: "לא זמין" },
];

const SORT_OPTIONS = [
  { value: "created_at:desc", label: "חדשים ביותר" },
  { value: "created_at:asc", label: "ישנים ביותר" },
  { value: "price:asc", label: "מחיר: נמוך לגבוה" },
  { value: "price:desc", label: "מחיר: גבוה לנמוך" },
  { value: "year:desc", label: "שנה: חדש לישן" },
  { value: "year:asc", label: "שנה: ישן לחדש" },
];

// Format Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL").format(price) + "₪";
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "sold":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "deleted":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "active":
      return "פעיל";
    case "sold":
      return "נמכר";
    case "deleted":
      return "נמחק";
    default:
      return "לא ידוע";
  }
};

// Enhanced Car Card for Dealer
interface DealerCarCardProps {
  car: Car;
  viewMode: "grid" | "list";
  onEdit: (car: Car) => void;
  onDelete: (id: number) => void;
  onMarkSold: (id: number) => void;
  onToggleAvailability: (id: number, available: boolean) => void;
  actionLoading: boolean;
}

function DealerCarCard({
  car,
  viewMode,
  onEdit,
  onDelete,
  onMarkSold,
  onToggleAvailability,
  actionLoading,
}: DealerCarCardProps) {
  return (
    <Link href={`/dealer/cars/${car.id}`} className="block">
      <div className="relative">
        <CarCard
          car={car}
          viewMode={viewMode}
          showActions={false}
          showContactButton={false}
          showFavoriteButton={false}
          className={cn(
            "transition-all duration-200",
            !car.isAvailable && "opacity-75",
            car.status === "sold" && "ring-2 ring-purple-200"
          )}
        />

        {/* Dealer Actions Overlay */}
        <div className="absolute top-2 left-2 flex gap-1">
          <Badge className={getStatusColor(car.status)}>
            {getStatusLabel(car.status)}
          </Badge>
          {car.isFeatured && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              מומלץ
            </Badge>
          )}
        </div>

        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                disabled={actionLoading}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(car);
                }}
              >
                <Edit className="w-4 h-4 mr-2" />
                עריכה
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleAvailability(car.id, !car.isAvailable);
                }}
              >
                {car.isAvailable ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    הסתר
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    הצג
                  </>
                )}
              </DropdownMenuItem>

              {car.status === "active" && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onMarkSold(car.id);
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  סמן כנמכר
                </DropdownMenuItem>
              )}

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (
                    window.confirm(
                      "האם אתה בטוח שברצונך למחוק את הרכב? פעולה זו לא ניתנת לביטול."
                    )
                  ) {
                    onDelete(car.id);
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                מחיקה
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom Info Bar */}
        <div className="absolute bottom-2 left-2 right-2">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-xs">
            <div className="flex items-center justify-between">
              <span>נוסף ב-{formatDate(car.createdAt)}</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-blue-600">
                  <Eye className="w-3 h-3" />0 צפיות
                </span>
                <span className="flex items-center gap-1 text-purple-600">
                  <Users className="w-3 h-3" />0 פניות
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DealerCarsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State - תוקן להשתמש ב-"all" במקום ערכים ריקים
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMake, setFilterMake] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("created_at:desc");

  // Cars Hook
  const {
    cars,
    loading,
    error,
    actionLoading,
    refetch,
    updateCar,
    deleteCar,
    markAsSold,
    toggleAvailability,
  } = useDealerCars();

  // Filtered and sorted cars - תוקן הסינון
  const filteredCars = useMemo(() => {
    let filtered = cars;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.description?.toLowerCase().includes(query)
      );
    }

    // Filter by make
    if (filterMake && filterMake !== "all") {
      filtered = filtered.filter((car) => car.make === filterMake);
    }

    // Filter by status
    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((car) => car.status === filterStatus);
    }

    // Filter by availability
    if (filterAvailability && filterAvailability !== "all") {
      if (filterAvailability === "available") {
        filtered = filtered.filter((car) => car.isAvailable);
      } else if (filterAvailability === "unavailable") {
        filtered = filtered.filter((car) => !car.isAvailable);
      }
    }

    // Sort
    const [sortField, sortOrder] = sortBy.split(":");
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

    return filtered;
  }, [cars, searchQuery, filterMake, filterStatus, filterAvailability, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = cars.length;
    const active = cars.filter((c) => c.status === "active").length;
    const sold = cars.filter((c) => c.status === "sold").length;
    const available = cars.filter((c) => c.isAvailable).length;
    const totalValue = cars
      .filter((c) => c.status === "active" && c.isAvailable)
      .reduce((sum, car) => sum + car.price, 0);

    return { total, active, sold, available, totalValue };
  }, [cars]);

  // Actions
  const handleEdit = useCallback(
    (car: Car) => {
      router.push(`/dealer/cars/${car.id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      const success = await deleteCar(id);
      if (success) {
        toast.success("הרכב נמחק בהצלחה");
      }
    },
    [deleteCar]
  );

  const handleMarkSold = useCallback(
    async (id: number) => {
      const success = await markAsSold(id);
      if (success) {
        toast.success("הרכב סומן כנמכר");
      }
    },
    [markAsSold]
  );

  const handleToggleAvailability = useCallback(
    async (id: number, available: boolean) => {
      const success = await toggleAvailability(id, available);
      if (success) {
        toast.success(available ? "הרכב הוצג למכירה" : "הרכב הוסתר מהמכירה");
      }
    },
    [toggleAvailability]
  );

  const clearFilters = () => {
    setSearchQuery("");
    setFilterMake("all");
    setFilterStatus("all");
    setFilterAvailability("all");
    setSortBy("created_at:desc");
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              שגיאה בטעינת הרכבים
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                רענן דף
              </Button>
              <Button onClick={() => refetch()}>נסה שוב</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">המלאי שלי</h1>
          <p className="text-gray-600 mt-1">
            נהל את רכבי החברה שלך ועקוב אחר הביצועים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            רענן
          </Button>
          <Link href="/dealer/cars/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              הוסף רכב
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סך הכל</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <CarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">פעילים</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">נמכרו</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.sold}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">זמינים</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.available}
                </p>
              </div>
              <Eye className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">ערך מלאי</p>
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(stats.totalValue)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="חפש לפי יצרן, דגם או תיאור..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Filters */}
              <div className="flex flex-wrap gap-2 flex-1">
                <Select value={filterMake} onValueChange={setFilterMake}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל היצרנים</SelectItem>
                    {CAR_MANUFACTURERS.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="סטטוס" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filterAvailability}
                  onValueChange={setFilterAvailability}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="זמינות" />
                  </SelectTrigger>
                  <SelectContent>
                    {AVAILABILITY_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {(searchQuery ||
                  filterMake !== "all" ||
                  filterStatus !== "all" ||
                  filterAvailability !== "all") && (
                  <Button variant="ghost" onClick={clearFilters} size="sm">
                    נקה פילטרים
                  </Button>
                )}
              </div>

              {/* Sort and View Controls */}
              <div className="flex items-center gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
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

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          מציג {filteredCars.length} מתוך {cars.length} רכבים
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
      ) : filteredCars.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {cars.length === 0 ? "אין רכבים במלאי" : "לא נמצאו תוצאות"}
            </h3>
            <p className="text-gray-600 mb-4">
              {cars.length === 0
                ? "התחל בפרסום הרכב הראשון שלך"
                : "נסה לשנות את הפילטרים או מילות החיפוש"}
            </p>
            <Link href="/dealer/cars/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {cars.length === 0 ? "פרסם רכב ראשון" : "הוסף רכב חדש"}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          )}
        >
          {filteredCars.map((car) => (
            <DealerCarCard
              key={car.id}
              car={car}
              viewMode={viewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkSold={handleMarkSold}
              onToggleAvailability={handleToggleAvailability}
              actionLoading={actionLoading[car.id] || false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
