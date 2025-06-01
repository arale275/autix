"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Heart,
  Mail,
  MapPin,
  Calendar,
  Eye,
  MessageCircle,
  Car,
  Fuel,
  Gauge,
  Settings,
  Palette,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Loader2,
} from "lucide-react";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

// Types
interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  engineSize?: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  city?: string;
  status: string;
  createdAt: string;
  description?: string;
  isAvailable: boolean;
  dealer?: {
    id: number;
    businessName: string;
    phone?: string;
    city?: string;
  };
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  userType: string;
}

const CarDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const carId = params?.id;

  const [car, setCar] = useState<Car | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [submittingInquiry, setSubmittingInquiry] = useState(false);

  // טופס הפניה
  const [inquiryForm, setInquiryForm] = useState({
    message: "שלום, אני מעוניין ברכב ואשמח לקבוע פגישה לצפייה ונסיעת מבחן.",
    interestedInTestDrive: true,
    interestedInFinancing: false,
    offerPrice: "",
    availableTimes: "גמיש עם הזמנים - בוקר או אחר הצהריים",
  });

  // Helper Functions
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

  const getTransmissionText = (transmission: string): string => {
    switch (transmission) {
      case "automatic":
        return "אוטומטית";
      case "manual":
        return "ידנית";
      case "cvt":
        return "CVT";
      default:
        return transmission || "לא צוין";
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
        return fuelType || "לא צוין";
    }
  };

  // Load car data and user data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load user data
        const userData = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (userData) {
          setUser(JSON.parse(userData));
        }

        // Load car data
        if (carId) {
          const response = await fetch(`${API_URL}/api/cars/${carId}`);
          const data = await response.json();

          if (data.success) {
            setCar(data.data);
          } else {
            setError("רכב לא נמצא");
          }
        }
      } catch (error) {
        console.error("Error loading car:", error);
        setError("שגיאה בטעינת פרטי הרכב");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [carId]);

  // Check if car is saved in favorites
  useEffect(() => {
    if (car) {
      const savedCars = JSON.parse(localStorage.getItem("savedCars") || "[]");
      const isCarSaved = savedCars.some(
        (savedCar: any) => savedCar.id === car.id
      );
      setIsFavorite(isCarSaved);
    }
  }, [car]);

  const handleInquirySubmit = async () => {
    if (!user || !car) {
      alert("אנא התחבר כדי לשלוח פניה");
      return;
    }

    try {
      setSubmittingInquiry(true);
      const token = localStorage.getItem("token");

      const inquiryData = {
        car_id: car.id,
        dealer_id: car.dealer?.id,
        message: inquiryForm.message,
        metadata: {
          interestedInTestDrive: inquiryForm.interestedInTestDrive,
          interestedInFinancing: inquiryForm.interestedInFinancing,
          offerPrice: inquiryForm.offerPrice
            ? parseInt(inquiryForm.offerPrice)
            : null,
          availableTimes: inquiryForm.availableTimes,
        },
      };

      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(inquiryData),
      });

      const data = await response.json();

      if (data.success) {
        setInquirySubmitted(true);
        setShowInquiryForm(false);
      } else {
        alert("שגיאה בשליחת הפניה: " + (data.message || "שגיאה לא ידועה"));
      }
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      alert("שגיאה בשליחת הפניה");
    } finally {
      setSubmittingInquiry(false);
    }
  };

  const toggleFavorite = () => {
    if (!car) return;

    const savedCars = JSON.parse(localStorage.getItem("savedCars") || "[]");

    if (!isFavorite) {
      // הוספה למודעות שלי
      const carToSave = {
        ...car,
        savedAt: new Date().toISOString().split("T")[0],
      };
      localStorage.setItem(
        "savedCars",
        JSON.stringify([...savedCars, carToSave])
      );
      setIsFavorite(true);
    } else {
      // הסרה מהמודעות שלי
      const updatedCars = savedCars.filter(
        (savedCar: any) => savedCar.id !== car.id
      );
      localStorage.setItem("savedCars", JSON.stringify(updatedCars));
      setIsFavorite(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען פרטי רכב...</p>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            רכב לא נמצא
          </h1>
          <p className="text-gray-600 mb-4">
            {error || "הרכב שחיפשת לא קיים במערכת"}
          </p>
          <Button onClick={() => router.push("/buyer/cars")}>
            חזרה לחיפוש רכבים
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => router.push("/buyer/cars")}
              >
                <ArrowLeft className="h-4 w-4" />
                חזרה לתוצאות
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorite}
                className={`flex items-center gap-2 ${
                  isFavorite ? "text-red-600" : ""
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
                />
                {isFavorite ? "שמור במודעות שלי" : "שמור במודעות שלי"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* עמודה ראשית - פרטי הרכב */}
          <div className="lg:col-span-2 space-y-6">
            {/* תמונה ראשית */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Car className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p>תמונות הרכב יתווספו בקרוב</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* כותרת ומחיר */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {car.make} {car.model} {car.year}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {car.city && `${car.city} • `}
                      פורסם ב-
                      {new Date(car.createdAt).toLocaleDateString("he-IL")}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(car.price)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* פרטים טכניים */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  פרטים טכניים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {car.mileage && (
                    <div className="flex items-center gap-3">
                      <Gauge className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">קילומטרים</div>
                        <div className="font-semibold">
                          {formatMileage(car.mileage)}
                        </div>
                      </div>
                    </div>
                  )}

                  {car.transmission && (
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">
                          תיבת הילוכים
                        </div>
                        <div className="font-semibold">
                          {getTransmissionText(car.transmission)}
                        </div>
                      </div>
                    </div>
                  )}

                  {car.fuelType && (
                    <div className="flex items-center gap-3">
                      <Fuel className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">סוג דלק</div>
                        <div className="font-semibold">
                          {getFuelTypeText(car.fuelType)}
                        </div>
                      </div>
                    </div>
                  )}

                  {car.engineSize && (
                    <div className="flex items-center gap-3">
                      <Car className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">נפח מנוע</div>
                        <div className="font-semibold">{car.engineSize}</div>
                      </div>
                    </div>
                  )}

                  {car.color && (
                    <div className="flex items-center gap-3">
                      <Palette className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">צבע</div>
                        <div className="font-semibold">{car.color}</div>
                      </div>
                    </div>
                  )}

                  {car.city && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-500" />
                      <div>
                        <div className="text-sm text-gray-600">מיקום</div>
                        <div className="font-semibold">{car.city}</div>
                      </div>
                    </div>
                  )}
                </div>

                <Badge
                  className={`mt-4 ${
                    car.isAvailable
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  } hover:bg-current`}
                >
                  {car.isAvailable ? "זמין למכירה" : "לא זמין"}
                </Badge>
              </CardContent>
            </Card>

            {/* תיאור */}
            {car.description && (
              <Card>
                <CardHeader>
                  <CardTitle>תיאור הרכב</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">
                    {car.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* עמודה שמאלית - פרטי הסוחר ופעולות */}
          <div className="space-y-6">
            {/* פרטי הסוחר */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">פרטי הסוחר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold text-gray-900">
                    {car.dealer?.businessName || "סוחר"}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">סוחר מורשה</div>
                  {car.dealer?.city && (
                    <div className="text-sm text-gray-600">
                      {car.dealer.city}
                    </div>
                  )}
                </div>
                {car.dealer?.phone && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      window.open(`tel:${car.dealer?.phone}`, "_self")
                    }
                  >
                    📞 {car.dealer.phone}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* שליחת פניה */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">מעוניין ברכב?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <>
                    <p className="text-sm text-gray-600">
                      אנא התחבר כדי לשלוח פניה לסוחר
                    </p>
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => router.push("/auth/login")}
                    >
                      התחבר לשליחת פניה
                    </Button>
                  </>
                ) : !inquirySubmitted ? (
                  <>
                    <p className="text-sm text-gray-600">
                      שלח פניה לסוחר וקבל חזרה התקשרות תוך זמן קצר
                    </p>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowInquiryForm(true)}
                      disabled={!car.isAvailable}
                    >
                      <MessageCircle className="h-4 w-4 ml-2" />
                      {car.isAvailable ? "שלח פניה לסוחר" : "רכב לא זמין"}
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <div className="font-semibold text-green-700 mb-1">
                      הפניה נשלחה בהצלחה!
                    </div>
                    <div className="text-sm text-gray-600">
                      הסוחר יחזור אליך בהקדם
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <strong>איך זה עובד?</strong>
                  <br />
                  שלח פניה → הסוחר רואה את הפרטים שלך → הסוחר מתקשר אליך ישירות
                </div>
              </CardContent>
            </Card>

            {/* רכבים דומים */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">רכבים דומים</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    router.push(
                      `/buyer/cars?make=${car.make}&model=${car.model}`
                    )
                  }
                >
                  חפש רכבים דומים
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal טופס פניה */}
      {showInquiryForm && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>שלח פניה לסוחר</CardTitle>
              <p className="text-sm text-gray-600">
                {car.make} {car.model} {car.year} • {formatPrice(car.price)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="message">הודעה לסוחר</Label>
                  <Textarea
                    id="message"
                    value={inquiryForm.message}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        message: e.target.value,
                      })
                    }
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="testDrive"
                      checked={inquiryForm.interestedInTestDrive}
                      onCheckedChange={(checked: boolean) =>
                        setInquiryForm({
                          ...inquiryForm,
                          interestedInTestDrive: checked,
                        })
                      }
                    />
                    <Label htmlFor="testDrive" className="text-sm">
                      מעוניין בנסיעת מבחן
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="financing"
                      checked={inquiryForm.interestedInFinancing}
                      onCheckedChange={(checked: boolean) =>
                        setInquiryForm({
                          ...inquiryForm,
                          interestedInFinancing: checked,
                        })
                      }
                    />
                    <Label htmlFor="financing" className="text-sm">
                      מעוניין במימון
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="offerPrice">הצעת מחיר (אופציונלי)</Label>
                  <Input
                    id="offerPrice"
                    type="number"
                    placeholder="למשל: 180000"
                    value={inquiryForm.offerPrice}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        offerPrice: e.target.value,
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="availableTimes">זמנים נוחים לפגישה</Label>
                  <Textarea
                    id="availableTimes"
                    value={inquiryForm.availableTimes}
                    onChange={(e) =>
                      setInquiryForm({
                        ...inquiryForm,
                        availableTimes: e.target.value,
                      })
                    }
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="font-semibold text-blue-900">
                    הפרטים שיישלחו לסוחר:
                  </div>
                  <div className="text-blue-700 mt-1">
                    {user.firstName} {user.lastName} •{" "}
                    {user.phone || "טלפון לא צוין"} • {user.email}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleInquirySubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    disabled={submittingInquiry}
                  >
                    {submittingInquiry ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin ml-2" />
                        שולח...
                      </>
                    ) : (
                      "שלח פניה"
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowInquiryForm(false)}
                    disabled={submittingInquiry}
                  >
                    ביטול
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;
