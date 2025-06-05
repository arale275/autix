"use client";

import React from "react";
import { Loader2, Car, Search, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type LoadingType =
  | "spinner"
  | "skeleton"
  | "dots"
  | "overlay"
  | "cars"
  | "requests"
  | "inquiries"
  | "profile";

export interface LoadingStateProps {
  type?: LoadingType;
  message?: string;
  size?: "sm" | "md" | "lg";
  overlay?: boolean;
  className?: string;
}

// Loading configurations for different contexts
const loadingConfigs: Record<
  LoadingType,
  {
    icon: React.ComponentType<any>;
    message: string;
    color: string;
  }
> = {
  spinner: {
    icon: Loader2,
    message: "טוען...",
    color: "text-blue-600",
  },
  skeleton: {
    icon: Loader2,
    message: "טוען נתונים...",
    color: "text-gray-400",
  },
  dots: {
    icon: Loader2,
    message: "אנא המתן...",
    color: "text-blue-500",
  },
  overlay: {
    icon: Loader2,
    message: "מעבד...",
    color: "text-white",
  },
  cars: {
    icon: Car,
    message: "טוען רכבים...",
    color: "text-blue-600",
  },
  requests: {
    icon: Search,
    message: "טוען בקשות...",
    color: "text-green-600",
  },
  inquiries: {
    icon: MessageSquare,
    message: "טוען הודעות...",
    color: "text-purple-600",
  },
  profile: {
    icon: User,
    message: "טוען פרופיל...",
    color: "text-orange-600",
  },
};

// Size configurations
const sizeConfigs = {
  sm: { icon: "w-4 h-4", text: "text-sm", padding: "p-2" },
  md: { icon: "w-6 h-6", text: "text-base", padding: "p-4" },
  lg: { icon: "w-8 h-8", text: "text-lg", padding: "p-6" },
};

// Main LoadingState component
export default function LoadingState({
  type = "spinner",
  message,
  size = "md",
  overlay = false,
  className,
}: LoadingStateProps) {
  const config = loadingConfigs[type];
  const sizeConfig = sizeConfigs[size];
  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-3",
        sizeConfig.padding,
        className
      )}
    >
      <Icon className={cn(sizeConfig.icon, config.color, "animate-spin")} />
      <p className={cn(sizeConfig.text, "text-gray-600 font-medium")}>
        {message || config.message}
      </p>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg">{content}</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[200px]">
      {content}
    </div>
  );
}

// Specialized loading components
export function LoadingSpinner({
  size = "md",
  message,
  className,
}: Omit<LoadingStateProps, "type">) {
  return (
    <LoadingState
      type="spinner"
      size={size}
      message={message}
      className={className}
    />
  );
}

export function LoadingOverlay({
  message,
  className,
}: Omit<LoadingStateProps, "type" | "overlay">) {
  return (
    <LoadingState
      type="overlay"
      overlay={true}
      message={message}
      className={className}
    />
  );
}

export function LoadingDots({
  message = "טוען...",
  className,
}: Omit<LoadingStateProps, "type">) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span className="text-gray-600">{message}</span>
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
}

// Skeleton components for different layouts
export function SkeletonLoader({
  type = "card",
  count = 1,
  className,
}: {
  type?: "card" | "list" | "text";
  count?: number;
  className?: string;
}) {
  const renderSkeleton = () => {
    switch (type) {
      case "card":
        return (
          <div className="bg-white border rounded-lg p-4 space-y-3 animate-pulse">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="flex justify-between">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        );

      case "list":
        return (
          <div className="bg-white border rounded-lg p-4 flex items-center gap-4 animate-pulse">
            <div className="w-16 h-12 bg-gray-200 rounded"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-20"></div>
          </div>
        );

      case "text":
        return (
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: count }, (_, index) => (
        <div key={index}>{renderSkeleton()}</div>
      ))}
    </div>
  );
}

// Context-specific loading components
export function CarsLoading({
  layout = "grid",
  count = 6,
}: {
  layout?: "grid" | "list";
  count?: number;
}) {
  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SkeletonLoader type="card" count={count} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SkeletonLoader type="list" count={count} />
    </div>
  );
}

export function RequestsLoading({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="bg-white border rounded-lg p-4 animate-pulse"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="space-y-2 flex-1">
              <div className="h-5 bg-gray-200 rounded w-2/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function InquiriesLoading({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="bg-white border rounded-lg p-4 animate-pulse"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfileLoading() {
  return (
    <div className="bg-white rounded-lg border p-6 animate-pulse">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
}
