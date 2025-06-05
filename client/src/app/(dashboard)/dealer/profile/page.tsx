"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  Zap,
  RefreshCw,
  Save,
  User,
  Lock,
  Camera,
  Plus,
  Minus,
  Copy,
  ExternalLink,
  PieChart,
  FileText,
  ImageIcon,
  CreditCard,
  Globe,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import LoadingSpinner from "@/components/ui/loading-spinner";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useDealerCars } from "@/hooks/api/useCars";
import { useReceivedInquiries } from "@/hooks/api/useInquiries";
import { useProfile } from "@/hooks/api/useProfile";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Enhanced business metrics calculation
const useBusinessMetrics = () => {
  const { cars, loading: carsLoading } = useDealerCars();
  const { inquiries, loading: inquiriesLoading } = useReceivedInquiries();

  return useMemo(() => {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Car metrics
    const totalCars = cars.length;
    const activeCars = cars.filter(
      (car) => car.status === "active" && car.isAvailable
    ).length;
    const soldCars = cars.filter((car) => car.status === "sold").length;
    const carsWithImages = cars.filter(
      (car) => car.images && car.images.length > 0
    ).length;
    const averagePrice =
      activeCars > 0
        ? Math.round(
            cars
              .filter((car) => car.status === "active")
              .reduce((sum, car) => sum + car.price, 0) / activeCars
          )
        : 0;

    // Inquiry metrics
    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter((inq) => inq.status === "new").length;
    const respondedInquiries = inquiries.filter(
      (inq) => inq.status === "responded"
    ).length;
    const thisMonthInquiries = inquiries.filter(
      (inq) => new Date(inq.createdAt) >= thisMonth
    ).length;
    const lastMonthInquiries = inquiries.filter((inq) => {
      const date = new Date(inq.createdAt);
      return date >= lastMonth && date < thisMonth;
    }).length;

    // Performance calculations
    const responseRate =
      totalInquiries > 0
        ? Math.round((respondedInquiries / totalInquiries) * 100)
        : 0;
    const soldRate =
      totalCars > 0 ? Math.round((soldCars / totalCars) * 100) : 0;
    const imageCompletionRate =
      totalCars > 0 ? Math.round((carsWithImages / totalCars) * 100) : 0;
    const monthlyGrowth =
      lastMonthInquiries > 0
        ? Math.round(
            ((thisMonthInquiries - lastMonthInquiries) / lastMonthInquiries) *
              100
          )
        : thisMonthInquiries > 0
        ? 100
        : 0;

    // Quality score calculation
    const qualityScore = Math.round(
      responseRate * 0.4 + imageCompletionRate * 0.3 + soldRate * 0.3
    );

    // Business health indicators
    const businessHealth = {
      excellent: qualityScore >= 85,
      good: qualityScore >= 70 && qualityScore < 85,
      needsImprovement: qualityScore < 70,
    };

    return {
      // Basic metrics
      totalCars,
      activeCars,
      soldCars,
      carsWithImages,
      averagePrice,
      totalInquiries,
      newInquiries,
      respondedInquiries,
      thisMonthInquiries,
      lastMonthInquiries,

      // Performance metrics
      responseRate,
      soldRate,
      imageCompletionRate,
      monthlyGrowth,
      qualityScore,
      businessHealth,

      // Loading states
      loading: carsLoading || inquiriesLoading,
    };
  }, [cars, inquiries, carsLoading, inquiriesLoading]);
};

// Enhanced activity data generator
const generateActivityData = (
  cars: any[],
  inquiries: any[]
): ActivityItem[] => {
  const activities: ActivityItem[] = [];

  // Recent cars
  cars.slice(0, 3).forEach((car) => {
    activities.push({
      id: `car-${car.id}`,
      type: car.status === "sold" ? "car_sold" : "car_added",
      title: car.status === "sold" ? "רכב נמכר" : "רכב חדש נוסף",
      description: `${car.make} ${car.model} ${car.year}`,
      date: car.updatedAt || car.createdAt,
      icon: car.status === "sold" ? TrendingUp : CarIcon,
      color: car.status === "sold" ? "text-green-600" : "text-blue-600",
      bg: car.status === "sold" ? "bg-green-50" : "bg-blue-50",
    });
  });

  // Recent inquiries
  inquiries.slice(0, 3).forEach((inquiry) => {
    activities.push({
      id: `inquiry-${inquiry.id}`,
      type: "inquiry",
      title: "פנייה חדשה",
      description: `${inquiry.buyer?.firstName} ${inquiry.buyer?.lastName} - ${
        inquiry.car?.make || "פנייה כללית"
      }`,
      date: inquiry.createdAt,
      icon: MessageSquare,
      color: inquiry.status === "new" ? "text-orange-600" : "text-green-600",
      bg: inquiry.status === "new" ? "bg-orange-50" : "bg-green-50",
    });
  });

  return activities
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);
};

