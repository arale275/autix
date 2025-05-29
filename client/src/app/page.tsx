import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedCars } from "@/lib/mockData";
import { MapPin, Eye, MessageSquare, Calendar } from "lucide-react";

export default function HomePage() {
  // קבל רכבים מובילים מה-mock data
  const featuredCars = getFeaturedCars(3);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("he-IL").format(price) + " ₪";
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';
  };

  const getTimeAgo = (dateString: string) => {
    // דמו - מחזיר תאריכים רנדומליים לדמו
    const days = Math.floor(Math.random() * 7) + 1;
    if (days === 1) return "אתמול";
    return `לפני ${days} ימים`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Autix - חיבור בין סוחרים לקונים
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            הפלטפורמה המתקדמת לקניה ומכירת רכבים - חיבור ישיר, פשוט ואמין בין
            סוחרי רכב לקונים פרטיים
          </p>

          {/* בחירת מסלול משתמש */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
            {/* מסלול קונה פרטי */}
            <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-2xl font-bold mb-3">אני מחפש רכב</h3>
              <p className="mb-6 text-blue-100">
                חפש מבין אלפי רכבים מסוחרים מורשים או פרסם בקשת רכישה ותן
                לסוחרים לפנות אליך
              </p>
              <Link href="/auth/register?type=buyer">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-lg w-full">
                  הרשמה
                </Button>
              </Link>
            </Card>

            {/* מסלול סוחר */}
            <Card className="p-6 text-center bg-white/10 backdrop-blur border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="text-2xl font-bold mb-3">אני סוחר רכב</h3>
              <p className="mb-6 text-blue-100">
                פרסם רכבים למכירה, קבל פניות ישירות מקונים מעוניינים ונהל את
                המלאי שלך בקלות
              </p>
              <Link href="/auth/register?type=dealer">
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-lg w-full">
                  הרשמה
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-8">
            למה לבחור ב-Autix?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl mb-4">🤝</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                חיבור ישיר
              </h4>
              <p className="text-gray-600">
                קשר ישיר בין קונים לסוחרים ללא מתווכים נוספים
              </p>
            </div>
            <div>
              <div className="text-4xl mb-4">🛡️</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">
                בטוח ואמין
              </h4>
              <p className="text-gray-600">כל הסוחרים במערכת מאומתים ומורשים</p>
            </div>
            <div>
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">מהיר וקל</h4>
              <p className="text-gray-600">ממשק פשוט ונוח לכל סוגי המשתמשים</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Cars - עיצוב חדש */}
      <section className="container mx-auto py-12 px-4">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 text-center">
            רכבים מובילים למכירה
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCars.map((car) => (
            <Card
              key={car.id}
              className="hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-4" dir="rtl">
                {/* תמונה */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <div className="text-5xl mb-2">🚗</div>
                    <div className="text-sm">
                      {car.manufacturer} {car.model}
                    </div>
                  </div>
                </div>

                {/* כותרת ובadge */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    {car.manufacturer} {car.model}
                  </h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    זמין
                  </Badge>
                </div>

                {/* מטא-דטא */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {getTimeAgo("2024-05-27")}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {car.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {car.location}
                  </div>
                </div>

                {/* פרטים טכניים */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-500">שנה:</span>
                    <div className="font-medium">{car.year}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">מחיר:</span>
                    <div className="font-medium text-blue-600">
                      {formatPrice(car.price)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">ק"מ:</span>
                    <div className="font-medium">
                      {formatMileage(car.mileage)}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">תיבה:</span>
                    <div className="font-medium">{car.transmission}</div>
                  </div>
                </div>

                {/* תיאור קצר */}
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 mb-4">
                  רכב במצב מעולה, תחזוקות בזמן, מומלץ לבדיקה.
                </div>

                {/* כפתור וסוחר */}
                <div className="space-y-2">
                  <Link href="/auth/register">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2">
                      פרטי קשר
                    </Button>
                  </Link>
                  <div className="text-xs text-gray-500 text-center">
                    סוחר: {car.dealerName || "אוטו סנטר"}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* "אני מחפש" - Purchase Requests Section */}
      <section className="bg-green-50 py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 text-center">
              "אני מחפש" - בקשות רכישה מקונים
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* בקשת רכישה 1 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4" dir="rtl">
                {/* תמונה */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <div className="text-5xl mb-2">🚗</div>
                    <div className="text-sm">טויוטה קמרי</div>
                  </div>
                </div>

                {/* כותרת ובadge */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    מחפש טויוטה קמרי
                  </h3>
                  <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                    דחוף
                  </Badge>
                </div>

                {/* מטא-דטא */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    לפני 2 שעות
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    12
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    תל אביב
                  </div>
                </div>

                {/* פרטים טכניים */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-500">שנים:</span>
                    <div className="font-medium">2020-2023</div>
                  </div>
                  <div>
                    <span className="text-gray-500">מחיר:</span>
                    <div className="font-medium text-blue-600">
                      160,000-200,000 ₪
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">ק"מ:</span>
                    <div className="font-medium">עד 60,000</div>
                  </div>
                  <div>
                    <span className="text-gray-500">דלק:</span>
                    <div className="font-medium text-green-600">היברידי</div>
                  </div>
                </div>

                {/* תיאור קצר */}
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 mb-4">
                  מחפש רכב משפחתי אמין עם צריכת דלק נמוכה לעבודה.
                </div>

                {/* כפתור וקונה */}
                <div className="space-y-2">
                  <Link href="/auth/register?type=dealer">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2">
                      פרטי קשר
                    </Button>
                  </Link>
                  <div className="text-xs text-gray-500 text-center">
                    קונה: אליה כהן
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* בקשת רכישה 2 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4" dir="rtl">
                {/* תמונה */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <div className="text-5xl mb-2">🚙</div>
                    <div className="text-sm">הונדה סיוויק</div>
                  </div>
                </div>

                {/* כותרת ובadge */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    מחפש הונדה סיוויק
                  </h3>
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                    רגיל
                  </Badge>
                </div>

                {/* מטא-דטא */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    לפני 5 שעות
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />8
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    חיפה
                  </div>
                </div>

                {/* פרטים טכניים */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-500">שנים:</span>
                    <div className="font-medium">2018-2022</div>
                  </div>
                  <div>
                    <span className="text-gray-500">מחיר:</span>
                    <div className="font-medium text-blue-600">
                      120,000-160,000 ₪
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">ק"מ:</span>
                    <div className="font-medium">עד 80,000</div>
                  </div>
                  <div>
                    <span className="text-gray-500">מימון:</span>
                    <div className="font-medium text-red-600">לא מעוניין</div>
                  </div>
                </div>

                {/* תיאור קצר */}
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 mb-4">
                  מחפשת רכב קטן וחסכוני לנסיעות יומיומיות.
                </div>

                {/* כפתור וקונה */}
                <div className="space-y-2">
                  <Link href="/auth/register?type=dealer">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2">
                      פרטי קשר
                    </Button>
                  </Link>
                  <div className="text-xs text-gray-500 text-center">
                    קונה: שרה לוי
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* בקשת רכישה 3 */}
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4" dir="rtl">
                {/* תמונה */}
                <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center text-gray-500">
                    <div className="text-5xl mb-2">🏎️</div>
                    <div className="text-sm">BMW</div>
                  </div>
                </div>

                {/* כותרת ובadge */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900">מחפש BMW</h3>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                    לא דחוף
                  </Badge>
                </div>

                {/* מטא-דטא */}
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    לפני יום
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    15
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    ירושלים
                  </div>
                </div>

                {/* פרטים טכניים */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div>
                    <span className="text-gray-500">שנים:</span>
                    <div className="font-medium">מ-2020</div>
                  </div>
                  <div>
                    <span className="text-gray-500">מחיר:</span>
                    <div className="font-medium text-blue-600">
                      250,000-350,000 ₪
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">ק"מ:</span>
                    <div className="font-medium">עד 40,000</div>
                  </div>
                  <div>
                    <span className="text-gray-500">מימון:</span>
                    <div className="font-medium text-green-600">מעוניין</div>
                  </div>
                </div>

                {/* תיאור קצר */}
                <div className="bg-gray-50 p-3 rounded text-xs text-gray-700 mb-4">
                  מעוניין ברכב פרימיום לשימוש עסקי עם טכנולוגיה מתקדמת.
                </div>

                {/* כפתור וקונה */}
                <div className="space-y-2">
                  <Link href="/auth/register?type=dealer">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm py-2">
                      פרטי קשר
                    </Button>
                  </Link>
                  <div className="text-xs text-gray-500 text-center">
                    קונה: דוד רוזן
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">מוכן להתחיל?</h3>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            הצטרף לאלפי המשתמשים שכבר נהנים מהפלטפורמה שלנו
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth/register?type=buyer">
              <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg text-lg">
                פרסם "אני מחפש"
              </Button>
            </Link>
            <Link href="/auth/register?type=dealer">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-3 px-8 rounded-lg text-lg">
                פרסם רכב למכירה
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <h4 className="text-3xl font-bold text-blue-600">500+</h4>
              <p className="text-gray-600">סוחרים רשומים</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-green-600">2,000+</h4>
              <p className="text-gray-600">רכבים במלאי</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-purple-600">300+</h4>
              <p className="text-gray-600">בקשות רכישה פעילות</p>
            </div>
            <div>
              <h4 className="text-3xl font-bold text-orange-600">4.8⭐</h4>
              <p className="text-gray-600">דירוג לקוחות</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
