"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
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
  Filter,
  RefreshCw,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  Download,
  MoreVertical,
  Eye,
  Reply,
  Archive,
  Star,
  Calendar,
  SortAsc,
  SortDesc,
  Mail,
  Phone,
  Car,
  Bell,
  Settings,
  Zap,
  BarChart3,
} from "lucide-react";
import type { InquiriesSearchParams, Inquiry } from "@/lib/api/types";

// Enhanced filters interface
interface InquiryFilters {
  search: string;
  status: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  dateRange: string;
  carMake: string;
  priority: string;
}

export default function DealerInquiriesPage() {
  const router = useRouter();
  const { hasAccess, isLoading: authLoading } = useDealerRoute();

  // Enhanced state management
  const [filters, setFilters] = useState<InquiryFilters>({
    search: "",
    status: "all",
    sortBy: "created_at",
    sortOrder: "desc",
    dateRange: "all",
    carMake: "all",
    priority: "all",
  });

  const [activeTab, setActiveTab] = useState("all");
  const [selectedInquiries, setSelectedInquiries] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Inquiries hook with enhanced error handling
  const {
    inquiries,
    pagination,
    loading,
    error,
    actionLoading,
    fetchInquiries,
    refetch,
    markAsResponded,
    closeInquiry,
    deleteInquiry,
    clearError,
    newCount,
    respondedCount,
    closedCount,
  } = useReceivedInquiries();

  // Auto-refresh every 30 seconds for new inquiries
  useEffect(() => {
    const interval = setInterval(() => {
      if (!loading && !error) {
        refetch();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [loading, error, refetch]);

  // Enhanced filtering logic
  const filteredInquiries = useMemo(() => {
    let filtered = inquiries;

    // Filter by tab (status)
    if (activeTab !== "all") {
      filtered = filtered.filter((inquiry) => inquiry.status === activeTab);
    }

    // Search filter
    if (filters.search.trim()) {
      const query = filters.search.toLowerCase();
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

    // Car make filter
    if (filters.carMake !== "all") {
      filtered = filtered.filter(
        (inquiry) => inquiry.car?.make === filters.carMake
      );
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      const filterDate = new Date(now);

      switch (filters.dateRange) {
        case "today":
          filterDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          filterDate.setDate(now.getDate() - 7);
          break;
        case "month":
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filtered = filtered.filter(
        (inquiry) => new Date(inquiry.createdAt) >= filterDate
      );
    }

    // Priority filter (based on inquiry age and status)
    if (filters.priority !== "all") {
      const now = new Date();
      filtered = filtered.filter((inquiry) => {
        const inquiryDate = new Date(inquiry.createdAt);
        const hoursDiff =
          (now.getTime() - inquiryDate.getTime()) / (1000 * 3600);

        switch (filters.priority) {
          case "urgent":
            return inquiry.status === "new" && hoursDiff > 24;
          case "high":
            return (
              inquiry.status === "new" && hoursDiff > 12 && hoursDiff <= 24
            );
          case "normal":
            return inquiry.status === "new" && hoursDiff <= 12;
          default:
            return true;
        }
      });
    }

    // Sorting
    return filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (filters.sortBy) {
        case "created_at":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "buyer_name":
          aValue = `${a.buyer?.firstName} ${a.buyer?.lastName}`;
          bValue = `${b.buyer?.firstName} ${b.buyer?.lastName}`;
          break;
        case "car":
          aValue = a.car ? `${a.car.make} ${a.car.model}` : "";
          bValue = b.car ? `${b.car.make} ${b.car.model}` : "";
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  }, [inquiries, activeTab, filters]);

  // Get unique car makes for filter
  const availableCarMakes = useMemo(() => {
    const makes = new Set(
      inquiries
        .map((inquiry) => inquiry.car?.make)
        .filter((make): make is string => !!make)
    );
    return Array.from(makes).sort();
  }, [inquiries]);

  // Enhanced statistics
  const enhancedStats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayInquiries = inquiries.filter(
      (inq) => new Date(inq.createdAt) >= today
    ).length;

    const weekInquiries = inquiries.filter(
      (inq) => new Date(inq.createdAt) >= thisWeek
    ).length;

    const urgentInquiries = inquiries.filter((inq) => {
      if (inq.status !== "new") return false;
      const hoursDiff =
        (now.getTime() - new Date(inq.createdAt).getTime()) / (1000 * 3600);
      return hoursDiff > 24;
    }).length;

    const responseRate =
      inquiries.length > 0
        ? Math.round((respondedCount / inquiries.length) * 100)
        : 0;

    return {
      total: inquiries.length,
      new: newCount,
      responded: respondedCount,
      closed: closedCount,
      today: todayInquiries,
      week: weekInquiries,
      urgent: urgentInquiries,
      responseRate,
    };
  }, [inquiries, newCount, respondedCount, closedCount]);

  // Enhanced actions
  const handleBulkAction = useCallback(
    async (action: string) => {
      if (selectedInquiries.length === 0) {
        toast.warning("אנא בחר פניות לטיפול");
        return;
      }

      try {
        switch (action) {
          case "mark_responded":
            for (const id of selectedInquiries) {
              await markAsResponded(id);
            }
            toast.success(`${selectedInquiries.length} פניות סומנו כנענו`);
            break;
          case "close":
            for (const id of selectedInquiries) {
              await closeInquiry(id);
            }
            toast.success(`${selectedInquiries.length} פניות נסגרו`);
            break;
          case "delete":
            if (
              window.confirm(
                `האם אתה בטוח שברצונך למחוק ${selectedInquiries.length} פניות?`
              )
            ) {
              for (const id of selectedInquiries) {
                await deleteInquiry(id);
              }
              toast.success(`${selectedInquiries.length} פניות נמחקו`);
            }
            break;
        }
        setSelectedInquiries([]);
      } catch (error) {
        toast.error("שגיאה בביצוע הפעולה");
      }
    },
    [selectedInquiries, markAsResponded, closeInquiry, deleteInquiry]
  );

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

  const handleSearch = useCallback(async () => {
    const params: InquiriesSearchParams = {
      sortBy: filters.sortBy as "created_at",
      sortOrder: filters.sortOrder,
    };

    if (filters.status !== "all") {
      params.status = filters.status as "new" | "responded" | "closed";
    }

    await fetchInquiries(params);
  }, [filters, fetchInquiries]);

  const updateFilter = useCallback(
    (key: keyof InquiryFilters, value: string) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      search: "",
      status: "all",
      sortBy: "created_at",
      sortOrder: "desc",
      dateRange: "all",
      carMake: "all",
      priority: "all",
    });
    setActiveTab("all");
  }, []);

  // Tab counts with enhanced data
  const tabCounts = {
    all: inquiries.length,
    new: newCount,
    responded: respondedCount,
    closed: closedCount,
  };

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

  // Loading state
  if (loading && inquiries.length === 0) {
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
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            פניות מקונים
            {enhancedStats.urgent > 0 && (
              <Badge className="bg-red-100 text-red-800 animate-pulse">
                {enhancedStats.urgent} דחופות
              </Badge>
            )}
          </h1>
          <p className="text-gray-600 mt-1">
            ניהול וטיפול בפניות מהקונים שלך •
            {enhancedStats.today > 0 && ` ${enhancedStats.today} היום`} •
            {enhancedStats.week > 0 && ` ${enhancedStats.week} השבוע`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {selectedInquiries.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                נבחרו {selectedInquiries.length}
              </span>
              <Select onValueChange={handleBulkAction}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="פעולות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mark_responded">סמן כנענה</SelectItem>
                  <SelectItem value="close">סגור</SelectItem>
                  <SelectItem value="delete">מחק</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">פניות חדשות</p>
                <p className="text-2xl font-bold text-blue-900">
                  {enhancedStats.new}
                </p>
                <p className="text-xs text-blue-600">דורשות מענה</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">נענו</p>
                <p className="text-2xl font-bold text-green-900">
                  {enhancedStats.responded}
                </p>
                <p className="text-xs text-green-600">קיבלו מענה</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">סה״כ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {enhancedStats.total}
                </p>
                <p className="text-xs text-gray-600">כל הפניות</p>
              </div>
              <div className="p-3 rounded-full bg-gray-50">
                <Users className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            הכל
            {tabCounts.all > 0 && (
              <Badge variant="secondary" className="text-xs">
                {tabCounts.all}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="new" className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            חדשות
            {tabCounts.new > 0 && (
              <Badge variant="default" className="bg-blue-600 text-xs">
                {tabCounts.new}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="responded" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            נענו
            {tabCounts.responded > 0 && (
              <Badge variant="secondary" className="text-xs">
                {tabCounts.responded}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Inquiries List */}
        <div className="mt-6">
          {filteredInquiries.length === 0 ? (
            <EmptyState
              variant="inquiries"
              title={
                filters.search.trim()
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
                filters.search.trim()
                  ? "נסה לשנות את מילות החיפוש או הסינונים"
                  : activeTab === "new"
                  ? "כל הפניות החדשות יופיעו כאן"
                  : "כשתקבל פניות מקונים, הן יופיעו כאן"
              }
              actionLabel={filters.search.trim() ? "נקה חיפוש" : undefined}
              onAction={
                filters.search.trim()
                  ? () => updateFilter("search", "")
                  : undefined
              }
            />
          ) : (
            <div className="space-y-4">
              {/* Select All Checkbox */}
              {filteredInquiries.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={
                      selectedInquiries.length === filteredInquiries.length
                    }
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedInquiries(
                          filteredInquiries.map((inq) => inq.id)
                        );
                      } else {
                        setSelectedInquiries([]);
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-sm text-gray-600">
                    בחר הכל ({filteredInquiries.length} פניות)
                  </span>
                  {selectedInquiries.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedInquiries([])}
                    >
                      בטל בחירה
                    </Button>
                  )}
                </div>
              )}

              {/* Inquiries Grid */}
              {filteredInquiries.map((inquiry) => (
                <div key={inquiry.id} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-3 left-3 z-10">
                    <input
                      type="checkbox"
                      checked={selectedInquiries.includes(inquiry.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedInquiries((prev) => [...prev, inquiry.id]);
                        } else {
                          setSelectedInquiries((prev) =>
                            prev.filter((id) => id !== inquiry.id)
                          );
                        }
                      }}
                      className="rounded"
                    />
                  </div>

                  {/* Enhanced Inquiry Card */}
                  <InquiryCard
                    inquiry={inquiry}
                    userType="dealer"
                    onMarkAsResponded={markAsResponded}
                    onClose={closeInquiry}
                    onDelete={deleteInquiry}
                    actionLoading={actionLoading[inquiry.id] || false}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Enhanced Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  fetchInquiries({
                    ...pagination,
                    page: pagination.page - 1,
                    limit: 10,
                  })
                }
                disabled={pagination.page <= 1 || loading}
              >
                הקודם
              </Button>

              {Array.from(
                { length: Math.min(5, pagination.totalPages) },
                (_, i) => {
                  const pageNum = Math.max(1, pagination.page - 2) + i;
                  if (pageNum > pagination.totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={
                        pageNum === pagination.page ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() =>
                        fetchInquiries({
                          ...pagination,
                          page: pageNum,
                          limit: 10,
                        })
                      }
                      disabled={loading}
                    >
                      {pageNum}
                    </Button>
                  );
                }
              )}

              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  fetchInquiries({
                    ...pagination,
                    page: pagination.page + 1,
                    limit: 10,
                  })
                }
                disabled={pagination.page >= pagination.totalPages || loading}
              >
                הבא
              </Button>
            </div>
          </div>
        )}
      </Tabs>

      {/* Loading Overlay */}
      {loading && inquiries.length > 0 && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <Card className="p-6">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>טוען נתונים...</span>
            </div>
          </Card>
        </div>
      )}

      {/* Success Messages */}
      {enhancedStats.responseRate >= 80 && inquiries.length > 5 && (
        <Card className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">
                  ביצועים מעולים! 🏆
                </h3>
                <p className="text-sm text-green-700">
                  אחוז המענה שלך הוא {enhancedStats.responseRate}% - זה מעולה!
                  קונים אוהבים סוחרים שעונים מהר ובמקצועיות.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
