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
import { inquiryEvents } from "@/lib/events/inquiryEvents";
import { cn } from "@/lib/utils";
import {
  Plus,
  Car,
  MessageSquare,
  TrendingUp,
  Activity,
  Bell,
  RefreshCw,
  ArrowRight,
  Users,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";

// ✅ Simplified stats calculation
const useHomeStats = () => {
  const { user } = useAuth();
  const { cars, loading: carsLoading, error: carsError } = useDealerCars();
  const {
    inquiries,
    loading: inquiriesLoading,
    error: inquiriesError,
  } = useReceivedInquiries();

  return useMemo(() => {
    const activeCars = cars.filter(
      (car) => car.status === "active" && car.isAvailable
    ).length;
    const soldCars = cars.filter((car) => car.status === "sold").length;
    const newInquiries = inquiries.filter((inq) => inq.status === "new").length;
    const totalInquiries = inquiries.length;

    // ✅ Simple business activity (latest 4 items)
    const recentActivity = [
      ...cars.slice(0, 2).map((car) => ({
        id: `car-${car.id}`,
        title: car.status === "sold" ? "רכב נמכר" : "רכב נוסף למכירה",
        description: `${car.make} ${car.model} ${car.year}`,
        date: car.updatedAt || car.createdAt,
        icon: car.status === "sold" ? TrendingUp : Car,
        color: car.status === "sold" ? "text-green-600" : "text-blue-600",
      })),
      ...inquiries.slice(0, 2).map((inquiry) => ({
        id: `inquiry-${inquiry.id}`,
        title: inquiry.status === "new" ? "פנייה חדשה התקבלה" : "פנייה נענתה",
        description: `מ-${inquiry.buyer?.firstName} ${inquiry.buyer?.lastName}`,
        date: inquiry.createdAt,
        icon: MessageSquare,
        color: inquiry.status === "new" ? "text-orange-600" : "text-green-600",
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 4);

    return {
      activeCars,
      soldCars,
      newInquiries,
      totalInquiries,
      recentActivity,
      loading: carsLoading || inquiriesLoading,
      error: carsError || inquiriesError,
      hasNewInquiries: newInquiries > 0,
      hasActivity: recentActivity.length > 0,
    };
  }, [
    user,
    cars,
    inquiries,
    carsLoading,
    inquiriesLoading,
    carsError,
    inquiriesError,
  ]);
};

// ✅ Simple stat card component (consistent with other pages)
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
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
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

// ✅ Quick action component
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
  const stats = useHomeStats();
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Real-time updates for both cars and inquiries
  useEffect(() => {
    const cleanupCars = carEvents.onCarUpdate(() => {
      console.log("🚗 Car updated - refreshing home stats");
    });

    const cleanupInquiries = inquiryEvents.onInquiryUpdate(() => {
      console.log("💬 Inquiry updated - refreshing home stats");
    });

    return () => {
      cleanupCars();
      cleanupInquiries();
    };
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? "בוקר טוב" : hour < 18 ? "צהריים טובים" : "ערב טוב";
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasAccess) return null;

  if (stats.error) {
    return (
      <ErrorState
        title="שגיאה"
        message={stats.error}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (stats.loading) {
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
  }

  return (
    <div className="space-y-6">
      {/* ✅ Simple Header */}
      <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user?.firstName}!
              </h1>
              {stats.hasNewInquiries && (
                <Badge className="bg-yellow-400 text-yellow-900 animate-bounce">
                  {stats.newInquiries} פניות חדשות
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

              {stats.hasNewInquiries && (
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
                onClick={handleRefresh}
                className="text-white hover:bg-white/20"
                disabled={refreshing}
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")}
                />
                רענן
              </Button>
            </div>
          </div>

          <div className="hidden md:flex w-20 h-20 bg-white/20 rounded-full items-center justify-center backdrop-blur-sm">
            {stats.hasNewInquiries ? (
              <Bell className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Car className="w-10 h-10 text-white" />
            )}
          </div>
        </div>
      </div>

      {/* ✅ Simple Stats (only 4 basic cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="רכבים פעילים"
          value={stats.activeCars}
          subtitle="מוכנים למכירה"
          icon={Car}
          onClick={() => (window.location.href = "/dealer/cars")}
        />

        <StatCard
          title="פניות חדשות"
          value={stats.newInquiries}
          subtitle="דורשות מענה"
          icon={MessageSquare}
          color="purple"
          urgent={stats.hasNewInquiries}
          onClick={() => (window.location.href = "/dealer/inquiries")}
        />

        <StatCard
          title="נמכרו"
          value={stats.soldCars}
          subtitle="השבוע"
          icon={TrendingUp}
          color="green"
        />

        <StatCard
          title="סה״כ פניות"
          value={stats.totalInquiries}
          subtitle="כל הפניות"
          icon={Users}
          color="blue"
        />
      </div>

      {/* ✅ Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
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
              urgent={stats.hasNewInquiries}
            />
          </CardContent>
        </Card>

        {/* ✅ Business Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                פעילות עסקית אחרונה
              </CardTitle>
              <Link href="/dealer/cars">
                <Button variant="ghost" size="sm">
                  הצג הכל
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {stats.hasActivity ? (
              <div className="space-y-3">
                {stats.recentActivity.map((activity: any) => (
                  <div
                    key={activity.id}
                    className="p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
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
                        {new Date(activity.date).toLocaleDateString("he-IL")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">אין פעילות עסקית אחרונה</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
