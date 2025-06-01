"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Plus,
  MessageSquare,
  Eye,
  Phone,
  Clock,
  Car,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

// Types
interface Car {
  id: number;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage?: number;
  city?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
}

interface CarRequest {
  id: number;
  make?: string;
  model?: string;
  yearMin?: number;
  yearMax?: number;
  priceMax?: number;
  requirements?: string;
  status: string;
  createdAt: string;
}

interface Dealer {
  businessName?: string;
  phone?: string;
}

interface Inquiry {
  id: number;
  car?: Car;
  dealer?: Dealer;
  message: string;
  status: string;
  createdAt: string;
}

// API Base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.autix.co.il";

export default function BuyerHomePage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();

  // State management
  const [isClient, setIsClient] = useState(false);
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [myRequests, setMyRequests] = useState<CarRequest[]>([]);
  const [sentInquiries, setSentInquiries] = useState<Inquiry[]>([]);
  const [stats, setStats] = useState({
    sentInquiries: 0,
    myActiveRequests: 0,
    totalRequests: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Client-side check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // ✅ Safe localStorage helpers
  const getLocalStorageItem = (
    key: string,
    defaultValue: string = ""
  ): string => {
    if (!isClient) return defaultValue;
    try {
      return localStorage.getItem(key) || defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // ✅ Authentication check
  useEffect(() => {
    if (!isClient) return;

    if (isLoading) return;

    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    if (user?.userType !== "buyer") {
      router.push("/dealer/home");
      return;
    }
  }, [isClient, isLoading, isAuthenticated, user, router]);

  // ✅ API Helper Functions - מתוקן עם error handling
  const api = {
    getFeaturedCars: async (): Promise<Car[]> => {
      try {
        const response = await fetch(`${API_URL}/api/cars?limit=3`);
        if (!response.ok) {
          console.error(`Featured cars API error: ${response.status}`);
          return [];
        }
        const data = await response.json();
        return data.success && data.data && Array.isArray(data.data.cars)
          ? data.data.cars
          : [];
      } catch (error) {
        console.error("Error fetching featured cars:", error);
        return [];
      }
    },

    getMyRequests: async (token: string): Promise<CarRequest[]> => {
      try {
        if (!token) {
          console.error("No token provided for my requests");
          return [];
        }

        const response = await fetch(
          `${API_URL}/api/car-requests/my-requests?limit=3`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          console.error(
            `My requests API error: ${response.status} ${response.statusText}`
          );
          // אם 400, ייתכן שאין buyer profile
          if (response.status === 400) {
            console.log("Buyer profile might not exist, returning empty array");
          }
          return [];
        }

        const data = await response.json();
        return data.success && data.data && Array.isArray(data.data.requests)
          ? data.data.requests
          : [];
      } catch (error) {
        console.error("Error fetching my requests:", error);
        return [];
      }
    },

    getSentInquiries: async (token: string): Promise<Inquiry[]> => {
      try {
        if (!token) {
          console.error("No token provided for sent inquiries");
          return [];
        }

        const response = await fetch(`${API_URL}/api/inquiries/sent?limit=4`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          console.error(
            `Sent inquiries API error: ${response.status} ${response.statusText}`
          );
          return [];
        }

        const data = await response.json();
        return data.success && data.data && Array.isArray(data.data.inquiries)
          ? data.data.inquiries
          : [];
      } catch (error) {
        console.error("Error fetching sent inquiries:", error);
        return [];
      }
    },
  };

  // ✅ Load data after authentication
  useEffect(() => {
    if (!isClient || isLoading || !isAuthenticated || !user) {
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = getLocalStorageItem("auth_token");

        if (!token) {
          console.log("❌ No auth_token found");
          router.push("/auth/login");
          return;
        }

        // Load all data in parallel
        const [cars, requests, inquiries] = await Promise.all([
          api.getFeaturedCars(),
          api.getMyRequests(token),
          api.getSentInquiries(token),
        ]);

        setFeaturedCars(cars);
        setMyRequests(requests);
        setSentInquiries(inquiries);

        // Calculate stats - עם null safety
        const safeRequests = Array.isArray(requests) ? requests : [];
        const safeInquiries = Array.isArray(inquiries) ? inquiries : [];

        setStats({
          sentInquiries: safeInquiries.length,
          myActiveRequests: safeRequests.filter(
            (r: CarRequest) => r && r.status === "active"
          ).length,
          totalRequests: safeRequests.length,
        });

        console.log("✅ Data loaded successfully");
      } catch (error) {
        console.error("❌ Error loading data:", error);
        setError(
          error instanceof Error ? error.message : "שגיאה בטעינת הנתונים"
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isClient, isLoading, isAuthenticated, user, router]);

  // Helper Functions
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("he-IL", {
      style: "currency",
      currency: "ILS",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
    return date.toLocaleDateString("he-IL");
  };

  const getTransmissionText = (transmission: string): string => {
    switch (transmission) {
      case "automatic":
        return "אוטומטית";
      case "manual":
        return "ידנית";
      case "cvt":
        return "CVT";
      default:
        return transmission || "";
    }
  };

  const getFuelTypeText = (fuelType: string): string => {
    switch (fuelType) {
      case "gasoline":
        return "בנזין";
      case "diesel":
        return "דיזל";
      case "hybrid":
        return "היברידי";
      case "electric":
        return "חשמלי";
      default:
        return fuelType || "";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">חדש</Badge>;
      case "responded":
        return <Badge className="bg-yellow-100 text-yellow-800">נענה</Badge>;
      case "closed":
        return <Badge className="bg-green-100 text-green-800">סגור</Badge>;
      case "active":
        return <Badge className="bg-green-100 text-green-800">פעיל</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "responded":
        return <Eye className="w-4 h-4 text-yellow-600" />;
      case "closed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getUserName = (): string => {
    if (!user) return "קונה";
    if (user.firstName) return user.firstName;
    if (user.email) return user.email.split("@")[0];
    return "קונה";
  };

  // Loading states
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">בודק אימות...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">שגיאה</h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>נסה שוב</Button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            נדרשת התחברות
          </h1>
          <p className="text-gray-600 mb-4">אנא התחבר כדי לראות את הדף</p>
          <Button onClick={() => router.push("/auth/login")}>התחבר</Button>
        </div>
      </div>
    );
  }

  if (user.userType !== "buyer") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            גישה מוגבלת
          </h1>
          <p className="text-gray-600 mb-4">דף זה מיועד לקונים בלבד</p>
          <Button onClick={() => router.push("/dealer/home")}>לדף הסוחר</Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  // Main content
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            שלום, {getUserName()}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            מוכן למצוא את הרכב המושלם? בואו נתחיל לחפש
          </p>
        </div>

        {/* Quick Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 ml-2" />
              חיפוש מהיר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="manufacturer">יצרן</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר יצרן" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Toyota">טויוטה</SelectItem>
                    <SelectItem value="Honda">הונדה</SelectItem>
                    <SelectItem value="Mazda">מאזדה</SelectItem>
                    <SelectItem value="BMW">BMW</SelectItem>
                    <SelectItem value="Mercedes">מרצדס</SelectItem>
                    <SelectItem value="Hyundai">יונדאי</SelectItem>
                    <SelectItem value="Volkswagen">פולקסווגן</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priceRange">טווח מחירים</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר מחיר" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0-50000">עד 50,000 ₪</SelectItem>
                    <SelectItem value="50000-100000">
                      50,000-100,000 ₪
                    </SelectItem>
                    <SelectItem value="100000-150000">
                      100,000-150,000 ₪
                    </SelectItem>
                    <SelectItem value="150000-200000">
                      150,000-200,000 ₪
                    </SelectItem>
                    <SelectItem value="200000+">מעל 200,000 ₪</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="year">שנת ייצור</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר שנה" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                    <SelectItem value="2022">2022</SelectItem>
                    <SelectItem value="2021">2021</SelectItem>
                    <SelectItem value="2020">2020</SelectItem>
                    <SelectItem value="2019">2019</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Link href="/buyer/cars" className="w-full">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    חפש
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">פניות ששלחתי</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.sentInquiries}
                  </p>
                </div>
                <MessageSquare className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">בקשות פעילות</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {stats.myActiveRequests}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">סה״כ בקשות</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {stats.totalRequests}
                  </p>
                </div>
                <Car className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Cars */}
        {featuredCars.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              רכבים זמינים במערכת
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredCars.map((car: Car) => (
                <Card key={car.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {car.make} {car.model}
                      </h3>
                      <p className="text-lg font-bold text-blue-600 mb-2">
                        {formatPrice(car.price)}
                      </p>
                      <div className="text-sm text-gray-600 mb-2">
                        {car.year} |{" "}
                        {car.mileage
                          ? `${car.mileage.toLocaleString()} ק״מ`
                          : "ק״מ לא צוין"}
                      </div>
                      {car.transmission && (
                        <div className="text-sm text-gray-600 mb-2">
                          {getTransmissionText(car.transmission)} |{" "}
                          {getFuelTypeText(car.fuelType || "")}
                        </div>
                      )}
                      <div className="text-sm text-gray-500 mb-2">
                        📍 {car.city || "מיקום לא צוין"}
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 text-xs mb-3">
                        זמין כעת
                      </Badge>
                    </div>

                    <Link href={`/buyer/cars/${car.id}`}>
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 w-full"
                      >
                        <Eye className="w-4 h-4 ml-1" />
                        צפה בפרטים ושלח פניה
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            פעולות מהירות
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/buyer/post-request">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Plus className="w-8 h-8 text-green-600 ml-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        פרסם &quot;אני מחפש&quot;
                      </h3>
                      <p className="text-sm text-gray-600">
                        תן לסוחרים לפנות אליך עם הצעות
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/buyer/cars">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Search className="w-8 h-8 text-blue-600 ml-3" />
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        חיפוש מתקדם
                      </h3>
                      <p className="text-sm text-gray-600">
                        חפש רכבים עם פילטרים מפורטים
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Bottom Section: Sent Inquiries & My Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sent Inquiries */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                הפניות ששלחתי
              </h2>
              <Link href="/buyer/requests">
                <Button variant="outline" size="sm">
                  צפה בכל הפניות
                </Button>
              </Link>
            </div>

            <div className="space-y-4">
              {sentInquiries.length > 0 ? (
                sentInquiries.slice(0, 4).map((inquiry: Inquiry) => (
                  <Card key={inquiry.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">
                              {inquiry.car
                                ? `${inquiry.car.make} ${inquiry.car.model}`
                                : "פנייה לסוחר"}
                            </h3>
                            {getStatusBadge(inquiry.status)}
                          </div>
                          {inquiry.car && (
                            <p className="text-lg font-bold text-blue-600 mb-1">
                              {formatPrice(inquiry.car.price)}
                            </p>
                          )}
                          <p className="text-sm text-gray-600 mb-2">
                            {inquiry.dealer?.businessName || "סוחר"}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center">
                              {getStatusIcon(inquiry.status)}
                              <span className="mr-1">
                                {formatDate(inquiry.createdAt)}
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {inquiry.dealer?.phone && (
                          <a href={`tel:${inquiry.dealer.phone}`}>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Phone className="w-4 h-4 ml-1" />
                              {inquiry.dealer.phone}
                            </Button>
                          </a>
                        )}
                        {inquiry.status === "responded" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600"
                          >
                            <CheckCircle className="w-4 h-4 ml-1" />
                            נענה
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">עדיין לא שלחת פניות לסוחרים</p>
                    <Link href="/buyer/cars">
                      <Button className="mt-4" size="sm">
                        התחל לחפש רכבים
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* My Requests */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                הבקשות שלי
              </h2>
              <Link href="/buyer/requests">
                <Button variant="outline" size="sm">
                  ניהול בקשות
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {myRequests.length > 0 ? (
                myRequests.slice(0, 3).map((request: CarRequest) => (
                  <Card key={request.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {request.make && request.model
                              ? `מחפש ${request.make} ${request.model}`
                              : "בקשת רכב"}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {request.yearMin && request.yearMax
                              ? `${request.yearMin}-${request.yearMax} | `
                              : ""}
                            {request.priceMax
                              ? `תקציב: עד ${formatPrice(request.priceMax)}`
                              : ""}
                          </p>
                          {request.requirements && (
                            <p className="text-sm text-gray-600 mb-2">
                              {request.requirements}
                            </p>
                          )}
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>{formatDate(request.createdAt)}</span>
                          </div>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">עדיין לא יצרת בקשות רכב</p>
                    <Link href="/buyer/post-request">
                      <Button className="mt-4" size="sm">
                        צור בקשה חדשה
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
