// app/(dashboard)/dealer/cars/page.tsx - Refactored Cars Management Page
"use client";

import React, { useState, useCallback, useMemo } from "react"; // ❌ הוסר useEffect
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  RefreshCw,
  Car as CarIcon,
  AlertTriangle,
  ChevronLeft,
  Zap,
  ImageIcon,
  TrendingUp,
  Users,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { StatCard } from "@/components/cards/StatCard";
import { DealerCarCard } from "@/components/cards/DealerCarCard";
import { CarFilters } from "@/components/features/CarFilters";
import { useDealerCars } from "@/hooks/api/useCars";
import { useAuth } from "@/contexts/AuthContext";
import { filterCars, calculateCarStats } from "@/lib/car-utils";
import type { Car } from "@/lib/api/types";
// ❌ הוסר import של carEvents

export default function DealerCarsPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State - Simplified
  const [filterMake, setFilterMake] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [sortBy, setSortBy] = useState("created_at:desc");

  // Cars Hook
  const {
    cars,
    loading,
    error,
    actionLoading,
    refetch,
    deleteCar,
    markAsSold,
    toggleAvailability,
  } = useDealerCars();
  console.log("🚗 Cars in dealer page:", cars);
  console.log(
    "🔍 Car 9 raw data:",
    JSON.stringify(
      cars.find((car) => car.id === 9),
      null,
      2
    )
  );
  // ❌ הוסר useEffect - העדכונים יקרו אוטומטית דרך cache invalidation!

  // Filtered and sorted cars
  const filteredCars = useMemo(() => {
    return filterCars(cars, {
      make: filterMake,
      status: filterStatus,
      availability: filterAvailability,
      sortBy,
    });
  }, [cars, filterMake, filterStatus, filterAvailability, sortBy]);

  // Statistics
  const stats = useMemo(() => calculateCarStats(cars), [cars]);

  // Actions
  const handleEdit = useCallback(
    (car: Car) => {
      router.push(`/dealer/cars/${car.id}`);
    },
    [router]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      if (
        window.confirm(
          "האם אתה בטוח שברצונך למחוק את הרכב? פעולה זו לא ניתנת לביטול."
        )
      ) {
        const success = await deleteCar(id);
        if (success) {
          toast.success("הרכב נמחק בהצלחה");
        }
      }
    },
    [deleteCar]
  );

  const handleMarkSold = useCallback(
    async (id: number) => {
      if (window.confirm("האם אתה בטוח שברצונך לסמן את הרכב כנמכר?")) {
        const success = await markAsSold(id);
        if (success) {
          toast.success("הרכב סומן כנמכר");
        }
      }
    },
    [markAsSold]
  );

  const handleToggleAvailability = useCallback(
    async (id: number, available: boolean) => {
      const success = await toggleAvailability(id, available);
      if (success) {
        toast.success(available ? "הרכב הוצג למכירה" : "הרכב הוסתר מהמכירה");
      }
    },
    [toggleAvailability]
  );

  const clearAllFilters = () => {
    setFilterMake("all");
    setFilterStatus("all");
    setFilterAvailability("all");
    setSortBy("created_at:desc");
  };

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              שגיאה בטעינת הרכבים
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                רענן דף
              </Button>
              <Button onClick={() => refetch()}>נסה שוב</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600 mb-2">
        <Link href="/dealer/home" className="hover:text-blue-600">
          לוח בקרה
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900 font-medium">הרכבים שלי</span>
      </nav>

      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <CarIcon className="w-8 h-8 text-blue-600" />
            הרכבים שלי
          </h1>
          <p className="text-gray-600 mt-1">
            נהל את הרכבים שלך ומכור אותם ביעילות
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/dealer/cars/new">
            <Button size="lg" className="px-8 py-3 text-lg font-semibold">
              <Plus className="w-5 h-5 mr-3" />
              הוסף רכב
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="סך הכל"
          value={stats.total}
          icon={CarIcon}
          color="blue"
          subtitle="כל הרכבים"
        />
        <StatCard
          title="פעילים"
          value={stats.active}
          icon={CheckCircle}
          color="green"
          progress={stats.availableProgress}
        />
        <StatCard
          title="נמכרו"
          value={stats.sold}
          icon={TrendingUp}
          color="purple"
          progress={stats.soldProgress}
        />
        <StatCard
          title="זמינים"
          value={stats.available}
          icon={Eye}
          color="blue"
        />
        <StatCard
          title="ללא תמונות"
          value={stats.withoutImages}
          icon={ImageIcon}
          color="orange"
          subtitle="זקוק לתמונות"
        />
      </div>

      {/* Filters */}
      <CarFilters
        filterMake={filterMake}
        filterStatus={filterStatus}
        filterAvailability={filterAvailability}
        sortBy={sortBy}
        onFilterMakeChange={setFilterMake}
        onFilterStatusChange={setFilterStatus}
        onFilterAvailabilityChange={setFilterAvailability}
        onSortByChange={setSortBy}
        onClearFilters={clearAllFilters}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          {filteredCars.length !== cars.length && (
            <span>
              מציג {filteredCars.length} מתוך {cars.length} רכבים
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <LoadingSpinner size="sm" />
              טוען...
            </div>
          )}
        </div>
      </div>

      {/* Cars Grid */}
      {loading && cars.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredCars.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <CarIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {cars.length === 0 ? "אין רכבים במלאי" : "לא נמצאו תוצאות"}
              </h3>
              <p className="text-gray-600 mb-6">
                {cars.length === 0
                  ? "התחל בפרסום הרכב הראשון שלך והתחל למכור היום"
                  : "נסה לשנות את הפילטרים כדי למצוא את מה שאתה מחפש"}
              </p>
              <div className="flex gap-2 justify-center">
                {cars.length > 0 && (
                  <Button variant="outline" onClick={clearAllFilters}>
                    נקה פילטרים
                  </Button>
                )}
                <Link href="/dealer/cars/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    {cars.length === 0 ? "פרסם רכב ראשון" : "הוסף רכב חדש"}
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <DealerCarCard
              key={car.id}
              car={car}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onMarkSold={handleMarkSold}
              onToggleAvailability={handleToggleAvailability}
              actionLoading={actionLoading[car.id] || false}
            />
          ))}
        </div>
      )}

      {/* Performance Tips */}
      {cars.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              💡 טיפים לשיפור ביצועים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <ImageIcon className="w-4 h-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">
                    הוסף תמונות איכותיות
                  </div>
                  <div className="text-blue-600">
                    רכבים עם תמונות מקבלים פי 3 יותר פניות
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-4 h-4 text-green-600 mt-0.5">₪</div>
                <div>
                  <div className="font-medium text-green-800">תמחר נכון</div>
                  <div className="text-green-600">
                    השווה מחירים בשוק לתוצאות טובות יותר
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Users className="w-4 h-4 text-purple-600 mt-0.5" />
                <div>
                  <div className="font-medium text-purple-800">
                    הגב מהר לפניות
                  </div>
                  <div className="text-purple-600">
                    תגובה תוך שעה מגדילה מכירות ב-50%
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <RefreshCw className="w-4 h-4 text-orange-600 mt-0.5" />
                <div>
                  <div className="font-medium text-orange-800">
                    עדכן באופן קבוע
                  </div>
                  <div className="text-orange-600">
                    רכבים מעודכנים מופיעים גבוה יותר בחיפוש
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
