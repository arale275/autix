import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "blue" | "gray" | "green" | "red" | "yellow" | "purple";
  className?: string;
}

export default function LoadingSpinner({
  size = "md",
  color = "blue",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "h-3 w-3 border",
    sm: "h-4 w-4 border",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-2",
    xl: "h-12 w-12 border-4",
  };

  const colorClasses = {
    blue: "border-blue-600 border-t-transparent",
    gray: "border-gray-600 border-t-transparent",
    green: "border-green-600 border-t-transparent",
    red: "border-red-600 border-t-transparent",
    yellow: "border-yellow-600 border-t-transparent",
    purple: "border-purple-600 border-t-transparent",
  };

  return (
    <div
      className={cn(
        "animate-spin rounded-full",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      role="status"
      aria-label="טוען..."
    >
      <span className="sr-only">טוען...</span>
    </div>
  );
}
