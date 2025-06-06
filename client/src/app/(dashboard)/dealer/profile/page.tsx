"use client";

import React, { useState, useMemo } from "react";
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
  Edit,
  Users,
  Clock,
  Star,
  Award,
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
  Copy,
  ImageIcon,
  Target,
  HeadphonesIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";
import ProfileForm from "@/components/forms/ProfileForm";
import { useAuth } from "@/contexts/AuthContext";
import { useDealerCars } from "@/hooks/api/useCars";
import { useReceivedInquiries } from "@/hooks/api/useInquiries";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ✅ Simplified unified hook
const useDealerProfile = () => {
  const { user } = useAuth();
  const { cars, loading: carsLoading } = useDealerCars();
  const { inquiries, loading: inquiriesLoading } = useReceivedInquiries();

  return useMemo(() => {
    const activeCars = cars.filter(
      (car) => car.status === "active" && car.isAvailable
    ).length;
    const soldCars = cars.filter((car) => car.status === "sold").length;
    const carsWithImages = cars.filter(
      (car) => car.images && car.images.length > 0
    ).length;
    const newInquiries = inquiries.filter((inq) => inq.status === "new").length;
    const respondedInquiries = inquiries.filter(
      (inq) => inq.status === "responded"
    ).length;

    const totalValue = cars
      .filter((car) => car.status === "active" && car.isAvailable)
      .reduce((sum, car) => sum + car.price, 0);

    const responseRate =
      inquiries.length > 0
        ? Math.round((respondedInquiries / inquiries.length) * 100)
        : 100;

    const imageCompletionRate =
      cars.length > 0 ? Math.round((carsWithImages / cars.length) * 100) : 100;

    const qualityScore = Math.round(
      responseRate * 0.6 + imageCompletionRate * 0.4
    );

    // Profile completion
    const profileFields = [
      user?.firstName,
      user?.lastName,
      user?.email,
      user?.phone,
    ];
    const completedFields = profileFields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    const profileCompletion = Math.round(
      (completedFields / profileFields.length) * 100
    );

    // Recent activity (simplified)
    const recentActivity = [
      ...cars.slice(0, 2).map((car) => ({
        id: `car-${car.id}`,
        title: car.status === "sold" ? "רכב נמכר" : "רכב חדש",
        description: `${car.make} ${car.model} ${car.year}`,
        date: car.updatedAt || car.createdAt,
        icon: car.status === "sold" ? TrendingUp : CarIcon,
        color: car.status === "sold" ? "text-green-600" : "text-blue-600",
      })),
      ...inquiries.slice(0, 2).map((inquiry) => ({
        id: `inquiry-${inquiry.id}`,
        title: "פנייה חדשה",
        description: `${inquiry.buyer?.firstName} ${inquiry.buyer?.lastName}`,
        date: inquiry.createdAt,
        icon: MessageSquare,
        color: inquiry.status === "new" ? "text-orange-600" : "text-green-600",
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    return {
      // Basic metrics
      totalCars: cars.length,
      activeCars,
      soldCars,
      newInquiries,
      totalValue,
      responseRate,
      qualityScore,
      profileCompletion,
      recentActivity,
      loading: carsLoading || inquiriesLoading,
      // Helper flags
      isExcellent: qualityScore >= 85,
      needsImprovement: qualityScore < 70,
      hasUrgentItems: newInquiries > 0 || cars.length - carsWithImages > 0,
    };
  }, [user, cars, inquiries, carsLoading, inquiriesLoading]);
};

// ✅ Simplified stat card component
const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "blue",
  urgent = false,
  onClick,
}: {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color?: string;
  urgent?: boolean;
  onClick?: () => void;
}) => (
  <Card
    className={cn(
      "cursor-pointer hover:shadow-md transition-all",
      urgent && "ring-2 ring-orange-200 bg-orange-50/50"
    )}
    onClick={onClick}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {urgent && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={cn("p-3 rounded-full", `bg-${color}-50`)}>
          <Icon className={cn("h-6 w-6", `text-${color}-600`)} />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ✅ Simplified business info card
const BusinessInfoCard = ({ user, stats }: { user: any; stats: any }) => {
  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("he-IL", {
        year: "numeric",
        month: "long",
      })
    : "לא ידוע";

  return (
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
              onClick={() => toast.info("עדכון תמונה - בקרוב")}
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
              {stats.isExcellent && (
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
            </div>

            {/* Profile Completion */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">השלמת פרופיל</span>
                <span className="font-medium">{stats.profileCompletion}%</span>
              </div>
              <Progress value={stats.profileCompletion} className="h-2" />
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-sm">
              <div className="text-center">
                <div className="font-bold text-purple-700">
                  {stats.activeCars}
                </div>
                <div className="text-gray-600">רכבים פעילים</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-700">
                  {stats.responseRate}%
                </div>
                <div className="text-gray-600">אחוז מענה</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-blue-700">
                  {stats.qualityScore}
                </div>
                <div className="text-gray-600">ציון איכות</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="hidden md:flex flex-col gap-2">
            <Link href="/dealer/cars/new">
              <Button size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                הוסף רכב
              </Button>
            </Link>
            <Link href="/dealer/cars">
              <Button variant="outline" size="sm" className="w-full">
                <CarIcon className="w-4 h-4 mr-2" />
                נהל מלאי
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// ✅ Simplified achievements (only 3 key ones)
const AchievementsCard = ({ stats }: { stats: any }) => {
  const achievements = [
    {
      icon: <Star className="w-6 h-6 text-yellow-600" />,
      title: "מענה מושלם",
      description: "מעל 90% מענה לפניות",
      earned: stats.responseRate >= 90,
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-green-600" />,
      title: "מוכר פעיל",
      description: "מעל 5 רכבים פעילים",
      earned: stats.activeCars >= 5,
      color: "bg-green-50 border-green-200",
    },
    {
      icon: <Award className="w-6 h-6 text-purple-600" />,
      title: "מקצועי מוכח",
      description: "ציון איכות מעל 80",
      earned: stats.qualityScore >= 80,
      color: "bg-purple-50 border-purple-200",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5" />
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
                  <h4 className="font-semibold text-sm">{achievement.title}</h4>
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
  );
};

// ✅ Main component
export default function DealerProfilePage() {
  const router = useRouter();
  const { hasAccess, isLoading: authLoading } = useDealerRoute();
  const { user } = useAuth();
  const stats = useDealerProfile();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("הנתונים עודכנו");
    }, 1000);
  };

  const handleExportData = () => {
    const data = { user, stats, exportDate: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `autix-profile-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("נתונים יוצאו בהצלחה");
  };

  // Auth checks
  if (authLoading) {
    return <LoadingState message="טוען הרשאות..." />;
  }

  if (!hasAccess || !user) {
    return (
      <ErrorState title="גישה נדחתה" message="אנא התחבר כדי לצפות בפרופיל" />
    );
  }

  if (stats.loading) {
    return <LoadingState message="טוען פרופיל עסקי..." />;
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
            <Settings className="w-4 h-4 mr-2" />
            הגדרות
          </Button>
        </div>
      </div>

      {/* Business Info */}
      <BusinessInfoCard user={user} stats={stats} />

      {/* Quality Alert */}
      {stats.needsImprovement && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-800">יש מקום לשיפור</h4>
                <p className="text-sm text-orange-700">
                  ציון האיכות שלך הוא {stats.qualityScore}. שפר את אחוז המענה
                  והוסף תמונות לרכבים.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-orange-700 border-orange-300"
              >
                צפה בטיפים
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Excellence Alert */}
      {stats.isExcellent && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Award className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <h4 className="font-medium text-green-800">
                  ביצועים מעולים! 🏆
                </h4>
                <p className="text-sm text-green-700">
                  ציון האיכות שלך הוא {stats.qualityScore} - זה מעולה!
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
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">סקירה ופעילות</TabsTrigger>
          <TabsTrigger value="profile">עריכת פרופיל</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Metrics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <StatCard
                  title="רכבים פעילים"
                  value={stats.activeCars}
                  subtitle="מוכנים למכירה"
                  icon={CarIcon}
                  onClick={() => router.push("/dealer/cars")}
                />
                <StatCard
                  title="פניות חדשות"
                  value={stats.newInquiries}
                  subtitle="דורשות מענה"
                  icon={MessageSquare}
                  color="purple"
                  urgent={stats.newInquiries > 0}
                  onClick={() => router.push("/dealer/inquiries")}
                />
                <StatCard
                  title="ציון איכות"
                  value={stats.qualityScore}
                  subtitle={stats.isExcellent ? "מעולה!" : "טוב"}
                  icon={Award}
                  color={stats.isExcellent ? "green" : "yellow"}
                />
              </div>

              {/* Performance Chart Placeholder */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    ביצועים חודשיים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <div className="text-3xl font-bold text-blue-700 mb-1">
                        {stats.activeCars}
                      </div>
                      <p className="text-sm text-blue-600 mb-2">רכבים פעילים</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-green-700 mb-1">
                        {stats.responseRate}%
                      </div>
                      <p className="text-sm text-green-600 mb-2">אחוז מענה</p>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-purple-700 mb-1">
                        {stats.totalValue > 0
                          ? `${Math.round(stats.totalValue / 1000)}K₪`
                          : "0₪"}
                      </div>
                      <p className="text-sm text-purple-600 mb-2">ערך מלאי</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      פעילות אחרונה
                    </CardTitle>
                    <Link href="/dealer/inquiries">
                      <Button variant="ghost" size="sm">
                        הצג הכל
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  {stats.recentActivity.length > 0 ? (
                    <div className="space-y-3">
                      {stats.recentActivity.map((activity: any) => (
                        <div
                          key={activity.id}
                          className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg"
                        >
                          <div className={activity.color}>
                            <activity.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">
                              {activity.title}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {activity.description}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(activity.date).toLocaleDateString(
                              "he-IL"
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">אין פעילות אחרונה</p>
                    </div>
                  )}
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
                      stats.isExcellent
                        ? "text-green-600"
                        : stats.needsImprovement
                        ? "text-orange-600"
                        : "text-yellow-600"
                    )}
                  >
                    {stats.qualityScore}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium mb-4",
                      stats.isExcellent
                        ? "text-green-700"
                        : stats.needsImprovement
                        ? "text-orange-700"
                        : "text-yellow-700"
                    )}
                  >
                    {stats.isExcellent
                      ? "מעולה 🏆"
                      : stats.needsImprovement
                      ? "זקוק לשיפור 📈"
                      : "טוב 👍"}
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>מענה לפניות</span>
                      <span className="font-medium">{stats.responseRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>רכבים פעילים</span>
                      <span className="font-medium">{stats.activeCars}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements */}
              <AchievementsCard stats={stats} />

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
                      {stats.newInquiries > 0 && (
                        <Badge className="mr-2 bg-blue-100 text-blue-800">
                          {stats.newInquiries}
                        </Badge>
                      )}
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
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