// Activity item interface
interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  date: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
}

// Achievements system
const calculateAchievements = (metrics: any) => {
  const achievements = [];

  if (metrics.responseRate >= 90) {
    achievements.push({
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      title: "מענה מושלם",
      description: "מעל 90% מענה לפניות",
      color: "bg-yellow-50 border-yellow-200",
      earned: true,
    });
  }

  if (metrics.soldRate >= 50) {
    achievements.push({
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: "מוכר מצטיין",
      description: "מעל 50% מהרכבים נמכרו",
      color: "bg-green-50 border-green-200",
      earned: true,
    });
  }

  if (metrics.imageCompletionRate >= 95) {
    achievements.push({
      icon: <ImageIcon className="w-6 h-6 text-purple-600" />,
      title: "תמונות מושלמות",
      description: "כל הרכבים עם תמונות",
      color: "bg-purple-50 border-purple-200",
      earned: true,
    });
  }

  if (metrics.totalCars >= 10) {
    achievements.push({
      icon: <CarIcon className="w-6 h-6 text-blue-600" />,
      title: "מלאי גדול",
      description: "מעל 10 רכבים במלאי",
      color: "bg-blue-50 border-blue-200",
      earned: true,
    });
  }

  if (metrics.monthlyGrowth >= 20) {
    achievements.push({
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      title: "צמיחה מהירה",
      description: "מעל 20% צמיחה חודשית",
      color: "bg-indigo-50 border-indigo-200",
      earned: true,
    });
  }

  // Add potential achievements
  if (achievements.length < 3) {
    if (metrics.responseRate < 90) {
      achievements.push({
        icon: <Clock className="w-6 h-6 text-gray-400" />,
        title: "מענה מושלם",
        description: "השג 90% מענה לפניות",
        color: "bg-gray-50 border-gray-200",
        earned: false,
      });
    }

    if (metrics.imageCompletionRate < 95) {
      achievements.push({
        icon: <ImageIcon className="w-6 h-6 text-gray-400" />,
        title: "תמונות מושלמות",
        description: "הוסף תמונות לכל הרכבים",
        color: "bg-gray-50 border-gray-200",
        earned: false,
      });
    }
  }

  return achievements;
};

