"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Search,
  RefreshCw,
  Users,
  CheckCircle,
  AlertCircle,
  Bell,
  Clock,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";
import type { Inquiry } from "@/lib/api/types";

// ✅ Simplified unified hook
const useInquiriesPage = () => {
  const {
    inquiries,
    loading,
    error,
    actionLoading,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    refetch,
    clearError,
  } = useReceivedInquiries();

  return useMemo(() => {
    const newCount = inquiries.filter((inq) => inq.status === "new").length;
    const respondedCount = inquiries.filter(
      (inq) => inq.status === "responded"
    ).length;
    const closedCount = inquiries.filter(
      (inq) => inq.status === "closed"
    ).length;

    // Simple stats calculation
    const responseRate =
      inquiries.length > 0
        ? Math.round((respondedCount / inquiries.length) * 100)
        : 100;

    // Check for urgent inquiries (over 24 hours without response)
    const now = new Date();
    const urgentCount = inquiries.filter((inq) => {
      if (inq.status !== "new") return false;
      const hoursDiff =
        (now.getTime() - new Date(inq.createdAt).getTime()) / (1000 * 3600);
      return hoursDiff > 24;
    }).length;

    return {
      inquiries,
      loading,
      error,
      actionLoading,
      // Actions
      markAsResponded,
      closeInquiry,
      deleteInquiry,
      refetch,
      clearError,
      // Simple stats
      total: inquiries.length,
      newCount,
      respondedCount,
      closedCount,
      responseRate,
      urgentCount,
      // Helper flags
      hasInquiries: inquiries.length > 0,
      hasNewInquiries: newCount > 0,
      hasUrgentInquiries: urgentCount > 0,
    };
  }, [
    inquiries,
    loading,
    error,
    actionLoading,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    refetch,
    clearError,
  ]);
};

// ✅ Simplified stat card (reused from home page)
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

// ✅ Simple filtering function
const filterInquiries = (
  inquiries: Inquiry[],
  activeTab: string,
  searchQuery: string
) => {
  let filtered = inquiries;

  // Filter by status tab
  if (activeTab !== "all") {
    filtered = filtered.filter((inquiry) => inquiry.status === activeTab);
  }

  // Simple search filter
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (inquiry) =>
        inquiry.message.toLowerCase().includes(query) ||
        inquiry.buyer?.firstName?.toLowerCase().includes(query) ||
        inquiry.buyer?.lastName?.toLowerCase().includes(query) ||
        inquiry.buyer?.email?.toLowerCase().includes(query) ||
        inquiry.car?.make?.toLowerCase().includes(query) ||
        inquiry.car?.model?.toLowerCase().includes(query)
    );
  }

  // Sort by date (newest first)
  return filtered.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// ✅ Main component
export default function DealerInquiriesPage() {
  const router = useRouter();
  const { hasAccess, isLoading: authLoading } = useDealerRoute();

  // ✅ Simplified state (only 3 variables)
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ✅ Single hook for all data
  const {
    inquiries,
    loading,
    error,
    actionLoading,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    refetch,
    clearError,
    total,
    newCount,
    respondedCount,
    closedCount,
    responseRate,
    urgentCount,
    hasInquiries,
    hasNewInquiries,
    hasUrgentInquiries,
  } = useInquiriesPage();

  // ✅ Simple filtered inquiries
  const filteredInquiries = useMemo(
    () => filterInquiries(inquiries, activeTab, searchQuery),
    [inquiries, activeTab, searchQuery]
  );

  // ✅ Simple actions
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("הנתונים עודכנו");
    } catch (error) {
      toast.error("שגיאה בעדכון הנתונים");
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const handleTabClick = useCallback((tab: string) => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
  }, []);

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
          refetch();
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
            {hasUrgentInquiries && (
              <Badge className="bg-red-100 text-red-800 animate-pulse">
                {urgentCount} דחופות
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            ניהול וטיפול בפניות מהקונים שלך
            {hasNewInquiries && ` • ${newCount} פניות חדשות ממתינות`}
          </p>
        </div>

        <div className="flex items-center gap-3">
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
      </div>

      {/* ✅ Simple Stats (only 3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="פניות חדשות"
          value={newCount}
          subtitle="דורשות מענה"
          icon={AlertCircle}
          color="blue"
          urgent={hasUrgentInquiries}
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
          title="אחוז מענה"
          value={`${responseRate}%`}
          subtitle={responseRate >= 80 ? "מעולה!" : "ניתן לשפר"}
          icon={responseRate >= 80 ? Star : Clock}
          color={responseRate >= 80 ? "green" : "orange"}
        />
      </div>

      {/* ✅ Performance Alert */}
      {responseRate >= 90 && total > 5 && (
        <Card className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  ביצועים מעולים! 🏆
                </h3>
                <p className="text-sm text-green-700">
                  אחוז המענה שלך הוא {responseRate}% - זה מעולה! קונים אוהבים
                  סוחרים שעונים מהר.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Simple Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="חפש פניות לפי שם קונה, הודעה או רכב..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 px-2"
            >
              ✕
            </Button>
          )}
        </div>
      </div>

      {/* ✅ Simple Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabClick} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
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
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            סגורות ({closedCount})
          </TabsTrigger>
        </TabsList>

        {/* ✅ Simple Content */}
        <TabsContent value={activeTab} className="mt-6">
          {loading && hasInquiries && (
            <div className="flex justify-center py-4">
              <div className="flex items-center gap-2 text-gray-600">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">מעדכן...</span>
              </div>
            </div>
          )}

          {filteredInquiries.length === 0 ? (
            <EmptyState
              variant="inquiries"
              title={
                searchQuery.trim()
                  ? "לא נמצאו פניות מתאימות"
                  : activeTab === "new"
                  ? "אין פניות חדשות"
                  : activeTab === "responded"
                  ? "אין פניות שנענו"
                  : activeTab === "closed"
                  ? "אין פניות סגורות"
                  : "אין פניות עדיין"
              }
              description={
                searchQuery.trim()
                  ? "נסה לשנות את מילות החיפוש"
                  : activeTab === "new"
                  ? "כל הפניות החדשות יופיעו כאן"
                  : "כשתקבל פניות מקונים, הן יופיעו כאן"
              }
              actionLabel={searchQuery.trim() ? "נקה חיפוש" : undefined}
              onAction={searchQuery.trim() ? handleClearSearch : undefined}
            />
          ) : (
            <>
              {/* Results summary */}
              {(searchQuery.trim() || activeTab !== "all") && (
                <div className="mb-4 text-sm text-gray-600">
                  מציג {filteredInquiries.length} פניות
                  {searchQuery.trim() && ` עבור "${searchQuery}"`}
                  {filteredInquiries.length !== total && ` מתוך ${total} סה"כ`}
                </div>
              )}

              {/* ✅ Simple Inquiries List */}
              <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
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
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* ✅ Simple Tips for Improvement */}
      {responseRate < 80 && total > 0 && (
        <Card className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-amber-600" />
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">
                  💡 טיפים לשיפור אחוז המענה
                </h3>
                <div className="text-sm text-amber-700 space-y-1">
                  <p>• ענה לפניות חדשות תוך 24 שעות</p>
                  <p>• השתמש בתבניות מוכנות למענה מהיר</p>
                  <p>• הפעל התראות לפניות חדשות</p>
                  <p>• אחוז מענה גבוה משפר את הדירוג שלך</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
