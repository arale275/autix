"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requestsApi } from "@/lib/api/requests";
import { CarRequest } from "@/lib/api/types";
import { toast } from "sonner";

interface RequestFormProps {
  request?: CarRequest;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

export default function RequestForm({
  request,
  mode = "create",
  onSuccess,
}: RequestFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    make: request?.make || "",
    model: request?.model || "",
    yearMin: request?.yearMin?.toString() || "",
    yearMax: request?.yearMax?.toString() || "",
    priceMax: request?.priceMax?.toString() || "",
    requirements: request?.requirements || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requestData = {
        make: formData.make || undefined,
        model: formData.model || undefined,
        yearMin: formData.yearMin ? parseInt(formData.yearMin) : undefined,
        yearMax: formData.yearMax ? parseInt(formData.yearMax) : undefined,
        priceMax: formData.priceMax ? parseInt(formData.priceMax) : undefined,
        requirements: formData.requirements || undefined,
      };

      // Remove undefined values
      const cleanData = Object.fromEntries(
        Object.entries(requestData).filter(([_, value]) => value !== undefined)
      );

      if (mode === "edit" && request?.id) {
        await requestsApi.updateRequest(request.id, cleanData);
        toast.success("הבקשה עודכנה בהצלחה");
      } else {
        await requestsApi.createRequest(cleanData);
        toast.success("הבקשה נוצרה בהצלחה");
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/buyer/requests");
      }
    } catch (error: any) {
      toast.error(error.message || "אירעה שגיאה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {mode === "edit" ? "עריכת בקשת רכב" : "בקשת רכב חדשה"}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          תאר את הרכב שאתה מחפש ונעזור לך למצוא את ההצעה המתאימה
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* פרטי רכב בסיסיים */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="make">יצרן</Label>
              <Input
                id="make"
                value={formData.make}
                onChange={(e) => handleChange("make", e.target.value)}
                placeholder="טויוטה, הונדה, פולקסוואגן... (אופציונלי)"
              />
              <p className="text-xs text-muted-foreground">
                השאר ריק אם אין העדפה
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">דגם</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleChange("model", e.target.value)}
                placeholder="קורולה, סיוויק, גולף... (אופציונלי)"
              />
              <p className="text-xs text-muted-foreground">
                השאר ריק אם אין העדפה
              </p>
            </div>
          </div>

          {/* טווח שנים */}
          <div className="space-y-4">
            <Label className="text-base font-medium">טווח שנות יצור</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yearMin">משנת</Label>
                <Input
                  id="yearMin"
                  type="number"
                  min="1990"
                  max="2025"
                  value={formData.yearMin}
                  onChange={(e) => handleChange("yearMin", e.target.value)}
                  placeholder="2015"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="yearMax">עד שנת</Label>
                <Input
                  id="yearMax"
                  type="number"
                  min="1990"
                  max="2025"
                  value={formData.yearMax}
                  onChange={(e) => handleChange("yearMax", e.target.value)}
                  placeholder="2023"
                />
              </div>
            </div>
          </div>

          {/* תקציב מקסימלי */}
          <div className="space-y-2">
            <Label htmlFor="priceMax">תקציב מקסימלי (₪)</Label>
            <Input
              id="priceMax"
              type="number"
              min="0"
              value={formData.priceMax}
              onChange={(e) => handleChange("priceMax", e.target.value)}
              placeholder="200000"
            />
            <p className="text-xs text-muted-foreground">
              הכנס את התקציב המקסימלי שלך
            </p>
          </div>

          {/* דרישות נוספות */}
          <div className="space-y-2">
            <Label htmlFor="requirements">דרישות ורצונות נוספים</Label>
            <Textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => handleChange("requirements", e.target.value)}
              placeholder="למשל: תיבת הילוכים אוטומטית, קילומטראז' נמוך, צבע כהה, ציוד מיוחד..."
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              תאר כל מה שחשוב לך ברכב - ככל שתהיה יותר ספציפי, כך נוכל למצוא לך
              הצעות מתאימות יותר
            </p>
          </div>

          {/* הודעה אינפורמטיבית */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3 space-x-reverse">
              <div className="text-blue-600 mt-0.5">
                <svg
                  className="w-5 h-5"
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
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">איך זה עובד?</p>
                <p>
                  לאחר שליחת הבקשה, סוחרי רכב יוכלו לראות אותה ולפנות אליך עם
                  הצעות מתאימות. תקבל התראות כשיש הצעות חדשות.
                </p>
              </div>
            </div>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "שולח..." : mode === "edit" ? "עדכן בקשה" : "שלח בקשה"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/buyer/requests")}
              disabled={loading}
            >
              ביטול
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
