"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Car,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle,
  AlertCircle,
  Info,
  Zap,
  Users,
  ArrowLeft,
} from "lucide-react";

// ממשקים
interface PurchaseRequest {
  id: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  manufacturer: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  mileageMax?: number;
  transmission?: string;
  fuelType?: string;
  location: string;
  description: string;
  interestedInFinancing: boolean;
  urgency: "low" | "medium" | "high";
  createdAt: string;
  status: "active" | "paused" | "fulfilled";
  views: number;
  responses: number;
}

// נתוני דמו
const currentUser = {
  name: "אליה כהן",
  phone: "052-9876543",
  email: "eliya.cohen@example.com",
};

const manufacturers = [
  "טויוטה",
  "הונדה",
  "מזדה",
  "ניסאן",
  "היונדאי",
  "קיה",
  "סקודה",
  "פולקסווגן",
  "BMW",
  "מרצדס",
  "אאודי",
  "וולוו",
];

const PostRequestPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    manufacturer: "",
    model: "",
    yearFrom: "",
    yearTo: "",
    priceFrom: "",
    priceTo: "",
    mileageMax: "",
    transmission: "none",
    fuelType: "none",
    location: "",
    description:
      "אני מחפש רכב אמין ובמצב טוב. אשמח לקבל הצעות מסוחרים מקצועיים.",
    interestedInFinancing: false,
    urgency: "medium" as "low" | "medium" | "high",
  });

  const handleSubmit = () => {
    // יצירת בקשת רכישה חדשה
    const newRequest: PurchaseRequest = {
      id: Date.now(),
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerEmail: currentUser.email,
      manufacturer: formData.manufacturer,
      model: formData.model || undefined,
      yearFrom: formData.yearFrom ? parseInt(formData.yearFrom) : undefined,
      yearTo: formData.yearTo ? parseInt(formData.yearTo) : undefined,
      priceFrom: formData.priceFrom ? parseInt(formData.priceFrom) : undefined,
      priceTo: formData.priceTo ? parseInt(formData.priceTo) : undefined,
      mileageMax: formData.mileageMax
        ? parseInt(formData.mileageMax)
        : undefined,
      transmission:
        formData.transmission === "none" ? undefined : formData.transmission,
      fuelType: formData.fuelType === "none" ? undefined : formData.fuelType,
      location: formData.location,
      description: formData.description,
      interestedInFinancing: formData.interestedInFinancing,
      urgency: formData.urgency,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active",
      views: 0,
      responses: 0,
    };

    // שמירה ב-localStorage
    const existingRequests = JSON.parse(
      localStorage.getItem("userRequests") || "[]"
    );
    localStorage.setItem(
      "userRequests",
      JSON.stringify([...existingRequests, newRequest])
    );

    // גם שמירה ברשימה הכללית לסוחרים
    const allRequests = JSON.parse(
      localStorage.getItem("purchaseRequests") || "[]"
    );
    localStorage.setItem(
      "purchaseRequests",
      JSON.stringify([...allRequests, newRequest])
    );

    setIsSubmitted(true);
  };

  const formatPrice = (price: string): string => {
    if (!price) return "";
    return new Intl.NumberFormat("he-IL").format(parseInt(price)) + " ₪";
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyText = (urgency: string): string => {
    switch (urgency) {
      case "high":
        return "דחוף - צריך רכב בהקדם";
      case "medium":
        return "רגיל - תוך חודש-חודשיים";
      case "low":
        return "לא דחוף - אחפש את הרכב המתאים";
      default:
        return "רגיל";
    }
  };

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
                הבקשה שלך פורסמה ותופיע בפני כל הסוחרים ברשת.
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
                    <span>סוחרים עם רכבים מתאימים יתקשרו אליך</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>תוכל לעקוב אחר הבקשה ב"המודעות שלי"</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  המודעות שלי
                </Button>
                <Button variant="outline">חזרה לדף הבית</Button>
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
                  <Label htmlFor="manufacturer">יצרן *</Label>
                  <Select
                    value={formData.manufacturer}
                    onValueChange={(value) =>
                      setFormData({ ...formData, manufacturer: value })
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
                    placeholder="למשל: קמרי, סיוויק, גולף..."
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
                    <Label htmlFor="yearFrom">שנה מ-</Label>
                    <Input
                      id="yearFrom"
                      type="number"
                      placeholder="2018"
                      value={formData.yearFrom}
                      onChange={(e) =>
                        setFormData({ ...formData, yearFrom: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="yearTo">שנה עד</Label>
                    <Input
                      id="yearTo"
                      type="number"
                      placeholder="2023"
                      value={formData.yearTo}
                      onChange={(e) =>
                        setFormData({ ...formData, yearTo: e.target.value })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                {/* טווח מחירים */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="priceFrom">מחיר מ- (₪)</Label>
                    <Input
                      id="priceFrom"
                      type="number"
                      placeholder="150000"
                      value={formData.priceFrom}
                      onChange={(e) =>
                        setFormData({ ...formData, priceFrom: e.target.value })
                      }
                      className="mt-1"
                    />
                    {formData.priceFrom && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatPrice(formData.priceFrom)}
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="priceTo">מחיר עד (₪)</Label>
                    <Input
                      id="priceTo"
                      type="number"
                      placeholder="200000"
                      value={formData.priceTo}
                      onChange={(e) =>
                        setFormData({ ...formData, priceTo: e.target.value })
                      }
                      className="mt-1"
                    />
                    {formData.priceTo && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatPrice(formData.priceTo)}
                      </div>
                    )}
                  </div>
                </div>

                {/* קילומטרים מקסימום */}
                <div>
                  <Label htmlFor="mileageMax">קילומטרים מקסימום</Label>
                  <Input
                    id="mileageMax"
                    type="number"
                    placeholder="80000"
                    value={formData.mileageMax}
                    onChange={(e) =>
                      setFormData({ ...formData, mileageMax: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* העדפות נוספות */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transmission">תיבת הילוכים</Label>
                    <Select
                      value={formData.transmission}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          transmission: value === "none" ? "" : value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="לא משנה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">לא משנה</SelectItem>
                        <SelectItem value="אוטומט">אוטומט</SelectItem>
                        <SelectItem value="ידני">ידני</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fuelType">סוג דלק</Label>
                    <Select
                      value={formData.fuelType}
                      onValueChange={(value) =>
                        setFormData({
                          ...formData,
                          fuelType: value === "none" ? "" : value,
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="לא משנה" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">לא משנה</SelectItem>
                        <SelectItem value="בנזין">בנזין</SelectItem>
                        <SelectItem value="דיזל">דיזל</SelectItem>
                        <SelectItem value="היברידי">היברידי</SelectItem>
                        <SelectItem value="חשמלי">חשמלי</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* פרטים נוספים */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  פרטים נוספים
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* מיקום */}
                <div>
                  <Label htmlFor="location">איזור מגורים *</Label>
                  <Input
                    id="location"
                    placeholder="תל אביב, חיפה, ירושלים..."
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>

                {/* תיאור */}
                <div>
                  <Label htmlFor="description">תיאור הבקשה</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    ספר לסוחרים מה חשוב לך ברכב, איזה שימוש תעשה בו וכל פרט נוסף
                  </div>
                </div>

                {/* מימון */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="financing"
                    checked={formData.interestedInFinancing}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        interestedInFinancing: checked as boolean,
                      })
                    }
                  />
                  <Label htmlFor="financing" className="text-sm">
                    מעוניין במימון
                  </Label>
                </div>

                {/* דחיפות */}
                <div>
                  <Label htmlFor="urgency">רמת דחיפות</Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        urgency: value as "low" | "medium" | "high",
                      })
                    }
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        לא דחוף - אחפש את הרכב המתאים
                      </SelectItem>
                      <SelectItem value="medium">
                        רגיל - תוך חודש-חודשיים
                      </SelectItem>
                      <SelectItem value="high">
                        דחוף - צריך רכב בהקדם
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* כפתור פרסום */}
            <Card>
              <CardContent className="py-6">
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                  disabled={!formData.manufacturer || !formData.location}
                >
                  <Zap className="h-5 w-5 ml-2" />
                  פרסם בקשה
                </Button>

                {(!formData.manufacturer || !formData.location) && (
                  <div className="text-sm text-red-600 mt-2 text-center">
                    יש למלא לפחות יצרן ואיזור מגורים
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
                      <div className="font-semibold">נפרסם את הבקשה</div>
                      <div className="text-gray-600">
                        הבקשה תופיע בפני סוחרים רלוונטיים
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                      3
                    </div>
                    <div>
                      <div className="font-semibold">סוחרים יתקשרו אליך</div>
                      <div className="text-gray-600">
                        תקבל הצעות ישירות מסוחרים מתאימים
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* תצוגה מקדימה */}
            {formData.manufacturer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">תצוגה מקדימה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">
                          מחפש {formData.manufacturer} {formData.model}
                        </h3>
                        <div className="text-sm text-gray-600">
                          {formData.location}
                        </div>
                      </div>
                      <Badge className={getUrgencyColor(formData.urgency)}>
                        {formData.urgency === "high"
                          ? "דחוף"
                          : formData.urgency === "medium"
                          ? "רגיל"
                          : "לא דחוף"}
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-700 space-y-1">
                      {(formData.yearFrom || formData.yearTo) && (
                        <div>
                          שנים: {formData.yearFrom || "..."} -{" "}
                          {formData.yearTo || "..."}
                        </div>
                      )}
                      {(formData.priceFrom || formData.priceTo) && (
                        <div>
                          מחיר:{" "}
                          {formData.priceFrom
                            ? formatPrice(formData.priceFrom)
                            : "..."}{" "}
                          -{" "}
                          {formData.priceTo
                            ? formatPrice(formData.priceTo)
                            : "..."}
                        </div>
                      )}
                      {formData.mileageMax && (
                        <div>
                          עד{" "}
                          {new Intl.NumberFormat("he-IL").format(
                            parseInt(formData.mileageMax)
                          )}{" "}
                          ק"מ
                        </div>
                      )}
                    </div>

                    <div className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {formData.description}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* סטטיסטיקות */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  הסוחרים שלנו
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">סוחרים פעילים</span>
                    <span className="font-semibold">150+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">בקשות השבוע</span>
                    <span className="font-semibold">45</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">זמן תגובה ממוצע</span>
                    <span className="font-semibold">4 שעות</span>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                    היה ספציפי כמה שיותר - ככל שתתן יותר פרטים, ההצעות יהיו
                    מדויקות יותר
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>
                    ציין את טווח המחירים שלך - זה יעזור לסוחרים להציע רכבים
                    מתאימים
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
