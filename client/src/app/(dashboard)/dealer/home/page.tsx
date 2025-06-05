"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useDealerCars } from "@/hooks/api/useCars";
import { useReceivedInquiries } from "@/hooks/api/useInquiries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LoadingSpinner from "@/components/ui/loading-spinner";
import ErrorState from "@/components/states/ErrorState";
import { carEvents } from "@/lib/events/carEvents";
import { cn } from "@/lib/utils";
import {
  Plus,
  Car,
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
  RefreshCw,
  Activity,
  Target,
  Zap,
  Award,
  Image,
  ArrowRight,
  Bell,
} from "lucide-react";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";

// ✅ מחשבון סטטיסטיקות מקוצר
const useProfileStats = () => {
  const { cars, loading: carsLoading, error: carsError } = useDealerCars();
  const {
    inquiries,
    loading: inquiriesLoading,
    error: inquiriesError,
  } = useReceivedInquiries();

  const stats = useMemo(() => {
    const activeCars = cars.filter(
      (car) => car.status === "active" && car.isAvailable
    ).length;
    const soldCars = cars.filter((car) => car.status === "sold").length;
    const carsWithoutImages = cars.filter(
      (car) => !car.images || car.images.length === 0
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

    return {
      activeCars,
      soldCars,
      carsWithoutImages,
      totalValue,
      newInquiries,
      responseRate,
      urgentCount: newInquiries + carsWithoutImages,
      qualityScore:
        responseRate >= 80 && carsWithoutImages === 0
          ? 90
          : responseRate >= 60 && carsWithoutImages <= 2
          ? 70
          : 50,
    };
  }, [cars, inquiries]);

  return {
    stats,
    loading: carsLoading || inquiriesLoading,
    error: carsError || inquiriesError,
    recentInquiries: inquiries.slice(0, 3),
    recentCars: cars.slice(0, 3),
  };
};

// ✅ רכיב סטט פשוט
const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  urgent = false,
  onClick,
  children,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color?: string;
  urgent?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}) => (
  <Card
    className={cn(
      "transition-all duration-200 cursor-pointer hover:shadow-md hover:scale-[1.02]",
      urgent && "ring-2 ring-orange-200 bg-orange-50/50"
    )}
    onClick={onClick}
  >
    <CardContent className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {urgent && (
              <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {children}
        </div>
        <div
          className={cn("p-3 rounded-full", `bg-${color}-50 text-${color}-600`)}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </CardContent>
  </Card>
);

// ✅ פעולה מהירה
const QuickAction = ({
  href,
  icon: Icon,
  title,
  description,
  badge = 0,
  urgent = false,
}: {
  href: string;
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  badge?: number;
  urgent?: boolean;
}) => (
  <Link href={href}>
    <div
      className={cn(
        "p-4 border-2 rounded-lg transition-all hover:shadow-md hover:scale-[1.02] group",
        urgent ? "border-orange-200 bg-orange-50/50" : "border-gray-200"
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {badge > 0 && (
          <Badge
            className={
              urgent
                ? "bg-orange-500 text-white animate-pulse"
                : "bg-blue-500 text-white"
            }
          >
            {badge}
          </Badge>
        )}
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </Link>
);

export default function DealerHomePage() {
  const { hasAccess, isLoading: authLoading } = useDealerRoute();
  const { user } = useAuth();
  const { stats, loading, error, recentInquiries, recentCars } =
    useProfileStats();
  const [refreshing, setRefreshing] = useState(false);

  // Real-time updates
  useEffect(() => {
    const cleanup = carEvents.onCarUpdate(() => {});
    return cleanup;
  }, []);

  const formatPrice = (price: number): string => {
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M₪`;
    if (price >= 1000) return `${(price / 1000).toFixed(0)}K₪`;
    return new Intl.NumberFormat("he-IL").format(price) + "₪";
  };

  const getStatusBadge = (status: string): string => {
    const statusMap: Record<string, string> = {
      new: "bg-blue-100 text-blue-800",
      responded: "bg-green-100 text-green-800",
      active: "bg-green-100 text-green-800",
      sold: "bg-purple-100 text-purple-800",
    };
    return statusMap[status] || "bg-gray-100 text-gray-800";
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : "ערב טוב";
  };

  if (authLoading)
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  if (!hasAccess) return null;
  if (error)
    return (
      <ErrorState
        title="שגיאה"
        message={error}
        onRetry={() => window.location.reload()}
      />
    );
  if (loading)
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 bg-gray-200 rounded-xl"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user?.firstName}!
              </h1>
              {stats.urgentCount > 0 && (
                <Badge className="bg-yellow-400 text-yellow-900 animate-bounce">
                  {stats.urgentCount} דרוש טיפול
                </Badge>
              )}
            </div>

            <p className="text-purple-100 mb-4">
              {stats.activeCars > 0
                ? `${stats.activeCars} רכבים פעילים במלאי`
                : "בואו נתחיל לפרסם רכבים!"}
            </p>

            <div className="flex gap-3">
              <Link href="/dealer/cars/new">
                <Button
                  variant="secondary"
                  className="bg-white text-purple-600 hover:bg-purple-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {stats.activeCars === 0 ? "פרסם רכב ראשון" : "הוסף רכב"}
                </Button>
              </Link>

              {stats.newInquiries > 0 && (
                <Link href="/dealer/inquiries">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-purple-600"
                  >
                    <Bell className="w-4 h-4 mr-2" />
                    {stats.newInquiries} פניות חדשות
                  </Button>
                </Link>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setRefreshing(true);
                  setTimeout(() => setRefreshing(false), 1000);
                }}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")}
                />
                רענן
              </Button>
            </div>
          </div>

          <div className="hidden md:flex w-20 h-20 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm">
            {stats.qualityScore >= 80 ? (
              <Award className="w-10 h-10 text-yellow-300" />
            ) : stats.newInquiries > 0 ? (
              <Bell className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Car className="w-10 h-10 text-white" />
            )}
          </div>
        </div>

        {/* Quick stats */}
        {stats.activeCars > 0 && (
          <div className="grid grid-cols-3 gap-4 bg-white/10 rounded-lg p-3 backdrop-blur-sm mt-4">
            <div className="text-center">
              <div className="text-xl font-bold">{stats.qualityScore}</div>
              <div className="text-xs text-purple-100">ציון איכות</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">
                {formatPrice(stats.totalValue)}
              </div>
              <div className="text-xs text-purple-100">ערך מלאי</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold">{stats.responseRate}%</div>
              <div className="text-xs text-purple-100">אחוז מענה</div>
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="רכבים פעילים"
          value={stats.activeCars}
          icon={Car}
          onClick={() => (window.location.href = "/dealer/cars")}
        >
          <p className="text-xs text-gray-500">מוכנים למכירה</p>
        </StatCard>

        <StatCard
          title="פניות חדשות"
          value={stats.newInquiries}
          icon={MessageSquare}
          color="purple"
          urgent={stats.newInquiries > 0}
          onClick={() => (window.location.href = "/dealer/inquiries")}
        >
          <p className="text-xs text-gray-500">דורשות מענה</p>
        </StatCard>

        <StatCard
          title="נמכרו"
          value={stats.soldCars}
          icon={TrendingUp}
          color="green"
        >
          <p className="text-xs text-gray-500">השבוע</p>
        </StatCard>

        <StatCard
          title="ללא תמונות"
          value={stats.carsWithoutImages}
          icon={Image}
          color={stats.carsWithoutImages > 0 ? "orange" : "green"}
          urgent={stats.carsWithoutImages > 0}
        >
          <p className="text-xs text-gray-500">
            {stats.carsWithoutImages > 0 ? "דרוש עדכון" : "הכל מעולה"}
          </p>
        </StatCard>
      </div>

      {/* Actions & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              פעולות מומלצות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              href="/dealer/cars/new"
              icon={Plus}
              title="הוסף רכב חדש"
              description="הגדל את המלאי"
            />

            <QuickAction
              href="/dealer/inquiries"
              icon={MessageSquare}
              title="פניות מקונים"
              description="עקוב ותגיב לפניות"
              badge={stats.newInquiries}
              urgent={stats.newInquiries > 0}
            />

            <QuickAction
              href="/dealer/cars"
              icon={Car}
              title="נהל מלאי"
              description={
                stats.carsWithoutImages > 0
                  ? `${stats.carsWithoutImages} רכבים ללא תמונות`
                  : "עדכן וערוך רכבים"
              }
              badge={stats.carsWithoutImages}
              urgent={stats.carsWithoutImages > 0}
            />
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
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
            {recentInquiries.length > 0 ? (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {inquiry.buyer?.firstName} {inquiry.buyer?.lastName}
                      </h4>
                      <Badge className={getStatusBadge(inquiry.status)}>
                        {inquiry.status === "new" ? "חדשה" : "נענתה"}
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
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">אין פעילות אחרונה</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      {stats.qualityScore < 80 && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Zap className="h-5 w-5" />
              טיפים לשיפור הביצועים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.carsWithoutImages > 0 && (
                <div className="flex items-start gap-3">
                  <Image className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">הוסף תמונות</h4>
                    <p className="text-sm text-orange-700">
                      {stats.carsWithoutImages} רכבים זקוקים לתמונות איכותיות
                    </p>
                  </div>
                </div>
              )}

              {stats.responseRate < 80 && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-orange-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-orange-800">שפר מענה</h4>
                    <p className="text-sm text-orange-700">
                      ענה לפניות תוך 24 שעות להגדלת המכירות
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
