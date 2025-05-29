"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Plus,
  MessageSquare,
  Eye,
  TrendingUp,
  Users,
  Clock,
  ArrowLeft,
  Search,
  Phone,
  Mail,
} from "lucide-react";

interface User {
  name: string;
  email: string;
  phone: string;
  role: string;
  businessName?: string;
  city: string;
}

export default function DealerHomePage() {
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
    activeCars: 12,
    newInquiries: 5,
    weeklyViews: 342,
    totalViews: 1847,
  };

  const recentInquiries = [
    {
      id: 1,
      buyerName: "דני כהן",
      carModel: "טויוטה קמרי 2021",
      message: "מעוניין לראות את הרכב מחר בבוקר",
      time: "לפני שעה",
      phone: "050-1234567",
      isNew: true,
    },
    {
      id: 2,
      buyerName: "רחל לוי",
      carModel: "הונדה סיוויק 2020",
      message: "האם יש מקום למשא ומתן על המחיר?",
      time: "לפני 3 שעות",
      phone: "052-9876543",
      isNew: true,
    },
    {
      id: 3,
      buyerName: "יוסי אברהם",
      carModel: "מאזדה 3 2019",
      message: "רוצה לדעת על ההיסטוריה של הרכב",
      time: "אתמול",
      phone: "054-5555555",
      isNew: false,
    },
  ];

  const buyerRequests = [
    {
      id: 1,
      title: "מחפש טויוטה קמרי",
      details: "שנים: 2020-2023 | תקציב: 150,000-200,000 ₪",
      location: "תל אביב",
      time: "לפני 2 שעות",
      matches: 2, // כמה רכבים של הסוחר מתאימים
    },
    {
      id: 2,
      title: "רכב משפחתי גדול",
      details: "7 מקומות | יצרן: הונדה/מאזדה | תקציב: עד 180,000 ₪",
      location: "חיפה",
      time: "לפני 4 שעות",
      matches: 1,
    },
    {
      id: 3,
      title: "BMW סדרה 3",
      details: "שנים: 2019-2022 | צבע: לבן/שחור | תקציב: 220,000-280,000 ₪",
      location: "פתח תקווה",
      time: "לפני יום",
      matches: 0,
    },
  ];

  const topCars = [
    {
      id: 1,
      model: "טויוטה קמרי 2021",
      price: "185,000 ₪",
      views: 45,
      inquiries: 3,
    },
    {
      id: 2,
      model: "הונדה סיוויק 2020",
      price: "145,000 ₪",
      views: 38,
      inquiries: 2,
    },
    {
      id: 3,
      model: "מאזדה 3 2019",
      price: "125,000 ₪",
      views: 32,
      inquiries: 1,
    },
  ];

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
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              שלום, {user?.name?.split(" ")[0] || "סוחר"}! 👋
            </h1>
            <p className="text-gray-600 mt-1">
              {user?.businessName && `${user.businessName} | `}
              ברוך הבא לדף הניהול שלך
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">רכבים פעילים</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {stats.activeCars}
                  </p>
                </div>
                <Car className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">פניות חדשות</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.newInquiries}
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
                  <p className="text-sm text-gray-600">צפיות השבוע</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.weeklyViews}
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
                  <p className="text-sm text-gray-600">סה"כ צפיות</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.totalViews}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Cars */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            הרכבים הפופולריים שלך
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topCars.map((car, index) => (
              <Card key={car.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-blue-100 text-blue-600 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="text-left text-sm text-gray-600">
                      <div className="flex items-center">
                        <Eye className="w-4 h-4 ml-1" />
                        {car.views}
                      </div>
                      <div className="flex items-center mt-1">
                        <MessageSquare className="w-4 h-4 ml-1" />
                        {car.inquiries}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {car.model}
                    </h3>
                    <p className="text-sm text-blue-600">{car.price}</p>
                  </div>
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/dealer/add-car">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Plus className="w-8 h-8 text-blue-600 ml-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        פרסם רכב חדש
                      </h3>
                      <p className="text-sm text-gray-600">
                        הוסף רכב למלאי שלך
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dealer/cars">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Car className="w-8 h-8 text-green-600 ml-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        ניהול מלאי
                      </h3>
                      <p className="text-sm text-gray-600">
                        ערוך ונהל את הרכבים
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/dealer/buyers">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Search className="w-8 h-8 text-purple-600 ml-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        קונים מחפשים
                      </h3>
                      <p className="text-sm text-gray-600">
                        בקשות רכישה רלוונטיות
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Inquiries */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                פניות אחרונות
              </h2>
              <Link href="/dealer/inquiries">
                <Button variant="outline" size="sm">
                  צפה בכל הפניות
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">
                            {inquiry.buyerName}
                          </h3>
                          {inquiry.isNew && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              חדש
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-blue-600 mb-1">
                          {inquiry.carModel}
                        </p>
                        <p className="text-sm text-gray-600 mb-2">
                          {inquiry.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 ml-1" />
                            {inquiry.time}
                          </span>
                          <span className="flex items-center">
                            <Phone className="w-3 h-3 ml-1" />
                            {inquiry.phone}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Phone className="w-4 h-4 ml-1" />
                        התקשר
                      </Button>
                      <Button size="sm" variant="outline">
                        <Mail className="w-4 h-4 ml-1" />
                        שלח הודעה
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Buyer Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                קונים מחפשים
              </h2>
              <Link href="/dealer/buyers">
                <Button variant="outline" size="sm">
                  צפה בכל הבקשות
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {buyerRequests.slice(0, 3).map((request) => (
                <Card
                  key={request.id}
                  className="border-l-4 border-l-green-500"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-1">
                          {request.details}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{request.location}</span>
                          <span>{request.time}</span>
                        </div>
                      </div>
                      <div className="text-left">
                        {request.matches > 0 ? (
                          <Badge className="bg-blue-100 text-blue-800">
                            {request.matches} התאמות
                          </Badge>
                        ) : (
                          <Badge variant="outline">אין התאמות</Badge>
                        )}
                      </div>
                    </div>
                    {request.matches > 0 && (
                      <Button
                        size="sm"
                        className="mt-2 bg-green-600 hover:bg-green-700"
                      >
                        שלח הצעה
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
