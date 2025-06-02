"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileStats } from "@/hooks/api/useProfile";
import { useSentInquiries } from "@/hooks/api/useInquiries";
import { useMyRequests } from "@/hooks/api/useRequests";
import { BuyerStatsCard } from "@/components/cards/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  FileText,
  MessageSquare,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowLeft,
  Plus,
  Eye,
} from "lucide-react";

export default function BuyerHomePage() {
  const { user } = useAuth();
  const { stats, loading: statsLoading } = useProfileStats();
  const { inquiries, loading: inquiriesLoading } = useSentInquiries();
  const { requests, loading: requestsLoading } = useMyRequests();

  const recentInquiries = inquiries?.slice(0, 3) || [];
  const recentRequests = requests?.slice(0, 3) || [];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "responded":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "new":
        return "חדשה";
      case "active":
        return "פעילה";
      case "responded":
        return "נענתה";
      case "closed":
        return "סגורה";
      default:
        return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {getGreeting()}, {user?.firstName}! 👋
            </h1>
            <p className="text-blue-100 mb-4">
              ברוך הבא לאזור האישי שלך. מה תרצה לעשות היום?
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/buyer/cars">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Search className="w-4 h-4 mr-2" />
                  חפש רכבים
                </Button>
              </Link>
              <Link href="/buyer/requests/new">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  פרסם בקשה
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-xl font-semibold mb-4">הסטטיסטיקות שלי</h2>
        <BuyerStatsCard stats={stats as any} loading={statsLoading} />
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
            <Link href="/buyer/cars" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">חיפוש רכבים</h3>
                    <p className="text-sm text-gray-600">
                      מצא את הרכב המושלם עבורך
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 mr-auto rotate-180" />
                </div>
              </div>
            </Link>

            <Link href="/buyer/requests/new" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">פרסם בקשת רכב</h3>
                    <p className="text-sm text-gray-600">
                      תן לסוחרים לפנות אליך
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 mr-auto rotate-180" />
                </div>
              </div>
            </Link>

            <Link href="/buyer/requests" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">הבקשות וההודעות שלי</h3>
                    <p className="text-sm text-gray-600">נהל את הפעילות שלך</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 mr-auto rotate-180" />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Requests */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                הבקשות האחרונות שלי
              </CardTitle>
              <Link href="/buyer/requests">
                <Button variant="ghost" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  הצג הכל
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {requestsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentRequests.length > 0 ? (
              <div className="space-y-3">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-3 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {request.make && request.model
                          ? `${request.make} ${request.model}`
                          : "בקשת רכב כללית"}
                      </h4>
                      <Badge className={getStatusColor(request.status)}>
                        {getStatusText(request.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(request.createdAt).toLocaleDateString(
                          "he-IL"
                        )}
                      </span>
                      {request.priceMax && (
                        <span>עד {request.priceMax.toLocaleString()}₪</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">אין בקשות עדיין</p>
                <Link href="/buyer/requests/new">
                  <Button variant="outline" size="sm" className="mt-2">
                    צור בקשה ראשונה
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Inquiries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              הפניות האחרונות שלי
            </CardTitle>
            <Link href="/buyer/requests">
              <Button variant="ghost" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                הצג הכל
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {inquiriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentInquiries.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentInquiries.map((inquiry) => (
                <div
                  key={inquiry.id}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">
                      {inquiry.car
                        ? `${inquiry.car.make} ${inquiry.car.model}`
                        : "פנייה כללית"}
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
                      {new Date(inquiry.createdAt).toLocaleDateString("he-IL")}
                    </span>
                    {inquiry.dealer && (
                      <span>{inquiry.dealer.businessName}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">
                אין פניות עדיין
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                כשתפנה לסוחרים או תשלח הודעות, הן יופיעו כאן
              </p>
              <Link href="/buyer/cars">
                <Button>
                  <Search className="w-4 h-4 mr-2" />
                  התחל לחפש רכבים
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            טיפים לקנייה חכמה
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">לפני הקנייה:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• בדוק היסטוריית תאונות</li>
                <li>• וודא מצב הטכנולוגיה</li>
                <li>• השווה מחירים</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-green-800">במהלך הצפייה:</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• בדוק את המנוע</li>
                <li>• נסה נסיעת מבחן</li>
                <li>• תדרוש אחריות</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
