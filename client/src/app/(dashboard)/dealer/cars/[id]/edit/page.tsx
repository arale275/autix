"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, AlertTriangle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CarForm from "@/components/forms/CarForm";
import { useCar } from "@/hooks/api/useCars";
import { formatCarTitle } from "@/lib/formatters";
import { carEvents } from "@/lib/events/carEvents";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useCarRoute } from "@/hooks/auth/useProtectedRoute";

export default function DealerCarEditPage() {
  const params = useParams();
  const router = useRouter();

  const carId = parseInt(params.id as string);

  // Hooks
  const { car, loading, error, refetch } = useCar(carId);

  // Check ownership
  const { hasAccess, isLoading: authLoading } = useCarRoute(car, {
    checkOwnership: true,
    requiredStatus: "active",
  });

  // פונקציות
  const handleSaveSuccess = () => {
    // שלח event לעדכון דפים אחרים
    if (car) {
      carEvents.emitCarUpdate(car.id, "update", {
        action: "edit_completed",
        carId: car.id,
      });
    }
    // חזור לדף הצפייה
    router.push(`/dealer/cars/${carId}`);
  };

  const handleCancel = () => {
    if (window.confirm("האם אתה בטוח שברצונך לבטל? השינויים לא יישמרו.")) {
      router.push(`/dealer/cars/${carId}`);
    }
  };

  // Loading state - כולל בדיקת הרשאות
  if (loading || authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  // בדיקת הרשאות
  if (!hasAccess) {
    return null; // useCarRoute כבר טיפל בredirect
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
              {error || "הרכב המבוקש לא קיים או שאין לך הרשאה לערוך אותו"}
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

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                עריכת פרטי הרכב
              </h1>
              <p className="text-gray-600">
                {formatCarTitle(car.make, car.model, car.year)}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                ביטול
              </Button>

              <Link href={`/dealer/cars/${carId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  חזור לצפייה
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Info Section */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <ErrorBoundary>
            <CarForm
              car={car}
              onSuccess={handleSaveSuccess}
              mode="edit"
              // props נוספים אם צריך
            />
          </ErrorBoundary>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Edit Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
                <Save className="w-5 h-5" />
                טיפים לעריכה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="text-sm text-blue-700 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  בדוק את המחיר בהשוואה לרכבים דומים
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  עדכן את התיאור אם השתנה משהו ברכב
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  וודא שהקילומטראז' מעודכן
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  הוסף פרטים על שירותים ותחזוקה
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Warning Card */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                שים לב
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700">
                שינויים משמעותיים במחיר או בפרטי הרכב עלולים להשפיע על פניות
                שכבר התקבלו.
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">פעולות מהירות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/dealer/cars/${carId}`} className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  חזור לצפייה ברכב
                </Button>
              </Link>

              <Link href="/dealer/cars" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  חזור למלאי
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
