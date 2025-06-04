// app/(dashboard)/dealer/cars/page.tsx - Enhanced Cars Management Page for Dealers
"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
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
  Calendar,
  TrendingUp,
  Users,
  ChevronLeft,
  Clock,
  Image as ImageIcon,
  X,
  Zap,
  Star,
  Filter as FilterIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CarCard from "@/components/cards/CarCard";
import { useDealerCars } from "@/hooks/api/useCars";
import { useAuth } from "@/contexts/AuthContext";
import { CAR_MANUFACTURERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/api/types";

// Enhanced Filter Options
const STATUS_OPTIONS = [
  { value: "all", label: "כל הסטטוסים", color: "gray" },
  { value: "active", label: "פעיל", color: "green" },
  { value: "sold", label: "נמכר", color: "purple" },
  { value: "deleted", label: "נמחק", color: "red" },
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
  const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
  const color = statusOption?.color || "gray";
  return `bg-${color}-100 text-${color}-800 border-${color}-200`;
};

const getStatusLabel = (status: string): string => {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label || "לא ידוע";
};

// Enhanced Statistics Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  progress?: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  progress,
}: StatCardProps) {
  return (
    <Card className="transition-colors duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            </div>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {progress !== undefined && (
              <Progress value={progress} className="h-1 mt-2" />
            )}
          </div>
          <div
            className={cn(
              `p-3 rounded-full bg-${color}-100`,
              "flex items-center justify-center"
            )}
          >
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Enhanced Car Card for Dealer
interface DealerCarCardProps {
  car: Car;
  onEdit: (car: Car) => void;
  onDelete: (id: number) => void;
  onMarkSold: (id: number) => void;
  onToggleAvailability: (id: number, available: boolean) => void;
  actionLoading: boolean;
}

