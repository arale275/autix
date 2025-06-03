// app-new/(dashboard)/buyer/cars/[id]/page.tsx - Car Details Page for Buyers
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Share2,
  Phone,
  MessageSquare,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Eye,
  Star,
  Building2,
  Clock,
  Car as CarIcon,
  ChevronLeft,
  ChevronRight,
  ImageIcon,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  Info,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import InquiryForm from "@/components/forms/InquiryForm";
import CarCard from "@/components/cards/CarCard";
import { ImageGallery } from "@/components/cards/ImageGallery";
import { useCar } from "@/hooks/api/useCars";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/ui/useLocalStorage";
import { carsApi } from "@/lib/api/cars";
import { EXTERNAL_URLS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Car, CarImage } from "@/lib/api/types";

// Type guard to check if image is CarImage object
const isCarImageObject = (image: string | CarImage): image is CarImage => {
  return (
    typeof image === "object" &&
    image !== null &&
    "id" in image &&
    "image_url" in image
  );
};

// Helper function to convert images to CarImage format for display only
const normalizeImages = (
  images: (string | CarImage)[] | undefined,
  carId: number
): { main: CarImage | null; gallery: CarImage[] } => {
  if (!images || images.length === 0) {
    return { main: null, gallery: [] };
  }

  const carImages: CarImage[] = images.map((image, index) => {
    if (isCarImageObject(image)) {
      return image;
    } else {
      // Convert string URL to CarImage object for display
      return {
        id: index + 1,
        car_id: carId,
        image_url: image,
        thumbnail_url: image,
        is_main: index === 0, // First image is main by default
        display_order: index,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  });

  const main =
    carImages.find((img) => img.is_main) ||
    (carImages.length > 0 ? carImages[0] : null);
  const gallery = carImages.filter((img) => !img.is_main);

  return { main, gallery };
};

// Format Functions
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

const getCarAge = (year: number): string => {
  const currentYear = new Date().getFullYear();
  const age = currentYear - year;
  if (age === 0) return "חדש";
  if (age === 1) return "שנה";
  return `${age} שנים`;
};

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

export default function BuyerCarDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();

  const carId = parseInt(params.id as string);
  const showContactForm = searchParams.get("contact") === "true";

  // State
  const [similarCars, setSimilarCars] = useState<Car[]>([]);
  const [similarCarsLoading, setSimilarCarsLoading] = useState(false);
  const [inquiryFormOpen, setInquiryFormOpen] = useState(showContactForm);

  // Hooks
  const { car, loading, error, refetch } = useCar(carId);

  // Load similar cars
  const loadSimilarCars = useCallback(async () => {
    if (!car) return;

    try {
      setSimilarCarsLoading(true);
      const similar = await carsApi.getSimilarCars(car.id, 4);
      setSimilarCars(similar);
    } catch (error) {
      console.error("Error loading similar cars:", error);
    } finally {
      setSimilarCarsLoading(false);
    }
  }, [car]);

  useEffect(() => {
    if (car) {
      loadSimilarCars();
    }
  }, [car, loadSimilarCars]);

  // Actions
  const handleFavorite = () => {
    if (!user) {
      toast.error("נדרשת התחברות", {
        description: "אנא התחבר כדי לשמור רכבים למועדפים",
      });
      return;
    }

    toggleFavorite(carId);
    toast.success(
      isFavorite(carId) ? "הרכב הוסר מהמועדפים" : "הרכב נשמר למועדפים"
    );
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = car ? `${car.make} ${car.model} ${car.year}` : "רכב למכירה";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(url);
        toast.success("הקישור הועתק ללוח");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("הקישור הועתק ללוח");
    }
  };

  const handleContact = () => {
    if (!user) {
      toast.error("נדרשת התחברות", {
        description: "אנא התחבר כדי ליצור קשר עם המוכר",
      });
      router.push("/login");
      return;
    }
    setInquiryFormOpen(true);
  };

  const handleCall = () => {
    if (car?.dealer?.phone) {
      window.location.href = `tel:${car.dealer.phone}`;
    }
  };

  const handleWhatsApp = () => {
    if (car?.dealer?.phone) {
      const message = `שלום, אני מעוניין ברכב ${car.make} ${car.model} ${
        car.year
      } במחיר ${formatPrice(car.price)}`;
      const url = EXTERNAL_URLS.WHATSAPP(car.dealer.phone, message);
      window.open(url, "_blank");
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              הרכב לא נמצא
            </h3>
            <p className="text-red-600 mb-4">
              {error || "הרכב המבוקש לא קיים או הוסר מהמערכת"}
            </p>
            <div className="flex gap-2 justify-center">
              <Link href="/buyer/cars">
                <Button variant="outline">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  חזור לחיפוש רכבים
                </Button>
              </Link>
              <Button onClick={refetch}>נסה שוב</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const condition = getCarCondition(car.year, car.mileage || 0);
  const conditionColor = getConditionColor(condition);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/buyer/cars" className="hover:text-blue-600">
          חיפוש רכבים
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">
          {car.make} {car.model} {car.year}
        </span>
      </nav>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Car Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery - החלק המעודכן */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>תמונות הרכב</span>
                <Badge variant="outline">
                  {car.images?.length || 0} תמונות
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ImageGallery
                images={{
                  ...normalizeImages(car.images, car.id),
                  count: car.images?.length || 0,
                }}
                isOwner={false} // קונה לא יכול לערוך תמונות
                className="space-y-4"
              />
            </CardContent>
          </Card>

          {/* Car Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {car.make} {car.model}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-gray-600 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {car.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {getCarAge(car.year)}
                    </span>
                    {car.city && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {car.city}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFavorite}
                    className="p-2"
                  >
                    <Heart
                      className={cn(
                        "h-5 w-5 transition-colors",
                        isFavorite(carId)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400 hover:text-red-500"
                      )}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                    className="p-2"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={conditionColor}>{condition}</Badge>
                {car.isFeatured && (
                  <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                    <Star className="w-3 h-3 mr-1" />
                    מומלץ
                  </Badge>
                )}
                {!car.isAvailable && <Badge variant="secondary">לא זמין</Badge>}
                {car.status === "sold" && (
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    נמכר
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center py-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-600">
                  {formatPrice(car.price)}
                </div>
              </div>

              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {car.mileage && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Gauge className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">קילומטראז'</div>
                    <div className="font-semibold">
                      {formatMileage(car.mileage)}
                    </div>
                  </div>
                )}

                {car.fuelType && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Fuel className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">סוג דלק</div>
                    <div className="font-semibold">{car.fuelType}</div>
                  </div>
                )}

                {car.transmission && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <Settings className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">תיבת הילוכים</div>
                    <div className="font-semibold">{car.transmission}</div>
                  </div>
                )}

                {car.engineSize && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <CarIcon className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-600">נפח מנוע</div>
                    <div className="font-semibold">{car.engineSize}</div>
                  </div>
                )}

                {car.color && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 bg-gray-600 rounded-full mx-auto mb-1"></div>
                    <div className="text-sm text-gray-600">צבע</div>
                    <div className="font-semibold">{car.color}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              {car.description && (
                <div>
                  <h3 className="font-semibold mb-2">תיאור הרכב</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {car.description}
                  </p>
                </div>
              )}

              {/* Safety Notice */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-800 mb-1">
                      בטיחות וזהירות
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      <li>• בדוק את הרכב לפני הקנייה</li>
                      <li>• וודא שמסמכי הרכב תקינים</li>
                      <li>• בצע עסקה רק באמצעות מסמכים חוקיים</li>
                      <li>• פגוש את המוכר במקום ציבורי</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact & Similar Cars */}
        <div className="space-y-6">
          {/* Dealer Info & Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                פרטי המוכר
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Dealer Info */}
              <div>
                <h3 className="font-semibold text-lg">
                  {car.dealer?.businessName || "סוחר רכב"}
                </h3>
                {car.dealer?.city && (
                  <p className="text-gray-600 flex items-center gap-1 mt-1">
                    <MapPin className="w-4 h-4" />
                    {car.dealer.city}
                  </p>
                )}
              </div>

              <div className="border-t border-gray-200 my-4"></div>

              {/* Contact Actions */}
              <div className="space-y-2">
                <Button
                  onClick={handleContact}
                  className="w-full"
                  disabled={!car.isAvailable || car.status === "sold"}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  שלח הודעה
                </Button>

                {car.dealer?.phone && (
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCall}
                      className="flex-1"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      התקשר
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleWhatsApp}
                      className="flex-1"
                    >
                      WhatsApp
                    </Button>
                  </div>
                )}
              </div>

              {/* Availability Status */}
              {!car.isAvailable || car.status === "sold" ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-red-700">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">
                      {car.status === "sold" ? "הרכב נמכר" : "הרכב לא זמין"}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">הרכב זמין לצפייה</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Similar Cars */}
          {similarCars.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarIcon className="w-5 h-5" />
                  רכבים דומים
                </CardTitle>
              </CardHeader>
              <CardContent>
                {similarCarsLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : (
                  <div className="space-y-3">
                    {similarCars.map((similarCar) => (
                      <CarCard
                        key={similarCar.id}
                        car={similarCar}
                        viewMode="list"
                        showActions={false}
                        className="border-0 shadow-none bg-gray-50"
                      />
                    ))}

                    <Link href="/buyer/cars" className="block">
                      <Button variant="outline" className="w-full">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        עוד רכבים דומים
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Inquiry Form Dialog */}
      <Dialog open={inquiryFormOpen} onOpenChange={setInquiryFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>שליחת פנייה</DialogTitle>
            <DialogDescription>
              שלח הודעה למוכר לקבלת מידע נוסף ותיאום צפייה
            </DialogDescription>
          </DialogHeader>

          <InquiryForm
            dealerId={car.dealerId}
            dealerName={car.dealer?.businessName}
            car={car}
            onSuccess={() => {
              setInquiryFormOpen(false);
              toast.success("הפנייה נשלחה בהצלחה!");
            }}
            onCancel={() => setInquiryFormOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
