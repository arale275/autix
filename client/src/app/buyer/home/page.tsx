"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MessageSquare,
  Eye,
  Phone,
  Clock,
  Car,
  FileText,
  PhoneCall,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  businessName?: string;
  city: string;
}

export default function BuyerHomePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("user_data");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Mock data for demo
  const stats = {
    sentInquiries: 8,
    viewedByDealers: 5,
    callsReceived: 2,
  };

  const myRequests = [
    {
      id: 1,
      title: "מחפש טויוטה קמרי 2020-2023",
      details: "אוטומט | תקציב: 150,000-200,000 ₪ | תל אביב",
      createdAt: "לפני 3 ימים",
      status: "פעיל",
      views: 12,
      responses: 3,
    },
    {
      id: 2,
      title: "רכב משפחתי עד 180,000 ₪",
      details: "7 מקומות | יצרן: הונדה/מאזדה/טויוטה",
      createdAt: "לפני שבוע",
      status: "פעיל",
      views: 8,
      responses: 1,
    },
    {
      id: 3,
      title: "BMW סדרה 3 2019-2022",
      details: "צבע: לבן/שחור | תקציב: 220,000-280,000 ₪",
      createdAt: "לפני שבועיים",
      status: "סגור",
      views: 15,
      responses: 5,
    },
  ];

  const sentInquiries = [
    {
      id: 1,
      carModel: "טויוטה קמרי 2021",
      price: "185,000 ₪",
      dealerName: "רכבי פרימיום",
      dealerPhone: "050-1234567",
      sentAt: "לפני 2 שעות",
      status: "sent", // sent, viewed, contacted
    },
    {
      id: 2,
      carModel: "הונדה סיוויק 2020",
      price: "145,000 ₪",
      dealerName: "אוטו דיל",
      dealerPhone: "052-9876543",
      sentAt: "אתמול",
      status: "viewed",
    },
    {
      id: 3,
      carModel: "מאזדה 3 2019",
      price: "125,000 ₪",
      dealerName: "כרמל רכב",
      dealerPhone: "054-5555555",
      sentAt: "לפני 3 ימים",
      status: "contacted",
    },
    {
      id: 4,
      carModel: "BMW 320i 2020",
      price: "245,000 ₪",
      dealerName: "BMW מרכז",
      dealerPhone: "053-1111111",
      sentAt: "לפני שבוע",
      status: "sent",
    },
  ];

  const recommendedCars = [
    {
      id: 1,
      model: "טויוטה קמרי 2022",
      price: "195,000 ₪",
      year: 2022,
      mileage: 25000,
      location: "תל אביב",
      dealerName: "טויוטה מרכז",
      matchReason: "מתאים לבקשה שלך",
    },
    {
      id: 2,
      model: "הונדה אקורד 2021",
      price: "175,000 ₪",
      year: 2021,
      mileage: 35000,
      location: "פתח תקווה",
      dealerName: "הונדה ישראל",
      matchReason: "במחיר שהגדרת",
    },
    {
      id: 3,
      model: "מאזדה 6 2020",
      price: "155,000 ₪",
      year: 2020,
      mileage: 45000,
      location: "חיפה",
      dealerName: "מאזדה צפון",
      matchReason: "רכב משפחתי",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-blue-100 text-blue-800">נשלח</Badge>;
      case "viewed":
        return <Badge className="bg-yellow-100 text-yellow-800">נצפה</Badge>;
      case "contacted":
        return <Badge className="bg-green-100 text-green-800">התקשרו</Badge>;
      default:
        return <Badge variant="outline">לא ידוע</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "sent":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "viewed":
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case "contacted":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            שלום, {user?.name?.split(" ")[0] || "קונה"}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            מוכן למצוא את הרכב המושלם? בואו נתחיל לחפש
          </p>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 ml-2" />
              חיפוש מהיר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="manufacturer">יצרן</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="toyota">טויוטה</SelectItem>
                    <SelectItem value="honda">הונדה</SelectItem>
                    <SelectItem value="mazda">מאזדה</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="mercedes">מרצדס</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priceRange">טווח מחירים</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מחיר" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-100000">עד 100,000 ₪</SelectItem>
                    <SelectItem value="100000-150000">
                      100,000-150,000 ₪
                    </SelectItem>
                    <SelectItem value="150000-200000">
                      150,000-200,000 ₪
                    </SelectItem>
                    <SelectItem value="200000+">מעל 200,000 ₪</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">שנת ייצור</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר שנה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Link href="/buyer/cars" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    חפש
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">פניות ששלחתי</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.sentInquiries}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">נצפו ע"י סוחרים</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.viewedByDealers}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">שיחות התקבלו</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.callsReceived}
                  </p>
                </div>
                <PhoneCall className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Cars */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            רכבים מומלצים עבורך
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedCars.map((car) => (
              <Card key={car.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {car.model}
                    </h3>
                    <p className="text-lg font-bold text-blue-600 mb-2">
                      {car.price}
                    </p>
                    <div className="text-sm text-gray-600 mb-2">
                      {car.year} | {car.mileage.toLocaleString()} ק"מ
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      📍 {car.location} | {car.dealerName}
                    </div>
                    <Badge className="bg-blue-100 text-blue-800 text-xs mb-3">
                      {car.matchReason}
                    </Badge>
                  </div>

                  <Link href={`/buyer/cars/${car.id}`}>
                    <Button
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700 w-full"
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      צפה בפרטים ושלח פניה
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            פעולות מהירות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/buyer/post-request">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Plus className="w-8 h-8 text-green-600 ml-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        פרסם "אני מחפש"
                      </h3>
                      <p className="text-sm text-gray-600">
                        תן לסוחרים לפנות אליך עם הצעות
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/buyer/cars">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Search className="w-8 h-8 text-blue-600 ml-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        חיפוש מתקדם
                      </h3>
                      <p className="text-sm text-gray-600">
                        חפש רכבים עם פילטרים מפורטים
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sent Inquiries */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                הפניות ששלחתי
              </h2>
              <Link href="/buyer/messages">
                <Button variant="outline" size="sm">
                  צפה בכל הפניות
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {sentInquiries.slice(0, 4).map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {inquiry.carModel}
                          </h3>
                          {getStatusBadge(inquiry.status)}
                        </div>
                        <p className="text-lg font-bold text-blue-600 mb-1">
                          {inquiry.price}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {inquiry.dealerName}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            {getStatusIcon(inquiry.status)}
                            <span className="mr-1">{inquiry.sentAt}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <a href={`tel:${inquiry.dealerPhone}`}>
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Phone className="w-4 h-4 ml-1" />
                          {inquiry.dealerPhone}
                        </Button>
                      </a>
                      {inquiry.status === "contacted" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                        >
                          <CheckCircle className="w-4 h-4 ml-1" />
                          בטיפול
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* My Requests */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              המודעות שלי
            </h2>
            <div className="space-y-3">
              {myRequests.slice(0, 3).map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {request.details}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{request.createdAt}</span>
                          <span className="flex items-center">
                            <Eye className="w-3 h-3 ml-1" />
                            {request.views} צפיות
                          </span>
                          <span className="flex items-center">
                            <MessageSquare className="w-3 h-3 ml-1" />
                            {request.responses} תגובות
                          </span>
                        </div>
                      </div>
                      <Badge
                        variant={
                          request.status === "פעיל" ? "default" : "outline"
                        }
                        className={
                          request.status === "פעיל"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/buyer/requests">
                <Button variant="outline" size="sm" className="w-full">
                  ניהול מודעות
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
