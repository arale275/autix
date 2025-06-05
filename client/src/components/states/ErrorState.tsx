"use client";

import React from "react";
import {
  AlertCircle,
  RefreshCw,
  Home,
  ArrowLeft,
  Wifi,
  Server,
  Lock,
  Search,
  Car,
  MessageSquare,
  User,
  ShieldAlert,
  Bug,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Error types for better UX
export type ErrorType =
  | "network"
  | "server"
  | "auth"
  | "notFound"
  | "forbidden"
  | "validation"
  | "generic";

export interface ErrorStateProps {
  type?: ErrorType;
  title?: string;
  message?: string;
  details?: string;
  showRetry?: boolean;
  showHome?: boolean;
  showBack?: boolean;
  onRetry?: () => void;
  onHome?: () => void;
  onBack?: () => void;
  className?: string;
}

// Error configurations for different types
const errorConfigs: Record<
  ErrorType,
  {
    icon: React.ComponentType<any>;
    title: string;
    message: string;
    color: string;
    bgColor: string;
  }
> = {
  network: {
    icon: Wifi,
    title: "בעיית חיבור",
    message: "לא ניתן להתחבר לשרת. בדוק את החיבור לאינטרנט ונסה שוב.",
    color: "text-orange-600",
    bgColor: "bg-orange-50 border-orange-200",
  },
  server: {
    icon: Server,
    title: "שגיאת שרת",
    message: "אירעה שגיאה בשרת. אנא נסה שוב מאוחר יותר.",
    color: "text-red-600",
    bgColor: "bg-red-50 border-red-200",
  },
  auth: {
    icon: Lock,
    title: "שגיאת הרשאה",
    message: "אין לך הרשאה לגשת לעמוד זה. אנא התחבר ונסה שוב.",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50 border-yellow-200",
  },
  notFound: {
    icon: Search,
    title: "העמוד לא נמצא",
    message: "העמוד שחיפשת לא קיים או הוסר.",
    color: "text-blue-600",
    bgColor: "bg-blue-50 border-blue-200",
  },
  forbidden: {
    icon: ShieldAlert,
    title: "גישה נדחתה",
    message: "אין לך הרשאה לבצע פעולה זו.",
    color: "text-purple-600",
    bgColor: "bg-purple-50 border-purple-200",
  },
  validation: {
    icon: AlertCircle,
    title: "שגיאת נתונים",
    message: "הנתונים שהוזנו אינם תקינים. אנא בדוק ונסה שוב.",
    color: "text-amber-600",
    bgColor: "bg-amber-50 border-amber-200",
  },
  generic: {
    icon: Bug,
    title: "אירעה שגיאה",
    message: "משהו השתבש. אנא נסה שוב.",
    color: "text-gray-600",
    bgColor: "bg-gray-50 border-gray-200",
  },
};

// Main ErrorState component
export default function ErrorState({
  type = "generic",
  title,
  message,
  details,
  showRetry = true,
  showHome = true,
  showBack = false,
  onRetry,
  onHome,
  onBack,
  className,
}: ErrorStateProps) {
  const config = errorConfigs[type];
  const Icon = config.icon;

  const handleRetry = () => {
    onRetry?.();
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      window.location.href = "/";
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.history.back();
    }
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-[400px] p-4",
        className
      )}
    >
      <Card className={cn("w-full max-w-md text-center", config.bgColor)}>
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-4">
            <div className={cn("p-3 rounded-full", config.bgColor)}>
              <Icon className={cn("w-8 h-8", config.color)} />
            </div>
          </div>
          <CardTitle className={cn("text-xl", config.color)}>
            {title || config.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-gray-600">{message || config.message}</p>

          {details && (
            <div className="text-sm text-gray-500 bg-white bg-opacity-50 p-3 rounded border">
              {details}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            {showRetry && (
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4" />
                נסה שוב
              </Button>
            )}

            {showBack && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                חזור
              </Button>
            )}

            {showHome && (
              <Button
                variant="outline"
                onClick={handleHome}
                className="flex items-center gap-2"
              >
                <Home className="w-4 h-4" />
                דף הבית
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Specialized error components for common use cases
export function NetworkError({
  onRetry,
  ...props
}: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="network"
      onRetry={onRetry}
      showRetry={!!onRetry}
      {...props}
    />
  );
}

export function ServerError({
  onRetry,
  ...props
}: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="server"
      onRetry={onRetry}
      showRetry={!!onRetry}
      {...props}
    />
  );
}

export function AuthError({
  onRetry,
  ...props
}: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="auth"
      onRetry={onRetry}
      showRetry={false}
      showHome={true}
      {...props}
    />
  );
}

export function NotFoundError({ ...props }: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="notFound"
      showRetry={false}
      showBack={true}
      showHome={true}
      {...props}
    />
  );
}

// Specialized components for different contexts
export function CarError({ onRetry, ...props }: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="notFound"
      title="רכב לא נמצא"
      message="הרכב שחיפשת לא קיים או הוסר מהמערכת"
      onRetry={onRetry}
      showRetry={!!onRetry}
      {...props}
    />
  );
}

export function RequestError({
  onRetry,
  ...props
}: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="server"
      title="שגיאה בטעינת הבקשות"
      message="לא ניתן לטעון את רשימת הבקשות כעת"
      onRetry={onRetry}
      showRetry={!!onRetry}
      {...props}
    />
  );
}

export function InquiryError({
  onRetry,
  ...props
}: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="server"
      title="שגיאה בטעינת הפניות"
      message="לא ניתן לטעון את רשימת הפניות כעת"
      onRetry={onRetry}
      showRetry={!!onRetry}
      {...props}
    />
  );
}

export function ProfileError({
  onRetry,
  ...props
}: Omit<ErrorStateProps, "type">) {
  return (
    <ErrorState
      type="server"
      title="שגיאה בטעינת הפרופיל"
      message="לא ניתן לטעון את פרטי הפרופיל כעת"
      onRetry={onRetry}
      showRetry={!!onRetry}
      {...props}
    />
  );
}
