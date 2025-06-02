// app-new/(dashboard)/dealer/profile/page.tsx - Dealer Profile Page
"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Building2,
  Settings,
  Activity,
  TrendingUp,
  MessageSquare,
  Car as CarIcon,
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
  Users,
  DollarSign,
  Clock,
  Star,
  Award,
  Target,
  Phone,
  Mail,
  MapPin,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useDealerCars } from "@/hooks/api/useCars";
import { useReceivedInquiries } from "@/hooks/api/useInquiries";
import { cn } from "@/lib/utils";

// Mock data for demonstration
const ACTIVITY_DATA = [
  {
    id: 1,
    type: "car_added",
    title: "רכב חדש נוסף",
    description: "הוספת טויוטה קורולה 2020 למלאי",
    date: "לפני 2 שעות",
    icon: <CarIcon className="w-4 h-4" />,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    id: 2,
    type: "inquiry",
    title: "פנייה חדשה",
    description: "דני כהן פנה בנוגע להונדה סיוויק",
    date: "אתמול",
    icon: <MessageSquare className="w-4 h-4" />,
    color: "text-green-600",
    bg: "bg-green-50",
  },
  {
    id: 3,
    type: "car_sold",
    title: "רכב נמכר",
    description: "מזדה CX-5 2019 סומן כנמכר",
    date: "לפני 3 ימים",
    icon: <CheckCircle className="w-4 h-4" />,
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    id: 4,
    type: "profile_update",
    title: "עדכון פרופיל",
    description: "עדכנת את פרטי העסק",
    date: "לפני שבוע",
    icon: <Edit className="w-4 h-4" />,
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
];

// Business achievements
const ACHIEVEMENTS = [
  {
    icon: <Star className="w-6 h-6 text-yellow-600" />,
    title: "סוחר מעולה",
    description: "דירוג גבוה מקונים",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    title: "מכירות מהירות",
    description: "ממוצע מכירה תוך 14 ימים",
    color: "bg-green-50 border-green-200",
  },
  {
    icon: <Users className="w-6 h-6 text-blue-600" />,
    title: "מענה מהיר",
    description: "תגובה תוך 24 שעות",
    color: "bg-blue-50 border-blue-200",
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

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL").format(price) + "₪";
};

export default function DealerProfilePage() {
  const { user, logout } = useAuth();
  const { cars, loading: carsLoading } = useDealerCars();
  const { inquiries, loading: inquiriesLoading } = useReceivedInquiries();

  const [activeTab, setActiveTab] = useState("overview");
  const [showDangerZone, setShowDangerZone] = useState(false);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCars = cars.length;
    const activeCars = cars.filter(
      (car) => car.isAvailable && car.status === "active"
    ).length;
    const soldCars = cars.filter((car) => car.status === "sold").length;
    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter((inq) => inq.status === "new").length;

    // Calculate total inventory value
    const totalValue = cars
      .filter((car) => car.isAvailable && car.status === "active")
      .reduce((sum, car) => sum + car.price, 0);

    // Calculate response rate
    const respondedInquiries = inquiries.filter(
      (inq) => inq.status === "responded"
    ).length;
    const responseRate =
      totalInquiries > 0
        ? Math.round((respondedInquiries / totalInquiries) * 100)
        : 0;

    return {
      totalCars,
      activeCars,
      soldCars,
      totalValue,
      totalInquiries,
      newInquiries,
      responseRate,
      memberSince: user?.createdAt ? formatDate(user.createdAt) : "לא ידוע",
    };
  }, [cars, inquiries, user]);

  // Recent cars (last 3)
  const recentCars = useMemo(() => {
    return [...cars]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3);
  }, [cars]);

  // Handle actions
  const handleExportData = () => {
    toast.info("ייצוא נתונים - בפיתוח");
  };

  const handleDeleteAccount = () => {
    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו לא ניתנת לביטול!"
      )
    ) {
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
          <h1 className="text-3xl font-bold text-gray-900">
            הפרופיל העסקי שלי
          </h1>
          <p className="text-gray-600 mt-1">
            נהל את הפרטים העסקיים והעדפות החשבון שלך
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

      {/* Business Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-full shadow-sm">
              <Building2 className="w-8 h-8 text-purple-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-gray-600">עסק רכב מקצועי</p>
              <div className="flex items-center gap-4 mt-2">
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Building2 className="w-3 h-3 mr-1" />
                  סוחר מורשה
                </Badge>
                <span className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  חבר מאז {stats.memberSince}
                </span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">4.8</span>
                  <span className="text-xs text-gray-500">(24 ביקורות)</span>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="text-right">
                <p className="text-sm text-gray-600">ID עסק</p>
                <p className="text-lg font-mono">
                  {user.id.toString().padStart(6, "0")}
                </p>
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
                <p className="text-sm text-gray-600">רכבים במלאי</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCars}
                </p>
                <p className="text-xs text-green-600">
                  {stats.activeCars} פעילים
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
                <p className="text-sm text-gray-600">ערך מלאי</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalValue > 0 ? formatPrice(stats.totalValue) : "0₪"}
                </p>
                <p className="text-xs text-gray-500">פעיל</p>
              </div>
              <DollarSign className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">פניות</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalInquiries}
                </p>
                <p className="text-xs text-blue-600">
                  {stats.newInquiries} חדשות
                </p>
              </div>
              <MessageSquare className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">אחוז מענה</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.responseRate}%
                </p>
                <p className="text-xs text-purple-600">מענה מהיר</p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            הישגים עסקיים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {ACHIEVEMENTS.map((achievement, index) => (
              <div
                key={index}
                className={cn("p-4 rounded-lg border", achievement.color)}
              >
                <div className="flex items-center gap-3">
                  {achievement.icon}
                  <div>
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
            {/* Recent Cars */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CarIcon className="w-5 h-5" />
                  רכבים אחרונים
                </CardTitle>
              </CardHeader>
              <CardContent>
                {carsLoading ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : recentCars.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <CarIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm">אין רכבים במלאי</p>
                    <Link href="/dealer/cars/new" className="mt-2 inline-block">
                      <Button size="sm">הוסף רכב ראשון</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentCars.map((car) => (
                      <div
                        key={car.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {car.make} {car.model} {car.year}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {formatPrice(car.price)} •{" "}
                            {formatDate(car.createdAt)}
                          </p>
                        </div>
                        <Badge
                          className={
                            car.status === "active"
                              ? "bg-green-100 text-green-800"
                              : car.status === "sold"
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
                          }
                        >
                          {car.status === "active"
                            ? "פעיל"
                            : car.status === "sold"
                            ? "נמכר"
                            : "לא פעיל"}
                        </Badge>
                      </div>
                    ))}

                    <Link href="/dealer/cars" className="block">
                      <Button variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        צפה בכל הרכבים
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
                  <Target className="w-5 h-5" />
                  פעולות מהירות
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dealer/cars/new" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <CarIcon className="w-4 h-4 mr-2" />
                    הוסף רכב חדש
                  </Button>
                </Link>

                <Link href="/dealer/inquiries" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    צפה בפניות ({stats.newInquiries} חדשות)
                  </Button>
                </Link>

                <Link href="/dealer/cars" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    נהל מלאי
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
              </CardContent>
            </Card>
          </div>

          {/* Performance Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <TrendingUp className="w-5 h-5" />
                סיכום ביצועים
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    {stats.soldCars}
                  </div>
                  <p className="text-sm text-green-600">רכבים נמכרו החודש</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    {stats.responseRate}%
                  </div>
                  <p className="text-sm text-green-600">אחוז מענה לפניות</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-700 mb-1">
                    14
                  </div>
                  <p className="text-sm text-green-600">ימים ממוצע למכירה</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <h4 className="font-medium mb-2">טיפים להגדלת מכירות:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• עדכן תמונות איכותיות לכל הרכבים</li>
                    <li>• הגב במהירות לפניות - תוך 24 שעות</li>
                    <li>• עדכן מחירים באופן קבוע לפי השוק</li>
                    <li>• כתוב תיאורים מפורטים ומדויקים</li>
                    <li>• סמן רכבים שנמכרו כדי לשמור על אמינות</li>
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
                פעילות עסקית אחרונה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ACTIVITY_DATA.map((activity) => (
                  <div
                    key={activity.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg",
                      activity.bg
                    )}
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
          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                הגדרות עסק
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">הודעות אימייל עסקיות</h4>
                  <p className="text-sm text-gray-600">
                    קבל עדכונים על פניות ורכבים חדשים
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">התראות SMS</h4>
                  <p className="text-sm text-gray-600">
                    התראות מיידיות על פניות חדשות
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">פרופיל ציבורי</h4>
                  <p className="text-sm text-gray-600">
                    הצג את העסק בתוצאות החיפוש
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                פרטיות ואבטחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={handleExportData}
              >
                <Download className="w-4 h-4 mr-2" />
                הורד את נתוני העסק
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
                        גיבוי מלא של נתוני העסק
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDeleteAccount}
                        className="w-full justify-start text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        מחק חשבון עסק לצמיתות
                      </Button>
                    </div>

                    <div className="mt-3 text-xs text-red-600">
                      <p>
                        ⚠️ מחיקת החשבון תסיר את כל הרכבים, הפניות וההיסטוריה
                        העסקית לצמיתות
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
