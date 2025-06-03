"use client";

import { useState, useMemo } from "react";
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
} from "lucide-react";
import type { InquiriesSearchParams } from "@/lib/api/types";

export default function DealerInquiriesPage() {
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [activeTab, setActiveTab] = useState("all");

  // Inquiries hook
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

  // Filter inquiries based on search and filters
  const filteredInquiries = useMemo(() => {
    let filtered = inquiries;

    // Filter by tab
    if (activeTab !== "all") {
      filtered = filtered.filter((inquiry) => inquiry.status === activeTab);
    }

    // Filter by search query
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

    return filtered;
  }, [inquiries, searchQuery, activeTab]);

  // Handle search
  const handleSearch = async () => {
    const params: InquiriesSearchParams = {
      sortBy: sortBy as "created_at",
      sortOrder: "desc",
    };

    if (statusFilter !== "all") {
      params.status = statusFilter as "new" | "responded" | "closed";
    }

    await fetchInquiries(params);
  };

  // Handle refresh
  const handleRefresh = async () => {
    await refetch();
  };

  // Stats data
  const stats = [
    {
      title: "פניות חדשות",
      value: newCount,
      icon: AlertCircle,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "דורשות מענה",
    },
    {
      title: "נענו",
      value: respondedCount,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "קיבלו מענה",
    },
    {
      title: "סגורות",
      value: closedCount,
      icon: XCircle,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      description: "הושלמו",
    },
    {
      title: "סה״כ",
      value: inquiries.length,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "כל הפניות",
    },
  ];

  // Tab counts
  const tabCounts = {
    all: inquiries.length,
    new: newCount,
    responded: respondedCount,
    closed: closedCount,
  };

  if (loading && inquiries.length === 0) {
    return <LoadingState message="טוען פניות מקונים..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="שגיאה בטעינת הפניות"
        message={error}
        onRetry={() => {
          clearError();
          refetch();
        }}
      />
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageSquare className="h-8 w-8 text-blue-600" />
            פניות מקונים
          </h1>
          <p className="text-gray-600 mt-1">ניהול וטיפול בפניות מהקונים שלך</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            רענן
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500">{stat.description}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            חיפוש וסינון
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="חפש לפי הודעה, שם קונה, מייל או רכב..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="lg:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="סינון לפי סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="new">חדשות</SelectItem>
                  <SelectItem value="responded">נענו</SelectItem>
                  <SelectItem value="closed">סגורות</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="lg:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="מיון" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">לפי תאריך</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="lg:w-auto"
            >
              <Search className="h-4 w-4 mr-2" />
              חפש
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
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
          <TabsTrigger value="closed" className="flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            סגורות
            {tabCounts.closed > 0 && (
              <Badge variant="secondary" className="text-xs">
                {tabCounts.closed}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Inquiries List */}
        <div className="mt-6">
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
                  ? "נסה לשנות את מילות החיפוש או הסינונים"
                  : activeTab === "new"
                  ? "כל הפניות החדשות יופיעו כאן"
                  : "כשתקבל פניות מקונים, הן יופיעו כאן"
              }
              {...(searchQuery.trim() && {
                actionLabel: "נקה חיפוש",
                onAction: () => setSearchQuery(""),
              })}
            />
          ) : (
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
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .slice(
                  Math.max(0, pagination.page - 3),
                  Math.min(pagination.totalPages, pagination.page + 2)
                )
                .map((page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      fetchInquiries({ ...pagination, page, limit: 10 })
                    }
                    disabled={loading}
                  >
                    {page}
                  </Button>
                ))}
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
              <span>טוען...</span>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
