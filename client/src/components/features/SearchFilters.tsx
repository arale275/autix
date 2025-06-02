// components/features/SearchFilters.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { Separator } from '@/components/ui/separator'; // Remove if not available
import {
  Search,
  Filter,
  X,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
// Import constants - replace with your actual constants file
// import { CAR_MAKES, FUEL_TYPES, TRANSMISSION_TYPES, CITIES } from '@/lib/constants';
// import { formatPrice } from '@/lib/formatters';

// Temporary constants for demo - replace with imports from your constants file
const CAR_MAKES = [
  "טויוטה",
  "הונדה",
  "מזדה",
  "ניסן",
  "פולקסווגן",
  "יונדאי",
  "קיא",
  "שברולט",
  "פורד",
  "רנו",
  "סקודה",
  "סיאט",
];

const FUEL_TYPES = [
  { value: "gasoline", label: "בנזין" },
  { value: "diesel", label: "דיזל" },
  { value: "hybrid", label: "היברידי" },
  { value: "electric", label: "חשמלי" },
  { value: "lpg", label: "גז" },
];

const TRANSMISSION_TYPES = [
  { value: "manual", label: "ידני" },
  { value: "automatic", label: "אוטומטי" },
  { value: "semi-automatic", label: "חצי אוטומטי" },
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

// Temporary formatter - replace with import from your formatters file
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export interface SearchFilters {
  search?: string;
  make?: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  fuelType?: string;
  transmission?: string;
  city?: string;
  sortBy?:
    | "price_asc"
    | "price_desc"
    | "year_desc"
    | "year_asc"
    | "created_desc";
}

interface SearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSearch: () => void;
  onClear: () => void;
  isLoading?: boolean;
  resultsCount?: number;
  className?: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 1990;

// Get models for selected make (mock data - replace with real data)
const getModelsForMake = (make: string): string[] => {
  const models: Record<string, string[]> = {
    טויוטה: ["קורולה", "קאמרי", "יאריס", "פריוס", "RAV4", "היילנדר"],
    הונדה: ["סיוויק", "אקורד", "CR-V", "פיט", "איי-אר-וי"],
    מזדה: ["3", "6", "CX-5", "CX-3", "MX-5"],
    ניסן: ["אלטימה", "סנטרה", "רוג׳", "מיקרה", "X-Trail"],
    פולקסווגן: ["גולף", "ג׳טה", "פולו", "פאסאט", "טיגואן"],
    יונדאי: ["אלנטרה", "סונטה", "טוקסון", "i30", "i20"],
    קיה: ["סראטו", "אופטימה", "ספורטאז׳", "ריו", "סורנטו"],
    שברולט: ["קרוז", "קפטיבה", "ספארק", "מליבו"],
    פורד: ["פוקוס", "פיאסטה", "מונדיאו", "אקספלורר"],
    רנו: ["מגיין", "סימבול", "קליאו", "קפטור"],
  };
  return models[make] || [];
};

export default function SearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  onClear,
  isLoading = false,
  resultsCount,
  className = "",
}: SearchFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Update available models when make changes
  useEffect(() => {
    if (localFilters.make) {
      setAvailableModels(getModelsForMake(localFilters.make));
    } else {
      setAvailableModels([]);
      if (localFilters.model) {
        setLocalFilters((prev) => ({ ...prev, model: undefined }));
      }
    }
  }, [localFilters.make]);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onFiltersChange(localFilters);
    onSearch();
  };

  const handleClear = () => {
    setLocalFilters({});
    onClear();
  };

  const getActiveFiltersCount = () => {
    return Object.values(localFilters).filter(
      (value) => value !== undefined && value !== "" && value !== null
    ).length;
  };

  const getActiveFiltersBadges = () => {
    const badges: { key: string; label: string; value: any }[] = [];

    if (localFilters.search)
      badges.push({
        key: "search",
        label: "חיפוש",
        value: localFilters.search,
      });
    if (localFilters.make)
      badges.push({ key: "make", label: "יצרן", value: localFilters.make });
    if (localFilters.model)
      badges.push({ key: "model", label: "דגם", value: localFilters.model });
    if (localFilters.yearFrom || localFilters.yearTo) {
      const yearRange = `${localFilters.yearFrom || MIN_YEAR}-${
        localFilters.yearTo || CURRENT_YEAR
      }`;
      badges.push({ key: "year", label: "שנה", value: yearRange });
    }
    if (localFilters.priceFrom || localFilters.priceTo) {
      const priceRange = `${formatPrice(
        localFilters.priceFrom || 0
      )}-${formatPrice(localFilters.priceTo || 999999)}`;
      badges.push({ key: "price", label: "מחיר", value: priceRange });
    }
    if (localFilters.fuelType)
      badges.push({
        key: "fuelType",
        label: "דלק",
        value: localFilters.fuelType,
      });
    if (localFilters.transmission)
      badges.push({
        key: "transmission",
        label: "תיבת הילוכים",
        value: localFilters.transmission,
      });
    if (localFilters.city)
      badges.push({ key: "city", label: "עיר", value: localFilters.city });

    return badges;
  };

  const removeFilter = (key: string) => {
    const newFilters = { ...localFilters };
    if (key === "year") {
      delete newFilters.yearFrom;
      delete newFilters.yearTo;
    } else if (key === "price") {
      delete newFilters.priceFrom;
      delete newFilters.priceTo;
    } else {
      delete newFilters[key as keyof SearchFilters];
    }
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Filter size={20} />
            חיפוש וסינון
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()}</Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1"
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {isExpanded ? "הסתר" : "הצג פילטרים"}
          </Button>
        </div>

        {/* Results count */}
        {resultsCount !== undefined && (
          <div className="text-sm text-gray-600">
            נמצאו {resultsCount.toLocaleString()} תוצאות
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search Input - Always visible */}
        <div className="space-y-2">
          <Label htmlFor="search">חיפוש כללי</Label>
          <div className="relative">
            <Search
              size={16}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <Input
              id="search"
              placeholder="חפש לפי יצרן, דגם, תיאור..."
              value={localFilters.search || ""}
              onChange={(e) => updateFilter("search", e.target.value)}
              className="pr-10"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
        </div>

        {/* Active Filters Badges */}
        {getActiveFiltersBadges().length > 0 && (
          <div className="flex flex-wrap gap-2">
            {getActiveFiltersBadges().map((badge) => (
              <Badge
                key={badge.key}
                variant="outline"
                className="flex items-center gap-1"
              >
                <span className="font-medium">{badge.label}:</span>
                <span>{badge.value}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFilter(badge.key)}
                  className="h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X size={12} />
                </Button>
              </Badge>
            ))}
          </div>
        )}

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Make and Model */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">יצרן</Label>
                <Select
                  value={localFilters.make || ""}
                  onValueChange={(value) =>
                    updateFilter("make", value || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל היצרנים</SelectItem>
                    {CAR_MAKES.map((make) => (
                      <SelectItem key={make} value={make}>
                        {make}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">דגם</Label>
                <Select
                  value={localFilters.model || ""}
                  onValueChange={(value) =>
                    updateFilter("model", value || undefined)
                  }
                  disabled={!localFilters.make}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        localFilters.make ? "בחר דגם" : "בחר יצרן תחילה"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל הדגמים</SelectItem>
                    {availableModels.map((model) => (
                      <SelectItem key={model} value={model}>
                        {model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Year Range */}
            <div className="space-y-2">
              <Label>שנת ייצור</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    placeholder="משנה"
                    min={MIN_YEAR}
                    max={CURRENT_YEAR}
                    value={localFilters.yearFrom || ""}
                    onChange={(e) =>
                      updateFilter(
                        "yearFrom",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="עד שנה"
                    min={MIN_YEAR}
                    max={CURRENT_YEAR}
                    value={localFilters.yearTo || ""}
                    onChange={(e) =>
                      updateFilter(
                        "yearTo",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <Label>מחיר (₪)</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Input
                    type="number"
                    placeholder="מחיר מינימלי"
                    min={0}
                    value={localFilters.priceFrom || ""}
                    onChange={(e) =>
                      updateFilter(
                        "priceFrom",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="מחיר מקסימלי"
                    min={0}
                    value={localFilters.priceTo || ""}
                    onChange={(e) =>
                      updateFilter(
                        "priceTo",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Fuel Type and Transmission */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">סוג דלק</Label>
                <Select
                  value={localFilters.fuelType || ""}
                  onValueChange={(value) =>
                    updateFilter("fuelType", value || undefined)
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

              <div className="space-y-2">
                <Label htmlFor="transmission">תיבת הילוכים</Label>
                <Select
                  value={localFilters.transmission || ""}
                  onValueChange={(value) =>
                    updateFilter("transmission", value || undefined)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר תיבת הילוכים" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">כל התיבות</SelectItem>
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
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label htmlFor="city">עיר</Label>
              <Select
                value={localFilters.city || ""}
                onValueChange={(value) =>
                  updateFilter("city", value || undefined)
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

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sortBy">מיון לפי</Label>
              <Select
                value={localFilters.sortBy || "created_desc"}
                onValueChange={(value) => updateFilter("sortBy", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_desc">חדשים ביותר</SelectItem>
                  <SelectItem value="price_asc">מחיר: נמוך לגבוה</SelectItem>
                  <SelectItem value="price_desc">מחיר: גבוה לנמוך</SelectItem>
                  <SelectItem value="year_desc">שנה: חדש לישן</SelectItem>
                  <SelectItem value="year_asc">שנה: ישן לחדש</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Separator */}
        <div className="border-t border-gray-200 my-4" />

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleSearch}
            disabled={isLoading}
            className="flex-1"
          >
            <Search size={16} className="ml-2" />
            {isLoading ? "מחפש..." : "חפש"}
          </Button>

          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isLoading || getActiveFiltersCount() === 0}
            className="flex items-center gap-2"
          >
            <RotateCcw size={16} />
            נקה הכל
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Usage Examples:
/*
const [filters, setFilters] = useState<SearchFilters>({});
const [isLoading, setIsLoading] = useState(false);

const handleSearch = async () => {
  setIsLoading(true);
  try {
    const results = await searchCars(filters);
    // Handle results
  } finally {
    setIsLoading(false);
  }
};

<SearchFilters
  filters={filters}
  onFiltersChange={setFilters}
  onSearch={handleSearch}
  onClear={() => setFilters({})}
  isLoading={isLoading}
  resultsCount={cars.length}
/>
*/
