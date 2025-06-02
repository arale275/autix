"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileStats } from "@/hooks/api/useProfile";
import { useReceivedInquiries } from "@/hooks/api/useInquiries";
import { useCars } from "@/hooks/api/useCars";
import { DealerStatsCard } from "@/components/cards/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Car,
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
  ArrowLeft,
  DollarSign,
  Users,
  BarChart3,
  Star,
  Calendar,
} from "lucide-react";

export default function DealerHomePage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useProfileStats();
  const { inquiries, loading: inquiriesLoading } = useReceivedInquiries();
  const { cars, loading: carsLoading } = useCars();

  const recentInquiries = inquiries?.slice(0, 3) || [];
  const recentCars = cars?.slice(0, 3) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "responded":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "sold":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "חדשה";
      case "responded":
        return "נענתה";
      case "closed":
        return "סגורה";
      case "active":
        return "פעיל";
      case "sold":
        return "נמכר";
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL").format(price);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {user?.firstName}! 🚗
            </h1>
            <p className="text-purple-100 mb-4">
              ברוך הבא לפאנל הניהול שלך. בואו נגדיל את המכירות היום!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dealer/cars/new">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  פרסם רכב חדש
                </Button>
              </Link>
              <Link href="/dealer/inquiries">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-purple-600"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  פניות מקונים
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">סטטיסטיקות עסק</h2>
        <DealerStatsCard stats={stats as any} loading={statsLoading} />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              פעולות מהירות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dealer/cars/new" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Plus className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">פרסם רכב חדש</h3>
                    <p className="text-sm text-gray-600">הוסף רכב למלאי שלך</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 mr-auto rotate-180" />
                </div>
              </div>
            </Link>

            <Link href="/dealer/cars" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">נהל מלאי</h3>
                    <p className="text-sm text-gray-600">
                      עדכן וערוך רכבים קיימים
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 mr-auto rotate-180" />
                </div>
              </div>
            </Link>

            <Link href="/dealer/inquiries" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">פניות מקונים</h3>
                    <p className="text-sm text-gray-600">עקוב ותגיב לפניות</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 mr-auto rotate-180" />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Inquiries */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                פניות אחרונות
              </CardTitle>
              <Link href="/dealer/inquiries">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  הצג הכל
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {inquiriesLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentInquiries.length > 0 ? (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {inquiry.buyer?.firstName} {inquiry.buyer?.lastName}
                      </h4>
                      <Badge className={getStatusColor(inquiry.status)}>
                        {getStatusText(inquiry.status)}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {inquiry.message}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(inquiry.createdAt).toLocaleDateString(
                          "he-IL"
                        )}
                      </span>
                      {inquiry.car && (
                        <span>
                          {inquiry.car.make} {inquiry.car.model}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">אין פניות חדשות</p>
                <p className="text-gray-400 text-xs">פניות מקונים יופיעו כאן</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Cars & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Cars */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                הרכבים האחרונים שלי
              </CardTitle>
              <Link href="/dealer/cars">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  הצג הכל
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {carsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentCars.length > 0 ? (
              <div className="space-y-3">
                {recentCars.map((car: any) => (
                  <div
                    key={car.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {car.make} {car.model} {car.year}
                      </h4>
                      <Badge className={getStatusColor(car.status)}>
                        {getStatusText(car.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatPrice(car.price)}₪
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(car.createdAt).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <Car className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">אין רכבים במלאי</p>
                <Link href="/dealer/cars/new">
                  <Button variant="outline" size="sm" className="mt-2">
                    פרסם רכב ראשון
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <BarChart3 className="h-5 w-5" />
              הביצועים שלך
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">רכבים פעילים</span>
                <span className="font-semibold text-green-800">
                  {stats ? (stats as any).activeCars || 0 : "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">פניות חדשות</span>
                <span className="font-semibold text-green-800">
                  {stats ? (stats as any).newInquiries || 0 : "0"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">רכבים שנמכרו</span>
                <span className="font-semibold text-green-800">
                  {stats ? (stats as any).soldCars || 0 : "0"}
                </span>
              </div>
              <div className="pt-3 border-t border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">דירוג איכות: מעולה</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Business Tips */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-800">
            <TrendingUp className="h-5 w-5" />
            טיפים להגדלת מכירות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-amber-800">תמונות איכותיות</h4>
              <p className="text-sm text-amber-700">
                הוסף תמונות ברורות מכל הזוויות לכל רכב
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-800">תיאור מפורט</h4>
              <p className="text-sm text-amber-700">
                ציין את כל הפרטים הטכניים והמצב של הרכב
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-amber-800">מענה מהיר</h4>
              <p className="text-sm text-amber-700">
                ענה לפניות בתוך 24 שעות להגדלת הסיכויים
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
