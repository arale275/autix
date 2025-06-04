// components/features/CarStatusBadge.tsx - Interactive Car Status Badge
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusColor, getStatusLabel } from "@/lib/car-utils";
import type { Car } from "@/lib/api/types";

interface CarStatusBadgeProps {
  car: Car;
  interactive?: boolean;
  onToggleAvailability?: () => void;
  loading?: boolean;
  className?: string;
}

export function CarStatusBadge({
  car,
  interactive = false,
  onToggleAvailability,
  loading = false,
  className,
}: CarStatusBadgeProps) {
  // Non-interactive badges for sold/deleted cars
  if (car.status === "sold") {
    return (
      <Badge
        className={cn(
          "bg-purple-100 text-purple-800 border-purple-200",
          className
        )}
      >
        נמכר
      </Badge>
    );
  }

  if (car.status === "deleted") {
    return (
      <Badge
        className={cn("bg-red-100 text-red-800 border-red-200", className)}
      >
        נמחק
      </Badge>
    );
  }

  // Interactive badge for active cars
  if (interactive && car.status === "active" && onToggleAvailability) {
    return (
      <div className={cn("flex flex-col items-center", className)}>
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleAvailability}
            disabled={loading}
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-full border cursor-pointer transition-all duration-200 hover:shadow-md",
              car.isAvailable
                ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200",
              loading && "opacity-50 cursor-not-allowed"
            )}
          >
            {car.isAvailable ? "פעיל" : "מוסתר"}
          </button>
          <span className="text-gray-400">|</span>
          <span
            className={cn(
              "px-3 py-1 text-sm font-medium rounded-full border opacity-50",
              !car.isAvailable
                ? "bg-green-100 text-green-800 border-green-200"
                : "bg-gray-100 text-gray-800 border-gray-200"
            )}
          >
            {!car.isAvailable ? "פעיל" : "מוסתר"}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">לחץ לשינוי מצב</p>
      </div>
    );
  }

  // Simple status badge
  return (
    <Badge className={cn(getStatusColor(car.status), className)}>
      {getStatusLabel(car.status)}
    </Badge>
  );
}
