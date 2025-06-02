// app-new/(dashboard)/buyer/profile/page.tsx - Buyer Profile Page
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Settings,
  Activity,
  Heart,
  MessageSquare,
  Search,
  Calendar,
  Shield,
  Bell,
  Download,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Edit,
  Eye,
  Car as CarIcon,
  TrendingUp,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useFavorites } from "@/hooks/ui/useLocalStorage";
import { useMyRequests } from "@/hooks/api/useRequests";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const ACTIVITY_DATA = [
  {
    id: 1,
    type: "search",
    title: "חיפוש רכבים",
    description: "חיפשת Toyota Corolla 2020-2022",
    date: "לפני 2 שעות",
    icon: <Search className="w-4 h-4" />,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "favorite",
    title: "הוספה למועדפים",
    description: "שמרת Honda Civic 2021",
    date: "אתמול",
    icon: <Heart className="w-4 h-4" />,
    color: "text-red-600",
  },
  {
    id: 3,
    type: "inquiry",
    title: "פנייה נשלחה",
    description: "פנית לסוחר בנוגע למזדה CX-5",
    date: "לפני 3 ימים",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-green-600",
  },
  {
    id: 4,
    type: "request",
    title: "בקשה נוצרה",
    description: "יצרת בקשה חדשה לרכב משפחתי",
    date: "לפני שבוע",
    icon: <CarIcon className="w-4 h-4" />,
    color: "text-purple-600",
  },
];

// Format Functions
const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function BuyerProfilePage() {
  const { user, logout } = useAuth();
  const { favorites, removeFromFavorites, isFavorite } = useFavorites();
  const { requests, loading: requestsLoading } = useMyRequests();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDangerZone, setShowDangerZone] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const activeRequests = requests.filter((r) => r.status === "active").length;
    const totalFavorites = favorites.length;
    const recentActivity = ACTIVITY_DATA.length;

    return {
      totalRequests: requests.length,
      activeRequests,
      totalFavorites,
      recentActivity,
      memberSince: user?.createdAt ? formatDate(user.createdAt) : "לא ידוע",
    };
  }, [requests, favorites, user]);

  // Handle actions
  const handleClearFavorites = () => {
    if (window.confirm("האם אתה בטוח שברצונך לנקות את כל המועדפים?")) {
      // Clear all favorites by removing each one
      favorites.forEach((carId) => removeFromFavorites(carId));
      toast.success("המועדפים נוקו בהצלחה");
    }
  };

  const handleExportData = () => {
    // Implementation for data export
    toast.info("ייצוא נתונים - בפיתוח");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו לא ניתנת לביטול!"
      )
    ) {
      // Implementation for account deletion
      toast.error("מחיקת חשבון - בפיתוח");
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              גישה נדחתה
            </h3>
            <p className="text-red-600 mb-4">אנא התחבר כדי לצפות בפרופיל</p>
            <Link href="/login">
              <Button>התחבר</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">הפרופיל שלי</h1>
          <p className="text-gray-600 mt-1">
            נהל את הפרטים האישיים והעדפות החשבון שלך
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            הודעות
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            הגדרות
          </Button>
        </div>
      </div>

      {/* User Info Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <UserIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <UserIcon className="w-3 h-3 mr-1" />
                  קונה
                </Badge>
                <span className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  חבר מאז {stats.memberSince}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">בקשות רכב</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalRequests}
                </p>
                <p className="text-xs text-green-600">
                  {stats.activeRequests} פעילות
                </p>
              </div>
              <CarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">רכבים שמורים</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalFavorites}
                </p>
                <p className="text-xs text-gray-500">למועדפים</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">פעילות אחרונה</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.recentActivity}
                </p>
                <p className="text-xs text-gray-500">פעולות</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">זמן חיפוש</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-purple-600">ימים ממוצע</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">סקירה</TabsTrigger>
          <TabsTrigger value="profile">עריכת פרופיל</TabsTrigger>
          <TabsTrigger value="activity">פעילות</TabsTrigger>
          <TabsTrigger value="settings">הגדרות</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Requests */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarIcon className="w-5 h-5" />
                  בקשות אחרונות
                </CardTitle>
              </CardHeader>
              <CardContent>
                {requestsLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <CarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">אין בקשות רכב</p>
                    <Link
                      href="/buyer/requests/new"
                      className="mt-2 inline-block"
                    >
                      <Button size="sm">צור בקשה ראשונה</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {requests.slice(0, 3).map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {request.make && request.model
                              ? `${request.make} ${request.model}`
                              : "בקשת רכב כללית"}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatDate(request.createdAt)}
                          </p>
                        </div>
                        <Badge
                          className={
                            request.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {request.status === "active" ? "פעיל" : "סגור"}
                        </Badge>
                      </div>
                    ))}

                    <Link href="/buyer/requests" className="block">
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        צפה בכל הבקשות
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  פעולות מהירות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/buyer/cars" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <Search className="w-4 h-4 mr-2" />
                    חפש רכבים
                  </Button>
                </Link>

                <Link href="/buyer/requests/new" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <CarIcon className="w-4 h-4 mr-2" />
                    צור בקשת רכב
                  </Button>
                </Link>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setActiveTab("activity")}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  צפה בפעילות
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleClearFavorites}
                  disabled={stats.totalFavorites === 0}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  נקה מועדפים ({stats.totalFavorites})
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Tips Card */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-2">
                    טיפים למציאת הרכב המושלם:
                  </h4>
                  <ul className="space-y-1 text-xs">
                    <li>• עדכן את הפרופיל שלך עם פרטי יצירת קשר מדויקים</li>
                    <li>• צור בקשות רכב מפורטות לקבלת הצעות מותאמות</li>
                    <li>• שמור רכבים מעניינים למועדפים לעקיבה מתמשכת</li>
                    <li>• הגב במהירות לפניות מסוחרים לחוויה טובה יותר</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Edit Tab */}
        <TabsContent value="profile">
          <ProfileForm />
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                פעילות אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ACTIVITY_DATA.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className={cn("mt-0.5", activity.color)}>
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{activity.title}</h4>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          {/* Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                הודעות והתראות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">הודעות אימייל</h4>
                  <p className="text-sm text-gray-600">
                    קבל עדכונים על הצעות חדשות
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">התראות פוש</h4>
                  <p className="text-sm text-gray-600">
                    התראות מיידיות על פעילות
                  </p>
                </div>
                <input type="checkbox" className="toggle" />
              </div>
            </CardContent>
          </Card>

          {/* Privacy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                פרטיות ואבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start">
                <Download className="w-4 h-4 mr-2" />
                הורד את הנתונים שלך
              </Button>

              <div className="border-t pt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start text-yellow-600 hover:text-yellow-700"
                  onClick={() => setShowDangerZone(!showDangerZone)}
                >
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  אזור סכנה
                </Button>

                {showDangerZone && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2">
                      פעולות בלתי הפיכות
                    </h4>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleExportData}
                        className="w-full justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        ייצוא כל הנתונים
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAccount}
                        className="w-full justify-start text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        מחק חשבון לצמיתות
                      </Button>
                    </div>

                    <div className="mt-3 text-xs text-red-600">
                      <p>
                        ⚠️ מחיקת החשבון תסיר את כל הנתונים, הבקשות והמועדפים שלך
                        לצמיתות
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
