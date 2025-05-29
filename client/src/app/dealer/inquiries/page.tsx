"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Car,
  Eye,
  CheckCircle,
  Clock,
  User,
  MapPin,
  DollarSign,
  Settings,
  Filter,
} from "lucide-react";

// ממשק הפניה שהתקבלה אצל הסוחר
interface DealerInquiry {
  id: number;
  carId: number;
  carManufacturer: string;
  carModel: string;
  carYear: number;
  carPrice: number;
  carColor: string;
  carMileage: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  interestedInTestDrive: boolean;
  interestedInFinancing: boolean;
  offerPrice?: number;
  availableTimes: string;
  receivedAt: string;
  status: "new" | "viewed" | "contacted"; // new = לא נצפה, viewed = נצפה, contacted = יצרתי קשר
  urgency: "low" | "medium" | "high";
}

// נתוני דמו - פניות שהתקבלו אצל הסוחר
const sampleInquiries: DealerInquiry[] = [
  {
    id: 1,
    carId: 101,
    carManufacturer: "טויוטה",
    carModel: "קמרי",
    carYear: 2021,
    carPrice: 185000,
    carColor: "לבן",
    carMileage: 45000,
    buyerName: "אליה כהן",
    buyerPhone: "052-9876543",
    buyerEmail: "eliya.cohen@example.com",
    message:
      "שלום, אני מעוניין ברכב ואשמח לקבוע פגישה לצפייה ונסיעת מבחן. הרכב נראה בדיוק מה שאני מחפש.",
    interestedInTestDrive: true,
    interestedInFinancing: false,
    availableTimes: "גמיש עם הזמנים - בוקר או אחר הצהריים",
    receivedAt: "2025-05-28T09:15:00",
    status: "new",
    urgency: "high",
  },
  {
    id: 2,
    carId: 102,
    carManufacturer: "הונדה",
    carModel: "סיוויק",
    carYear: 2020,
    carPrice: 145000,
    carColor: "כחול",
    carMileage: 62000,
    buyerName: "שרה לוי",
    buyerPhone: "050-1234567",
    buyerEmail: "sarah.levi@example.com",
    message:
      "מעוניינת לדעת עוד פרטים על הרכב. האם יש היסטוריית תחזוקה? מוכנה לבוא לצפייה השבוע.",
    interestedInTestDrive: true,
    interestedInFinancing: true,
    offerPrice: 140000,
    availableTimes: "רק בסופי שבוע",
    receivedAt: "2025-05-27T14:30:00",
    status: "viewed",
    urgency: "medium",
  },
  {
    id: 3,
    carId: 103,
    carManufacturer: "מזדה",
    carModel: "CX-5",
    carYear: 2019,
    carPrice: 155000,
    carColor: "אדום",
    carMileage: 78000,
    buyerName: "דוד משה",
    buyerPhone: "054-7777888",
    buyerEmail: "david.moshe@example.com",
    message:
      "רכב נראה מעניין, אשמח לשמוע עוד על ההיסטוריה שלו ולקבוע צפייה. יש אפשרות לנסיעת מבחן?",
    interestedInTestDrive: false,
    interestedInFinancing: false,
    availableTimes: "גמיש",
    receivedAt: "2025-05-26T11:45:00",
    status: "contacted",
    urgency: "low",
  },
  {
    id: 4,
    carId: 104,
    carManufacturer: "ניסאן",
    carModel: "אלטימה",
    carYear: 2022,
    carPrice: 165000,
    carColor: "שחור",
    carMileage: 28000,
    buyerName: "רונית אברהם",
    buyerPhone: "053-5555666",
    buyerEmail: "ronit.avraham@example.com",
    message:
      "שלום, הרכב נראה מושלם בשבילי. אני מחפשת רכב חדש יחסית עם קילומטראז' נמוך. מעוניינת גם במימון.",
    interestedInTestDrive: true,
    interestedInFinancing: true,
    availableTimes: "ימי חול בלבד - 9:00-17:00",
    receivedAt: "2025-05-28T16:20:00",
    status: "new",
    urgency: "high",
  },
  {
    id: 5,
    carId: 105,
    carManufacturer: "יונדאי",
    carModel: "אלנטרה",
    carYear: 2018,
    carPrice: 95000,
    carColor: "לבן",
    carMileage: 95000,
    buyerName: "מיכל גולן",
    buyerPhone: "052-3333444",
    buyerEmail: "michal.golan@example.com",
    message: "מחפשת רכב במיוחד במחיר הזה. האם המחיר סופי או יש מקום למשא ומתן?",
    interestedInTestDrive: false,
    interestedInFinancing: false,
    offerPrice: 90000,
    availableTimes: "אחרי 18:00 בימי חול",
    receivedAt: "2025-05-25T19:10:00",
    status: "viewed",
    urgency: "medium",
  },
];

