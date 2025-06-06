"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingState from "@/components/states/LoadingState";
import ErrorState from "@/components/states/ErrorState";
import EmptyState from "@/components/states/EmptyState";
import InquiryCard from "@/components/cards/InquiryCard";
import { useReceivedInquiries } from "@/hooks/api/useInquiries";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  MessageSquare,
  Users,
  CheckCircle,
  AlertCircle,
  Bell,
  Award,
} from "lucide-react";

// ✅ Simplified hook - just the data we need
const useInquiriesPage = () => {
  const {
    inquiries,
    loading,
    error,
    actionLoading,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    clearError,
  } = useReceivedInquiries();

  return useMemo(() => {
    const newCount = inquiries.filter((inq) => inq.status === "new").length;
    const respondedCount = inquiries.filter(
      (inq) => inq.status === "responded"
    ).length;
    const total = inquiries.length;

    return {
      inquiries,
      loading,
      error,
      actionLoading,
      // Actions
      markAsResponded,
      closeInquiry,
      deleteInquiry,
      clearError,
      // Simple stats
      total,
      newCount,
      respondedCount,
      // Helper flags
      hasInquiries: total > 0,
      hasNewInquiries: newCount > 0,
    };
  }, [
    inquiries,
    loading,
    error,
    actionLoading,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    clearError,
  ]);
};

// ✅ Simple stat card
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
  value: number;
  subtitle?: string;
  icon: React.ComponentType<any>;
  color?: string;
  urgent?: boolean;
  onClick?: () => void;
}) => (
  <Card
    className={cn(
      "cursor-pointer hover:shadow-md transition-all hover:scale-[1.02]",
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

// ✅ Filter inquiries by tab only
const filterInquiriesByStatus = (inquiries: any[], activeTab: string) => {
  if (activeTab === "all") return inquiries;
  return inquiries.filter((inquiry) => inquiry.status === activeTab);
};

// ✅ Main component
export default function DealerInquiriesPage() {
  const { hasAccess, isLoading: authLoading } = useDealerRoute();

  // ✅ Only one state variable
  const [activeTab, setActiveTab] = useState("all");

  // ✅ Single hook for all data
  const {
    inquiries,
    loading,
    error,
    actionLoading,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    clearError,
    total,
    newCount,
    respondedCount,
    hasInquiries,
    hasNewInquiries,
  } = useInquiriesPage();

  // ✅ Simple filtered inquiries
  const filteredInquiries = useMemo(
    () => filterInquiriesByStatus(inquiries, activeTab),
    [inquiries, activeTab]
  );

  // Auth guard
  if (authLoading) {
    return <LoadingState message="טוען הרשאות..." />;
  }

  if (!hasAccess) {
    return null;
  }

  // Loading state
  if (loading && !hasInquiries) {
    return <LoadingState message="טוען פניות מקונים..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="שגיאה בטעינת הפניות"
        message={error}
        onRetry={() => {
          clearError();
          window.location.reload();
        }}
        showRetry
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      {/* ✅ Simple Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            פניות מקונים
          </h1>
          <p className="text-gray-600 mt-1">
            ניהול וטיפול בפניות מהקונים שלך
            {hasNewInquiries && ` • ${newCount} פניות חדשות ממתינות`}
          </p>
        </div>

        {hasNewInquiries && (
          <Button
            onClick={() => setActiveTab("new")}
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            {newCount} חדשות
          </Button>
        )}
      </div>

      {/* ✅ Simple Stats (only 3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="פניות חדשות"
          value={newCount}
          subtitle="דורשות מענה"
          icon={AlertCircle}
          color="blue"
          urgent={newCount > 0}
          onClick={() => setActiveTab("new")}
        />
        <StatCard
          title="נענו"
          value={respondedCount}
          subtitle="קיבלו מענה"
          icon={CheckCircle}
          color="green"
          onClick={() => setActiveTab("responded")}
        />
        <StatCard
          title="סה״כ פניות"
          value={total}
          subtitle="כל הפניות"
          icon={Users}
          color="purple"
          onClick={() => setActiveTab("all")}
        />
      </div>

      {/* ✅ Excellence Alert */}
      {respondedCount >= 10 && newCount === 0 && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  עבודה מעולה! 🏆
                </h3>
                <p className="text-sm text-green-700">
                  אין פניות ממתינות - כל הפניות טופלו! זה מעולה לשירות הלקוחות.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Simple Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            הכל ({total})
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            חדשות
            {newCount > 0 && (
              <Badge variant="default" className="bg-blue-600 text-xs">
                {newCount}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            נענו ({respondedCount})
          </TabsTrigger>
        </TabsList>

        {/* ✅ Content */}
        <TabsContent value={activeTab} className="mt-6">
          {filteredInquiries.length === 0 ? (
            <EmptyState
              variant="inquiries"
              title={
                activeTab === "new"
                  ? "אין פניות חדשות"
                  : activeTab === "responded"
                  ? "אין פניות שנענו"
                  : "אין פניות עדיין"
              }
              description={
                activeTab === "new"
                  ? "כל הפניות החדשות יופיעו כאן"
                  : activeTab === "responded"
                  ? "פניות שענית עליהן יופיעו כאן"
                  : "כשתקבל פניות מקונים, הן יופיעו כאן"
              }
            />
          ) : (
            <div className="space-y-4">
              {filteredInquiries.map((inquiry: any) => (
                <InquiryCard
                  key={inquiry.id}
                  inquiry={inquiry}
                  userType="dealer"
                  onMarkAsResponded={markAsResponded}
                  onClose={closeInquiry}
                  onDelete={deleteInquiry}
                  actionLoading={actionLoading[inquiry.id] || false}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
