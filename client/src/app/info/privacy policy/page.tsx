"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Shield,
  Eye,
  Lock,
  UserCheck,
  Database,
  Globe,
  Mail,
  Phone,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  Download,
  Share2,
  Calendar,
  Users,
  Baby,
  Gavel,
} from "lucide-react";

const PrivacyPolicyPage = () => {
  const router = useRouter();

  const dataTypes = [
    {
      icon: UserCheck,
      title: "פרטים אישיים",
      items: ["שם מלא", "כתובת אימייל", "מספר טלפון", "תמונת פרופיל"],
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Settings,
      title: "מידע עסקי (סוחרים)",
      items: ["שם עסק", "מספר רישיון", "כתובת", "תיאור עסק"],
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Database,
      title: "פעילות באתר",
      items: ["בקשות רכב", "פניות", "הודעות", "חיפושים"],
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Globe,
      title: "מידע טכני",
      items: ["כתובת IP", "סוג דפדפן", "מערכת הפעלה", "עוגיות"],
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const rights = [
    {
      icon: Eye,
      title: "זכות צפייה",
      description: "לראות את כל המידע השמור עליכם במערכת",
    },
    {
      icon: FileText,
      title: "זכות תיקון",
      description: "לעדכן או לתקן מידע שגוי או לא מעודכן",
    },
    {
      icon: Trash2,
      title: "זכות מחיקה",
      description: "לבקש מחיקת החשבון והמידע באופן מלא",
    },
    {
      icon: Download,
      title: "זכות העברה",
      description: "לקבל עותק של המידע בפורמט נגיש",
    },
  ];

  const securityMeasures = [
    {
      icon: Lock,
      title: "הצפנה מלאה",
      description: "כל התקשורת מוצפנת באמצעות SSL/TLS",
    },
    {
      icon: Shield,
      title: "אימות מאובטח",
      description: "מערכת JWT tokens עם הצפנת סיסמאות",
    },
    {
      icon: Database,
      title: "שרתים מוגנים",
      description: "AWS עם הגנות רב-שכבתיות וגיבויים",
    },
    {
      icon: CheckCircle,
      title: "עדכוני אבטחה",
      description: "עדכון מערכות באופן קבוע ומתמיד",
    },
  ];

  const contactMethods = [
    {
      icon: Mail,
      title: "אימייל פרטיות",
      value: "privacy@autix.co.il",
      description: "לפניות בנושאי פרטיות",
    },
    {
      icon: Phone,
      title: "טלפון",
      value: "03-1234567",
      description: "תמיכה טלפונית",
    },
    {
      icon: Globe,
      title: "טופס יצירת קשר",
      value: "דרך האתר",
      description: "טופס מאובטח באתר",
    },
  ];

  const retentionPeriods = [
    {
      icon: Users,
      title: "חשבונות פעילים",
      period: "כל עוד החשבון פעיל",
      description: "מידע נשמר לצורך מתן השירות",
    },
    {
      icon: Clock,
      title: "חשבונות מבוטלים",
      period: "עד 7 שנים",
      description: "לצרכי ארכיון וחוק",
    },
    {
      icon: Database,
      title: "נתוני שימוש",
      period: "עד 3 שנים",
      description: "לצרכי ניתוח ושיפור השירות",
    },
    {
      icon: Mail,
      title: "הודעות ופניות",
      period: "עד שנתיים",
      description: "לצרכי תמיכה ושירות",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
              חזרה
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              מדיניות פרטיות
            </h1>
            <p className="text-xl text-gray-600">
              אנחנו מתחייבים להגן על פרטיותכם ולשמור על המידע שלכם
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                עודכן לאחרונה: 1 ביוני 2025
              </span>
              <Badge variant="outline">גרסה 1.0</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600 text-white rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ברוכים הבאים לפלטפורמת AUTIX
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  אנחנו מתחייבים להגן על פרטיותכם ולשמור על המידע האישי שלכם.
                  מדיניות פרטיות זו מסבירה כיצד אנחנו אוספים, משתמשים ומגינים על
                  המידע שלכם בפלטפורמת AUTIX.
                </p>
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <Info className="h-4 w-4" />
                  <span>השימוש באתר מהווה הסכמה לתנאי מדיניות זו</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Collection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">איסוף מידע</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dataTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    {type.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Usage */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-blue-600" />
              שימוש במידע
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">מתן השירות</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• יצירה וניהול חשבון משתמש</li>
                  <li>• הצגת רכבים רלוונטיים</li>
                  <li>• חיבור בין קונים לסוחרים</li>
                  <li>• עיבוד בקשות רכב ופניות</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  שיפור השירות
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• ניתוח שימוש והתנהגות</li>
                  <li>• שיפור ממשק המשתמש</li>
                  <li>• פיתוח תכונות חדשות</li>
                  <li>• מניעת הונאות ואבטחה</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">תקשורת</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• התראות על פעילות</li>
                  <li>• עדכונים על השירות</li>
                  <li>• מידע שיווקי (בהסכמה)</li>
                  <li>• תמיכה טכנית</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            הזכויות שלכם
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rights.map((right, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <right.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {right.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {right.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">אבטחת מידע</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {securityMeasures.map((measure, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                      <measure.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {measure.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {measure.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Data Retention */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">שמירת מידע</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {retentionPeriods.map((retention, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <retention.icon className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {retention.title}
                  </h3>
                  <div className="text-lg font-bold text-purple-600 mb-2">
                    {retention.period}
                  </div>
                  <p className="text-xs text-gray-600">
                    {retention.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Minors */}
        <Card className="mb-12 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Baby className="h-5 w-5" />
              מדיניות קטינים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">
                    גיל מינימום
                  </h3>
                  <p className="text-orange-800 text-sm">
                    השירות מיועד למשתמשים בני 18 ומעלה. משתמשים בני 16-17 נדרשים
                    לאישור הורי.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-orange-900 mb-2">
                    הגנה מיוחדת
                  </h3>
                  <p className="text-orange-800 text-sm">
                    אנחנו נוקטים בזהירות מיוחדת עם מידע של משתמשים צעירים
                    ומבטיחים הגנה מוגברת.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">יצירת קשר</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactMethods.map((contact, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <contact.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {contact.title}
                  </h3>
                  <div className="text-blue-600 font-medium mb-2">
                    {contact.value}
                  </div>
                  <p className="text-sm text-gray-600">{contact.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Notice */}
        <Card className="bg-gray-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Gavel className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  הצהרה משפטית
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  מדיניות פרטיות זו כתובה בשפה ברורה ונגישה. אנחנו מתחייבים
                  לשקיפות מלאה ולהגנה על פרטיותכם בהתאם לתקני האבטחה הגבוהים
                  ביותר ולחוק הגנת הפרטיות תשמ"א-1981.
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>עדכון אחרון: 1 ביוני 2025</span>
                  <span>•</span>
                  <span>גרסה 1.0</span>
                  <span>•</span>
                  <span>צוות AUTIX</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="space-y-4">
            <p className="text-gray-600">
              יש לכם שאלות נוספות על מדיניות הפרטיות שלנו?
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => router.push("/info/contact")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mail className="h-4 w-4 ml-2" />
                צרו קשר
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/info/terms%20of%20use")}
              >
                <FileText className="h-4 w-4 ml-2" />
                תנאי שימוש
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
