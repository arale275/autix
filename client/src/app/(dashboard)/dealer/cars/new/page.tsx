"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Car as CarIcon,
  CheckCircle,
  TrendingUp,
  Users,
  Eye,
  Star,
  Info,
  Zap,
  Target,
  AlertTriangle,
  Save,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import CarForm from "@/components/forms/CarForm";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { carEvents } from "@/lib/events/carEvents";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useDealerRoute } from "@/hooks/auth/useProtectedRoute";

// Benefits data
const BENEFITS = [
  {
    icon: <Eye className="w-6 h-6 text-blue-600" />,
    title: "חשיפה מקסימלית",
    description: "הרכב שלך יוצג לאלפי קונים פוטנציאליים בכל הארץ",
  },
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: "קונים איכותיים",
    description: "פלטפורמה המתמחה ברכבים משמעותה קונים רציניים ומתעניינים",
  },
  {
    icon: <TrendingUp className="w-6 h-6 text-purple-600" />,
    title: "מכירה מהירה",
    description: "רכבים איכותיים נמכרים בממוצע תוך 14 ימים בפלטפורמה",
  },
];

// Enhanced tips with priorities
const TIPS = [
  {
    title: "תמונות איכותיות",
    description: "הוסף לפחות 5 תמונות באיכות גבוהה מזוויות שונות",
    priority: "גבוהה",
    color: "text-red-600",
    icon: <Star className="w-4 h-4" />,
  },
  {
    title: "תיאור מפורט",
    description: "תאר את מצב הרכב, שירותים ואביזרים נוספים",
    priority: "גבוהה",
    color: "text-red-600",
    icon: <Info className="w-4 h-4" />,
  },
  {
    title: "מחיר תחרותי",
    description: "בדוק מחירים דומים בשוק ותמחר בהתאם",
    priority: "בינונית",
    color: "text-yellow-600",
    icon: <Target className="w-4 h-4" />,
  },
  {
    title: "פרטי יצירת קשר",
    description: "וודא שפרטי הקשר שלך מעודכנים ונגישים",
    priority: "בינונית",
    color: "text-yellow-600",
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    title: "עדכונים שוטפים",
    description: "עדכן את המלאי באופן קבוע ומחק רכבים שנמכרו",
    priority: "נמוכה",
    color: "text-green-600",
    icon: <RefreshCw className="w-4 h-4" />,
  },
];

// Enhanced process steps
const PROCESS_STEPS = [
  {
    number: "1",
    title: "מלא פרטי הרכב",
    description: "יצרן, דגם, שנה, מחיר וכל הפרטים הטכניים",
    color: "bg-blue-100 text-blue-800",
    icon: <CarIcon className="w-5 h-5" />,
  },
  {
    number: "2",
    title: "כתוב תיאור",
    description: "תאר את הרכב, מצבו, שירותים וכל מידע רלוונטי",
    color: "bg-purple-100 text-purple-800",
    icon: <Info className="w-5 h-5" />,
  },
  {
    number: "3",
    title: "הוסף תמונות",
    description: "העלה תמונות איכותיות של הרכב מזוויות שונות",
    color: "bg-green-100 text-green-800",
    icon: <Star className="w-5 h-5" />,
  },
  {
    number: "4",
    title: "פרסם והמתן",
    description:
      "המודעה מתפרסמת באופן מיידי וקונים פוטנציאליים יכולים להשאיר לך פניות",
    color: "bg-yellow-100 text-yellow-800",
    icon: <Zap className="w-5 h-5" />,
  },
];

