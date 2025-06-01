"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Car,
  Loader2,
  ArrowLeft,
} from "lucide-react";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

// Types
interface CarRequest {
  id: number;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMax?: number;
  requirements?: string;
  status: string;
  createdAt: string;
}

interface Inquiry {
  id: number;
  car?: {
    id: number;
    make: string;
    model: string;
    year: number;
    price: number;
  };
  dealer?: {
    businessName: string;
    phone?: string;
  };
  message: string;
  status: string;
  createdAt: string;
}

interface SavedCar {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  color?: string;
  city?: string;
  savedAt: string;
}

const BuyerRequestsPage = () => {
  const router = useRouter();

  // ✅ השתמש רק ב-useAuth
  const { user, isAuthenticated, isLoading } = useAuth();

  // ✅ State לבדיקת client-side
  const [isClient, setIsClient] = useState(false);

  // States
  const [requests, setRequests] = useState<CarRequest[]>([]);
  const [savedCars, setSavedCars] = useState<SavedCar[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showInactiveModal, setShowInactiveModal] = useState<CarRequest | null>(
    null
  );
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  // ✅ בדיקת client-side - מונע SSR issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Helper functions מוגנות מ-SSR
  const getLocalStorageItem = (
    key: string,
    defaultValue: string = ""
  ): string => {
    if (!isClient) return defaultValue;
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const setLocalStorageItem = (key: string, value: string): void => {
    if (!isClient) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error("Error setting localStorage:", error);
    }
  };

  const removeLocalStorageItem = (key: string): void => {
    if (!isClient) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error("Error removing localStorage:", error);
    }
  };

  // ✅ Debug console logs - רק בצד הלקוח
  useEffect(() => {
    if (!isClient) return;

    console.log("🔍 BuyerRequestsPage Debug:", {
      isAuthenticated,
      isLoading,
      user: user ? `${user.firstName} ${user.lastName}` : null,
      userType: user?.userType,
      localStorage_token: getLocalStorageItem("auth_token")
        ? "exists"
        : "missing",
    });
  }, [isClient, isAuthenticated, isLoading, user]);

  // ✅ בדיקת authentication נכונה
  useEffect(() => {
    if (!isClient) return; // ✅ תיקון - הוסף בתחילת useEffect

    console.log("🔍 Auth check:", { isLoading, isAuthenticated });

    // חכה שהאימות יסתיים
    if (isLoading) return;

    // אם לא מחובר - הפנה להתחברות
    if (!isAuthenticated) {
      console.log("❌ Not authenticated, redirecting to login");
      router.push("/auth/login");
      return;
    }

    // בדיקת סוג משתמש
    if (user?.userType !== "buyer") {
      console.log("❌ Not a buyer, redirecting");
      router.push("/dealer/home");
      return;
    }

    console.log("✅ Authentication OK, loading data");
  }, [isClient, isLoading, isAuthenticated, user, router]); // ✅ תיקון - הוסף isClient

  // ✅ טעינת נתונים - רק אחרי אימות מוצלח
  useEffect(() => {
    if (!isClient || isLoading || !isAuthenticated || !user) {
      // ✅ תיקון - הוסף !isClient
      return; // עדיין ממתין או לא מחובר
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // ✅ השתמש ב-auth_token (עקבי!)
        const token = getLocalStorageItem("auth_token");

        if (!token) {
          console.log("❌ No auth_token found");
          router.push("/auth/login");
          return;
        }

        console.log(
          "🔄 Loading data with token:",
          token.substring(0, 20) + "..."
        );

        // API calls
        const [requestsResponse, inquiriesResponse] = await Promise.all([
          fetch(`${API_URL}/api/car-requests/my-requests`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
          fetch(`${API_URL}/api/inquiries/sent`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }),
        ]);

        console.log("📡 API Responses:", {
          requests: requestsResponse.status,
          inquiries: inquiriesResponse.status,
        });

        // Process responses
        if (requestsResponse.ok) {
          const requestsData = await requestsResponse.json();
          console.log("📋 Requests data:", requestsData);
          if (requestsData.success) {
            setRequests(requestsData.data.requests || []);
          }
        } else {
          console.warn("❌ Car requests API failed:", requestsResponse.status);
        }

        if (inquiriesResponse.ok) {
          const inquiriesData = await inquiriesResponse.json();
          console.log("💬 Inquiries data:", inquiriesData);
          if (inquiriesData.success) {
            setInquiries(inquiriesData.data.inquiries || []);
          }
        } else {
          console.warn("❌ Inquiries API failed:", inquiriesResponse.status);
        }

        // Load saved cars from localStorage
        const savedCarsData = JSON.parse(
          getLocalStorageItem("savedCars", "[]")
        );
        setSavedCars(savedCarsData);

        console.log("✅ Data loaded successfully");
      } catch (error) {
        console.error("❌ Error loading data:", error);
        setError(
          error instanceof Error ? error.message : "שגיאה בטעינת הנתונים"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isClient, isLoading, isAuthenticated, user, router]); // ✅ תיקון - הוסף isClient

  // Helper functions
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

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
    return date.toLocaleDateString("he-IL");
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "fulfilled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "active":
        return "פעיל";
      case "inactive":
        return "לא פעיל";
      case "fulfilled":
        return "הושלם";
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "inactive":
        return <XCircle className="h-3 w-3" />;
      case "fulfilled":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getInquiryStatusColor = (status: string): string => {
    switch (status) {
      case "new":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "responded":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "closed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getInquiryStatusText = (status: string): string => {
    switch (status) {
      case "new":
        return "נשלח";
      case "responded":
        return "נענה";
      case "closed":
        return "סגור";
      default:
        return status;
    }
  };

  const getInquiryStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="h-3 w-3" />;
      case "responded":
        return <Eye className="h-3 w-3" />;
      case "closed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getTransmissionText = (transmission: string): string => {
    switch (transmission) {
      case "automatic":
        return "אוטומטית";
      case "manual":
        return "ידנית";
      case "cvt":
        return "CVT";
      default:
        return transmission || "";
    }
  };

  const getFuelTypeText = (fuelType: string): string => {
    switch (fuelType) {
      case "gasoline":
        return "בנזין";
      case "diesel":
        return "דיזל";
      case "hybrid":
        return "היברידי";
      case "electric":
        return "חשמלי";
      default:
        return fuelType || "";
    }
  };

  // Update request status
  const handleStatusChange = async (request: CarRequest, newStatus: string) => {
    if (newStatus === "inactive") {
      setShowInactiveModal(request);
      return;
    }

    try {
      setUpdatingStatus(request.id);
      const token = getLocalStorageItem("auth_token");

      if (!token) {
        setError("לא נמצא token - אנא התחבר מחדש");
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/car-requests/${request.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === request.id ? { ...req, status: newStatus } : req
          )
        );
      } else {
        throw new Error(data.message || "שגיאה לא ידועה");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      const errorMessage =
        error instanceof Error ? error.message : "שגיאה בעדכון הסטטוס";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const confirmInactive = async () => {
    if (showInactiveModal) {
      await handleStatusChange(showInactiveModal, "inactive");
      setShowInactiveModal(null);
    }
  };

  const removeSavedCar = (carId: number) => {
    if (!isClient) return;
    const updatedCars = savedCars.filter((car) => car.id !== carId);
    setSavedCars(updatedCars);
    setLocalStorageItem("savedCars", JSON.stringify(updatedCars));
  };

  // ✅ SSR Safe - לא מרנדר עד שהclient מוכן
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  // ✅ Loading state מסודר
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">בודק אימות...</p>
        </div>
      </div>
    );
  }

  // ✅ Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">שגיאה</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>נסה שוב</Button>
        </div>
      </div>
    );
  }

  // ✅ רק אחרי שהאימות הסתיים
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            נדרשת התחברות
          </h1>
          <p className="text-gray-600 mb-4">
            אנא התחבר כדי לראות את הבקשות שלך
          </p>
          <Button onClick={() => router.push("/auth/login")}>התחבר</Button>
        </div>
      </div>
    );
  }

  // ✅ Loading של נתונים (אחרי אימות מוצלח)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  const activeRequests = requests.filter((req) => req.status === "active");
  const inactiveRequests = requests.filter((req) => req.status !== "active");

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push("/buyer/home")}
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה לדף הבית
            </Button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="h-6 w-6" />
                הבקשות והמודעות שלי
              </h1>
              <p className="text-gray-600 mt-1">
                {activeRequests.length} בקשות פעילות • {savedCars.length} מודעות
                שמורות • {inquiries.length} פניות ששלחתי
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                onClick={() => router.push("/buyer/post-request")}
              >
                <Plus className="h-4 w-4" />
                בקשה חדשה
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* רשימת בקשות פעילות */}
        {activeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              בקשות פעילות ({activeRequests.length})
            </h2>

            <div className="space-y-4">
              {activeRequests.map((request) => (
                <Card
                  key={request.id}
                  className="hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* מידע ראשי */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              מחפש {request.make} {request.model || ""}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {getTimeAgo(request.createdAt)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${getStatusColor(
                                request.status
                              )} border flex items-center gap-1`}
                            >
                              {getStatusIcon(request.status)}
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* פרטים טכניים */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          {(request.yearMin || request.yearMax) && (
                            <div>
                              <span className="text-gray-500">שנים:</span>
                              <div className="font-medium">
                                {request.yearMin || "..."} -{" "}
                                {request.yearMax || "..."}
                              </div>
                            </div>
                          )}

                          {request.priceMax && (
                            <div>
                              <span className="text-gray-500">
                                מחיר מקסימלי:
                              </span>
                              <div className="font-medium">
                                {formatPrice(request.priceMax)}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* תיאור */}
                        {request.requirements && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700 text-sm leading-relaxed">
                              {request.requirements}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* פעולות */}
                      <div className="lg:w-48 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleStatusChange(request, "inactive")
                          }
                          disabled={updatingStatus === request.id}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          {updatingStatus === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                          סמן כלא רלוונטי
                        </Button>

                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                          <div className="font-semibold mb-1">בקשה פעילה</div>
                          <div>סוחרים יכולים לראות את הבקשה</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* מודעות ששמרתי */}
        {savedCars.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              מודעות ששמרתי ({savedCars.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCars.map((car) => (
                <Card
                  key={car.id}
                  className="hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {car.make} {car.model} {car.year}
                        </h3>
                        <div className="text-sm text-gray-600">{car.city}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          {formatPrice(car.price)}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1 mb-3">
                      {car.mileage && <div>{formatMileage(car.mileage)}</div>}
                      {car.transmission && car.fuelType && (
                        <div>
                          {getTransmissionText(car.transmission)} •{" "}
                          {getFuelTypeText(car.fuelType)}
                        </div>
                      )}
                      {car.color && <div>{car.color}</div>}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>
                        נשמר ב-
                        {new Date(car.savedAt).toLocaleDateString("he-IL")}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                        onClick={() => router.push(`/buyer/cars/${car.id}`)}
                      >
                        צפה במודעה
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => removeSavedCar(car.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        הסר
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* הפניות ששלחתי */}
        {inquiries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              הפניות ששלחתי ({inquiries.length})
            </h2>

            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card
                  key={inquiry.id}
                  className="hover:shadow-md transition-all duration-200"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      {/* מידע הרכב */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {inquiry.car
                                ? `${inquiry.car.make} ${inquiry.car.model} ${inquiry.car.year}`
                                : "פנייה לסוחר"}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              {inquiry.car && (
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  {formatPrice(inquiry.car.price)}
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {getTimeAgo(inquiry.createdAt)}
                              </div>
                              <div>
                                סוחר:{" "}
                                {inquiry.dealer?.businessName || "לא ידוע"}
                              </div>
                            </div>
                          </div>

                          <Badge
                            className={`${getInquiryStatusColor(
                              inquiry.status
                            )} border flex items-center gap-1`}
                          >
                            {getInquiryStatusIcon(inquiry.status)}
                            {getInquiryStatusText(inquiry.status)}
                          </Badge>
                        </div>

                        {/* הודעה ששלחתי */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <div className="text-sm font-medium text-blue-900 mb-2">
                            ההודעה ששלחתי:
                          </div>
                          <p className="text-blue-700 text-sm leading-relaxed">
                            {inquiry.message}
                          </p>
                        </div>
                      </div>

                      {/* פעולות */}
                      <div className="lg:w-48 flex flex-col gap-2">
                        {inquiry.car && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() =>
                              router.push(`/buyer/cars/${inquiry.car?.id}`)
                            }
                          >
                            <Eye className="h-4 w-4" />
                            צפה ברכב
                          </Button>
                        )}

                        {inquiry.dealer?.phone && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                            onClick={() =>
                              window.open(
                                `tel:${inquiry.dealer?.phone}`,
                                "_self"
                              )
                            }
                          >
                            📞 {inquiry.dealer.phone}
                          </Button>
                        )}

                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                          <div className="font-semibold mb-1">
                            {inquiry.status === "new" && "הפניה נשלחה"}
                            {inquiry.status === "responded" && "הסוחר ענה"}
                            {inquiry.status === "closed" && "הפניה נסגרה"}
                          </div>
                          <div>
                            {inquiry.status === "new" && "ממתין לתגובה"}
                            {inquiry.status === "responded" && "יצרו איתך קשר"}
                            {inquiry.status === "closed" && "תהליך הושלם"}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* רשימת בקשות לא רלוונטיות */}
        {inactiveRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-gray-600" />
              בקשות לא פעילות ({inactiveRequests.length})
            </h2>

            <div className="space-y-4">
              {inactiveRequests.map((request) => (
                <Card key={request.id} className="opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">
                          מחפש {request.make} {request.model || ""}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{getTimeAgo(request.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${getStatusColor(
                            request.status
                          )} border flex items-center gap-1`}
                        >
                          {getStatusIcon(request.status)}
                          {getStatusText(request.status)}
                        </Badge>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request, "active")}
                          disabled={updatingStatus === request.id}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          {updatingStatus === request.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                          החזר לפעיל
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* מסך ריק */}
        {requests.length === 0 &&
          savedCars.length === 0 &&
          inquiries.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  אין פעילות עדיין
                </h3>
                <p className="text-gray-600 mb-6">
                  פרסם בקשת "אני מחפש", שמור מודעות או שלח פניות לסוחרים
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => router.push("/buyer/post-request")}
                  >
                    <Plus className="h-4 w-4 ml-2" />
                    פרסם בקשה
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/buyer/cars")}
                  >
                    <Car className="h-4 w-4 ml-2" />
                    חפש רכבים
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
      </div>

      {/* Modal אישור */}
      {showInactiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                סימון כלא פעיל
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                האם אתה בטוח שברצונך לסמן את הבקשה כלא פעילה?
                <br />
                <strong>
                  {showInactiveModal.make} {showInactiveModal.model}
                </strong>
              </p>

              <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700">
                <strong>שים לב:</strong> הבקשה תיעלם מחיפושי הסוחרים, אבל תוכל
                להחזיר אותה לפעילות מתי שתרצה.
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={confirmInactive}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  כן, סמן כלא פעיל
                </Button>
                <Button
                  onClick={() => setShowInactiveModal(null)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BuyerRequestsPage;
