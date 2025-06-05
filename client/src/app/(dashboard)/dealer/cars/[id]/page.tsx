// app/(dashboard)/dealer/cars/[id]/page.tsx - Car Details & Management Page for Dealers (Clean)
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Edit,
  CheckCircle,
  Share2,
  Calendar,
  Gauge,
  Fuel,
  Settings,
  MapPin,
  Car as CarIcon,
  ChevronLeft,
  AlertTriangle,
  Zap,
  Upload,
  MessageSquare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { CarStatusBadge } from "@/components/features/CarStatusBadge";
import { CarActions } from "@/components/features/CarActions";
import { useCar } from "@/hooks/api/useCars";
import { useImages } from "@/hooks/useImages";
import { useAuth } from "@/contexts/AuthContext";
import { carsApi } from "@/lib/api/cars";
import {
  formatPrice,
  formatMileage,
  formatEngineSize,
  formatTransmission,
  formatFuelType,
  formatCarTitle,
} from "@/lib/formatters";
import { normalizeImages } from "@/lib/car-utils";
import type { Car } from "@/lib/api/types";
import { carEvents } from "@/lib/events/carEvents";

export default function DealerCarDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const carId = parseInt(params.id as string);

  // State
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Hooks
  const { car, loading, error, refetch } = useCar(carId);
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
      // ✅ שליחת event
      carEvents.emitCarUpdate(car.id, "image", { imageId });
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

    const currentValue = car.isAvailable ?? true;
    const newValue = !currentValue;

    if (currentValue && !newValue) {
      const confirmed = window.confirm(
        "האם אתה בטוח שברצונך להסתיר את הרכב מהקונים?"
      );
      if (!confirmed) return;
    }

    try {
      setActionLoading(true);

      // 1. עדכן בשרת
      await carsApi.toggleCarAvailability(car.id, newValue);

      // 2. שלח event לעמודים אחרים
      carEvents.emitCarUpdate(car.id, "availability", {
        isAvailable: newValue,
      });

      // 3. ✅ עדכן את הנתונים המקומיים - זה חסר!
      await refetch();

      toast.success(newValue ? "הרכב מוצג כעת לקונים" : "הרכב הוסתר מהקונים");
    } catch (error) {
      console.error("Toggle error:", error);
      toast.error("שגיאה בשינוי מצב הרכב");
    } finally {
      setActionLoading(false);
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
    if (!car) return; // ✅ הוסף בדיקה

    setIsEditMode(false);
    refetch();

    // ✅ הוסף event
    carEvents.emitCarUpdate(car.id, "update", {
      action: "edit_completed",
      carId: car.id,
    });

    toast.success("הרכב עודכן בהצלחה");
  };

  // ✅ Delete עם API ישיר
  const handleDelete = async () => {
    if (!car) return;
    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק את הרכב? פעולה זו לא ניתנת לביטול."
      )
    ) {
      try {
        setActionLoading(true);
        await carsApi.deleteCar(car.id);

        // ✅ הוסף event
        carEvents.emitCarUpdate(car.id, "delete", {
          action: "car_deleted",
          carId: car.id,
        });

        toast.success("הרכב נמחק בהצלחה");
        router.push("/dealer/cars");
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("שגיאה במחיקת הרכב");
      } finally {
        setActionLoading(false);
      }
    }
  };

  // ✅ Mark as sold עם API ישיר
  const handleMarkSold = async () => {
    if (!car) return;

    const confirmed = window.confirm(
      "האם אתה בטוח שברצונך לסמן את הרכב כנמכר?"
    );
    if (!confirmed) return;

    try {
      setActionLoading(true);
      await carsApi.updateCar(car.id, { status: "sold" });

      // ✅ שלח event
      carEvents.emitCarUpdate(car.id, "status", { status: "sold" });

      await refetch();
      toast.success("הרכב סומן כנמכר בהצלחה");
    } catch (error) {
      console.error("Mark sold error:", error);
      toast.error("שגיאה בסימון הרכב כנמכר");
    } finally {
      setActionLoading(false);
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/buyer/cars/${carId}`;
    const title = car
      ? formatCarTitle(car.make, car.model, car.year)
      : "רכב למכירה";

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
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/dealer/cars" className="hover:text-blue-600">
            הרכבים שלי
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <Link href={`/dealer/cars/${car.id}`} className="hover:text-blue-600">
            {formatCarTitle(car.make, car.model, car.year)}
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-gray-900">עריכה</span>
        </nav>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  עריכת פרטי הרכב
                </h1>
                <p className="text-gray-600 mt-1">
                  {formatCarTitle(car.make, car.model, car.year)}
                </p>
              </div>
              <Button variant="outline" onClick={handleCancelEdit}>
                ביטול
              </Button>
            </div>
          </CardContent>
        </Card>

        <CarForm car={car} onSuccess={handleSaveEdit} mode="edit" />
      </div>
    );
  }

  // View Mode
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Car Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {formatCarTitle(car.make, car.model, car.year)}
              </h1>
              <div className="flex items-center gap-4 text-gray-600 mb-4">
                {car.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {car.city}
                  </span>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <CarStatusBadge
              car={car}
              interactive={car.status === "active"}
              onToggleAvailability={
                car.status === "active" ? handleToggleAvailability : undefined
              }
              loading={actionLoading}
            />
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
              {car.status === "active" && (
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
                        disabled={false}
                        uploading={false}
                        existingImages={car?.images?.map((img) =>
                          typeof img === "string" ? img : img.image_url
                        )}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              )}

              <ImageGallery
                images={normalizeImages(car.images, car.id)}
                isOwner={car.status === "active"}
                onSetMain={
                  car.status === "active" ? handleSetMainImage : undefined
                }
                onDelete={
                  car.status === "active" ? handleDeleteImage : undefined
                }
                className="space-y-4"
              />
            </CardContent>
          </Card>

          {/* Car Specifications */}
          <Card>
            <CardContent className="space-y-6 p-6">
              {/* Price */}
              <div className="text-center py-6 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-4xl font-bold text-blue-600">
                  {formatPrice(car.price)}
                </div>
                <div className="text-sm text-blue-500 mt-1">מחיר המכירה</div>
              </div>

              {/* Specifications Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <Calendar className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-1">שנתון</div>
                  <div className="font-semibold text-gray-900">{car.year}</div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <Gauge className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-1">קילומטראז'</div>
                  <div className="font-semibold text-gray-900">
                    {car.mileage ? formatMileage(car.mileage) : "לא צוין"}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <CarIcon className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-1">יד</div>
                  <div className="font-semibold text-gray-900">
                    {(car as any).hand || "לא צוין"}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <Settings className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-1">נפח מנוע</div>
                  <div className="font-semibold text-gray-900">
                    {formatEngineSize((car as any).engineSize)}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <Fuel className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-1">סוג דלק</div>
                  <div className="font-semibold text-gray-900">
                    {formatFuelType(car.fuelType)}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <Settings className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-1">תיבת הילוכים</div>
                  <div className="font-semibold text-gray-900">
                    {formatTransmission(car.transmission)}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <MapPin className="w-5 h-5 text-gray-600 mx-auto mb-2" />
                  <div className="text-xs text-gray-600 mb-1">עיר</div>
                  <div className="font-semibold text-gray-900">
                    {car.city || "לא צוין"}
                  </div>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-lg border">
                  <div className="w-5 h-5 mx-auto mb-2 rounded-full bg-gray-400"></div>
                  <div className="text-xs text-gray-600 mb-1">צבע</div>
                  <div className="font-semibold text-gray-900">
                    {car.color || "לא צוין"}
                  </div>
                </div>
              </div>

              {/* Description */}
              {car.description && (
                <div className="pt-4 border-t border-gray-200">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {car.description}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <CarActions
            car={car}
            onShare={handleShare}
            onEdit={handleEdit}
            onMarkSold={handleMarkSold}
            onDelete={handleDelete}
            loading={actionLoading}
          />

          {/* Status Information Cards */}
          {car.status === "sold" && (
            <Card className="bg-purple-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-sm text-purple-800 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  רכב נמכר
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-purple-700">
                  הרכב הזה נמכר בהצלחה ואינו זמין יותר לקונים. נתונים אלה נשמרים
                  לצורך מעקב וניהול.
                </p>
              </CardContent>
            </Card>
          )}

          {car.status === "deleted" && (
            <Card className="bg-red-50 border-red-200">
              <CardHeader>
                <CardTitle className="text-sm text-red-800 flex items-center gap-2">
                  <Trash2 className="w-5 h-5" />
                  רכב נמחק
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700">
                  הרכב הזה נמחק מהמערכת ואינו מוצג לקונים.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Performance Tips */}
          {car.status === "active" && (
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
          )}
        </div>
      </div>
    </div>
  );
}
