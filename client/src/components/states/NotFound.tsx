// components/states/NotFound.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Home, Search, AlertCircle } from "lucide-react";
import Link from "next/link";

type NotFoundVariant = "page" | "car" | "user" | "general";

interface NotFoundProps {
  variant?: NotFoundVariant;
  title?: string;
  description?: string;
  showHomeButton?: boolean;
  showSearchButton?: boolean;
  customActions?: React.ReactNode;
  className?: string;
}

const notFoundConfig = {
  page: {
    title: "העמוד לא נמצא",
    description:
      "העמוד שחיפשת לא קיים או הועבר. בדוק את הכתובת או חזור לדף הבית.",
    homeUrl: "/",
    searchUrl: "/buyer/cars",
  },
  car: {
    title: "הרכב לא נמצא",
    description:
      "הרכב שחיפשת לא קיים עוד או הוסר מהמערכת. ייתכן שהוא כבר נמכר.",
    homeUrl: "/buyer/cars",
    searchUrl: "/buyer/cars",
  },
  user: {
    title: "המשתמש לא נמצא",
    description: "המשתמש שחיפשת לא קיים או שהפרופיל שלו הוסר.",
    homeUrl: "/",
    searchUrl: "/buyer/cars",
  },
  general: {
    title: "משהו לא נמצא",
    description: "המידע שחיפשת לא זמין כרגע.",
    homeUrl: "/",
    searchUrl: "/buyer/cars",
  },
};

export default function NotFound({
  variant = "page",
  title,
  description,
  showHomeButton = true,
  showSearchButton = true,
  customActions,
  className = "",
}: NotFoundProps) {
  const config = notFoundConfig[variant];

  const displayTitle = title || config.title;
  const displayDescription = description || config.description;

  return (
    <div
      className={`flex items-center justify-center min-h-[60vh] p-4 ${className}`}
    >
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
          {/* 404 Icon */}
          <div className="mb-6 p-4 rounded-full bg-red-50">
            <AlertCircle size={48} className="text-red-500" />
          </div>

          {/* Error Code */}
          <div className="text-6xl font-bold text-gray-300 mb-4">404</div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {displayTitle}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {displayDescription}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {showHomeButton && (
              <Button asChild className="flex items-center gap-2">
                <Link href={config.homeUrl}>
                  <Home size={16} />
                  {variant === "car" ? "כל הרכבים" : "דף הבית"}
                </Link>
              </Button>
            )}

            {showSearchButton && variant !== "car" && (
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link href={config.searchUrl}>
                  <Search size={16} />
                  חיפוש רכבים
                </Link>
              </Button>
            )}
          </div>

          {/* Custom Actions */}
          {customActions && <div className="mt-4 w-full">{customActions}</div>}

          {/* Additional Help */}
          <div className="mt-8 text-sm text-gray-500">
            <p>
              זקוק לעזרה?{" "}
              <Link
                href="/info/contact"
                className="text-blue-600 hover:text-blue-800 underline"
              >
                צור קשר
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Specialized Components for common use cases
export function CarNotFound({ carId }: { carId?: string }) {
  return (
    <NotFound
      variant="car"
      description={
        carId
          ? `הרכב עם מזהה ${carId} לא נמצא או הוסר מהמערכת.`
          : "הרכב שחיפשת לא קיים עוד או הוסר מהמערכת. ייתכן שכבר נמכר."
      }
      customActions={
        <Button asChild variant="ghost" className="flex items-center gap-2">
          <Link href="/buyer/cars">
            רכבים דומים
            <ArrowRight size={16} />
          </Link>
        </Button>
      }
    />
  );
}

export function PageNotFound() {
  return <NotFound variant="page" />;
}

// Usage Examples:
/*
// Basic 404 page
<NotFound />

// Car not found
<NotFound variant="car" />
<CarNotFound carId="123" />

// Custom not found
<NotFound 
  variant="general"
  title="הזמנה לא נמצאה"
  description="ההזמנה שחיפשת לא קיימת במערכת"
  showSearchButton={false}
  customActions={
    <Button onClick={() => router.back()}>
      חזור אחורה
    </Button>
  }
/>

// In pages/404.tsx
export default function Custom404() {
  return <PageNotFound />;
}
*/