const DealerInquiriesPage = () => {
  const [inquiries, setInquiries] = useState<DealerInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<DealerInquiry[]>(
    []
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");

  useEffect(() => {
    // טעינת פניות מ-localStorage ומיזוג עם דמו
    const savedInquiries = JSON.parse(
      localStorage.getItem("dealerInquiries") || "[]"
    );
    const allInquiries = [...sampleInquiries, ...savedInquiries];
    setInquiries(allInquiries);
    setFilteredInquiries(allInquiries);
  }, []);

  // סינון הפניות
  useEffect(() => {
    let filtered = inquiries;

    if (statusFilter !== "all") {
      filtered = filtered.filter((inquiry) => inquiry.status === statusFilter);
    }

    if (urgencyFilter !== "all") {
      filtered = filtered.filter(
        (inquiry) => inquiry.urgency === urgencyFilter
      );
    }

    // מיון לפי תאריך (החדשות ביותר קודם)
    filtered.sort(
      (a, b) =>
        new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime()
    );

    setFilteredInquiries(filtered);
  }, [inquiries, statusFilter, urgencyFilter]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("he-IL").format(price) + " ₪";
  };

  const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "new":
        return "bg-red-100 text-red-800 border-red-200";
      case "viewed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "contacted":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "new":
        return "חדש";
      case "viewed":
        return "נצפה";
      case "contacted":
        return "יצרתי קשר";
      default:
        return "לא ידוע";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="h-3 w-3" />;
      case "viewed":
        return <Eye className="h-3 w-3" />;
      case "contacted":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyText = (urgency: string): string => {
    switch (urgency) {
      case "high":
        return "דחוף";
      case "medium":
        return "רגיל";
      case "low":
        return "לא דחוף";
      default:
        return "רגיל";
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
    if (diffHours < 24) return `לפני ${diffHours} שעות`;
    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    return `לפני ${diffDays} ימים`;
  };

  const handleStatusChange = (
    inquiryId: number,
    newStatus: DealerInquiry["status"]
  ) => {
    const updatedInquiries = inquiries.map((inquiry) =>
      inquiry.id === inquiryId ? { ...inquiry, status: newStatus } : inquiry
    );
    setInquiries(updatedInquiries);

    // עדכון ב-localStorage
    const userInquiries = updatedInquiries.filter(
      (inquiry) => inquiry.id > 1000
    );
    localStorage.setItem("dealerInquiries", JSON.stringify(userInquiries));
  };

  const handleCallCustomer = (inquiry: DealerInquiry) => {
    // סימון שיצרנו קשר
    handleStatusChange(inquiry.id, "contacted");

    // פתיחת אפליקציית הטלפון
    window.location.href = `tel:${inquiry.buyerPhone}`;
  };

  const handleWhatsApp = (inquiry: DealerInquiry) => {
    // סימון שיצרנו קשר
    handleStatusChange(inquiry.id, "contacted");

    // פתיחת וואטסאפ
    const message = `שלום ${inquiry.buyerName}, קיבלתי את פנייתך לגבי ${inquiry.carManufacturer} ${inquiry.carModel} ${inquiry.carYear}. אשמח לתאם איתך צפייה ברכב.`;
    const whatsappUrl = `https://wa.me/972${inquiry.buyerPhone.substring(
      1
    )}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  // מונים לסטטיסטיקה
  const newCount = inquiries.filter((i) => i.status === "new").length;
  const viewedCount = inquiries.filter((i) => i.status === "viewed").length;
  const contactedCount = inquiries.filter(
    (i) => i.status === "contacted"
  ).length;

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-6 w-6" />
                הפניות שקיבלתי
              </h1>
              <p className="text-gray-600 mt-1">
                {newCount} חדשות • {viewedCount} נצפו • {contactedCount} יצרתי
                קשר
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 ml-2" />
                הגדרות התראות
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* סינון */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">סינון:</span>
            </div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={statusFilter === "all" ? "default" : "outline"}
                onClick={() => setStatusFilter("all")}
              >
                הכל ({inquiries.length})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "new" ? "default" : "outline"}
                onClick={() => setStatusFilter("new")}
                className={
                  statusFilter === "new" ? "bg-red-600 hover:bg-red-700" : ""
                }
              >
                חדשות ({newCount})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "viewed" ? "default" : "outline"}
                onClick={() => setStatusFilter("viewed")}
                className={
                  statusFilter === "viewed"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : ""
                }
              >
                נצפו ({viewedCount})
              </Button>
              <Button
                size="sm"
                variant={statusFilter === "contacted" ? "default" : "outline"}
                onClick={() => setStatusFilter("contacted")}
                className={
                  statusFilter === "contacted"
                    ? "bg-green-600 hover:bg-green-700"
                    : ""
                }
              >
                יצרתי קשר ({contactedCount})
              </Button>
            </div>

            <div className="border-r h-6 mx-2"></div>

            <div className="flex gap-2">
              <Button
                size="sm"
                variant={urgencyFilter === "all" ? "default" : "outline"}
                onClick={() => setUrgencyFilter("all")}
              >
                כל הדחיפויות
              </Button>
              <Button
                size="sm"
                variant={urgencyFilter === "high" ? "default" : "outline"}
                onClick={() => setUrgencyFilter("high")}
                className={
                  urgencyFilter === "high" ? "bg-red-600 hover:bg-red-700" : ""
                }
              >
                דחופות
              </Button>
            </div>
          </div>
        </div>

        {/* רשימת הפניות */}
        {filteredInquiries.length > 0 ? (
          <div className="space-y-4">
            {filteredInquiries.map((inquiry) => (
              <Card
                key={inquiry.id}
                className={`hover:shadow-md transition-all duration-200 ${
                  inquiry.status === "new"
                    ? "ring-2 ring-red-200 bg-red-50/30"
                    : ""
                }`}
                onClick={() => {
                  if (inquiry.status === "new") {
                    handleStatusChange(inquiry.id, "viewed");
                  }
                }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col xl:flex-row gap-6">
                    {/* מידע הפניה */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
                            <Car className="h-5 w-5 text-blue-600" />
                            {inquiry.carManufacturer} {inquiry.carModel}{" "}
                            {inquiry.carYear}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {formatPrice(inquiry.carPrice)}
                            </div>
                            <div>{inquiry.carColor}</div>
                            <div>{formatMileage(inquiry.carMileage)}</div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {getTimeAgo(inquiry.receivedAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getUrgencyColor(
                              inquiry.urgency
                            )} border`}
                          >
                            {getUrgencyText(inquiry.urgency)}
                          </Badge>
                          <Badge
                            className={`${getStatusColor(
                              inquiry.status
                            )} border flex items-center gap-1`}
                          >
                            {getStatusIcon(inquiry.status)}
                            {getStatusText(inquiry.status)}
                          </Badge>
                        </div>
                      </div>

                      {/* פרטי הקונה */}
                      <div className="bg-blue-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <User className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-semibold text-blue-900">
                              {inquiry.buyerName}
                            </div>
                            <div className="text-sm text-blue-700">
                              {inquiry.buyerPhone} • {inquiry.buyerEmail}
                            </div>
                          </div>
                        </div>

                        <div className="text-sm text-blue-700 leading-relaxed">
                          <strong>ההודעה:</strong>
                          <br />
                          {inquiry.message}
                        </div>
                      </div>

                      {/* פרטים נוספים */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">נסיעת מבחן:</span>
                          <div className="font-medium">
                            {inquiry.interestedInTestDrive ? (
                              <span className="text-green-600">מעוניין</span>
                            ) : (
                              <span className="text-gray-600">לא מעוניין</span>
                            )}
                          </div>
                        </div>

                        <div>
                          <span className="text-gray-500">מימון:</span>
                          <div className="font-medium">
                            {inquiry.interestedInFinancing ? (
                              <span className="text-green-600">מעוניין</span>
                            ) : (
                              <span className="text-gray-600">לא מעוניין</span>
                            )}
                          </div>
                        </div>

                        {inquiry.offerPrice && (
                          <div>
                            <span className="text-gray-500">הצעת מחיר:</span>
                            <div className="font-medium text-green-600">
                              {formatPrice(inquiry.offerPrice)}
                            </div>
                          </div>
                        )}
                      </div>

                      {inquiry.availableTimes && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">זמנים נוחים: </span>
                          <span className="font-medium">
                            {inquiry.availableTimes}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* פעולות */}
                    <div className="xl:w-64 flex flex-col gap-3">
                      <div className="flex xl:flex-col gap-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallCustomer(inquiry);
                          }}
                          className="bg-green-600 hover:bg-green-700 flex items-center gap-2 flex-1"
                        >
                          <Phone className="h-4 w-4" />
                          התקשר עכשיו
                        </Button>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsApp(inquiry);
                          }}
                          variant="outline"
                          className="flex items-center gap-2 flex-1 border-green-600 text-green-600 hover:bg-green-50"
                        >
                          <MessageSquare className="h-4 w-4" />
                          וואטסאפ
                        </Button>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        צפה ברכב
                      </Button>

                      {/* מידע נוסף */}
                      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                        <div className="font-semibold mb-1">
                          {inquiry.status === "new" && "פניה חדשה!"}
                          {inquiry.status === "viewed" && "נצפתה"}
                          {inquiry.status === "contacted" && "יצרת קשר"}
                        </div>
                        <div>
                          {inquiry.status === "new" && "לחץ כדי לסמן כנצפה"}
                          {inquiry.status === "viewed" && "זמן ליצור קשר"}
                          {inquiry.status === "contacted" && "המשך התהליך"}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {inquiries.length === 0
                  ? "אין פניות עדיין"
                  : "אין פניות המתאימות לסינון"}
              </h3>
              <p className="text-gray-600">
                {inquiries.length === 0
                  ? "פרסם רכבים למכירה כדי לקבל פניות מקונים מעוניינים"
                  : "נסה לשנות את הסינון כדי לראות יותר פניות"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DealerInquiriesPage;
