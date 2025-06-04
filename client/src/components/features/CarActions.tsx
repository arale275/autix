// components/features/CarActions.tsx - Car Quick Actions Component
import React from "react";
import { Share2, Edit, CheckCircle, Trash2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Car } from "@/lib/api/types";

interface CarActionsProps {
  car: Car;
  onShare?: () => void;
  onEdit?: () => void;
  onMarkSold?: () => void;
  onDelete?: () => void;
  loading?: boolean;
  className?: string;
}

export function CarActions({
  car,
  onShare,
  onEdit,
  onMarkSold,
  onDelete,
  loading = false,
  className,
}: CarActionsProps) {
  // Only show actions for active cars
  if (car.status !== "active") {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          פעולות מהירות
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {onShare && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onShare}
          >
            <Share2 className="w-4 h-4 mr-2" />
            שתף רכב
          </Button>
        )}

        {onEdit && (
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={onEdit}
          >
            <Edit className="w-4 h-4 mr-2" />
            ערוך פרטים
          </Button>
        )}

        {onMarkSold && (
          <Button
            variant="outline"
            className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
            onClick={onMarkSold}
            disabled={loading}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            סמן כנמכר
          </Button>
        )}

        {onDelete && (
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={onDelete}
            disabled={loading}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            מחק רכב
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
