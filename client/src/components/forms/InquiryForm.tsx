"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { inquiriesApi } from "@/lib/api/inquiries";
import { Car } from "@/lib/api/types";
import { toast } from "sonner";
import {
  MessageSquare,
  Car as CarIcon,
  Building2,
  Send,
  DollarSign,
  Calendar,
} from "lucide-react";

interface InquiryFormProps {
  dealerId: number;
  dealerName?: string;
  car?: Car;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export default function InquiryForm({
  dealerId,
  dealerName,
  car,
  onSuccess,
  onCancel,
  className = "",
}: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL").format(price);
  };

  const getDefaultMessage = () => {
    if (car) {
      return `שלום,\n\nאני מעוניין/ת ברכב ${car.make} ${car.model} משנת ${
        car.year
      } במחיר ${formatPrice(
        car.price
      )}₪.\n\nאשמח לקבל פרטים נוספים ולתאם צפייה.\n\nתודה!`;
    }
    return "שלום,\n\nאני מעוניין/ת לקבל מידע נוסף על הרכבים שלכם.\n\nתודה!";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error("אנא כתוב הודעה");
      return;
    }

    setLoading(true);

    try {
      const inquiryData = {
        dealerId,
        carId: car?.id,
        message: message.trim(),
      };

      await inquiriesApi.sendInquiry(inquiryData);
      toast.success("הפנייה נשלחה בהצלחה");

      if (onSuccess) {
        onSuccess();
      } else {
        setMessage("");
      }
    } catch (error: any) {
      toast.error(error.message || "אירעה שגיאה בשליחת הפנייה");
    } finally {
      setLoading(false);
    }
  };

  const handleUseTemplate = () => {
    setMessage(getDefaultMessage());
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          שליחת פנייה
        </CardTitle>

        {/* Dealer Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Building2 className="h-4 w-4" />
          <span>אל: {dealerName || "הסוחר"}</span>
        </div>

        {/* Car Info */}
        {car && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-3">
              <CarIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">
                  {car.make} {car.model} {car.year}
                </h4>
                <div className="flex items-center gap-4 text-sm text-blue-700 mt-1">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {formatPrice(car.price)}₪
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {car.year}
                  </div>
                  {car.mileage && (
                    <span>{car.mileage.toLocaleString()} ק"מ</span>
                  )}
                </div>
                {car.city && (
                  <p className="text-xs text-blue-600 mt-1">{car.city}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Message Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="message">הודעה *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleUseTemplate}
                className="text-xs h-auto p-1"
              >
                השתמש בתבנית
              </Button>
            </div>

            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                car
                  ? "כתוב הודעה על הרכב שמעניין אותך..."
                  : "כתוב הודעה לסוחר..."
              }
              rows={6}
              required
            />

            <p className="text-xs text-muted-foreground">
              {message.length}/500 תווים
            </p>
          </div>

          {/* Info Message */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-gray-500 mt-0.5">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">טיפים לפנייה יעילה:</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>ציין בבירור מה מעניין אותך</li>
                  <li>הזכר את התקציב שלך</li>
                  <li>שאל על אפשרות לצפייה</li>
                  <li>השאיר פרטי יצירת קשר</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading || !message.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  שולח...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  שלח פנייה
                </>
              )}
            </Button>

            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                ביטול
              </Button>
            )}
          </div>

          {/* Privacy Note */}
          <p className="text-xs text-muted-foreground text-center">
            הפרטים שלך יישלחו לסוחר ויוכל ליצור איתך קשר ישירות
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
