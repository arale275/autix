"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CarRequest } from "@/lib/api/types";
import { toast } from "sonner";
import {
  MoreVertical,
  Calendar,
  DollarSign,
  Car,
  User,
  Edit,
  Trash2,
  CheckCircle,
  RotateCcw,
  Phone,
  Mail,
} from "lucide-react";

interface RequestCardProps {
  request: CarRequest;
  userType?: "buyer" | "dealer";
  showBuyerInfo?: boolean;
  onEdit?: (request: CarRequest) => void;
  onDelete?: (id: number) => Promise<boolean>;
  onClose?: (id: number) => Promise<boolean>;
  onReopen?: (id: number) => Promise<boolean>;
  actionLoading?: boolean;
}

export default function RequestCard({
  request,
  userType = "buyer",
  showBuyerInfo = false,
  onEdit,
  onDelete,
  onClose,
  onReopen,
  actionLoading = false,
}: RequestCardProps) {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL").format(price);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "פעילה";
      case "closed":
        return "סגורה";
      default:
        return status;
    }
  };

  const handleAction = async (
    action: () => Promise<boolean>,
    successMessage: string
  ) => {
    setIsActionLoading(true);
    try {
      const success = await action();
      if (success) {
        toast.success(successMessage);
      }
    } catch (error) {
      toast.error("אירעה שגיאה");
    } finally {
      setIsActionLoading(false);
    }
  };

  const buildCarDescription = () => {
    const parts = [];

    if (request.make && request.model) {
      parts.push(`${request.make} ${request.model}`);
    } else if (request.make) {
      parts.push(request.make);
    } else if (request.model) {
      parts.push(`דגם ${request.model}`);
    } else {
      parts.push("כל רכב");
    }

    return parts.join(" ");
  };

  const buildDetailsText = () => {
    const details = [];

    if (request.yearMin && request.yearMax) {
      details.push(`שנים ${request.yearMin}-${request.yearMax}`);
    } else if (request.yearMin) {
      details.push(`משנת ${request.yearMin}`);
    } else if (request.yearMax) {
      details.push(`עד שנת ${request.yearMax}`);
    }

    if (request.priceMax) {
      details.push(`עד ${formatPrice(request.priceMax)}₪`);
    }

    return details.join(" • ");
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{buildCarDescription()}</CardTitle>
              <Badge className={getStatusColor(request.status)}>
                {getStatusText(request.status)}
              </Badge>
            </div>

            {buildDetailsText() && (
              <p className="text-sm text-muted-foreground">
                {buildDetailsText()}
              </p>
            )}
          </div>

          {/* Actions Menu */}
          {userType === "buyer" &&
            (onEdit || onDelete || onClose || onReopen) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={actionLoading || isActionLoading}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(request)}>
                      <Edit className="h-4 w-4 mr-2" />
                      עריכה
                    </DropdownMenuItem>
                  )}

                  {request.status === "active" && onClose && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(() => onClose(request.id), "הבקשה נסגרה")
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      סגור בקשה
                    </DropdownMenuItem>
                  )}

                  {request.status === "closed" && onReopen && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(
                          () => onReopen(request.id),
                          "הבקשה נפתחה מחדש"
                        )
                      }
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      פתח מחדש
                    </DropdownMenuItem>
                  )}

                  {onDelete && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() =>
                        handleAction(() => onDelete(request.id), "הבקשה נמחקה")
                      }
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      מחק
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Requirements */}
        {request.requirements && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">
              דרישות נוספות:
            </h4>
            <p className="text-sm bg-gray-50 p-3 rounded-md">
              {request.requirements}
            </p>
          </div>
        )}

        {/* Buyer Info for Dealers */}
        {showBuyerInfo && request.buyer && userType === "dealer" && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <User className="h-4 w-4" />
              פרטי הקונה
            </h4>
            <div className="space-y-1">
              <p className="text-sm">
                {request.buyer.firstName} {request.buyer.lastName}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {request.buyer.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {request.buyer.email}
                  </div>
                )}
                {request.buyer.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {request.buyer.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(request.createdAt)}
            </div>

            {request.priceMax && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                תקציב עד {formatPrice(request.priceMax)}₪
              </div>
            )}
          </div>

          {/* Contact Button for Dealers */}
          {userType === "dealer" && request.buyer && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              onClick={() => {
                if (request.buyer?.phone) {
                  window.open(`tel:${request.buyer.phone}`);
                } else if (request.buyer?.email) {
                  window.open(`mailto:${request.buyer.email}`);
                }
              }}
            >
              <Phone className="h-3 w-3 mr-1" />
              צור קשר
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
