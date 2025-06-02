// app-new/(dashboard)/dealer/cars/[id]/page.tsx - Car Details & Management Page for Dealers
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
  ChevronRight,
  ImageIcon,
  ExternalLink,
  AlertTriangle,
  TrendingUp,
  Users,
  MessageSquare,
  Heart,
  DollarSign,
  Clock,
  BarChart3,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import CarForm from "@/components/forms/CarForm";
import { useCar } from "@/hooks/api/useCars";
import { useDealerCars } from "@/hooks/api/useCars";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/api/types";

// Mock analytics data
const ANALYTICS_DATA = {
  views: {
    total: 247,
    thisWeek: 43,
    trend: "+12%",
  },
  inquiries: {
    total: 8,
    thisWeek: 3,
    trend: "+25%",
  },
  favorites: {
    total: 12,
    thisWeek: 2,
    trend: "+5%",
  },
  clicks: {
    total: 89,
    thisWeek: 15,
    trend: "+8%",
  },
};

// Mock recent activity
const RECENT_ACTIVITY = [
  {
    id: 1,
    type: "view",
    description: "משתמש צפה ברכב",
    time: "לפני 2 שעות",
    icon: <Eye className="w-4 h-4" />,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "inquiry",
    description: "דני כהן שלח פנייה",
    time: "אתמול",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "favorite",
    description: "נשמר למועדפים",
    time: "לפני 2 ימים",
    icon: <Heart className="w-4 h-4" />,
    color: "text-red-600",
  },
];

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);

  // Hooks
  const { car, loading, error, refetch } = useCar(carId);
  const {
    updateCar,
    deleteCar,
    markAsSold,
    toggleAvailability,
    actionLoading,
  } = useDealerCars();

  // Check ownership
  useEffect(() => {
    if (car && user && car.dealerId !== user.id) {
      toast.error("אין לך הרשאה לצפות ברכב זה");
      router.push("/dealer/cars");
    }
  }, [car, user, router]);

  // Image navigation
  const nextImage = () => {
    const images = car?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    const images = car?.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    }
  };

  // Actions
  const handleEdit = () => {
    setIsEditing(true);
    setActiveTab("edit");
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setActiveTab("overview");
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
    setActiveTab("overview");
    refetch(); // Refresh car data
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

  const handleToggleAvailability = async () => {
    if (!car) return;

    const success = await toggleAvailability(car.id, !car.isAvailable);
    if (success) {
      toast.success(
        car.isAvailable ? "הרכב הוסתר מהמכירה" : "הרכב הוצג למכירה"
      );
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

  const images = car.images || [];

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

              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(car.status)}>
                  {getStatusLabel(car.status)}
                </Badge>
                {car.isFeatured && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    מומלץ
                  </Badge>
                )}
                {!car.isAvailable && <Badge variant="secondary">מוסתר</Badge>}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                שתף
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleAvailability}
                disabled={actionLoading[car.id]}
              >
                {car.isAvailable ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    הסתר
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    הצג
                  </>
                )}
              </Button>

              {car.status === "active" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkSold}
                  disabled={actionLoading[car.id]}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  סמן כנמכר
                </Button>
              )}

              <Button variant="outline" size="sm" onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                עריכה
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={actionLoading[car.id]}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                מחק
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">סקירה</TabsTrigger>
          <TabsTrigger value="analytics">סטטיסטיקות</TabsTrigger>
          <TabsTrigger value="activity">פעילות</TabsTrigger>
          <TabsTrigger value="edit">עריכה</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Car Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card>
                <CardContent className="p-0">
                  <div className="relative bg-gray-100 aspect-video rounded-t-lg overflow-hidden">
                    {images.length > 0 ? (
                      <>
                        <img
                          src={images[currentImageIndex]}
                          alt={`${car.make} ${car.model} - תמונה ${
                            currentImageIndex + 1
                          }`}
                          className="w-full h-full object-cover"
                        />

                        {images.length > 1 && (
                          <>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                              onClick={prevImage}
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70"
                              onClick={nextImage}
                            >
                              <ChevronLeft className="w-4 h-4" />
                            </Button>
                          </>
                        )}

                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-sm px-2 py-1 rounded">
                          {currentImageIndex + 1} / {images.length}
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-400">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p>אין תמונות</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="p-4 border-t">
                      <div className="flex gap-2 overflow-x-auto">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={cn(
                              "flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors",
                              index === currentImageIndex
                                ? "border-blue-500"
                                : "border-gray-200 hover:border-gray-300"
                            )}
                          >
                            <img
                              src={image}
                              alt={`תמונה ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Car Details */}
              <Card>
                <CardHeader>
                  <CardTitle>פרטי הרכב</CardTitle>
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
                        <div className="text-sm text-gray-600">
                          תיבת הילוכים
                        </div>
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
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    ביצועים מהירים
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">צפיות השבוע</span>
                    <span className="font-semibold text-blue-600">
                      {ANALYTICS_DATA.views.thisWeek}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">פניות</span>
                    <span className="font-semibold text-green-600">
                      {ANALYTICS_DATA.inquiries.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">מועדפים</span>
                    <span className="font-semibold text-red-600">
                      {ANALYTICS_DATA.favorites.total}
                    </span>
                  </div>
                </CardContent>
              </Card>

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
                    onClick={() =>
                      window.open(`/buyer/cars/${car.id}`, "_blank")
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    צפה כקונה
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleEdit}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    ערוך פרטים
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setActiveTab("analytics")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    סטטיסטיקות
                  </Button>
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
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">סך צפיות</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {ANALYTICS_DATA.views.total}
                    </p>
                    <p className="text-xs text-green-600">
                      {ANALYTICS_DATA.views.trend} השבוע
                    </p>
                  </div>
                  <Eye className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">פניות</p>
                    <p className="text-2xl font-bold text-green-600">
                      {ANALYTICS_DATA.inquiries.total}
                    </p>
                    <p className="text-xs text-green-600">
                      {ANALYTICS_DATA.inquiries.trend} השבוע
                    </p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">מועדפים</p>
                    <p className="text-2xl font-bold text-red-600">
                      {ANALYTICS_DATA.favorites.total}
                    </p>
                    <p className="text-xs text-green-600">
                      {ANALYTICS_DATA.favorites.trend} השבוע
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">קליקים</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {ANALYTICS_DATA.clicks.total}
                    </p>
                    <p className="text-xs text-green-600">
                      {ANALYTICS_DATA.clicks.trend} השבוע
                    </p>
                  </div>
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Chart Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>ביצועים לאורך זמן</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-2" />
                  <p>גרף ביצועים יתווסף בעתיד</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                פעילות אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {RECENT_ACTIVITY.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={cn("mt-0.5", activity.color)}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Edit Tab */}
        <TabsContent value="edit">
          {isEditing ? (
            <CarForm car={car} onSuccess={handleSaveEdit} mode="edit" />
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <Edit className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  עריכת פרטי הרכב
                </h3>
                <p className="text-gray-600 mb-4">
                  לחץ על כפתור העריכה כדי לערוך את פרטי הרכב
                </p>
                <Button onClick={handleEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  התחל עריכה
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
