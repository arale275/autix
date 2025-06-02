// app-new/(dashboard)/buyer/requests/page.tsx - Car Requests Management Page for Buyers
"use client";

import React, { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  Calendar,
  DollarSign,
  Car as CarIcon,
  AlertCircle,
  TrendingUp,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useMyRequests } from "@/hooks/api/useRequests";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import type { CarRequest, RequestsSearchParams } from "@/lib/api/types";

// Filter Options
const STATUS_OPTIONS = [
  { value: "", label: "כל הסטטוסים" },
  { value: "active", label: "פעיל" },
  { value: "closed", label: "סגור" },
];

const SORT_OPTIONS = [
  { value: "created_at:desc", label: "חדשים ביותר" },
  { value: "created_at:asc", label: "ישנים ביותר" },
  { value: "price:asc", label: "תקציב: נמוך לגבוה" },
  { value: "price:desc", label: "תקציב: גבוה לנמוך" },
];

// Format Functions
const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("he-IL").format(price) + "₪";
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 border-green-200";
    case "closed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    default:
      return "bg-blue-100 text-blue-800 border-blue-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <Clock className="w-3 h-3" />;
    case "closed":
      return <CheckCircle className="w-3 h-3" />;
    default:
      return <AlertCircle className="w-3 h-3" />;
  }
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case "active":
      return "פעיל";
    case "closed":
      return "סגור";
    default:
      return "לא ידוע";
  }
};

// Request Card Component
interface RequestCardProps {
  request: CarRequest;
  onEdit: (request: CarRequest) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number, newStatus: "active" | "closed") => void;
  actionLoading: boolean;
}

function RequestCard({
  request,
  onEdit,
  onDelete,
  onToggleStatus,
  actionLoading,
}: RequestCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(request.status)}>
                {getStatusIcon(request.status)}
                <span className="mr-1">{getStatusLabel(request.status)}</span>
              </Badge>
              <span className="text-xs text-gray-500">
                {formatDate(request.createdAt)}
              </span>
            </div>

            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {request.make && request.model
                ? `${request.make} ${request.model}`
                : "בקשת רכב כללית"}
            </h3>

            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              {request.yearMin && request.yearMax && (
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {request.yearMin === request.yearMax
                    ? request.yearMin
                    : `${request.yearMin}-${request.yearMax}`}
                </span>
              )}

              {request.priceMax && (
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  עד {formatPrice(request.priceMax)}
                </span>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={actionLoading}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onEdit(request)}>
                <Edit className="w-4 h-4 mr-2" />
                עריכה
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  onToggleStatus(
                    request.id,
                    request.status === "active" ? "closed" : "active"
                  )
                }
              >
                {request.status === "active" ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    סגירה
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    הפעלה מחדש
                  </>
                )}
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  if (
                    window.confirm(
                      "האם אתה בטוח שברצונך למחוק את הבקשה? פעולה זו לא ניתנת לביטול."
                    )
                  ) {
                    onDelete(request.id);
                  }
                }}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                מחיקה
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Requirements */}
        {request.requirements && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 line-clamp-2">
              {request.requirements}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>נוצר ב-{formatDate(request.createdAt)}</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />0 הצעות
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />0 צפיות
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function BuyerRequestsPage() {
  const { user } = useAuth();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at:desc");

  // Requests Hook
  const {
    requests,
    pagination,
    loading,
    error,
    actionLoading,
    refetch,
    deleteRequest,
    closeRequest,
    reopenRequest,
    clearError,
  } = useMyRequests();

  // Filtered and sorted requests
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.make?.toLowerCase().includes(query) ||
          request.model?.toLowerCase().includes(query) ||
          request.requirements?.toLowerCase().includes(query)
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter((request) => request.status === filterStatus);
    }

    // Sort
    const [sortField, sortOrder] = sortBy.split(":");
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortField) {
        case "created_at":
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case "price":
          aValue = a.priceMax || 0;
          bValue = b.priceMax || 0;
          break;
        default:
          return 0;
      }

      const modifier = sortOrder === "desc" ? -1 : 1;
      return aValue > bValue ? modifier : aValue < bValue ? -modifier : 0;
    });

    return filtered;
  }, [requests, searchQuery, filterStatus, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const activeRequests = requests.filter((r) => r.status === "active").length;
    const closedRequests = requests.filter((r) => r.status === "closed").length;

    return {
      total: requests.length,
      active: activeRequests,
      closed: closedRequests,
    };
  }, [requests]);

  // Actions
  const handleEdit = useCallback((request: CarRequest) => {
    // Navigate to edit page (to be implemented)
    toast.info("עריכת בקשה - בפיתוח");
  }, []);

  const handleDelete = useCallback(
    async (id: number) => {
      const success = await deleteRequest(id);
      if (success) {
        toast.success("הבקשה נמחקה בהצלחה");
      }
    },
    [deleteRequest]
  );

  const handleToggleStatus = useCallback(
    async (id: number, newStatus: "active" | "closed") => {
      const success =
        newStatus === "closed"
          ? await closeRequest(id)
          : await reopenRequest(id);

      if (success) {
        toast.success(
          newStatus === "closed" ? "הבקשה נסגרה" : "הבקשה הופעלה מחדש"
        );
      }
    },
    [closeRequest, reopenRequest]
  );

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              שגיאה בטעינת הבקשות
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
              <Button onClick={clearError}>נסה שוב</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">הבקשות שלי</h1>
          <p className="text-gray-600 mt-1">
            נהל את בקשות הרכב שלך וקבל הצעות מסוחרים
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            רענן
          </Button>
          <Link href="/buyer/requests/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              בקשה חדשה
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">סך הכל בקשות</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
              </div>
              <CarIcon className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">בקשות פעילות</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.active}
                </p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">בקשות סגורות</p>
                <p className="text-2xl font-bold text-gray-600">
                  {stats.closed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="חפש בבקשות..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* Status Filter */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="סטטוס" />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          מציג {filteredRequests.length} מתוך {requests.length} בקשות
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <LoadingSpinner size="sm" />
            טוען...
          </div>
        )}
      </div>

      {/* Requests List */}
      {loading && requests.length === 0 ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : filteredRequests.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {requests.length === 0 ? "אין בקשות רכב" : "לא נמצאו תוצאות"}
            </h3>
            <p className="text-gray-600 mb-4">
              {requests.length === 0
                ? "פרסם את הבקשה הראשונה שלך וקבל הצעות מסוחרים"
                : "נסה לשנות את הפילטרים או מילות החיפוש"}
            </p>
            <Link href="/buyer/requests/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                צור בקשה ראשונה
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleStatus={handleToggleStatus}
              actionLoading={actionLoading[request.id] || false}
            />
          ))}
        </div>
      )}

      {/* Tips Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="text-sm text-blue-800">
              <h4 className="font-medium mb-2">טיפים להצלחה:</h4>
              <ul className="space-y-1 text-xs">
                <li>• כתב בקשה מפורטת עם כל הדרישות שלך</li>
                <li>• ציין תקציב ריאלי למקסימום הצעות</li>
                <li>• עדכן את הבקשה אם השתנו הצרכים שלך</li>
                <li>• סגור בקשות שכבר לא רלוונטיות</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
