"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  ArrowLeft,
  Loader2,
} from "lucide-react";

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

const manufacturers = [
  "Toyota",
  "Honda",
  "Mazda",
  "Nissan",
  "Hyundai",
  "Kia",
  "Skoda",
  "Volkswagen",
  "BMW",
  "Mercedes",
  "Audi",
  "Volvo",
  "Ford",
  "Chevrolet",
  "Peugeot",
  "Renault",
];

const PostRequestPage = () => {
  const router = useRouter();

  // השתמש ב-useAuth
  const { user, isLoading, isAuthenticated } = useAuth();
  console.log("🔍 Full user object:", user);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    make: "",
    model: "",
    yearMin: "",
    yearMax: "",
    priceMax: "",
    requirements:
      "אני מחפש רכב אמין ובמצב טוב. אשמח לקבל הצעות מסוחרים מקצועיים.",
  });

  const handleSubmit = async () => {
    if (!user || !isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    // בדיקה גמישה לסוג משתמש - בטוח מTypeScript
    const userRole =
      (user as any).role || (user as any).userType || user.userType;

    if (userRole !== "buyer") {
      alert("רק קונים יכולים לפרסם בקשות רכב");
      return;
    }

    if (!formData.make) {
      alert("יש לבחור לפחות יצרן");
      return;
    }

    try {
      setIsSubmitting(true);

      // קבל token מlocalStorage
      const token = localStorage.getItem("token");

      const requestData = {
        make: formData.make,
        model: formData.model || null,
        year_min: formData.yearMin ? parseInt(formData.yearMin) : null,
        year_max: formData.yearMax ? parseInt(formData.yearMax) : null,
        price_max: formData.priceMax ? parseInt(formData.priceMax) : null,
        requirements: formData.requirements,
      };

      const response = await fetch(`${API_URL}/api/car-requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
      } else {
        alert("שגיאה ביצירת הבקשה: " + (data.message || "שגיאה לא ידועה"));
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      alert("שגיאה ביצירת הבקשה");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: string): string => {
    if (!price) return "";
    return new Intl.NumberFormat("he-IL").format(parseInt(price)) + " ₪";
  };

  // Helper function to get user name - בטוח מTypeScript
  const getUserName = () => {
    if (!user) return "";

    const userAny = user as any;

    if (userAny.name) return userAny.name;
    if (user.firstName && user.lastName)
      return `${user.firstName} ${user.lastName}`;
    if (user.firstName) return user.firstName;
    return user.email || "משתמש";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            נדרשת התחברות
          </h1>
          <p className="text-gray-600 mb-4">אנא התחבר כדי לפרסם בקשת רכב</p>
          <Button onClick={() => router.push("/auth/login")}>התחבר</Button>
        </div>
      </div>
    );
  }

  // אם המשתמש לא buyer - בטוח מTypeScript
  const userRole =
    (user as any).role || (user as any).userType || user.userType;
  if (userRole !== "buyer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            גישה מוגבלת
          </h1>
          <p className="text-gray-600 mb-4">רק קונים יכולים לפרסם בקשות רכב</p>
          <Button onClick={() => router.push("/dealer/home")}>לדף הסוחר</Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                הבקשה נפרסמה בהצלחה!
              </h1>
              <p className="text-gray-600 mb-8">
                הבקשה שלך נשמרה במערכת ותופיע בפני כל הסוחרים ברשת.
                <br />
                סוחרים מתאימים יוכלו ליצור איתך קשר ישירות.
              </p>

              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">
                  מה קורה עכשיו?
                </h3>
                <div className="text-blue-700 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>הבקשה שלך מופיעה בפני סוחרים רלוונטיים</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>
                      סוחרים עם רכבים מתאימים יכולים לראות את הפרטים שלך
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>תוכל לעקוב אחר הבקשה ב"הבקשות שלי"</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => router.push("/buyer/requests")}
                >
                  הבקשות שלי
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/buyer/home")}
                >
                  חזרה לדף הבית
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.push("/buyer/home")}
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                פרסום בקשת רכישה
              </h1>
              <p className="text-sm text-gray-600">
                פרסם "אני מחפש" וקבל הצעות מסוחרים
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* טופס ראשי */}
          <div className="lg:col-span-2 space-y-6">
            {/* פרטי הרכב המבוקש */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  איזה רכב אתה מחפש?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* יצרן - חובה */}
                <div>
                  <Label htmlFor="make">יצרן *</Label>
                  <Select
                    value={formData.make}
                    onValueChange={(value) =>
                      setFormData({ ...formData, make: value })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="בחר יצרן" />
                    </SelectTrigger>
                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem key={manufacturer} value={manufacturer}>
                          {manufacturer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* דגם - אופציונלי */}
                <div>
                  <Label htmlFor="model">דגם (אופציונלי)</Label>
                  <Input
                    id="model"
                    placeholder="למשל: Camry, Civic, Golf..."
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* טווח שנים */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearMin">שנה מ-</Label>
                    <Input
                      id="yearMin"
                      type="number"
                      placeholder="2018"
                      min="1990"
                      max="2025"
                      value={formData.yearMin}
                      onChange={(e) =>
                        setFormData({ ...formData, yearMin: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearMax">שנה עד</Label>
                    <Input
                      id="yearMax"
                      type="number"
                      placeholder="2023"
                      min="1990"
                      max="2025"
                      value={formData.yearMax}
                      onChange={(e) =>
                        setFormData({ ...formData, yearMax: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* מחיר מקסימלי */}
                <div>
                  <Label htmlFor="priceMax">מחיר מקסימלי (₪)</Label>
                  <Input
                    id="priceMax"
                    type="number"
                    placeholder="200000"
                    value={formData.priceMax}
                    onChange={(e) =>
                      setFormData({ ...formData, priceMax: e.target.value })
                    }
                    className="mt-1"
                  />
                  {formData.priceMax && (
                    <div className="text-xs text-gray-500 mt-1">
                      {formatPrice(formData.priceMax)}
                    </div>
                  )}
                </div>

                {/* תיאור */}
                <div>
                  <Label htmlFor="requirements">דרישות ותיאור הבקשה</Label>
                  <Textarea
                    id="requirements"
                    rows={4}
                    value={formData.requirements}
                    onChange={(e) =>
                      setFormData({ ...formData, requirements: e.target.value })
                    }
                    className="mt-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    ספר לסוחרים מה חשוב לך ברכב, איזה שימוש תעשה בו וכל פרט נוסף
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* מידע על המשתמש */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  הפרטים שיישלחו לסוחרים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-semibold text-blue-900 mb-2">
                    פרטי הקשר שלך:
                  </div>
                  <div className="text-blue-700 space-y-1">
                    <div>{getUserName()}</div>
                    <div>{user.email}</div>
                    {user.phone && <div>{user.phone}</div>}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    הפרטים האלה יהיו זמינים לסוחרים כדי שיוכלו ליצור איתך קשר
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* כפתור פרסום */}
            <Card>
              <CardContent className="py-6">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                  disabled={!formData.make || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin ml-2" />
                      פורסם בקשה...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 ml-2" />
                      פרסם בקשה
                    </>
                  )}
                </Button>

                {!formData.make && (
                  <div className="text-sm text-red-600 mt-2 text-center">
                    יש לבחור לפחות יצרן
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* סייד-בר עם מידע */}
          <div className="space-y-6">
            {/* איך זה עובד */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">איך זה עובד?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      1
                    </div>
                    <div>
                      <div className="font-semibold">תמלא את הטופס</div>
                      <div className="text-gray-600">
                        ספר לנו איזה רכב אתה מחפש
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      2
                    </div>
                    <div>
                      <div className="font-semibold">נשמור במערכת</div>
                      <div className="text-gray-600">
                        הבקשה תישמר ותופיע בפני סוחרים
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-semibold">סוחרים יראו את הבקשה</div>
                      <div className="text-gray-600">
                        סוחרים עם רכבים מתאימים יכולים לראות את הפרטים שלך
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* תצוגה מקדימה */}
            {formData.make && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">תצוגה מקדימה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">
                          מחפש {formData.make} {formData.model}
                        </h3>
                        <div className="text-sm text-gray-600">
                          {getUserName()}
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        פעיל
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      {(formData.yearMin || formData.yearMax) && (
                        <div>
                          שנים: {formData.yearMin || "..."} -{" "}
                          {formData.yearMax || "..."}
                        </div>
                      )}
                      {formData.priceMax && (
                        <div>
                          מחיר מקסימלי: {formatPrice(formData.priceMax)}
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {formData.requirements}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* טיפים */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  טיפים לבקשה מוצלחת
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>
                    היה ספציפי כמה שיותר - ככל שתתן יותר פרטים, הסוחרים יבינו
                    טוב יותר מה אתה מחפש
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>
                    ציין מחיר מקסימלי - זה יעזור לסוחרים להכין הצעות מתאימות
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>
                    הוסף תיאור אישי - ספר מה חשוב לך ברכב ואיך תשתמש בו
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostRequestPage;
