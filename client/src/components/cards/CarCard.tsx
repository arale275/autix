// components/cards/CarCard.tsx - Car Card Component (Fixed with Images)
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Eye,
  Heart,
  MapPin,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  Phone,
  MessageSquare,
  Star,
  Clock,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useFavorites } from "@/hooks/ui/useLocalStorage";
import { cn } from "@/lib/utils";
import type { Car, CarImage } from "@/lib/api/types";

// ✅ Fixed Format Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
  }).format(price);
};

const formatMileage = (mileage: number): string => {
  return new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';
};

const formatYear = (year: number): string => {
  return year.toString();
};

const getCarAge = (year: number): string => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age === 0) return "חדש";
  if (age === 1) return "שנה";
  return `${age} שנים`;
};

// Car condition based on age and mileage
const getCarCondition = (
  year: number,
  mileage: number
): "חדש" | "מעולה" | "טוב" | "סביר" => {
  const age = new Date().getFullYear() - year;
  const avgMileagePerYear = mileage / Math.max(age, 1);

  if (age <= 1 && mileage < 20000) return "חדש";
  if (age <= 3 && avgMileagePerYear < 15000) return "מעולה";
  if (age <= 7 && avgMileagePerYear < 20000) return "טוב";
  return "סביר";
};

const getConditionColor = (condition: string): string => {
  switch (condition) {
    case "חדש":
      return "bg-green-100 text-green-800 border-green-200";
    case "מעולה":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "טוב":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "סביר":
      return "bg-orange-100 text-orange-800 border-orange-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// ✅ Helper function to get main image URL
const getMainImageUrl = (
  images: (string | CarImage)[] | undefined
): string | null => {
  if (!images || images.length === 0) {
    return null;
  }

  // Look for main image
  const mainImage = images.find((img) => {
    if (typeof img === "string") {
      return false; // If it's a string, we can't know if it's main
    }
    return img.is_main;
  });

  if (mainImage && typeof mainImage !== "string") {
    return mainImage.image_url;
  }

  // Fallback to first image
  const firstImage = images[0];
  if (typeof firstImage === "string") {
    return firstImage;
  }
  return firstImage.image_url;
};

// ✅ Helper function to get images count
const getImagesCount = (images: (string | CarImage)[] | undefined): number => {
  return images?.length || 0;
};

// ✅ Fixed Component Interface
export interface CarCardProps {
  car: Car;
  viewMode?: "grid" | "list";
  showActions?: boolean;
  showContactButton?: boolean;
  showFavoriteButton?: boolean;
  onContact?: (car: Car) => void;
  onView?: (car: Car) => void;
  className?: string;
}

export default function CarCard({
  car,
  viewMode = "grid",
  showActions = true,
  showContactButton = true,
  showFavoriteButton = true,
  onContact,
  onView,
  className,
}: CarCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const condition = getCarCondition(car.year, car.mileage || 0);
  const conditionColor = getConditionColor(condition);

  // ✅ Get main image and count
  const mainImageUrl = getMainImageUrl(car.images);
  const imagesCount = getImagesCount(car.images);

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContact?.(car);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(car.id);
  };

  const handleView = () => {
    onView?.(car);
  };

  // ✅ Fixed Grid Layout with Image Support
  if (viewMode === "grid") {
    return (
      <Card
        className={cn(
          "group hover:shadow-lg transition-all duration-300 cursor-pointer border-gray-200 hover:border-blue-300",
          !car.isAvailable && "opacity-75 grayscale",
          className
        )}
      >
        <CardHeader className="p-4 pb-2">
          {/* Header with Badges */}
          <div className="flex justify-between items-start mb-2">
            <div className="flex flex-wrap gap-1">
              <Badge className={conditionColor}>{condition}</Badge>
              {car.isFeatured && (
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Star className="w-3 h-3 mr-1" />
                  מומלץ
                </Badge>
              )}
              {!car.isAvailable && <Badge variant="secondary">לא זמין</Badge>}
            </div>

            {/* Favorite Button */}
            {showFavoriteButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFavorite}
                className="p-1 h-8 w-8 hover:bg-red-50"
              >
                <Heart
                  className={cn(
                    "h-4 w-4 transition-colors",
                    isFavorite(car.id)
                      ? "fill-red-500 text-red-500"
                      : "text-gray-400 hover:text-red-500"
                  )}
                />
              </Button>
            )}
          </div>

          {/* Car Title */}
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
              {car.make} {car.model}
            </h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatYear(car.year)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
              </span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 pt-2">
          {/* ✅ Car Image - Fixed to show actual image */}
          <div className="relative bg-gray-100 rounded-lg mb-4 aspect-video overflow-hidden">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={`${car.make} ${car.model} ${car.year}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            )}

            {/* Images Count Badge */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              {imagesCount} תמונות
            </div>
          </div>

          {/* Car Details */}
          <div className="space-y-3">
            {/* Price */}
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatPrice(car.price)}
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              {car.mileage && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Gauge className="w-4 h-4" />
                  <span>{formatMileage(car.mileage)}</span>
                </div>
              )}

              {car.fuelType && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Fuel className="w-4 h-4" />
                  <span>{car.fuelType}</span>
                </div>
              )}

              {car.transmission && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Settings className="w-4 h-4" />
                  <span>{car.transmission}</span>
                </div>
              )}

              {car.city && (
                <div className="flex items-center gap-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{car.city}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {car.description && (
              <p className="text-sm text-gray-600 line-clamp-2">
                {car.description}
              </p>
            )}
          </div>
        </CardContent>

        {/* Actions */}
        {showActions && (
          <CardFooter className="p-4 pt-2 flex gap-2">
            <Link href={`/buyer/cars/${car.id}`} className="flex-1">
              <Button variant="outline" className="w-full" onClick={handleView}>
                <Eye className="w-4 h-4 mr-2" />
                צפייה
              </Button>
            </Link>

            {showContactButton && (
              <Button onClick={handleContact} className="flex-1">
                <MessageSquare className="w-4 h-4 mr-2" />
                פנייה
              </Button>
            )}
          </CardFooter>
        )}
      </Card>
    );
  }

  // ✅ List Layout - Fixed to show actual image
  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-all duration-200 cursor-pointer",
        !car.isAvailable && "opacity-75 grayscale",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* ✅ Car Image - Fixed to show actual image */}
          <div className="w-24 h-16 bg-gray-100 rounded flex-shrink-0 overflow-hidden relative">
            {mainImageUrl ? (
              <Image
                src={mainImageUrl}
                alt={`${car.make} ${car.model} ${car.year}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="96px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
            )}
          </div>

          {/* Car Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  {car.make} {car.model} {formatYear(car.year)}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                  {car.mileage && (
                    <span className="flex items-center gap-1">
                      <Gauge className="w-3 h-3" />
                      {formatMileage(car.mileage)}
                    </span>
                  )}
                  {car.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {car.city}
                    </span>
                  )}
                  {imagesCount > 0 && (
                    <span className="flex items-center gap-1">
                      <ImageIcon className="w-3 h-3" />
                      {imagesCount} תמונות
                    </span>
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="text-lg font-bold text-blue-600 whitespace-nowrap">
                {formatPrice(car.price)}
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex items-center gap-2">
                  {showFavoriteButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleFavorite}
                      className="p-1 h-8 w-8"
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4",
                          isFavorite(car.id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        )}
                      />
                    </Button>
                  )}

                  <Link href={`/buyer/cars/${car.id}`}>
                    <Button variant="outline" size="sm">
                      צפייה
                    </Button>
                  </Link>

                  {showContactButton && (
                    <Button size="sm" onClick={handleContact}>
                      פנייה
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