export default function NewCarPage() {
  const router = useRouter();

  // Enhanced loading states
  const [isPublishing, setIsPublishing] = useState(false);
  const [lastAction, setLastAction] = useState<string>("");

  // Error handling
  const [error, setError] = useState<string>("");

  // Success handling with real-time events
  const handleSuccess = (newCarId?: number) => {
    setIsPublishing(false);
    setLastAction("פרסום מוצלח");

    // ✅ Enhanced toast with description
    toast.success("הרכב נוסף בהצלחה!", {
      description:
        "הרכב זמין כעת למכירה ויוצג לקונים פוטנציאליים בכל הפלטפורמה",
    });

    // ✅ Real-time events for other tabs/pages
    if (newCarId) {
      carEvents.emitCarListUpdate("create", {
        carId: newCarId,
        action: "new_car_added",
        timestamp: Date.now(),
      });
    }

    // Navigation after short delay to show success
    setTimeout(() => {
      router.push("/dealer/cars");
    }, 1500);
  };

  // Enhanced cancel with confirmation
  const handleCancel = () => {
    if (isPublishing) {
      toast.warning("לא ניתן לבטל בזמן פרסום");
      return;
    }

    if (window.confirm("האם אתה בטוח שברצונך לבטל? השינויים לא יישמרו.")) {
      router.push("/dealer/cars");
    }
  };

  // Enhanced error handling
  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsPublishing(false);
    setLastAction("שגיאה בפרסום");

    toast.error("שגיאה בפרסום הרכב", {
      description: errorMessage || "אירעה שגיאה לא צפויה. אנא נסה שנית.",
    });
  };

  // Clear errors when user starts typing again
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Authorization check with enhanced error
  const { hasAccess, isLoading: authLoading } = useDealerRoute();

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    );
  }

  if (!hasAccess) {
    return null; // useDealerRoute כבר טיפל בredirect
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Enhanced Page Header with status */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div
            className={`p-3 rounded-full transition-colors ${
              isPublishing
                ? "bg-blue-100 animate-pulse"
                : error
                ? "bg-red-100"
                : "bg-purple-100"
            }`}
          >
            <CarIcon
              className={`w-8 h-8 ${
                isPublishing
                  ? "text-blue-600"
                  : error
                  ? "text-red-600"
                  : "text-purple-600"
              }`}
            />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900">הוספת רכב למכירה</h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          פרסם את הרכב שלך ותן לקונים איכותיים למצוא אותו בקלות. המערכת שלנו
          מבטיחה חשיפה מקסימלית ומכירה מהירה.
        </p>

        {/* Enhanced status indicators */}
        {isPublishing && (
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <LoadingSpinner size="sm" />
            <span className="text-sm font-medium">מפרסם רכב...</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {lastAction && !isPublishing && !error && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-green-600 text-sm">
              <CheckCircle className="w-4 h-4" />
              <span>{lastAction}</span>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Benefits Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div
                key={index}
                className="text-center space-y-3 p-4 bg-white/50 rounded-lg border border-white/20"
              >
                <div className="flex justify-center">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Form Column */}
        <div className="lg:col-span-2">
          <ErrorBoundary
            onError={(error, errorInfo) => {
              console.error("Car form error:", error);
              // כאן תוכל לשלוח לשירות reporting
            }}
          >
            <CarForm onSuccess={handleSuccess} />
          </ErrorBoundary>
        </div>

        {/* Enhanced Sidebar */}
        <div className="space-y-6">
          {/* Enhanced Process Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                תהליך הפרסום
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.number}
                  className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${step.color}`}
                  >
                    {step.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Tips for Success */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                טיפים להצלחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {TIPS.map((tip, index) => (
                <div
                  key={index}
                  className="space-y-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {tip.icon}
                      <h4 className="font-semibold text-gray-900 text-sm">
                        {tip.title}
                      </h4>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${tip.color} border-current`}
                    >
                      {tip.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 pr-6">
                    {tip.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Enhanced Quick Stats */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-8 h-8 text-green-600" />
                  <div className="text-2xl font-bold text-green-700">
                    24 שעות
                  </div>
                </div>
                <p className="text-sm text-green-600">
                  זמן ממוצע עד לפנייה ראשונה מקונה
                </p>
                <div className="text-xs text-green-500 bg-green-100 rounded-full px-3 py-1">
                  מבוסס על נתוני הפלטפורמה
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Enhanced Bottom Info Section */}
      <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-3 p-4 bg-white/70 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">פרסום מיידי</h3>
              <p className="text-sm text-gray-600">
                הרכב שלך יהיה זמין לצפייה מיד לאחר הפרסום ויוצג בחיפושים
              </p>
            </div>

            <div className="space-y-3 p-4 bg-white/70 rounded-lg">
              <Users className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">קהל מתעניין</h3>
              <p className="text-sm text-gray-600">
                המשתמשים שלנו מחפשים באופן פעיל רכבים לקנייה ומעוניינים ברכישה
              </p>
            </div>

            <div className="space-y-3 p-4 bg-white/70 rounded-lg">
              <Star className="w-8 h-8 text-yellow-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">איכות מובטחת</h3>
              <p className="text-sm text-gray-600">
                אנחנו דואגים לאיכות הפרסומים ולחוויית משתמש מעולה לכל הצדדים
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