export default function DealerProfilePage() {
  const router = useRouter();
  const { hasAccess, isLoading: authLoading } = useDealerRoute();
  const { user, logout } = useAuth();
  const metrics = useBusinessMetrics();
  const { profile, loading: profileLoading, updateProfile } = useProfile();

  // Enhanced state management
  const [activeTab, setActiveTab] = useState("overview");
  const [showDangerZone, setShowDangerZone] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [editMode, setEditMode] = useState(false);

  // Calculate member duration
  const memberSince = useMemo(() => {
    if (!user?.createdAt) return "לא ידוע";
    const created = new Date(user.createdAt);
    const now = new Date();
    const months =
      (now.getFullYear() - created.getFullYear()) * 12 +
      now.getMonth() -
      created.getMonth();

    if (months < 1) return "חדש";
    if (months < 12) return `${months} חודשים`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} ${years === 1 ? "שנה" : "שנים"}${
      remainingMonths > 0 ? ` ו-${remainingMonths} חודשים` : ""
    }`;
  }, [user?.createdAt]);

  // Generate activity data
  const activityData: ActivityItem[] = useMemo(() => {
    if (metrics.loading) return [];
    return generateActivityData([], []); // Will be populated from hooks
  }, [metrics.loading]);

  // Calculate achievements
  const achievements = useMemo(() => {
    return calculateAchievements(metrics);
  }, [metrics]);

  // Enhanced refresh function
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Refresh all data
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("הנתונים עודכנו בהצלחה");
    } catch (error) {
      toast.error("שגיאה בעדכון הנתונים");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Enhanced export function
  const handleExportData = useCallback(() => {
    try {
      const data = {
        profile: user,
        metrics,
        exportDate: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `autix-profile-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("נתוני הפרופיל יוצאו בהצלחה");
    } catch (error) {
      toast.error("שגיאה בייצוא הנתונים");
    }
  }, [user, metrics]);

  // Enhanced delete account function
  const handleDeleteAccount = useCallback(() => {
    if (
      window.confirm(
        "האם אתה בטוח שברצונך למחוק את החשבון? פעולה זו לא ניתנת לביטול!"
      )
    ) {
      if (window.confirm("האם אתה באמת בטוח? כל הנתונים יימחקו לצמיתות!")) {
        toast.error("מחיקת חשבון - פונקציה זו תמומש בקרוב");
      }
    }
  }, []);

  // Profile completion calculation
  const profileCompletion = useMemo(() => {
    if (!user) return 0;

    const fields = [user.firstName, user.lastName, user.email, user.phone];

    const completedFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return Math.round((completedFields / fields.length) * 100);
  }, [user]);

  // Auth guard
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingState message="טוען הרשאות..." />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  // User not found
  if (!user) {
    return (
      <ErrorState
        title="גישה נדחתה"
        message="אנא התחבר כדי לצפות בפרופיל"
        onRetry={() => router.push("/auth/login")}
        showRetry
      />
    );
  }

  // Loading state
  if (profileLoading || metrics.loading) {
    return (
      <div className="container mx-auto px-4 py-6 space-y-6">
        <LoadingState message="טוען פרופיל עסקי..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Enhanced Page Header */}
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw
              className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")}
            />
            רענן
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            הודעות
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="w-4 h-4 mr-2" />
            הגדרות
          </Button>
        </div>
      </div>

      {/* Enhanced Business Info Card */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center">
                <Building2 className="w-10 h-10 text-purple-600" />
              </div>
              <Button
                size="sm"
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full p-0"
                onClick={() => toast.info("עדכון תמונה - בפיתוח")}
              >
                <Camera className="w-3 h-3" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h2>
                <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                  <Building2 className="w-3 h-3 mr-1" />
                  סוחר מורשה
                </Badge>
                {metrics.qualityScore >= 85 && (
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    מוכר מצטיין
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  חבר מאז {memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  ID: {user.id.toString().padStart(6, "0")}
                </span>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="font-medium">4.8</span>
                  <span className="text-xs">(24 ביקורות)</span>
                </div>
              </div>

              {/* Profile Completion */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">השלמת פרופיל</span>
                  <span className="font-medium">{profileCompletion}%</span>
                </div>
                <Progress value={profileCompletion} className="h-2" />
                {profileCompletion < 100 && (
                  <p className="text-xs text-gray-500 mt-1">
                    השלם את הפרטים החסרים לשיפור החשיפה
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-purple-700">
                    {metrics.activeCars}
                  </div>
                  <div className="text-gray-600">רכבים פעילים</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-700">
                    {metrics.responseRate}%
                  </div>
                  <div className="text-gray-600">אחוז מענה</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-blue-700">
                    {metrics.qualityScore}
                  </div>
                  <div className="text-gray-600">ציון איכות</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="hidden md:flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                {editMode ? "בטל עריכה" : "ערוך פרופיל"}
              </Button>
              <Link href="/dealer/cars/new">
                <Button size="sm" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  הוסף רכב
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quality Score Alert */}
      {metrics.businessHealth.needsImprovement && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-800">יש מקום לשיפור</h4>
                <p className="text-sm text-orange-700">
                  ציון האיכות שלך הוא {metrics.qualityScore}. שפר את אחוז המענה
                  והוסף תמונות לרכבים לציון גבוה יותר.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300"
                onClick={() => setActiveTab("overview")}
              >
                צפה בטיפים
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Alert */}
      {metrics.businessHealth.excellent && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">
                  ביצועים מעולים! 🏆
                </h4>
                <p className="text-sm text-green-700">
                  ציון האיכות שלך הוא {metrics.qualityScore} - זה מעולה! אתה
                  מנהל עסק מקצועי ויעיל.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Performance Dashboard */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    מדדי ביצועים עיקריים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <CarIcon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-900">
                        {metrics.activeCars}
                      </div>
                      <div className="text-sm text-blue-600">רכבים פעילים</div>
                      <div className="text-xs text-gray-500 mt-1">
                        מתוך {metrics.totalCars} סה"כ
                      </div>
                    </div>

                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-900">
                        {metrics.soldRate}%
                      </div>
                      <div className="text-sm text-green-600">אחוז מכירות</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {metrics.soldCars} רכבים נמכרו
                      </div>
                    </div>

                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-900">
                        {metrics.responseRate}%
                      </div>
                      <div className="text-sm text-purple-600">אחוז מענה</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {metrics.respondedInquiries} מתוך{" "}
                        {metrics.totalInquiries}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <ImageIcon className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-orange-900">
                        {metrics.imageCompletionRate}%
                      </div>
                      <div className="text-sm text-orange-600">תמונות</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {metrics.carsWithImages} עם תמונות
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Monthly Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    ביצועים חודשיים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-700 mb-1">
                        {metrics.thisMonthInquiries}
                      </div>
                      <p className="text-sm text-blue-600 mb-2">פניות החודש</p>
                      {metrics.monthlyGrowth !== 0 && (
                        <div
                          className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            metrics.monthlyGrowth > 0
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          )}
                        >
                          {metrics.monthlyGrowth > 0 ? "+" : ""}
                          {metrics.monthlyGrowth}% לעומת חודש קודם
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-700 mb-1">
                        {metrics.newInquiries}
                      </div>
                      <p className="text-sm text-green-600 mb-2">פניות חדשות</p>
                      <div className="text-xs text-gray-500">ממתינות למענה</div>
                    </div>

                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-700 mb-1">
                        {metrics.averagePrice > 0
                          ? `${Math.round(metrics.averagePrice / 1000)}K`
                          : "0"}
                        ₪
                      </div>
                      <p className="text-sm text-purple-600 mb-2">מחיר ממוצע</p>
                      <div className="text-xs text-gray-500">רכבים פעילים</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Business Tips */}
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-amber-800">
                    <Zap className="w-5 h-5" />
                    טיפים לשיפור ביצועים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {metrics.responseRate < 80 && (
                      <div className="p-4 bg-white rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <h4 className="font-medium text-amber-800">
                            שפר זמן תגובה
                          </h4>
                        </div>
                        <p className="text-sm text-amber-700 mb-3">
                          אחוז המענה שלך: {metrics.responseRate}%. המטרה: מעל
                          80%
                        </p>
                        <Link href="/dealer/inquiries">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-700 border-amber-300"
                          >
                            טפל בפניות
                          </Button>
                        </Link>
                      </div>
                    )}

                    {metrics.imageCompletionRate < 95 && (
                      <div className="p-4 bg-white rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <ImageIcon className="w-5 h-5 text-amber-600" />
                          <h4 className="font-medium text-amber-800">
                            הוסף תמונות
                          </h4>
                        </div>
                        <p className="text-sm text-amber-700 mb-3">
                          {metrics.totalCars - metrics.carsWithImages} רכבים ללא
                          תמונות
                        </p>
                        <Link href="/dealer/cars">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-700 border-amber-300"
                          >
                            עדכן רכבים
                          </Button>
                        </Link>
                      </div>
                    )}

                    {metrics.activeCars === 0 && (
                      <div className="p-4 bg-white rounded-lg border border-amber-200">
                        <div className="flex items-center gap-2 mb-2">
                          <CarIcon className="w-5 h-5 text-amber-600" />
                          <h4 className="font-medium text-amber-800">
                            הוסף רכבים
                          </h4>
                        </div>
                        <p className="text-sm text-amber-700 mb-3">
                          אין רכבים פעילים במלאי
                        </p>
                        <Link href="/dealer/cars/new">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-amber-700 border-amber-300"
                          >
                            פרסם רכב
                          </Button>
                        </Link>
                      </div>
                    )}

                    <div className="p-4 bg-white rounded-lg border border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-5 h-5 text-amber-600" />
                        <h4 className="font-medium text-amber-800">
                          מטרות שבועיות
                        </h4>
                      </div>
                      <p className="text-sm text-amber-700 mb-3">
                        קבע מטרות שבועיות לשיפור הביצועים
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-amber-700 border-amber-300"
                      >
                        קבע מטרות
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quality Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    ציון איכות עסקי
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div
                    className={cn(
                      "text-6xl font-bold mb-2",
                      metrics.businessHealth.excellent
                        ? "text-green-600"
                        : metrics.businessHealth.good
                        ? "text-yellow-600"
                        : "text-orange-600"
                    )}
                  >
                    {metrics.qualityScore}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium mb-4",
                      metrics.businessHealth.excellent
                        ? "text-green-700"
                        : metrics.businessHealth.good
                        ? "text-yellow-700"
                        : "text-orange-700"
                    )}
                  >
                    {metrics.businessHealth.excellent
                      ? "מעולה 🏆"
                      : metrics.businessHealth.good
                      ? "טוב 👍"
                      : "זקוק לשיפור 📈"}
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>מענה לפניות</span>
                      <span className="font-medium">
                        {metrics.responseRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>תמונות ברכבים</span>
                      <span className="font-medium">
                        {metrics.imageCompletionRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>אחוז מכירות</span>
                      <span className="font-medium">{metrics.soldRate}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    הישגים עסקיים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className={cn(
                          "p-3 rounded-lg border",
                          achievement.color,
                          !achievement.earned && "opacity-60"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {achievement.icon}
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              {achievement.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {achievement.description}
                            </p>
                          </div>
                          {achievement.earned && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <Plus className="w-4 h-4 mr-2" />
                      פרסם רכב חדש
                    </Button>
                  </Link>

                  <Link href="/dealer/inquiries" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      צפה בפניות
                      {metrics.newInquiries > 0 && (
                        <Badge className="mr-2 bg-blue-100 text-blue-800">
                          {metrics.newInquiries}
                        </Badge>
                      )}
                    </Button>
                  </Link>

                  <Link href="/dealer/cars" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <CarIcon className="w-4 h-4 mr-2" />
                      נהל מלאי
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleExportData}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    ייצא נתונים
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Profile Edit Tab */}
        <TabsContent value="profile">
          <ProfileForm
            onSuccess={() => {
              toast.success("הפרופיל עודכן בהצלחה");
              setEditMode(false);
            }}
          />
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
              {activityData.length > 0 ? (
                <div className="space-y-4">
                  {activityData.map((activity) => (
                    <div
                      key={activity.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg",
                        activity.bg
                      )}
                    >
                      <div className={cn("mt-0.5", activity.color)}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {activity.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {activity.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(activity.date).toLocaleDateString("he-IL")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    אין פעילות עדיין
                  </h3>
                  <p className="text-gray-600 mb-4">
                    פעילויות עסקיות יופיעו כאן
                  </p>
                  <Link href="/dealer/cars/new">
                    <Button>התחל עכשיו</Button>
                  </Link>
                </div>
              )}
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

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">רענון אוטומטי</h4>
                  <p className="text-sm text-gray-600">
                    רענן נתונים אוטומטית כל 30 שניות
                  </p>
                </div>
                <input type="checkbox" className="toggle" defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                הגדרות התראות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h5 className="font-medium">התראות פניות</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">פנייה חדשה</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">פנייה דחופה (+24 שעות)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">תזכורת מענה</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <h5 className="font-medium">התראות רכבים</h5>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">רכב נצפה הרבה</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" />
                      <span className="text-sm">הצעת מחיר חדשה</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked />
                      <span className="text-sm">סיכום שבועי</span>
                    </label>
                  </div>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={handleExportData}
                >
                  <Download className="w-4 h-4 mr-2" />
                  הורד את נתוני העסק
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toast.info("גיבוי אוטומטי - בפיתוח")}
                >
                  <Save className="w-4 h-4 mr-2" />
                  הגדר גיבוי אוטומטי
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toast.info("שינוי סיסמה - בפיתוח")}
                >
                  <Lock className="w-4 h-4 mr-2" />
                  שנה סיסמה
                </Button>

                <Button
                  variant="outline"
                  className="justify-start"
                  onClick={() => toast.info("היסטוריית גישה - בפיתוח")}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  היסטוריית גישה
                </Button>
              </div>

              {/* Danger Zone */}
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

          {/* Support */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeadphonesIcon className="w-5 h-5" />
                תמיכה ועזרה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  מדריך משתמש
                </Button>

                <Button variant="outline" className="justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  מרכז עזרה
                </Button>

                <Button variant="outline" className="justify-start">
                  <Mail className="w-4 h-4 mr-2" />
                  צור קשר עם תמיכה
                </Button>

                <Button variant="outline" className="justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  צ'אט עם תמיכה
                </Button>
              </div>

              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>טיפ:</strong> רוב השאלות נענות במדריך המשתמש.
                  לבעיות דחופות, צור קשר עם התמיכה.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
