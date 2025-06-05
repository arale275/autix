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
  ArrowLeft,
  DollarSign,
  Users,
  BarChart3,
  Star,
  Calendar,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Activity,
  Target,
  Zap,
  Award,
  ImageIcon,
  ArrowRight,
  PieChart,
  TrendingDown,
  Bell,
} from "lucide-react";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";

// Enhanced stats calculation hook
const useProfileStats = () => {
  const { cars, loading: carsLoading, error: carsError } = useDealerCars();
  const {
    inquiries,
    loading: inquiriesLoading,
    error: inquiriesError,
  } = useReceivedInquiries();

  const stats = useMemo(() => {
    const totalCars = cars.length;
    const activeCars = cars.filter(
      (car) => car.status === "active" && car.isAvailable
    ).length;
    const soldCars = cars.filter((car) => car.status === "sold").length;
    const deletedCars = cars.filter((car) => car.status === "deleted").length;
    const carsWithoutImages = cars.filter(
      (car) => !car.images || car.images.length === 0
    ).length;

    const totalInquiries = inquiries.length;
    const newInquiries = inquiries.filter((inq) => inq.status === "new").length;
    const respondedInquiries = inquiries.filter(
      (inq) => inq.status === "responded"
    ).length;

    // Calculate total inventory value
    const totalValue = cars
      .filter((car) => car.status === "active" && car.isAvailable)
      .reduce((sum, car) => sum + car.price, 0);

    // Calculate average price
    const avgPrice = activeCars > 0 ? Math.round(totalValue / activeCars) : 0;

    // Response rate
    const responseRate =
      totalInquiries > 0
        ? Math.round((respondedInquiries / totalInquiries) * 100)
        : 0;

    return {
      totalCars,
      activeCars,
      soldCars,
      deletedCars,
      carsWithoutImages,
      totalValue,
      avgPrice,
      totalInquiries,
      newInquiries,
      respondedInquiries,
      responseRate,
      // Performance indicators
      soldRate: totalCars > 0 ? Math.round((soldCars / totalCars) * 100) : 0,
      activeRate:
        totalCars > 0 ? Math.round((activeCars / totalCars) * 100) : 0,
    };
  }, [cars, inquiries]);

  return {
    stats,
    loading: carsLoading || inquiriesLoading,
    error: carsError || inquiriesError,
    cars,
    inquiries,
  };
};

