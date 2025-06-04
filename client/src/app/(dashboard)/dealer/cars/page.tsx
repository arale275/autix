// app/(dashboard)/dealer/cars/page.tsx - Enhanced Cars Management Page for Dealers
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
  ChevronLeft,
  Clock,
  Target,
  Image as ImageIcon,
  MapPin,
  Fuel,
  Gauge,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Zap,
  Star,
  ExternalLink,
  Share2,
  Download,
  Save,
  Table,
  BarChart3,
  Activity,
  Bookmark,
  Filter as FilterIcon,
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
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
  { value: "created_at:desc", label: "חדשים ביותר", icon: Clock },
  { value: "created_at:asc", label: "ישנים ביותר", icon: Clock },
  { value: "price:asc", label: "מחיר: נמוך לגבוה", icon: DollarSign },
  { value: "price:desc", label: "מחיר: גבוה לנמוך", icon: DollarSign },
  { value: "year:desc", label: "שנה: חדש לישן", icon: Calendar },
  { value: "year:asc", label: "שנה: ישן לחדש", icon: Calendar },
];

const VIEW_MODES = [
  { value: "grid", label: "רשת", icon: Grid3X3 },
  { value: "list", label: "רשימה", icon: List },
  { value: "table", label: "טבלה", icon: Table },
  { value: "compact", label: "קומפקטי", icon: BarChart3 },
];

const QUICK_FILTERS = [
  { id: "available", label: "זמינים", color: "green" },
  { id: "no-images", label: "ללא תמונות", color: "orange" },
  { id: "new-this-week", label: "חדשים השבוע", color: "blue" },
  { id: "high-priced", label: "מחיר גבוה", color: "purple" },
  { id: "old-inventory", label: "מלאי ישן", color: "yellow" },
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

const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';
};

const getStatusColor = (status: string): string => {
  const statusOption = STATUS_OPTIONS.find((opt) => opt.value === status);
  const color = statusOption?.color || "gray";
  return `bg-${color}-100 text-${color}-800 border-${color}-200`;
};

const getStatusLabel = (status: string): string => {
  return STATUS_OPTIONS.find((opt) => opt.value === status)?.label || "לא ידוע";
};

const getCarAge = (year: number): string => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age === 0) return "חדש";
  if (age === 1) return "שנה";
  return `${age} שנים`;
};

// Enhanced Statistics Card Component
interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
  subtitle?: string;
  onClick?: () => void;
  progress?: number;
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  onClick,
  progress,
}: StatCardProps) {
  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md cursor-pointer group",
        onClick && "hover:scale-105"
      )}
      onClick={onClick}
    >
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
              `p-3 rounded-full bg-${color}-100 group-hover:bg-${color}-200 transition-colors`,
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
  viewMode: string;
  isSelected: boolean;
  onSelect: (id: number) => void;
  onEdit: (car: Car) => void;
  onDelete: (id: number) => void;
  onMarkSold: (id: number) => void;
  onToggleAvailability: (id: number, available: boolean) => void;
  actionLoading: boolean;
}

