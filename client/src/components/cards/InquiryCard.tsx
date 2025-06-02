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
import { Inquiry } from "@/lib/api/types";
import { toast } from "sonner";
import {
  MoreVertical,
  Calendar,
  Car,
  User,
  Building2,
  CheckCircle,
  XCircle,
  MessageSquare,
  Phone,
  Mail,
  DollarSign,
} from "lucide-react";

interface InquiryCardProps {
  inquiry: Inquiry;
  userType?: "buyer" | "dealer";
  onMarkAsResponded?: (id: number) => Promise<boolean>;
  onClose?: (id: number) => Promise<boolean>;
  onDelete?: (id: number) => Promise<boolean>;
  actionLoading?: boolean;
}

export default function InquiryCard({
  inquiry,
  userType = "buyer",
  onMarkAsResponded,
  onClose,
  onDelete,
  actionLoading = false,
}: InquiryCardProps) {
  const [isActionLoading, setIsActionLoading] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("he-IL", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  const getCardTitle = () => {
    if (inquiry.car) {
      return `${inquiry.car.make} ${inquiry.car.model} ${inquiry.car.year}`;
    }
    return "פנייה כללית";
  };

  const getContactPerson = () => {
    if (userType === "dealer" && inquiry.buyer) {
      return {
        name: `${inquiry.buyer.firstName} ${inquiry.buyer.lastName}`,
        email: inquiry.buyer.email,
        phone: inquiry.buyer.phone,
        type: "קונה",
      };
    } else if (userType === "buyer" && inquiry.dealer) {
      return {
        name: inquiry.dealer.businessName,
        phone: inquiry.dealer.phone,
        type: "סוחר",
      };
    }
    return null;
  };

  const contactPerson = getContactPerson();

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                {getCardTitle()}
              </CardTitle>
              <Badge className={getStatusColor(inquiry.status)}>
                {getStatusText(inquiry.status)}
              </Badge>
            </div>

            {inquiry.car && (
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  {formatPrice(inquiry.car.price)}₪
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {inquiry.car.year}
                </div>
              </div>
            )}
          </div>

          {/* Actions Menu for Dealers */}
          {userType === "dealer" &&
            (onMarkAsResponded || onClose || onDelete) && (
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
                  {inquiry.status === "new" && onMarkAsResponded && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(
                          () => onMarkAsResponded(inquiry.id),
                          "הפנייה סומנה כנענתה"
                        )
                      }
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      סמן כנענתה
                    </DropdownMenuItem>
                  )}

                  {inquiry.status !== "closed" && onClose && (
                    <DropdownMenuItem
                      onClick={() =>
                        handleAction(() => onClose(inquiry.id), "הפנייה נסגרה")
                      }
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      סגור פנייה
                    </DropdownMenuItem>
                  )}

                  {onDelete && (
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() =>
                        handleAction(() => onDelete(inquiry.id), "הפנייה נמחקה")
                      }
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      מחק
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Message */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">הודעה:</h4>
          <p className="text-sm bg-gray-50 p-3 rounded-md leading-relaxed">
            {inquiry.message}
          </p>
        </div>

        {/* Contact Person Info */}
        {contactPerson && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              {userType === "dealer" ? (
                <User className="h-4 w-4" />
              ) : (
                <Building2 className="h-4 w-4" />
              )}
              {contactPerson.type}
            </h4>
            <div className="space-y-1">
              <p className="text-sm font-medium">{contactPerson.name}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                {contactPerson.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {contactPerson.email}
                  </div>
                )}
                {contactPerson.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {contactPerson.phone}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDate(inquiry.createdAt)}
          </div>

          {/* Contact Actions */}
          {contactPerson && (contactPerson.phone || contactPerson.email) && (
            <div className="flex gap-2">
              {contactPerson.phone && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => window.open(`tel:${contactPerson.phone}`)}
                >
                  <Phone className="h-3 w-3 mr-1" />
                  התקשר
                </Button>
              )}

              {contactPerson.email && (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => {
                    const subject = inquiry.car
                      ? `בנוגע לרכב ${inquiry.car.make} ${inquiry.car.model}`
                      : "בנוגע לפנייתך";
                    window.open(
                      `mailto:${
                        contactPerson.email
                      }?subject=${encodeURIComponent(subject)}`
                    );
                  }}
                >
                  <Mail className="h-3 w-3 mr-1" />
                  מייל
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Status Indicator for New Inquiries */}
        {inquiry.status === "new" && userType === "dealer" && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-800">
              פנייה חדשה - דורשת טיפול
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
