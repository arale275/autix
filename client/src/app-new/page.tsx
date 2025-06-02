import { Metadata } from "next";
import Link from "next/link";
import {
  Search,
  Car,
  Users,
  MessageSquare,
  Shield,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Autix - פלטפורמה לחיבור בין סוחרי רכב לקונים",
  description:
    "מצא את הרכב המושלם או פרסם את הרכב שלך למכירה. הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים.",
};

const features = [
  {
    icon: Search,
    title: "חיפוש מתקדם",
    description:
      "מצא את הרכב המושלם עם חיפוש מתקדם לפי יצרן, דגם, שנה, מחיר ועוד",
    color: "blue",
  },
  {
    icon: MessageSquare,
    title: "תקשורת ישירה",
    description: "יצירת קשר ישירה בין קונים לסוחרים ללא מתווכים",
    color: "green",
  },
  {
    icon: Shield,
    title: "בטיחות ואמינות",
    description: "פלטפורמה מאובטחת עם אימות זהות וביקורת איכות",
    color: "purple",
  },
  {
    icon: Clock,
    title: "זמינות 24/7",
    description: "הפלטפורמה פעילה 24 שעות ביממה לנוחותכם",
    color: "orange",
  },
];

const stats = [
  { number: "2", label: "רכבים פעילים", suffix: "+" },
  { number: "7", label: "משתמשים רשומים", suffix: "+" },
  { number: "24/7", label: "זמינות", suffix: "" },
  { number: "100%", label: "בטיחות", suffix: "" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              קונים. מוכרים. מרוויחים.
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              הפלטפורמה המתקדמת לחיבור בין סוחרי רכב לקונים פרטיים
            </p>
            <p className="text-lg mb-12 text-blue-100 max-w-2xl mx-auto">
              מצא את הרכב המושלם או פרסם את הרכב שלך למכירה. תהליך פשוט, מהיר
              ובטוח.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/buyer/cars"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Search className="w-5 h-5" />
                <span>חפש רכבים</span>
              </Link>

              <Link
                href="/register"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center space-x-2 space-x-reverse"
              >
                <Car className="w-5 h-5" />
                <span>פרסם רכב למכירה</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                  {stat.suffix}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              למה לבחור ב-Autix?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              אנחנו מספקים הכל שאתה צריך כדי לקנות או למכור רכב בקלות ובביטחון
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorClasses = {
                blue: "bg-blue-100 text-blue-600",
                green: "bg-green-100 text-green-600",
                purple: "bg-purple-100 text-purple-600",
                orange: "bg-orange-100 text-orange-600",
              };

              return (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-lg ${
                      colorClasses[feature.color as keyof typeof colorClasses]
                    } flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              איך זה עובד?
            </h2>
            <p className="text-xl text-gray-600">
              תהליך פשוט ומהיר בשלושה שלבים
            </p>
          </div>

          {/* For Buyers */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-center text-blue-600 mb-8">
              לקונים
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">חפש או פרסם בקשה</h4>
                <p className="text-gray-600">
                  חפש רכבים או פרסם בקשה עם הדרישות שלך
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">
                  צור קשר עם סוחרים
                </h4>
                <p className="text-gray-600">
                  פנה ישירות לסוחרים עם הרכבים המתאימים
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-blue-600 font-bold text-xl">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">קנה את הרכב</h4>
                <p className="text-gray-600">תאם צפייה, בדיקה וסגור עסקה</p>
              </div>
            </div>
          </div>

          {/* For Dealers */}
          <div>
            <h3 className="text-2xl font-bold text-center text-purple-600 mb-8">
              לסוחרים
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">1</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">פרסם רכבים</h4>
                <p className="text-gray-600">
                  הוסף את הרכבים שלך עם תמונות ופרטים
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">2</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">קבל פניות</h4>
                <p className="text-gray-600">קונים יפנו אליך עם בקשות והצעות</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <h4 className="text-lg font-semibold mb-2">מכור ותרוויח</h4>
                <p className="text-gray-600">סגור עסקאות ותגדיל את המכירות</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">מוכן להתחיל?</h2>
          <p className="text-xl mb-8 text-blue-100">
            הצטרף אלינו עוד היום וגלה כמה פשוט לקנות או למכור רכב
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-flex items-center justify-center space-x-2 space-x-reverse"
            >
              <Users className="w-5 h-5" />
              <span>הרשם עכשיו</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </Link>

            <Link
              href="/login"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
            >
              יש לך חשבון? התחבר
            </Link>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <section className="bg-gray-900 text-gray-400 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            🚗 Autix - הפלטפורמה שמחברת בין סוחרי רכב לקונים פרטיים בישראל
          </p>
        </div>
      </section>
    </div>
  );
}
