// components/features/CarFilters.tsx - Car Filtering Component (Fixed Scrolling)
import React from "react";
import { ArrowUpDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CAR_MANUFACTURERS } from "@/lib/constants";
import {
  STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
  SORT_OPTIONS,
} from "@/lib/car-utils";
import { CAR_MANUFACTURERS_HEBREW } from "@/lib/constants";

interface CarFiltersProps {
  filterMake: string;
  filterStatus: string;
  filterAvailability: string;
  sortBy: string;
  onFilterMakeChange: (value: string) => void;
  onFilterStatusChange: (value: string) => void;
  onFilterAvailabilityChange: (value: string) => void;
  onSortByChange: (value: string) => void;
  onClearFilters: () => void;
  showStatusFilter?: boolean;
  showAvailabilityFilter?: boolean;
  className?: string;
}

export function CarFilters({
  filterMake,
  filterStatus,
  filterAvailability,
  sortBy,
  onFilterMakeChange,
  onFilterStatusChange,
  onFilterAvailabilityChange,
  onSortByChange,
  onClearFilters,
  showStatusFilter = true,
  showAvailabilityFilter = true,
  className,
}: CarFiltersProps) {
  const hasActiveFilters =
    filterMake !== "all" ||
    filterStatus !== "all" ||
    filterAvailability !== "all";

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Basic Filters */}
            <div className="flex flex-wrap gap-2 flex-1">
              {/* Make Filter - ✅ FIXED: הוספת גלילה */}
              <Select value={filterMake} onValueChange={onFilterMakeChange}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="יצרן" />
                </SelectTrigger>
                <SelectContent className="max-h-[200px] overflow-y-auto">
                  <SelectItem value="all">כל היצרנים</SelectItem>
                  {CAR_MANUFACTURERS_HEBREW.map((manufacturer) => (
                    <SelectItem
                      key={manufacturer.value}
                      value={manufacturer.value}
                    >
                      {manufacturer.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              {showStatusFilter && (
                <Select
                  value={filterStatus}
                  onValueChange={onFilterStatusChange}
                >
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
              )}

              {/* Availability Filter */}
              {showAvailabilityFilter && (
                <Select
                  value={filterAvailability}
                  onValueChange={onFilterAvailabilityChange}
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
              )}

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button variant="ghost" onClick={onClearFilters} size="sm">
                  <X className="w-4 h-4 mr-2" />
                  נקה הכל
                </Button>
              )}
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={onSortByChange}>
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
        </div>
      </CardContent>
    </Card>
  );
}
