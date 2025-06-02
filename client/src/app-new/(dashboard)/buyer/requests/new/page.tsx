// app-new/(dashboard)/buyer/requests/new/page.tsx - New Car Request Page for Buyers
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Car as CarIcon,
  Heart,
  Search,
  Users,
  CheckCircle,
  Info,
  Calendar,
  DollarSign,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import RequestForm from "@/components/forms/RequestForm";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

// Benefits data
const BENEFITS = [
  {
    icon: <Search className="w-6 h-6 text-blue-600" />,
    title: "חיפוש מותאם אישית",
    description: "סוחרים יחפשו עבורך רכבים שמתאימים בדיוק לדרישות שלך",
  },
  {
    icon: <Users className="w-6 h-6 text-green-600" />,
    title: "הצעות מרובות",
    description: "קבל הצעות ממספר סוחרים והשווה מחירים בקלות",
  },
  {
    icon: <Heart className="w-6 h-6 text-red-600" />,
    title: "חסכון בזמן",
    description: "במקום לחפש בעצמך, הסוחרים יפנו אליך עם הצעות מתאימות",
  },
  {
    icon: <CheckCircle className="w-6 h-6 text-purple-600" />,
    title: "התאמה מושלמת",
    description: "רק רכבים שעונים על הקריטריונים שלך יוצעו לך",
  },
];

// Steps data
const STEPS = [
  {
    number: "1",
    title: "מלא פרטי בקשה",
    description: "תאר את הרכב שאתה מחפש - יצרן, דגם, שנה, תקציב ודרישות נוספות",
    color: "bg-blue-100 text-blue-800",
  },
  {
    number: "2",
    title: "קבל הצעות",
    description: "סוחרי רכב יראו את הבקשה שלך ויפנו אליך עם הצעות מתאימות",
    color: "bg-green-100 text-green-800",
  },
  {
    number: "3",
    title: "השווה ובחר",
    description: "השווה בין ההצעות השונות ובחר את הרכב המושלם עבורך",
    color: "bg-purple-100 text-purple-800",
  },
];

// Examples data
const EXAMPLES = [
  {
    title: "חיפוש מוקד",
    example: "טויוטה קורולה, 2018-2021, עד 120,000₪, אוטומטי, קילומטראז' נמוך",
  },
  {
    title: "חיפוש כללי",
    example: "רכב משפחתי, 2017 ומעלה, עד 180,000₪, חסכוני בדלק, מקום מטען גדול",
  },
  {
    title: "חיפוש פרימיום",
    example: "BMW סדרה 3, 2019-2022, עד 300,000₪, ציוד מלא, צבע כהה",
  },
];

export default function NewCarRequestPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("נדרשת התחברות", {
        description: "אנא התחבר כדי ליצור בקשת רכב",
      });
      router.push("/login");
    }
  }, [user, authLoading, router]);

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">טוען...</p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

  const handleSuccess = () => {
    toast.success("בקשת הרכב נוצרה בהצלחה!", {
      description: "סוחרים יוכלו לראות את הבקשה שלך ולפנות אליך עם הצעות",
    });
    router.push("/buyer/requests");
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-600">
        <Link href="/buyer/requests" className="hover:text-blue-600">
          הבקשות שלי
        </Link>
        <ChevronLeft className="w-4 h-4" />
        <span className="text-gray-900">בקשה חדשה</span>
      </nav>

      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="bg-blue-100 p-3 rounded-full">
            <CarIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          יצירת בקשת רכב חדשה
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          תאר את הרכב החלומות שלך ואנחנו נעזור לך למצוא אותו. סוחרי רכב מקצועיים
          יפנו אליך עם הצעות מותאמות אישית.
        </p>
      </div>

      {/* Benefits Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            למה לפרסם בקשת רכב?
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
          <RequestForm onSuccess={handleSuccess} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* How it Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                איך זה עובד?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {STEPS.map((step) => (
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

          {/* Examples */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CarIcon className="w-5 h-5 text-green-600" />
                דוגמאות לבקשות
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {EXAMPLES.map((example, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">
                    {example.title}
                  </h4>
                  <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    "{example.example}"
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="text-2xl font-bold text-green-700">95%</div>
                <p className="text-sm text-green-600">
                  מהמשתמשים מוצאים רכב מתאים תוך 7 ימים
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="bg-yellow-50 border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm text-yellow-800">
                💡 טיפים להצלחה
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• תאר בפירוט את הרכב שאתה מחפש</li>
                <li>• ציין תקציב ריאלי למקסימום הצעות</li>
                <li>• הזכר ציוד חשוב (אוטומטי, מולטימדיה וכו')</li>
                <li>• ציין העדפות צבע ואזור גיאוגרפי</li>
                <li>• הוסף פרטי יצירת קשר נוספים אם רלוונטי</li>
              </ul>
            </CardContent>
          </Card>

          {/* Alternative Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">פעולות נוספות</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/buyer/cars" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <Search className="w-4 h-4 mr-2" />
                  חפש רכבים קיימים
                </Button>
              </Link>

              <Link href="/buyer/requests" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  חזור לבקשות שלי
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
              <Calendar className="w-8 h-8 text-blue-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">זמין 24/7</h3>
              <p className="text-sm text-gray-600">
                הבקשה שלך פעילה מיד ומזמינה סוחרים לפנות אליך
              </p>
            </div>

            <div className="space-y-2">
              <DollarSign className="w-8 h-8 text-green-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">ללא עלות</h3>
              <p className="text-sm text-gray-600">
                פרסום בקשות רכב הוא שירות חינמי לחלוטין
              </p>
            </div>

            <div className="space-y-2">
              <Settings className="w-8 h-8 text-purple-600 mx-auto" />
              <h3 className="font-semibold text-gray-900">שליטה מלאה</h3>
              <p className="text-sm text-gray-600">
                תוכל לערוך או לסגור את הבקשה בכל עת
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
