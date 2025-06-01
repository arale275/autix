"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  FileText,
  UserCheck,
  Shield,
  AlertTriangle,
  Car,
  Users,
  Handshake,
  Ban,
  Scale,
  Clock,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Info,
  Calendar,
  Gavel,
  CreditCard,
  Eye,
  MessageSquare,
  Star,
  Flag,
  Lock,
  Globe,
} from "lucide-react";

const TermsOfUsePage = () => {
  const router = useRouter();

  const userTypes = [
    {
      icon: Car,
      title: "קונים",
      description: "משתמשים המחפשים לרכוש רכב",
      responsibilities: [
        "מסירת פרטים נכונים ומעודכנים",
        "יחס מכבד לסוחרים",
        "בדיקת רכבים לפני רכישה",
        "תשלום עמלות במועד (אם רלוונטי)",
      ],
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Users,
      title: "סוחרים",
      description: "משתמשים המוכרים רכבים (יחיד או עסק)",
      responsibilities: [
        "רישיונות ותעודות תקפים",
        "מידע מדויק על הרכבים",
        "מענה מהיר לפניות קונים",
        "שמירה על מוניטין מקצועי",
      ],
      color: "bg-green-50 text-green-600",
    },
  ];

  const allowedActivities = [
    {
      icon: CheckCircle,
      title: "רישום חשבון משתמש תקין",
      description: "עם פרטים אמיתיים ומעודכנים",
    },
    {
      icon: Car,
      title: "פרסום רכבים למכירה (סוחרים)",
      description: "עם מידע מדויק ותמונות אמיתיות",
    },
    {
      icon: MessageSquare,
      title: "יצירת קשר בין משתמשים",
      description: "לצורך עסקאות רכב בלבד",
    },
    {
      icon: Star,
      title: "כתיבת חוות דעת והערכות",
      description: "על בסיס חוויה אמיתית בלבד",
    },
  ];

  const prohibitedActivities = [
    {
      icon: XCircle,
      title: "מידע כוזב או מטעה",
      description: "איסור על פרטים שקריים או מזויפים",
    },
    {
      icon: Ban,
      title: "הטרדה או התנכלות",
      description: "איסור על הודעות פוגעניות או חוזרות",
    },
    {
      icon: AlertTriangle,
      title: "עסקאות חשודות",
      description: "איסור על הונאות או מכירת רכבים גנובים",
    },
    {
      icon: Flag,
      title: "שימוש לא מורשה",
      description: "איסור על גישה לחשבונות אחרים או מעקפי מערכת",
    },
  ];

  const responsibilities = [
    {
      icon: UserCheck,
      title: "זיהוי אמיתי",
      description: "חובה למסור זהות אמיתית ופרטים נכונים",
    },
    {
      icon: Shield,
      title: "אבטחת חשבון",
      description: "שמירה על סיסמה חזקה וסודיות הפרטים",
    },
    {
      icon: Handshake,
      title: "יחס מכבד",
      description: "התנהגות נאותה כלפי משתמשים אחרים",
    },
    {
      icon: Eye,
      title: "בדיקת מידע",
      description: "אימות עצמאי של פרטי רכבים לפני רכישה",
    },
  ];

  const paymentTerms = [
    {
      icon: CreditCard,
      title: "עמלות פלטפורמה",
      description: "עמלה קטנה על השלמת עסקאות (יעודכן בעתיד)",
      status: "בתכנון",
    },
    {
      icon: Clock,
      title: "תנאי תשלום",
      description: "תשלום במועד לפי התנאים שיפורסמו",
      status: "בתכנון",
    },
    {
      icon: Shield,
      title: "החזר כספי",
      description: "מדיניות החזר תפורסם עם השקת התשלומים",
      status: "בתכנון",
    },
  ];

  const supportChannels = [
    {
      icon: Mail,
      title: "אימייל תמיכה",
      value: "support@autix.co.il",
      responseTime: "עד 24 שעות",
    },
    {
      icon: Phone,
      title: "טלפון",
      value: "03-1234567",
      responseTime: "שעות פעילות",
    },
    {
      icon: MessageSquare,
      title: "צ'אט באתר",
      value: "בקרוב",
      responseTime: "זמן אמת",
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
              תנאי שימוש
            </h1>
            <p className="text-xl text-gray-600">
              הכללים וההנחיות לשימוש בפלטפורמת AUTIX
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
        <Card className="mb-8 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-600 text-white rounded-lg">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  ברוכים הבאים לפלטפורמת AUTIX
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  תנאי שימוש אלה מסדירים את השימוש שלכם בשירותי AUTIX, הפלטפורמה
                  הדיגיטלית לחיבור בין קונים וסוחרי רכב. על ידי גישה לאתר או
                  שימוש בו, אתם מסכימים לתנאים אלה במלואם.
                </p>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <Info className="h-4 w-4" />
                  <span>קריאת התנאים בעיון מומלצת לפני תחילת השימוש</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            סוגי משתמשים ואחריות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <type.icon className="h-5 w-5" />
                    </div>
                    {type.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </CardHeader>
                <CardContent>
                  <h4 className="font-medium text-gray-900 mb-3">
                    אחריות המשתמש:
                  </h4>
                  <ul className="space-y-2">
                    {type.responsibilities.map((responsibility, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2 text-sm text-gray-600"
                      >
                        <CheckCircle className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                        {responsibility}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* User Responsibilities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            אחריות כללית של המשתמש
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {responsibilities.map((responsibility, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <responsibility.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {responsibility.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {responsibility.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Allowed Activities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            שימושים מותרים
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allowedActivities.map((activity, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow border-green-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Prohibited Activities */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            שימושים אסורים
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prohibitedActivities.map((activity, index) => (
              <Card
                key={index}
                className="hover:shadow-md transition-shadow border-red-200"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                      <activity.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {activity.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Terms */}
        <Card className="mb-12 bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <CreditCard className="h-5 w-5" />
              תנאי תשלום (בתכנון)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paymentTerms.map((term, index) => (
                <div key={index} className="text-center">
                  <term.icon className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-orange-900 mb-2">
                    {term.title}
                  </h3>
                  <p className="text-sm text-orange-800 mb-2">
                    {term.description}
                  </p>
                  <Badge
                    variant="outline"
                    className="border-orange-300 text-orange-700"
                  >
                    {term.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-orange-100 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-orange-600 mt-0.5" />
                <p className="text-sm text-orange-800">
                  <strong>הודעה חשובה:</strong> כרגע השירות חינמי לחלוטין.
                  מדיניות תשלום ועמלות תפורסם מראש עם הודעה של 30 יום לפני
                  הכנסתה לתוקף.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liability */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-purple-600" />
              אחריות והגבלות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  אחריות AUTIX
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    מתן פלטפורמה יציבה ומאובטחת
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    אימות בסיסי של משתמשים ורכבים
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    תמיכה טכנית ושירות לקוחות
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  הגבלות אחריות
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    AUTIX משמשת כפלטפורמה בלבד - העסקאות הן בין המשתמשים
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    איננו אחראים למצב הרכבים או לנכונות המידע המסופק
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                    ההחלטה הסופית על רכישה/מכירה היא באחריות המשתמש
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>המלצה:</strong> תמיד בדקו את הרכב באופן עצמאי, קראו את
                  כל המסמכים ושקלו להיעזר במומחה לפני השלמת עסקה.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Termination */}
        <Card className="mb-12 border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Ban className="h-5 w-5" />
              ביטול חשבון והשעיה
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  סיבות להשעיה
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• הפרת תנאי השימוש</li>
                  <li>• מידע כוזב או מטעה</li>
                  <li>• פעילות חשודה או בלתי חוקית</li>
                  <li>• הטרדה של משתמשים אחרים</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">
                  תהליך הערעור
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  אם חשבונכם הושעה, תוכלו להגיש ערעור תוך 30 יום ל:
                </p>
                <p className="text-sm font-medium text-blue-600">
                  appeals@autix.co.il
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            תמיכה ושירות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportChannels.map((channel, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <channel.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {channel.title}
                  </h3>
                  <div className="text-blue-600 font-medium mb-2">
                    {channel.value}
                  </div>
                  <p className="text-sm text-gray-600">
                    זמן תגובה: {channel.responseTime}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Changes to Terms */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              שינויים בתנאים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    הודעה מראש
                  </h3>
                  <p className="text-sm text-gray-600">
                    שינויים מהותיים יובאו לידיעתכם 30 יום מראש באמצעות אימייל
                    והודעה באתר.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    תוקף השינויים
                  </h3>
                  <p className="text-sm text-gray-600">
                    המשך השימוש באתר לאחר השינוי יהווה הסכמה לתנאים החדשים.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card className="mb-12 bg-gray-100">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Gavel className="h-6 w-6 text-gray-600 mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  דין חל וסמכות שיפוט
                </h3>
                <p className="text-sm text-gray-700 leading-relaxed mb-4">
                  תנאי שימוש אלה כפופים לדיני מדינת ישראל. כל מחלוקת תידון בבתי
                  המשפט המוסמכים בתל אביב-יפו, אלא אם יוסכם אחרת על גישור או
                  בוררות.
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
        <div className="text-center">
          <div className="space-y-4">
            <p className="text-gray-600">יש לכם שאלות נוספות על תנאי השימוש?</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => router.push("/info/contact")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Mail className="h-4 w-4 ml-2" />
                צרו קשר
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/info/privacy%20policy")}
              >
                <Shield className="h-4 w-4 ml-2" />
                מדיניות פרטיות
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUsePage;
