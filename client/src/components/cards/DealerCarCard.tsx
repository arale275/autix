// components/cards/DealerCarCard.tsx - Enhanced Car Card for Dealer Management
import React from "react";
import Link from "next/link";
import { Star, ImageIcon, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CarCard from "@/components/cards/CarCard";
import {
  getStatusColor,
  getStatusLabel,
  getDaysOnMarket,
} from "@/lib/car-utils";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/api/types";

interface DealerCarCardProps {
  car: Car;
  onEdit?: (car: Car) => void;
  onDelete?: (id: number) => void;
  onMarkSold?: (id: number) => void;
  onToggleAvailability?: (id: number, available: boolean) => void;
  actionLoading?: boolean;
  className?: string;
}

export function DealerCarCard({
  car,
  onEdit,
  onDelete,
  onMarkSold,
  onToggleAvailability,
  actionLoading,
  className,
}: DealerCarCardProps) {
  const hasImages = car.images && car.images.length > 0;
  const daysOnMarket = getDaysOnMarket(car.createdAt);

  return (
    <Link href={`/dealer/cars/${car.id}`} className="block">
      <div
        className={cn(
          "relative overflow-hidden transition-all duration-300 ease-out hover:scale-[1.02] hover:shadow-xl",
          className
        )}
      >
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