// Enhanced stats card component
const StatCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  subtitle,
  trend,
  progress,
  onClick,
  className,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<any>;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
  subtitle?: string;
  trend?: { value: number; isPositive: boolean; label: string };
  progress?: number;
  onClick?: () => void;
  className?: string;
}) => {
  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-600",
      border: "border-green-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200",
    },
    orange: {
      bg: "bg-orange-50",
      text: "text-orange-600",
      border: "border-orange-200",
    },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-600",
      border: "border-yellow-200",
    },
  };

  const colors = colorClasses[color];

  return (
    <Card
      className={cn(
        "hover:shadow-md transition-all duration-200 cursor-pointer",
        onClick && "hover:scale-105",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>

            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}

            {trend && (
              <div className="flex items-center gap-1 mt-2">
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs px-2 py-1 rounded-full",
                    trend.isPositive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  )}
                >
                  {trend.isPositive ? "↗" : "↘"} {trend.value}%
                </div>
                <span className="text-xs text-gray-500">{trend.label}</span>
              </div>
            )}

            {progress !== undefined && (
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>השלמה</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={cn(
                      "h-1.5 rounded-full transition-all",
                      colors.text.replace("text-", "bg-")
                    )}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className={cn("p-3 rounded-full", colors.bg)}>
            <Icon className={cn("h-6 w-6", colors.text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function DealerHomePage() {
  const { hasAccess, isLoading: authLoading } = useDealerRoute();
  const { user } = useAuth();
  const { stats, loading, error, cars, inquiries } = useProfileStats();
  const [refreshing, setRefreshing] = useState(false);

  // Real-time updates
  useEffect(() => {
    const handleCarUpdate = () => {
      // Data will be automatically refreshed by hooks
    };

    const cleanup = carEvents.onCarUpdate(handleCarUpdate);
    return cleanup;
  }, []);

  // Get recent data
  const recentInquiries = useMemo(
    () => inquiries?.slice(0, 3) || [],
    [inquiries]
  );

  const recentCars = useMemo(() => cars?.slice(0, 3) || [], [cars]);

  // Helper functions
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL").format(price);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    // The hooks will automatically refresh the data
    setTimeout(() => setRefreshing(false), 1000);
  };

  // Auth guard
  if (authLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!hasAccess) {
    return null;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="שגיאה בטעינת הנתונים"
        message={error}
        onRetry={handleRefresh}
        showRetry
      />
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-64 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-96 mb-4"></div>
            <div className="flex gap-3">
              <div className="h-8 bg-white/20 rounded w-32"></div>
              <div className="h-8 bg-white/20 rounded w-32"></div>
            </div>
          </div>
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Section */}
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold">
                {getGreeting()}, {user?.firstName}! 🚗
              </h1>
              {stats.newInquiries > 0 && (
                <Badge className="bg-yellow-400 text-yellow-900 animate-pulse">
                  {stats.newInquiries} פניות חדשות
                </Badge>
              )}
            </div>

            <p className="text-purple-100 mb-4">
              ברוך הבא לפאנל הניהול שלך.{" "}
              {stats.activeCars > 0
                ? `יש לך ${stats.activeCars} רכבים פעילים במלאי`
                : "בואו נתחיל לפרסם רכבים!"}
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
                  {stats.newInquiries > 0 && (
                    <Badge className="mr-2 bg-yellow-400 text-yellow-900">
                      {stats.newInquiries}
                    </Badge>
                  )}
                </Button>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
                className="text-white hover:bg-white/20"
              >
                <RefreshCw
                  className={cn("w-4 h-4 mr-2", refreshing && "animate-spin")}
                />
                רענן
              </Button>
            </div>
          </div>

          <div className="hidden md:block relative">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Car className="w-12 h-12 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Overview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">סטטיסטיקות עסק</h2>
          <Link href="/dealer/cars">
            <Button variant="ghost" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              צפה בפירוט
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="רכבים במלאי"
            value={stats.totalCars}
            icon={Car}
            color="blue"
            subtitle={`${stats.activeCars} פעילים`}
            progress={stats.activeRate}
            onClick={() => (window.location.href = "/dealer/cars")}
          />

          <StatCard
            title="פניות מקונים"
            value={stats.totalInquiries}
            icon={MessageSquare}
            color="purple"
            subtitle={`${stats.newInquiries} חדשות`}
            trend={
              stats.newInquiries > 0
                ? {
                    value: stats.newInquiries,
                    isPositive: true,
                    label: "פניות חדשות",
                  }
                : undefined
            }
            onClick={() => (window.location.href = "/dealer/inquiries")}
          />
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="רכבים נמכרו"
          value={stats.soldCars}
          icon={TrendingUp}
          color="green"
          subtitle={`${stats.soldRate}% מהמלאי`}
          progress={stats.soldRate}
        />
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enhanced Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              פעולות מהירות
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/dealer/cars/new" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                    <Plus className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">פרסם רכב חדש</h3>
                    <p className="text-sm text-gray-600">הוסף רכב למלאי שלך</p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/dealer/cars" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">נהל מלאי</h3>
                    <p className="text-sm text-gray-600">
                      עדכן וערוך רכבים קיימים
                    </p>
                  </div>
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/dealer/inquiries" className="block">
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <MessageSquare className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">פניות מקונים</h3>
                    <p className="text-sm text-gray-600">עקוב ותגיב לפניות</p>
                  </div>
                  {stats.newInquiries > 0 && (
                    <Badge className="bg-green-100 text-green-800">
                      {stats.newInquiries}
                    </Badge>
                  )}
                  <ArrowLeft className="w-4 h-4 text-gray-400 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Enhanced Recent Inquiries */}
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
            {recentInquiries.length > 0 ? (
              <div className="space-y-3">
                {recentInquiries.map((inquiry) => (
                  <div
                    key={inquiry.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
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
        {/* Enhanced Recent Cars */}
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
            {recentCars.length > 0 ? (
              <div className="space-y-3">
                {recentCars.map((car: any) => (
                  <div
                    key={car.id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() =>
                      (window.location.href = `/dealer/cars/${car.id}`)
                    }
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

        {/* Enhanced Performance Metrics */}
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
                  {stats.activeCars}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">פניות חדשות</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-green-800">
                    {stats.newInquiries}
                  </span>
                  {stats.newInquiries > 0 && (
                    <Badge className="bg-green-200 text-green-800 animate-pulse">
                      חדש
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700">רכבים שנמכרו</span>
                <span className="font-semibold text-green-800">
                  {stats.soldCars}
                </span>
              </div>

              <div className="pt-3 border-t border-green-200">
                <div className="flex items-center gap-2 text-green-700">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">
                    דירוג איכות:{" "}
                    {stats.responseRate >= 80 && stats.carsWithoutImages === 0
                      ? "מעולה ⭐⭐⭐"
                      : stats.responseRate >= 60
                      ? "טוב ⭐⭐"
                      : "צריך שיפור ⭐"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