function DealerCarCard({
  car,
  onEdit,
  onDelete,
  onMarkSold,
  onToggleAvailability,
  actionLoading,
}: DealerCarCardProps) {
  const hasImages = car.images && car.images.length > 0;
  const daysOnMarket = Math.floor(
    (Date.now() - new Date(car.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Simple card for grid view only
  return (
    <Link href={`/dealer/cars/${car.id}`} className="block">
      <div className="relative overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
        {/* Use the original CarCard component */}
        <CarCard
          car={car}
          viewMode="grid"
          showActions={false}
          showContactButton={false}
          showFavoriteButton={false}
          className={cn(
            "border transition-all duration-300",
            !car.isAvailable && "opacity-75",
            car.status === "sold" && "ring-2 ring-purple-200",
            car.status === "deleted" && "ring-2 ring-red-200"
          )}
        />

        {/* Status Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          <Badge className={getStatusColor(car.status)}>
            {getStatusLabel(car.status)}
          </Badge>
          {car.isFeatured && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Star className="w-3 h-3 mr-1" />
              מומלץ
            </Badge>
          )}
          {!hasImages && (
            <Badge className="bg-orange-100 text-orange-800 border-orange-200">
              <ImageIcon className="w-3 h-3 mr-1" />
              ללא תמונות
            </Badge>
          )}
          {daysOnMarket > 30 && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Clock className="w-3 h-3 mr-1" />
              מלאי ישן
            </Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function DealerCarsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State - Simplified
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

  // Filtered and sorted cars - Simplified
  const filteredCars = useMemo(() => {
    let filtered = cars;

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
  }, [cars, filterMake, filterStatus, filterAvailability, sortBy]);

  // Enhanced Statistics
  const stats = useMemo(() => {
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
      if (
        window.confirm(
          "האם אתה בטוח שברצונך למחוק את הרכב? פעולה זו לא ניתנת לביטול."
        )
      ) {
        const success = await deleteCar(id);
        if (success) {
          toast.success("הרכב נמחק בהצלחה");
        }
      }
    },
    [deleteCar]
  );

  const handleMarkSold = useCallback(
    async (id: number) => {
      if (window.confirm("האם אתה בטוח שברצונך לסמן את הרכב כנמכר?")) {
        const success = await markAsSold(id);
        if (success) {
          toast.success("הרכב סומן כנמכר");
        }
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

  const clearAllFilters = () => {
    setFilterMake("all");
    setFilterStatus("all");
    setFilterAvailability("all");
    setSortBy("created_at:desc");
  };

  // Quick filter for status - removed click functionality
  const handleStatClick = (filterType: string) => {
    // Removed functionality
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
      {/* Enhanced Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Link href="/dealer/home" className="hover:text-blue-600">
          לוח בקרה
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900 font-medium">הרכבים שלי</span>
      </nav>

      {/* Enhanced Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CarIcon className="w-8 h-8 text-blue-600" />
            הרכבים שלי
          </h1>
          <p className="text-gray-600 mt-1">
            נהל את הרכבים שלך ומכור אותם ביעילות
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dealer/cars/new">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              <Plus className="w-5 h-5 mr-3" />
              הוסף רכב
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="סך הכל"
          value={stats.total}
          icon={CarIcon}
          color="blue"
          subtitle="כל הרכבים"
        />
        <StatCard
          title="פעילים"
          value={stats.active}
          icon={CheckCircle}
          color="green"
          progress={stats.availableProgress}
        />
        <StatCard
          title="נמכרו"
          value={stats.sold}
          icon={TrendingUp}
          color="purple"
          progress={stats.soldProgress}
        />
        <StatCard
          title="זמינים"
          value={stats.available}
          icon={Eye}
          color="blue"
        />
        <StatCard
          title="ללא תמונות"
          value={stats.withoutImages}
          icon={ImageIcon}
          color="orange"
          subtitle="זקוק לתמונות"
        />
      </div>

      {/* Enhanced Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Main Filters Row */}
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Basic Filters */}
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

                {/* Clear Filters Button */}
                {(filterMake !== "all" ||
                  filterStatus !== "all" ||
                  filterAvailability !== "all") && (
                  <Button variant="ghost" onClick={clearAllFilters} size="sm">
                    <X className="w-4 h-4 mr-2" />
                    נקה הכל
                  </Button>
                )}
              </div>

              {/* Sort Controls */}
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
              </div>
            </div>

            {/* Advanced Filters - Hidden */}
            {false && <div>Advanced filters removed</div>}
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar - Removed */}
      {false && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-800">נבחרו</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary - Simplified */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {/* Empty for now */}
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LoadingSpinner size="sm" />
              טוען...
            </div>
          )}
        </div>
      </div>

      {/* Cars Grid Display */}
      {loading && cars.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredCars.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <CarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {cars.length === 0 ? "אין רכבים במלאי" : "לא נמצאו תוצאות"}
              </h3>
              <p className="text-gray-600 mb-6">
                {cars.length === 0
                  ? "התחל בפרסום הרכב הראשון שלך והתחל למכור היום"
                  : "נסה לשנות את הפילטרים כדי למצוא את מה שאתה מחפש"}
              </p>
              <div className="flex gap-2 justify-center">
                {cars.length > 0 && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    <FilterIcon className="w-4 h-4 mr-2" />
                    נקה פילטרים
                  </Button>
                )}
                <Link href="/dealer/cars/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {cars.length === 0 ? "פרסם רכב ראשון" : "הוסף רכב חדש"}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <DealerCarCard
              key={car.id}
              car={car}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkSold={handleMarkSold}
              onToggleAvailability={handleToggleAvailability}
              actionLoading={actionLoading[car.id] || false}
            />
          ))}
        </div>
      )}

      {/* Performance Tips Card */}
      {cars.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              💡 טיפים לשיפור ביצועים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">
                    הוסף תמונות איכותיות
                  </div>
                  <div className="text-blue-600">
                    רכבים עם תמונות מקבלים פי 3 יותר פניות
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 text-green-600 mt-0.5">₪</div>
                <div>
                  <div className="font-medium text-green-800">תמחר נכון</div>
                  <div className="text-green-600">
                    השווה מחירים בשוק לתוצאות טובות יותר
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-purple-600 mt-0.5" />
                <div>
                  <div className="font-medium text-purple-800">
                    הגב מהר לפניות
                  </div>
                  <div className="text-purple-600">
                    תגובה תוך שעה מגדילה מכירות ב-50%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-800">
                    עדכן באופן קבוע
                  </div>
                  <div className="text-orange-600">
                    רכבים מעודכנים מופיעים גבוה יותר בחיפוש
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
