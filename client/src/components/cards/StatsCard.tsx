"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatItem {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  color?: "default" | "blue" | "green" | "yellow" | "red" | "purple";
  trend?: {
    value: number;
    isPositive: boolean;
    label: string;
  };
  description?: string;
}

interface StatsCardProps {
  title: string;
  stats: StatItem[];
  className?: string;
  loading?: boolean;
  error?: string;
  icon?: LucideIcon;
  variant?: "default" | "compact" | "detailed";
}

const getColorClasses = (color: StatItem["color"] = "default") => {
  const colors = {
    default: {
      bg: "bg-gray-50",
      text: "text-gray-700",
      icon: "text-gray-500",
      border: "border-gray-200",
    },
    blue: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      icon: "text-blue-500",
      border: "border-blue-200",
    },
    green: {
      bg: "bg-green-50",
      text: "text-green-700",
      icon: "text-green-500",
      border: "border-green-200",
    },
    yellow: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      icon: "text-yellow-500",
      border: "border-yellow-200",
    },
    red: {
      bg: "bg-red-50",
      text: "text-red-700",
      icon: "text-red-500",
      border: "border-red-200",
    },
    purple: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: "text-purple-500",
      border: "border-purple-200",
    },
  };

  return colors[color];
};

const formatValue = (value: number | string): string => {
  if (typeof value === "string") return value;

  // Format large numbers
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value.toLocaleString("he-IL");
};

const StatItemComponent = ({
  stat,
  variant = "default",
}: {
  stat: StatItem;
  variant?: StatsCardProps["variant"];
}) => {
  const colorClasses = getColorClasses(stat.color);
  const IconComponent = stat.icon;

  if (variant === "compact") {
    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {IconComponent && (
            <IconComponent className={cn("h-4 w-4", colorClasses.icon)} />
          )}
          <span className="text-sm text-muted-foreground">{stat.label}</span>
        </div>
        <span className="font-semibold">{formatValue(stat.value)}</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-lg p-4 border",
        colorClasses.bg,
        colorClasses.border
      )}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {IconComponent && (
            <IconComponent className={cn("h-5 w-5", colorClasses.icon)} />
          )}
          <span className={cn("text-sm font-medium", colorClasses.text)}>
            {stat.label}
          </span>
        </div>

        {stat.trend && (
          <Badge
            variant={stat.trend.isPositive ? "default" : "secondary"}
            className="text-xs"
          >
            {stat.trend.isPositive ? "+" : ""}
            {stat.trend.value}%
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-2xl font-bold text-gray-900">
          {formatValue(stat.value)}
        </div>

        {stat.description && (
          <p className="text-xs text-muted-foreground">{stat.description}</p>
        )}

        {stat.trend && (
          <p className="text-xs text-muted-foreground">{stat.trend.label}</p>
        )}
      </div>
    </div>
  );
};

const LoadingSkeleton = ({
  variant = "default",
}: {
  variant?: StatsCardProps["variant"];
}) => {
  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-4 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-lg p-4 border bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div className="h-5 w-12 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-3 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

const ErrorState = ({ error }: { error: string }) => (
  <div className="flex items-center justify-center p-8 text-center">
    <div className="space-y-2">
      <div className="text-red-500 text-sm font-medium">
        שגיאה בטעינת הנתונים
      </div>
      <div className="text-xs text-muted-foreground">{error}</div>
    </div>
  </div>
);

export default function StatsCard({
  title,
  stats,
  className = "",
  loading = false,
  error,
  icon: TitleIcon,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          {TitleIcon && <TitleIcon className="h-5 w-5" />}
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading && <LoadingSkeleton variant={variant} />}

        {error && <ErrorState error={error} />}

        {!loading && !error && (
          <>
            {variant === "compact" ? (
              <div className="space-y-3">
                {stats.map((stat, index) => (
                  <StatItemComponent
                    key={index}
                    stat={stat}
                    variant={variant}
                  />
                ))}
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-4",
                  variant === "detailed"
                    ? "grid-cols-1 md:grid-cols-2"
                    : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}
              >
                {stats.map((stat, index) => (
                  <StatItemComponent
                    key={index}
                    stat={stat}
                    variant={variant}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {!loading && !error && stats.length === 0 && (
          <div className="flex items-center justify-center p-8 text-center">
            <div className="text-sm text-muted-foreground">
              אין נתונים להצגה
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Example usage components for different user types
export const BuyerStatsCard = ({
  stats,
  loading,
  error,
}: {
  stats?: {
    totalRequests: number;
    activeRequests: number;
    totalInquiries: number;
    savedCars: number;
  };
  loading?: boolean;
  error?: string;
}) => {
  const statsItems: StatItem[] = stats
    ? [
        {
          label: "בקשות רכב",
          value: stats.totalRequests,
          color: "blue",
          description: `${stats.activeRequests} פעילות`,
        },
        {
          label: "פניות שנשלחו",
          value: stats.totalInquiries,
          color: "green",
        },
        {
          label: "רכבים שמורים",
          value: stats.savedCars,
          color: "purple",
        },
      ]
    : [];

  return (
    <StatsCard
      title="הסטטיסטיקות שלי"
      stats={statsItems}
      loading={loading}
      error={error}
      variant="compact"
    />
  );
};

export const DealerStatsCard = ({
  stats,
  loading,
  error,
}: {
  stats?: {
    totalCars: number;
    activeCars: number;
    soldCars: number;
    totalInquiries: number;
    newInquiries: number;
  };
  loading?: boolean;
  error?: string;
}) => {
  const statsItems: StatItem[] = stats
    ? [
        {
          label: "סה״כ רכבים",
          value: stats.totalCars,
          color: "blue",
          description: `${stats.activeCars} פעילים`,
        },
        {
          label: "רכבים נמכרו",
          value: stats.soldCars,
          color: "green",
        },
        {
          label: "פניות התקבלו",
          value: stats.totalInquiries,
          color: "yellow",
          description: `${stats.newInquiries} חדשות`,
        },
      ]
    : [];

  return (
    <StatsCard
      title="סטטיסטיקות עסק"
      stats={statsItems}
      loading={loading}
      error={error}
      variant="detailed"
    />
  );
};
