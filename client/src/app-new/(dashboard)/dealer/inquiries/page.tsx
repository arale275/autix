// app-new/(dashboard)/dealer/cars/new/page.tsx - New Car Page for Dealers
"use client";

import React from "react";
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
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CarForm from "@/components/forms/CarForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  {
    icon: <Star className="w-6 h-6 text-yellow-600" />,
    title: "כלים מתקדמים",
    description: "מערכת ניהול מלאי, סטטיסטיקות ודוחות למעקב אחר הביצועים",
  },
];

// Tips data
const TIPS = [
  {
    title: "תמונות איכותיות",
    description: "הוסף לפחות 5 תמונות באיכות גבוהה מזוויות שונות",
    priority: "גבוהה",
    color: "text-red-600",
  },
  {
    title: "תיאור מפורט",
    description: "תאר את מצב הרכב, שירותים ואביזרים נוספים",
    priority: "גבוהה",
    color: "text-red-600",
  },
  {
    title: "מחיר תחרותי",
    description: "בדוק מחירים דומים בשוק ותמחר בהתאם",
    priority: "בינונית",
    color: "text-yellow-600",
  },
  {
    title: "פרטי יצירת קשר",
    description: "וודא שפרטי הקשר שלך מעודכנים ונגישים",
    priority: "בינונית",
    color: "text-yellow-600",
  },
  {
    title: "עדכונים שוטפים",
    description: "עדכן את המלאי באופן קבוע ומחק רכבים שנמכרו",
    priority: "נמוכה",
    color: "text-green-600",
  },
];

// Process steps
const PROCESS_STEPS = [
  {
    number: "1",
    title: "מלא פרטי הרכב",
    description: "יצרן, דגם, שנה, מחיר וכל הפרטים הטכניים",
    color: "bg-blue-100 text-blue-800",
  },
  {
    number: "2",
    title: "הוסף תמונות",
    description: "העלה תמונות איכותיות של הרכב מזוויות שונות",
    color: "bg-green-100 text-green-800",
  },
  {
    number: "3",
    title: "כתוב תיאור",
    description: "תאר את הרכב, מצבו, שירותים וכל מידע רלוונטי",
    color: "bg-purple-100 text-purple-800",
  },
  {
    number: "4",
    title: "פרסם והמתן",
    description: "הרכב יהיה זמין מיד וקונים יוכלו ליצור איתך קשר",
    color: "bg-yellow-100 text-yellow-800",
  },
];

export default function NewCarPage() {
  const router = useRouter();
  const { user } = useAuth();

  const handleSuccess = () => {
    toast.success("הרכב נוסף בהצלחה!", {
      description: "הרכב זמין כעת למכירה",
    });
    router.push("/dealer/cars");
  };

  const handleCancel = () => {
    if (window.confirm("האם אתה בטוח שברצונך לבטל? השינויים לא יישמרו.")) {
      router.push("/dealer/cars");
    }
  };

  if (!user || user.userType !== "dealer") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <div className="text-red-600 mb-2">גישה מוגבלת</div>
            <p className="text-red-500 mb-4">
              רק סוחרי רכב יכולים להוסיף רכבים חדשים
            </p>
            <Link href="/dealer/home">
              <Button>חזור לדף הבית</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/dealer/cars" className="hover:text-blue-600">
          המלאי שלי
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">הוספת רכב חדש</span>
      </nav>

      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-purple-100 p-3 rounded-full">
            <CarIcon className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          הוספת רכב חדש למלאי
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          פרסם את הרכב שלך ותן לקונים איכותיים למצוא אותו בקלות. המערכת שלנו
          מבטיחה חשיפה מקסימלית ומכירה מהירה.
        </p>
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            למה לפרסם אצלנו?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BENEFITS.map((benefit, index) => (
              <div key={index} className="text-center space-y-3">
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
        {/* Form Column */}
        <div className="lg:col-span-2">
          <CarForm onSuccess={handleSuccess} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Process Steps */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                תהליך הפרסום
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {PROCESS_STEPS.map((step) => (
                <div key={step.number} className="flex gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step.color}`}
                  >
                    {step.number}
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

          {/* Tips for Success */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-600" />
                טיפים להצלחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {TIPS.map((tip, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {tip.title}
                    </h4>
                    <Badge
                      variant="outline"
                      className={`text-xs ${tip.color} border-current`}
                    >
                      {tip.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{tip.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <Zap className="w-8 h-8 text-green-600 mx-auto" />
                <div className="text-2xl font-bold text-green-700">24 שעות</div>
                <p className="text-sm text-green-600">
                  זמן ממוצע עד לפנייה ראשונה מקונה
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alternative Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">פעולות נוספות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dealer/cars" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  חזור למלאי
                </Button>
              </Link>

              <Link href="/dealer/home" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  לוח בקרה
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Info Section */}
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">פרסום מיידי</h3>
              <p className="text-sm text-gray-600">
                הרכב שלך יהיה זמין לצפייה מיד לאחר הפרסום
              </p>
            </div>

            <div className="space-y-2">
              <Users className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">קהל מתעניין</h3>
              <p className="text-sm text-gray-600">
                המשתמשים שלנו מחפשים באופן פעיל רכבים לקנייה
              </p>
            </div>

            <div className="space-y-2">
              <Star className="w-8 h-8 text-yellow-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">איכות מובטחת</h3>
              <p className="text-sm text-gray-600">
                אנחנו דואגים לאיכות הפרסומים ולחוויית משתמש מעולה
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
