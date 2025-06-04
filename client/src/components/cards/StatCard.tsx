// components/cards/StatCard.tsx - Reusable Statistics Card Component
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: "blue" | "green" | "purple" | "orange" | "red" | "gray";
  subtitle?: string;
  progress?: number;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle,
  progress,
  onClick,
  className,
}: StatCardProps) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    orange: "text-orange-600 bg-orange-100",
    red: "text-red-600 bg-red-100",
    gray: "text-gray-600 bg-gray-100",
  };

  return (
    <Card
      className={cn(
        "transition-colors duration-200",
        onClick && "cursor-pointer hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-gray-600">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className={cn("text-2xl font-bold", `text-${color}-600`)}>
                {value}
              </p>
            </div>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
            {progress !== undefined && (
              <Progress value={progress} className="h-1 mt-2" />
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-full flex items-center justify-center",
              colorClasses[color]
            )}
          >
            <Icon className={cn("w-6 h-6", `text-${color}-600`)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
