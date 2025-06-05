import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Car,
  MessageSquare,
  FileText,
  Search,
  Plus,
  Frown,
  Package,
} from "lucide-react";

type EmptyStateVariant =
  | "cars"
  | "requests"
  | "inquiries"
  | "search"
  | "general"
  | "my-cars"
  | "my-requests";

interface EmptyStateProps {
  variant: EmptyStateVariant;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

const emptyStateConfig = {
  cars: {
    icon: Car,
    title: "אין רכבים כרגע",
    description:
      "לא נמצאו רכבים המתאימים לחיפוש שלך. נסה לשנות את הפילטרים או לחפש מחדש.",
    actionLabel: "נקה פילטרים",
    iconColor: "text-blue-500",
  },
  "my-cars": {
    icon: Package,
    title: "אין לך רכבים למכירה",
    description:
      "התחל למכור את הרכב שלך עוד היום והגע לאלפי קונים פוטנציאליים.",
    actionLabel: "הוסף רכב למכירה",
    iconColor: "text-green-500",
  },
  requests: {
    icon: FileText,
    title: "אין בקשות כרגע",
    description:
      "לא נמצאו בקשות רכב. בקשות חדשות יופיעו כאן כשקונים יחפשו רכבים.",
    actionLabel: "רענן",
    iconColor: "text-orange-500",
  },
  "my-requests": {
    icon: FileText,
    title: "לא יצרת בקשות עדיין",
    description:
      "צור בקשת רכב ובואו נעזור לך למצוא את הרכב המושלם. סוחרים יוכלו לפנות אליך עם הצעות.",
    actionLabel: "צור בקשת רכב",
    iconColor: "text-purple-500",
  },
  inquiries: {
    icon: MessageSquare,
    title: "אין פניות כרגע",
    description: "כשקונים יהיו מעוניינים ברכבים שלך, הפניות שלהם יופיעו כאן.",
    actionLabel: "רענן",
    iconColor: "text-indigo-500",
  },
  search: {
    icon: Search,
    title: "לא נמצאו תוצאות",
    description:
      "לא מצאנו תוצאות לחיפוש שלך. נסה מילות חיפוש אחרות או שנה את הפילטרים.",
    actionLabel: "נסה חיפוש אחר",
    iconColor: "text-gray-500",
  },
  general: {
    icon: Frown,
    title: "אין מידע להצגה",
    description:
      "אין מידע זמין כעת. נסה לטעון מחדש את הדף או לחזור מאוחר יותר.",
    actionLabel: "טען מחדש",
    iconColor: "text-gray-400",
  },
};

export default function EmptyState({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  className = "",
}: EmptyStateProps) {
  const config = emptyStateConfig[variant];
  const Icon = config.icon;

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;
  const displayActionLabel = actionLabel || config.actionLabel;

  return (
    <Card className={`w-full ${className}`}>
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {/* Icon */}
        <div className={`mb-6 p-4 rounded-full bg-gray-50 ${config.iconColor}`}>
          <Icon size={48} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {displayTitle}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
          {displayDescription}
        </p>

        {/* Action Button */}
        {onAction && (
          <Button
            onClick={onAction}
            variant="outline"
            className="flex items-center gap-2"
          >
            {variant === "my-cars" && <Plus size={16} />}
            {variant === "search" && <Search size={16} />}
            {displayActionLabel}
          </Button>
        )}

        {/* Additional context for specific variants */}
        {variant === "cars" && (
          <div className="mt-6 text-sm text-gray-500">
            <p>💡 טיפ: נסה חיפוש רחב יותר או בדוק שוב מאוחר יותר</p>
          </div>
        )}

        {variant === "my-cars" && (
          <div className="mt-6 text-sm text-gray-500">
            <p>🚀 זה קל ומהיר - רק כמה פרטים על הרכב ואתה מוכן!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Usage Examples:
/*
// For cars listing
<EmptyState 
  variant="cars" 
  onAction={() => clearFilters()} 
/>

// For dealer's cars
<EmptyState 
  variant="my-cars" 
  onAction={() => router.push('/dealer/add-car')} 
/>

// For search results
<EmptyState 
  variant="search" 
  onAction={() => setSearchQuery('')} 
/>

// For buyer's requests
<EmptyState 
  variant="my-requests" 
  onAction={() => router.push('/buyer/post-request')} 
/>

// Custom text
<EmptyState 
  variant="general"
  title="משהו השתבש"
  description="נסה שוב בעוד כמה דקות"
  actionLabel="נסה שוב"
  onAction={() => window.location.reload()}
/>
*/
