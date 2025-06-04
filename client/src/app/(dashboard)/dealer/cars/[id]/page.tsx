// app/(dashboard)/dealer/cars/[id]/page.tsx - Car Details & Management Page for Dealers (No Tabs)
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  Share2,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Car as CarIcon,
  ChevronLeft,
  ImageIcon,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  MessageSquare,
  Heart,
  Clock,
  BarChart3,
  Target,
  Zap,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CarForm from "@/components/forms/CarForm";
import { ImageGallery } from "@/components/cards/ImageGallery";
import { ImageUploader } from "@/components/forms/ImageUploader";
import { useCar } from "@/hooks/api/useCars";
import { useDealerCars } from "@/hooks/api/useCars";
import { useImages } from "@/hooks/useImages";
import { useAuth } from "@/contexts/AuthContext";
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

// Helper function to convert images to CarImage format
const normalizeImages = (
  images: (string | CarImage)[] | undefined,
  carId: number
): { main: CarImage | null; gallery: CarImage[]; count: number } => {
  if (!images || images.length === 0) {
    return { main: null, gallery: [], count: 0 };
  }

  const carImages: CarImage[] = images.map((image, index) => {
    if (isCarImageObject(image)) {
      return image;
    } else {
      // Convert string URL to CarImage object
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

  const main = carImages.find((img) => img.is_main) || carImages[0] || null;
  const gallery = carImages.filter((img) => !img.is_main);

  return {
    main,
    gallery,
    count: carImages.length,
  };
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

export default function DealerCarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const carId = parseInt(params.id as string);

  // State
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);

  // Hooks - תיקון לשימוש באותו hook
  const { car, loading, error, refetch } = useCar(carId);
  const {
    toggleAvailability,
    actionLoading,
    updateCar,
    deleteCar,
    markAsSold,
  } = useDealerCars();
  const { setMainImage, deleteImage, uploadMultipleImages } = useImages();

  // Check ownership
  useEffect(() => {
    if (car && user) {
      if (user.userType === "dealer" && car.dealer_user_id !== user.id) {
        toast.error("אין לך הרשאה לצפות ברכב זה");
        router.push("/dealer/cars");
      }
    }
  }, [car, user, router]);

  // פונקציות לניהול תמונות
  const handleSetMainImage = async (imageId: number) => {
    if (!car) return;

    const success = await setMainImage(car.id, imageId);
    if (success) {
      refetch();
    }
  };

  const handleDeleteImage = async (imageId: number) => {
    if (!car) return;

    if (window.confirm("האם אתה בטוח שברצונך למחוק את התמונה?")) {
      const success = await deleteImage(imageId);
      if (success) {
        refetch();
      }
    }
  };

  const handleImagesSelect = (files: File[]) => {
    setSelectedFiles(files);
  };

  const handleUploadClick = async () => {
    if (selectedFiles.length === 0 || !car) return;

    try {
      const success = await uploadMultipleImages(
        car.id,
        selectedFiles,
        car.images
      );
      if (success) {
        setIsImageUploadOpen(false);
        setSelectedFiles([]);
        refetch();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("שגיאה בהעלאת התמונות");
    }
  };

  const handleToggleAvailability = async () => {
    if (!car) return;

    try {
      console.log("🔄 Starting toggle...", {
        carId: car.id,
        currentValue: car.isAvailable,
        newValue: !(car.isAvailable ?? true),
      });

      const success = await toggleAvailability(
        car.id,
        !(car.isAvailable ?? true)
      );

      console.log("📤 Toggle result:", { success });

      if (success) {
        console.log("✅ Refetching car data...");
        // רענון נתוני הרכב הספציפי
        await refetch();
        console.log("✅ Refetch complete");
      } else {
        console.log("❌ Toggle failed");
      }
    } catch (error) {
      console.error("💥 Toggle error:", error);
    }
  };

  // Actions
  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  const handleSaveEdit = () => {
    setIsEditMode(false);
    refetch();
    toast.success("הרכב עודכן בהצלחה");
  };

  const handleDelete = async () => {
    if (!car) return;

    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק את הרכב? פעולה זו לא ניתנת לביטול."
      )
    ) {
      const success = await deleteCar(car.id);
      if (success) {
        toast.success("הרכב נמחק בהצלחה");
        router.push("/dealer/cars");
      }
    }
  };

  const handleMarkSold = async () => {
    if (!car) return;

    const success = await markAsSold(car.id);
    if (success) {
      toast.success("הרכב סומן כנמכר");
      refetch();
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/buyer/cars/${carId}`;
    const title = car ? `${car.make} ${car.model} ${car.year}` : "רכב למכירה";

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch (error) {
        navigator.clipboard.writeText(url);
        toast.success("הקישור הועתק ללוח");
      }
    } else {
      navigator.clipboard.writeText(url);
      toast.success("הקישור הועתק ללוח");
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
              {error || "הרכב המבוקש לא קיים או שאין לך הרשאה לצפות בו"}
            </p>
            <Link href="/dealer/cars">
              <Button>
                <ArrowRight className="w-4 h-4 mr-2" />
                חזור למלאי
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Edit Mode
  if (isEditMode) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/dealer/cars" className="hover:text-blue-600">
            המלאי שלי
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href={`/dealer/cars/${car.id}`} className="hover:text-blue-600">
            {car.make} {car.model} {car.year}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900">עריכה</span>
        </nav>

        {/* Edit Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  עריכת פרטי הרכב
                </h1>
                <p className="text-gray-600 mt-1">
                  {car.make} {car.model} {car.year}
                </p>
              </div>
              <Button variant="outline" onClick={handleCancelEdit}>
                ביטול
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Car Form */}
        <CarForm car={car} onSuccess={handleSaveEdit} mode="edit" />
      </div>
    );
  }

  // View Mode
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dealer/cars" className="hover:text-blue-600">
          המלאי שלי
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">
          {car.make} {car.model} {car.year}
        </span>
      </nav>

      {/* Car Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {car.make} {car.model} {car.year}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {car.year} ({getCarAge(car.year)})
                </span>
                {car.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {car.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  פורסם {new Date(car.createdAt).toLocaleDateString("he-IL")}
                </span>
              </div>

              {/* Removed duplicate status badges - they appear in sidebar */}
            </div>

            {/* Status Info Only */}
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(car.status)}>
                {getStatusLabel(car.status)}
              </Badge>
              {!car.isAvailable && <Badge variant="secondary">מוסתר</Badge>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Car Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <Card>
            <CardContent className="p-4">
              <div className="relative mb-4">
                <Dialog
                  open={isImageUploadOpen}
                  onOpenChange={setIsImageUploadOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 left-2 z-10 bg-white/90 hover:bg-white shadow-sm"
                    >
                      <Upload className="w-4 h-4 mr-1" />
                      הוסף תמונות
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>העלאת תמונות לרכב</DialogTitle>
                      <DialogDescription>
                        בחר תמונות איכותיות של הרכב ולחץ "העלה" להוספתן לגלריה
                      </DialogDescription>
                    </DialogHeader>
                    <ImageUploader
                      onImagesChange={handleImagesSelect}
                      onUploadClick={handleUploadClick}
                      maxImages={10}
                      maxFileSize={5}
                      disabled={uploadingImages}
                      uploading={uploadingImages}
                      existingImages={car?.images?.map((img) =>
                        typeof img === "string" ? img : img.image_url
                      )}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              <ImageGallery
                images={normalizeImages(car.images, car.id)}
                isOwner={true}
                onSetMain={handleSetMainImage}
                onDelete={handleDeleteImage}
                className="space-y-4"
              />
            </CardContent>
          </Card>

          {/* Car Details */}
          <Card>
            <CardContent className="space-y-6 p-6">
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

                {car.color && (
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <CarIcon className="w-6 h-6 text-gray-600 mx-auto mb-1" />
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
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                פעולות מהירות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                שתף רכב
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4 mr-2" />
                ערוך פרטים
              </Button>

              {/* Toggle Switch for Availability - Simple Version */}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    הצגה לקונים
                  </span>
                  <span className="text-xs text-gray-500">
                    {car.isAvailable ?? true ? "מוצג למכירה" : "מוסתר מהקונים"}
                  </span>
                </div>

                {/* Simple Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={car.isAvailable ?? true}
                    onChange={handleToggleAvailability}
                    disabled={actionLoading[car.id]}
                    className="sr-only peer"
                  />
                  <div className="relative w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-blue-300 transition-colors duration-300">
                    <div className="absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform duration-300 peer-checked:translate-x-5 peer-checked:border-white"></div>
                  </div>
                </label>
              </div>

              {car.status === "active" && (
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleMarkSold}
                  disabled={actionLoading[car.id]}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  סמן כנמכר
                </Button>
              )}

              {car.status === "active" && (
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={handleDelete}
                  disabled={actionLoading[car.id]}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  מחק רכב
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Performance Tips */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-800">
                💡 טיפים לשיפור ביצועים
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• הוסף עוד תמונות איכותיות</li>
                <li>• עדכן את התיאור עם פרטים נוספים</li>
                <li>• בדוק שהמחיר תחרותי</li>
                <li>• הגב במהירות לפניות</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
