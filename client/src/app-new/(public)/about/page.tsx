"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Users,
  Shield,
  Zap,
  Heart,
  Star,
  CheckCircle,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Globe,
  Target,
  Lightbulb,
  Award,
  TrendingUp,
  Clock,
  Handshake,
} from "lucide-react";

const AboutAutixPage = () => {
  const router = useRouter();

  const stats = [
    {
      icon: Car,
      label: "רכבים במערכת",
      value: "1,500+",
      color: "text-blue-600",
    },
    {
      icon: Users,
      label: "סוחרים פעילים",
      value: "150+",
      color: "text-green-600",
    },
    {
      icon: Handshake,
      label: "עסקאות הושלמו",
      value: "500+",
      color: "text-purple-600",
    },
    {
      icon: Star,
      label: "דירוג ממוצע",
      value: "4.8",
      color: "text-yellow-600",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "אמינות ואבטחה",
      description:
        "כל הסוחרים עוברים אימות ובדיקה מקצועית. המערכת מוגנת ברמה הגבוהה ביותר.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Zap,
      title: "מהיר ויעיל",
      description:
        "חיפוש מתקדם ומערכת התאמה חכמה שחוסכת לך זמן ומאמץ בחיפוש הרכב המושלם.",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Heart,
      title: "שירות אישי",
      description:
        "צוות התמיכה שלנו זמין לעזרה בכל שלב, מהחיפוש הראשוני ועד להשלמת העסקה.",
      color: "bg-red-50 text-red-600",
    },
    {
      icon: Target,
      title: "התאמה מדויקת",
      description:
        "אלגוריתם התאמה מתקדם שמציע לך רק רכבים שמתאימים בדיוק לצרכים ולתקציב שלך.",
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const team = [
    {
      name: "אליה כהן",
      role: "מייסד ומנכ״ל",
      description: "יזם עם ניסיון של 15 שנה בתחום הרכב והטכנולוגיה",
      avatar: "👨‍💼",
    },
    {
      name: "שרה לוי",
      role: "מנהלת טכנולוגיה",
      description: "מפתחת בכירה עם התמחות במערכות חיפוש ובינה מלאכותית",
      avatar: "👩‍💻",
    },
    {
      name: "דוד משה",
      role: "מנהל מכירות",
      description: "מומחה לשוק הרכב הישראלי עם קשרים נרחבים עם סוחרים",
      avatar: "👨‍💼",
    },
  ];

  const timeline = [
    {
      year: "2024",
      title: "השקת הפלטפורמה",
      description: "השקנו את AUTIX עם 50 סוחרים ו-300 רכבים במערכת",
    },
    {
      year: "2024",
      title: "צמיחה מהירה",
      description: "הגענו ל-150 סוחרים ו-1,500 רכבים פעילים במערכת",
    },
    {
      year: "2025",
      title: "חידושים טכנולוגיים",
      description: "השקת מערכת בינה מלאכותית להתאמת רכבים מדויקת",
    },
    {
      year: "2025",
      title: "התרחבות ארצית",
      description: "כיסוי מלא של כל הארץ עם סוחרים בכל העיירות הגדולות",
    },
  ];

  const values = [
    {
      icon: Shield,
      title: "שקיפות",
      description: "מידע מלא וכנה על כל רכב, ללא הסתרות או הפתעות",
    },
    {
      icon: Heart,
      title: "אמפתיה",
      description: "אנחנו מבינים שקניית רכב זה חוויה חשובה ורגשית",
    },
    {
      icon: Star,
      title: "מצוינות",
      description: "שואפים תמיד לשירות הטוב ביותר ולחוויית משתמש מושלמת",
    },
    {
      icon: Handshake,
      title: "אמינות",
      description: "יוצרים יחסי אמון לטווח הארוך עם לקוחות וסוחרים",
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
              אודות AUTIX
            </h1>
            <p className="text-xl text-gray-600">
              הפלטפורמה המובילה לקנייה ומכירה של רכבים בישראל
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-4xl font-bold mb-6">
              מהפכה בעולם הרכב הישראלי
            </div>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              AUTIX הייתה נוצרה מתוך הרצון לשנות את הדרך שבה אנשים קונים ומוכרים
              רכבים בישראל. אנחנו מאמינים שכל אדם זכאי לחוויית קנייה שקופה,
              פשוטה ומהנה.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/buyer/cars")}
              >
                <Car className="h-4 w-4 ml-2" />
                חפש רכבים
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/info/contact")}
              >
                <Mail className="h-4 w-4 ml-2" />
                צור קשר
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                המשימה שלנו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                ליצור את הפלטפורמה הטובה והאמינה ביותר לקנייה ומכירה של רכבים
                בישראל. אנחנו רוצים לחסוך לכם זמן, כסף ומתח, ולהפוך את תהליך
                קניית הרכב לחוויה פשוטה ונעימה.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-purple-600" />
                החזון שלנו
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                להיות הפלטפורמה הראשונה שאליה פונים ישראלים כשהם רוצים לקנות או
                למכור רכב. אנחנו חולמים על עולם שבו כל עסקת רכב היא שקופה, הוגנת
                ומבוססת על אמון הדדי.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            למה לבחור ב-AUTIX?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${feature.color}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            הערכים שלנו
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <value.icon className="h-8 w-8 text-blue-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            המסע שלנו
          </h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {timeline.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                    {item.year}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            הצוות שלנו
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="text-4xl mb-4">{member.avatar}</div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <div className="text-blue-600 font-medium mb-3">
                    {member.role}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Technology */}
        <Card className="mb-16 bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-full shadow-lg">
                  <Zap className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                טכנולוגיה מתקדמת
              </h2>
              <div className="max-w-3xl mx-auto">
                <p className="text-gray-700 leading-relaxed mb-6">
                  המערכת שלנו בנויה על טכנולוגיות הענן המתקדמות ביותר, עם דגש על
                  אבטחה, מהירות ויציבות. אנחנו משתמשים בבינה מלאכותית כדי להתאים
                  לכם את הרכבים הכי מתאימים לצרכים שלכם.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Badge variant="outline">Next.js</Badge>
                  <Badge variant="outline">Node.js</Badge>
                  <Badge variant="outline">PostgreSQL</Badge>
                  <Badge variant="outline">AWS</Badge>
                  <Badge variant="outline">TypeScript</Badge>
                  <Badge variant="outline">AI Matching</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact CTA */}
        <Card className="bg-blue-600 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">רוצים לדעת עוד?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              יש לכם שאלות על AUTIX? רוצים להצטרף כסוחרים? או פשוט רוצים לשתף
              אותנו ברעיונות? אנחנו תמיד שמחים לשמוע מכם!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                variant="secondary"
                onClick={() => router.push("/info/contact")}
              >
                <Mail className="h-4 w-4 ml-2" />
                צור קשר
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600"
                onClick={() => router.push("/buyer/cars")}
              >
                <Car className="h-4 w-4 ml-2" />
                התחל לחפש רכב
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutAutixPage;