function DealerCarCard({
  car,
  viewMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onMarkSold,
  onToggleAvailability,
  actionLoading,
}: DealerCarCardProps) {
  const mainImage =
    Array.isArray(car.images) && car.images.length > 0
      ? typeof car.images[0] === "string"
        ? car.images[0]
        : car.images[0].image_url
      : null;

  const hasImages = car.images && car.images.length > 0;
  const imageCount = car.images?.length || 0;
  const daysOnMarket = Math.floor(
    (Date.now() - new Date(car.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (viewMode === "table") {
    return (
      <tr
        className={cn(
          "border-b hover:bg-gray-50 transition-colors",
          isSelected && "bg-blue-50",
          !car.isAvailable && "opacity-75",
          car.status === "sold" && "bg-purple-50"
        )}
      >
        <td className="p-4">
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(car.id)}
          />
        </td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            {mainImage ? (
              <img
                src={mainImage}
                alt={`${car.make} ${car.model}`}
                className="w-12 h-12 object-cover rounded-lg"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                <CarIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div>
              <Link
                href={`/dealer/cars/${car.id}`}
                className="font-semibold hover:text-blue-600"
              >
                {car.make} {car.model} {car.year}
              </Link>
              <div className="text-sm text-gray-500">
                {car.city && <span>{car.city}</span>}
                {car.city && imageCount > 0 && <span> • </span>}
                {imageCount > 0 && <span>{imageCount} תמונות</span>}
              </div>
            </div>
          </div>
        </td>
        <td className="p-4 font-semibold">{formatPrice(car.price)}</td>
        <td className="p-4">
          <div className="flex gap-1">
            <Badge className={getStatusColor(car.status)}>
              {getStatusLabel(car.status)}
            </Badge>
            {car.isAvailable ? (
              <Badge className="bg-green-100 text-green-800">זמין</Badge>
            ) : (
              <Badge className="bg-gray-100 text-gray-800">מוסתר</Badge>
            )}
          </div>
        </td>
        <td className="p-4 text-sm text-gray-600">
          {formatDate(car.createdAt)}
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">{daysOnMarket} ימים</span>
            {imageCount > 0 && (
              <span className="flex items-center gap-1 text-blue-600">
                <ImageIcon className="w-3 h-3" />
                {imageCount}
              </span>
            )}
          </div>
        </td>
        <td className="p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" disabled={actionLoading}>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(car)}>
                <Edit className="w-4 h-4 mr-2" />
                עריכה
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onToggleAvailability(car.id, !car.isAvailable)}
              >
                {car.isAvailable ? (
                  <EyeOff className="w-4 h-4 mr-2" />
                ) : (
                  <Eye className="w-4 h-4 mr-2" />
                )}
                {car.isAvailable ? "הסתר" : "הצג"}
              </DropdownMenuItem>
              {car.status === "active" && (
                <DropdownMenuItem onClick={() => onMarkSold(car.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  סמן כנמכר
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(car.id)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                מחיקה
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </td>
      </tr>
    );
  }

  return (
    <div className="relative group">
      {/* Selection Checkbox */}
      <div className="absolute top-2 right-2 z-10 transition-transform duration-200 group-hover:scale-105">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(car.id)}
          className="bg-white/90 border-gray-300"
        />
      </div>

      <Link href={`/dealer/cars/${car.id}`} className="block">
        <div className="relative overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl">
          <CarCard
            car={car}
            viewMode={viewMode as "grid" | "list"}
            showActions={false}
            showContactButton={false}
            showFavoriteButton={false}
            className={cn(
              "border transition-all duration-300",
              isSelected && "ring-2 ring-blue-500 ring-offset-2",
              !car.isAvailable && "opacity-75",
              car.status === "sold" && "ring-2 ring-purple-200",
              car.status === "deleted" && "ring-2 ring-red-200"
            )}
          />

          {/* Enhanced Status Badges - נעים עם הקארד */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 transition-transform duration-300 group-hover:scale-105">
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

          {/* Interactive Availability Toggle - נעים עם הקארד */}
          {car.status === "active" && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 transition-transform duration-300 group-hover:scale-105">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onToggleAvailability(car.id, !car.isAvailable);
                }}
                disabled={actionLoading}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full border transition-all duration-200",
                  "hover:shadow-md backdrop-blur-sm",
                  car.isAvailable
                    ? "bg-green-100/90 text-green-800 border-green-200 hover:bg-green-200"
                    : "bg-gray-100/90 text-gray-800 border-gray-200 hover:bg-gray-200",
                  actionLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {car.isAvailable ? "פעיל" : "מוסתר"}
              </button>
            </div>
          )}

          {/* Quick Actions on Hover - נעים עם הקארד */}
          <div className="absolute top-2 right-10 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEdit(car);
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                // Share functionality
              }}
            >
              <Share2 className="h-3 w-3" />
            </Button>
          </div>

          {/* Enhanced Bottom Info Bar - נעים עם הקארד */}
          <div className="absolute bottom-2 left-2 right-2 transition-transform duration-300 group-hover:scale-105">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-2 text-xs border border-white/20 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">
                    {car.make} {car.model} {car.year}
                  </span>
                  {car.city && (
                    <span className="text-gray-600">{car.city}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {imageCount > 0 && (
                    <span className="flex items-center gap-1 text-blue-600">
                      <ImageIcon className="w-3 h-3" />
                      {imageCount}
                    </span>
                  )}
                  <span className="text-gray-500">{daysOnMarket}ד</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// Advanced Filters Component
interface AdvancedFiltersProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  priceRange: [number, number];
  onPriceRangeChange: (range: [number, number]) => void;
  yearRange: [number, number];
  onYearRangeChange: (range: [number, number]) => void;
  selectedFuelTypes: string[];
  onFuelTypesChange: (types: string[]) => void;
  selectedTransmissions: string[];
  onTransmissionsChange: (transmissions: string[]) => void;
  selectedCities: string[];
  onCitiesChange: (cities: string[]) => void;
  onReset: () => void;
}

function AdvancedFilters({
  isOpen,
  onOpenChange,
  priceRange,
  onPriceRangeChange,
  yearRange,
  onYearRangeChange,
  selectedFuelTypes,
  onFuelTypesChange,
  selectedTransmissions,
  onTransmissionsChange,
  selectedCities,
  onCitiesChange,
  onReset,
}: AdvancedFiltersProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4" />
            פילטרים מתקדמים
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mt-4">
        <Card>
          <CardContent className="p-4 space-y-6">
            {/* Price Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                טווח מחירים: {formatPrice(priceRange[0])} -{" "}
                {formatPrice(priceRange[1])}
              </label>
              <Slider
                value={priceRange}
                onValueChange={onPriceRangeChange}
                min={0}
                max={1000000}
                step={10000}
                className="w-full"
              />
            </div>

            {/* Year Range */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                טווח שנים: {yearRange[0]} - {yearRange[1]}
              </label>
              <Slider
                value={yearRange}
                onValueChange={onYearRangeChange}
                min={1990}
                max={new Date().getFullYear()}
                step={1}
                className="w-full"
              />
            </div>

            {/* Fuel Types */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                סוג דלק
              </label>
              <div className="flex flex-wrap gap-2">
                {FUEL_TYPES.map((fuel) => (
                  <div key={fuel.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`fuel-${fuel.value}`}
                      checked={selectedFuelTypes.includes(fuel.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onFuelTypesChange([...selectedFuelTypes, fuel.value]);
                        } else {
                          onFuelTypesChange(
                            selectedFuelTypes.filter((f) => f !== fuel.value)
                          );
                        }
                      }}
                    />
                    <label htmlFor={`fuel-${fuel.value}`} className="text-sm">
                      {fuel.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Transmission */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                תיבת הילוכים
              </label>
              <div className="flex flex-wrap gap-2">
                {TRANSMISSION_TYPES.map((transmission) => (
                  <div
                    key={transmission.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`transmission-${transmission.value}`}
                      checked={selectedTransmissions.includes(
                        transmission.value
                      )}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          onTransmissionsChange([
                            ...selectedTransmissions,
                            transmission.value,
                          ]);
                        } else {
                          onTransmissionsChange(
                            selectedTransmissions.filter(
                              (t) => t !== transmission.value
                            )
                          );
                        }
                      }}
                    />
                    <label
                      htmlFor={`transmission-${transmission.value}`}
                      className="text-sm"
                    >
                      {transmission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={onReset} className="w-full">
                <X className="w-4 h-4 mr-2" />
                איפוס פילטרים
              </Button>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function DealerCarsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State
  const [viewMode, setViewMode] = useState<string>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterMake, setFilterMake] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("created_at:desc");
  const [selectedCars, setSelectedCars] = useState<number[]>([]);
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([]);

  // Advanced Filters State
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000000]);
  const [yearRange, setYearRange] = useState<[number, number]>([
    1990,
    new Date().getFullYear(),
  ]);
  const [selectedFuelTypes, setSelectedFuelTypes] = useState<string[]>([]);
  const [selectedTransmissions, setSelectedTransmissions] = useState<string[]>(
    []
  );
  const [selectedCities, setSelectedCities] = useState<string[]>([]);

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

  // Filtered and sorted cars
  const filteredCars = useMemo(() => {
    let filtered = cars;

    // Apply basic filters
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(query) ||
          car.model.toLowerCase().includes(query) ||
          car.description?.toLowerCase().includes(query)
      );
    }

    if (filterMake && filterMake !== "all") {
      filtered = filtered.filter((car) => car.make === filterMake);
    }

    if (filterStatus && filterStatus !== "all") {
      filtered = filtered.filter((car) => car.status === filterStatus);
    }

    if (filterAvailability && filterAvailability !== "all") {
      if (filterAvailability === "available") {
        filtered = filtered.filter((car) => car.isAvailable);
      } else if (filterAvailability === "unavailable") {
        filtered = filtered.filter((car) => !car.isAvailable);
      }
    }

    // Apply advanced filters
    filtered = filtered.filter(
      (car) => car.price >= priceRange[0] && car.price <= priceRange[1]
    );

    filtered = filtered.filter(
      (car) => car.year >= yearRange[0] && car.year <= yearRange[1]
    );

    if (selectedFuelTypes.length > 0) {
      filtered = filtered.filter(
        (car) => car.fuelType && selectedFuelTypes.includes(car.fuelType)
      );
    }

    if (selectedTransmissions.length > 0) {
      filtered = filtered.filter(
        (car) =>
          car.transmission && selectedTransmissions.includes(car.transmission)
      );
    }

    if (selectedCities.length > 0) {
      filtered = filtered.filter(
        (car) => car.city && selectedCities.includes(car.city)
      );
    }

    // Apply quick filters
    activeQuickFilters.forEach((filter) => {
      switch (filter) {
        case "available":
          filtered = filtered.filter((car) => car.isAvailable);
          break;
        case "no-images":
          filtered = filtered.filter(
            (car) => !car.images || car.images.length === 0
          );
          break;
        case "new-this-week":
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(
            (car) => new Date(car.createdAt) > weekAgo
          );
          break;
        case "high-priced":
          const avgPrice =
            cars.reduce((sum, car) => sum + car.price, 0) / cars.length;
          filtered = filtered.filter((car) => car.price > avgPrice * 1.5);
          break;
        case "old-inventory":
          const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(
            (car) => new Date(car.createdAt) < monthAgo
          );
          break;
      }
    });

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
  }, [
    cars,
    searchQuery,
    filterMake,
    filterStatus,
    filterAvailability,
    sortBy,
    priceRange,
    yearRange,
    selectedFuelTypes,
    selectedTransmissions,
    selectedCities,
    activeQuickFilters,
  ]);

  // Enhanced Statistics
  const stats = useMemo(() => {
    const total = cars.length;
    const active = cars.filter((c) => c.status === "active").length;
    const sold = cars.filter((c) => c.status === "sold").length;
    const available = cars.filter((c) => c.isAvailable).length;
    const withoutImages = cars.filter(
      (c) => !c.images || c.images.length === 0
    ).length;
    const totalValue = cars
      .filter((c) => c.status === "active" && c.isAvailable)
      .reduce((sum, car) => sum + car.price, 0);

    return {
      total,
      active,
      sold,
      available,
      withoutImages,
      totalValue,
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
          setSelectedCars((prev) => prev.filter((carId) => carId !== id));
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

  // Selection handlers
  const handleSelectCar = (id: number) => {
    setSelectedCars((prev) =>
      prev.includes(id) ? prev.filter((carId) => carId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedCars.length === filteredCars.length) {
      setSelectedCars([]);
    } else {
      setSelectedCars(filteredCars.map((car) => car.id));
    }
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (selectedCars.length === 0) return;

    if (
      window.confirm(
        `האם אתה בטוח שברצונך למחוק ${selectedCars.length} רכבים? פעולה זו לא ניתנת לביטול.`
      )
    ) {
      for (const carId of selectedCars) {
        await deleteCar(carId);
      }
      toast.success(`${selectedCars.length} רכבים נמחקו בהצלחה`);
      setSelectedCars([]);
    }
  };

  const handleBulkMarkSold = async () => {
    if (selectedCars.length === 0) return;

    if (
      window.confirm(
        `האם אתה בטוח שברצונך לסמן ${selectedCars.length} רכבים כנמכרים?`
      )
    ) {
      for (const carId of selectedCars) {
        await markAsSold(carId);
      }
      toast.success(`${selectedCars.length} רכבים סומנו כנמכרים`);
      setSelectedCars([]);
    }
  };

  const handleBulkToggleAvailability = async (available: boolean) => {
    if (selectedCars.length === 0) return;

    for (const carId of selectedCars) {
      await toggleAvailability(carId, available);
    }
    toast.success(
      `${selectedCars.length} רכבים ${available ? "הוצגו" : "הוסתרו"}`
    );
    setSelectedCars([]);
  };

  // Filter handlers
  const toggleQuickFilter = (filterId: string) => {
    setActiveQuickFilters((prev) =>
      prev.includes(filterId)
        ? prev.filter((id) => id !== filterId)
        : [...prev, filterId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setFilterMake("all");
    setFilterStatus("all");
    setFilterAvailability("all");
    setSortBy("created_at:desc");
    setActiveQuickFilters([]);
    setPriceRange([0, 1000000]);
    setYearRange([1990, new Date().getFullYear()]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedCities([]);
  };

  const resetAdvancedFilters = () => {
    setPriceRange([0, 1000000]);
    setYearRange([1990, new Date().getFullYear()]);
    setSelectedFuelTypes([]);
    setSelectedTransmissions([]);
    setSelectedCities([]);
  };

  // Quick filter for status
  const handleStatClick = (filterType: string) => {
    switch (filterType) {
      case "active":
        setFilterStatus("active");
        break;
      case "sold":
        setFilterStatus("sold");
        break;
      case "available":
        setFilterAvailability("available");
        break;
      case "no-images":
        toggleQuickFilter("no-images");
        break;
    }
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
            נהל את רכבי החברה שלך ועקוב אחר הביצועים • {filteredCars.length}{" "}
            מתוך {cars.length} רכבים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => refetch()}
            variant="outline"
            size="sm"
            disabled={loading}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", loading && "animate-spin")}
            />
            רענן
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            ייצא
          </Button>
          <Link href="/dealer/cars/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              הוסף רכב
            </Button>
          </Link>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
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
          onClick={() => handleStatClick("active")}
        />
        <StatCard
          title="נמכרו"
          value={stats.sold}
          icon={TrendingUp}
          color="purple"
          progress={stats.soldProgress}
          onClick={() => handleStatClick("sold")}
        />
        <StatCard
          title="זמינים"
          value={stats.available}
          icon={Eye}
          color="blue"
          subtitle={`${Math.round(stats.availableProgress)}% מהמלאי`}
          onClick={() => handleStatClick("available")}
        />
        <StatCard
          title="ללא תמונות"
          value={stats.withoutImages}
          icon={ImageIcon}
          color="orange"
          subtitle="זקוק לתמונות"
          onClick={() => handleStatClick("no-images")}
        />
        <StatCard
          title="ערך מלאי"
          value={`${Math.round(stats.totalValue / 1000)}K₪`}
          icon={DollarSign}
          color="yellow"
          subtitle="רכבים זמינים"
        />
      </div>

      {/* Enhanced Search and Quick Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="חפש לפי יצרן, דגם, תיאור או מילות מפתח..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 h-12 text-lg"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute left-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Quick Filter Chips */}
            <div className="flex flex-wrap gap-2">
              {QUICK_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => toggleQuickFilter(filter.id)}
                  className={cn(
                    "px-3 py-1 text-sm font-medium rounded-full border transition-all duration-200",
                    activeQuickFilters.includes(filter.id)
                      ? `bg-${filter.color}-100 text-${filter.color}-800 border-${filter.color}-300`
                      : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                  )}
                >
                  {filter.label}
                  {activeQuickFilters.includes(filter.id) && (
                    <X className="w-3 h-3 ml-1 inline" />
                  )}
                </button>
              ))}
            </div>

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
                {(searchQuery ||
                  filterMake !== "all" ||
                  filterStatus !== "all" ||
                  filterAvailability !== "all" ||
                  activeQuickFilters.length > 0) && (
                  <Button variant="ghost" onClick={clearAllFilters} size="sm">
                    <X className="w-4 h-4 mr-2" />
                    נקה הכל
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
                        <div className="flex items-center gap-2">
                          <option.icon className="w-4 h-4" />
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="flex border rounded-md bg-white">
                  {VIEW_MODES.map((mode) => (
                    <Button
                      key={mode.value}
                      variant={viewMode === mode.value ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode(mode.value)}
                      className={cn(
                        "rounded-none first:rounded-l-md last:rounded-r-md",
                        "relative z-10"
                      )}
                      title={mode.label}
                    >
                      <mode.icon className="w-4 h-4" />
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Filters */}
            <AdvancedFilters
              isOpen={isAdvancedFiltersOpen}
              onOpenChange={setIsAdvancedFiltersOpen}
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              yearRange={yearRange}
              onYearRangeChange={setYearRange}
              selectedFuelTypes={selectedFuelTypes}
              onFuelTypesChange={setSelectedFuelTypes}
              selectedTransmissions={selectedTransmissions}
              onTransmissionsChange={setSelectedTransmissions}
              selectedCities={selectedCities}
              onCitiesChange={setSelectedCities}
              onReset={resetAdvancedFilters}
            />
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Toolbar */}
      {selectedCars.length > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-800">
                  {selectedCars.length} רכבים נבחרו
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggleAvailability(true)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    הצג הכל
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleBulkToggleAvailability(false)}
                  >
                    <EyeOff className="w-4 h-4 mr-2" />
                    הסתר הכל
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkMarkSold}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    סמן כנמכר
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    מחק
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCars([])}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Summary with Enhanced Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>
            מציג {filteredCars.length} מתוך {cars.length} רכבים
          </span>
          {selectedCars.length > 0 && (
            <span className="text-blue-600 font-medium">
              • {selectedCars.length} נבחרו
            </span>
          )}
          {activeQuickFilters.length > 0 && (
            <span className="text-purple-600">
              • {activeQuickFilters.length} פילטרים פעילים
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LoadingSpinner size="sm" />
              טוען...
            </div>
          )}

          {viewMode !== "table" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="text-xs"
            >
              {selectedCars.length === filteredCars.length
                ? "בטל בחירה"
                : "בחר הכל"}
            </Button>
          )}
        </div>
      </div>

      {/* Cars Display */}
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
                  : "נסה לשנות את הפילטרים או מילות החיפוש כדי למצוא את מה שאתה מחפש"}
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
      ) : viewMode === "table" ? (
        /* Table View */
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="p-4 text-right">
                      <Checkbox
                        checked={selectedCars.length === filteredCars.length}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-right font-semibold">רכב</th>
                    <th className="p-4 text-right font-semibold">מחיר</th>
                    <th className="p-4 text-right font-semibold">סטטוס</th>
                    <th className="p-4 text-right font-semibold">
                      תאריך הוספה
                    </th>
                    <th className="p-4 text-right font-semibold">מידע נוסף</th>
                    <th className="p-4 text-right font-semibold">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCars.map((car) => (
                    <DealerCarCard
                      key={car.id}
                      car={car}
                      viewMode={viewMode}
                      isSelected={selectedCars.includes(car.id)}
                      onSelect={handleSelectCar}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onMarkSold={handleMarkSold}
                      onToggleAvailability={handleToggleAvailability}
                      actionLoading={actionLoading[car.id] || false}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Grid/List/Compact Views */
        <div
          className={cn(
            viewMode === "grid" &&
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
            viewMode === "list" && "space-y-4",
            viewMode === "compact" &&
              "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4"
          )}
        >
          {filteredCars.map((car) => (
            <DealerCarCard
              key={car.id}
              car={car}
              viewMode={viewMode}
              isSelected={selectedCars.includes(car.id)}
              onSelect={handleSelectCar}
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
                <DollarSign className="w-4 h-4 text-green-600 mt-0.5" />
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
                <Activity className="w-4 h-4 text-orange-600 mt-0.5" />
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
