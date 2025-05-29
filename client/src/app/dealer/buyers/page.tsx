"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Eye,
  Clock,
  Filter,
  SortAsc,
  AlertCircle,
  Car,
  DollarSign,
  Zap,
  MessageSquare,
  ArrowRight,
  Gauge,
  CheckCircle2,
} from "lucide-react";

// ממשקים
interface PurchaseRequest {
  id: number;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  manufacturer: string;
  model?: string;
  yearFrom?: number;
  yearTo?: number;
  priceFrom?: number;
  priceTo?: number;
  mileageMax?: number;
  transmission?: string;
  fuelType?: string;
  location: string;
  description: string;
  interestedInFinancing: boolean;
  urgency: "low" | "medium" | "high";
  createdAt: string;
  status: "active" | "paused" | "fulfilled";
  views: number;
  responses: number;
}

// נתוני דמו - בקשות רכישה
const sampleRequests: PurchaseRequest[] = [
  {
    id: 1,
    buyerName: "אליה כהן",
    buyerPhone: "052-9876543",
    buyerEmail: "eliya.cohen@example.com",
    manufacturer: "טויוטה",
    model: "קמרי",
    yearFrom: 2019,
    yearTo: 2023,
    priceFrom: 160000,
    priceTo: 200000,
    mileageMax: 60000,
    transmission: "אוטומט",
    fuelType: "היברידי",
    location: "תל אביב",
    description:
      "מחפש רכב משפחתי אמין עם צריכת דלק נמוכה. אני נוהג הרבה לעבודה ומעוניין ברכב במצב מעולה.",
    interestedInFinancing: true,
    urgency: "high",
    createdAt: "2024-05-27",
    status: "active",
    views: 12,
    responses: 3,
  },
  {
    id: 2,
    buyerName: "שרה לוי",
    buyerPhone: "050-1234567",
    buyerEmail: "sarah.levi@example.com",
    manufacturer: "הונדה",
    model: "סיוויק",
    yearFrom: 2018,
    yearTo: 2022,
    priceFrom: 120000,
    priceTo: 160000,
    mileageMax: 80000,
    transmission: "אוטומט",
    location: "חיפה",
    description:
      "מחפשת רכב קטן וחסכוני לנסיעות יומיומיות. חשוב לי שיהיה מהימן ועם תחזוקה זולה.",
    interestedInFinancing: false,
    urgency: "medium",
    createdAt: "2024-05-26",
    status: "active",
    views: 8,
    responses: 1,
  },
  {
    id: 3,
    buyerName: "דוד רוזן",
    buyerPhone: "053-7777888",
    buyerEmail: "david.rosen@example.com",
    manufacturer: "BMW",
    yearFrom: 2020,
    priceFrom: 250000,
    priceTo: 350000,
    mileageMax: 40000,
    location: "ירושלים",
    description:
      "מעוניין ברכב פרימיום לשימוש עסקי. חשוב לי נוחות, טכנולוגיה מתקדמת ומראה מכובד.",
    interestedInFinancing: true,
    urgency: "low",
    createdAt: "2024-05-25",
    status: "active",
    views: 15,
    responses: 5,
  },
  {
    id: 4,
    buyerName: "רחל ישראלי",
    buyerPhone: "054-9999000",
    buyerEmail: "rachel.israeli@example.com",
    manufacturer: "קיה",
    model: "ספורטאז'",
    yearFrom: 2019,
    yearTo: 2023,
    priceFrom: 140000,
    priceTo: 180000,
    location: "באר שבע",
    description:
      "רכב SUV לדרום הארץ. צריכה משהו גבוה ויציב לכבישים קשים ועם מקום למשפחה.",
    interestedInFinancing: false,
    urgency: "medium",
    createdAt: "2024-05-24",
    status: "active",
    views: 6,
    responses: 2,
  },
  {
    id: 5,
    buyerName: "מיכאל זהר",
    buyerPhone: "052-5555444",
    buyerEmail: "michael.zohar@example.com",
    manufacturer: "וולוו",
    yearFrom: 2018,
    yearTo: 2021,
    priceFrom: 180000,
    priceTo: 240000,
    mileageMax: 70000,
    location: "נתניה",
    description:
      "מחפש רכב עם מערכות בטיחות מתקדמות. בטיחות המשפחה היא הדבר הכי חשוב עבורי.",
    interestedInFinancing: true,
    urgency: "high",
    createdAt: "2024-05-23",
    status: "active",
    views: 9,
    responses: 4,
  },
];

const DealerBuyersPage = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<PurchaseRequest[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedManufacturer, setSelectedManufacturer] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showContactModal, setShowContactModal] =
    useState<PurchaseRequest | null>(null);

  // טעינת בקשות מ-localStorage ומיזוג עם דמו
  useEffect(() => {
    const savedRequests = JSON.parse(
      localStorage.getItem("purchaseRequests") || "[]"
    );
    const allRequests = [...sampleRequests, ...savedRequests];
    setRequests(allRequests);
    setFilteredRequests(allRequests);
  }, []);

  // סינון וחיפוש
  useEffect(() => {
    let filtered = requests.filter((request) => {
      const matchesSearch =
        request.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        false ||
        request.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesManufacturer =
        selectedManufacturer === "all" ||
        request.manufacturer === selectedManufacturer;
      const matchesUrgency =
        selectedUrgency === "all" || request.urgency === selectedUrgency;
      const matchesLocation =
        selectedLocation === "all" ||
        request.location.includes(selectedLocation);

      return (
        matchesSearch &&
        matchesManufacturer &&
        matchesUrgency &&
        matchesLocation
      );
    });

    // מיון
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "urgent":
          const urgencyOrder = { high: 3, medium: 2, low: 1 };
          return urgencyOrder[b.urgency] - urgencyOrder[a.urgency];
        case "price-high":
          return (b.priceTo || 0) - (a.priceTo || 0);
        case "price-low":
          return (a.priceFrom || 0) - (b.priceFrom || 0);
        default:
          return 0;
      }
    });

    setFilteredRequests(filtered);
  }, [
    requests,
    searchTerm,
    selectedManufacturer,
    selectedUrgency,
    selectedLocation,
    sortBy,
  ]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("he-IL").format(price) + " ₪";
  };

  const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getUrgencyText = (urgency: string): string => {
    switch (urgency) {
      case "high":
        return "דחוף";
      case "medium":
        return "רגיל";
      case "low":
        return "לא דחוף";
      default:
        return "רגיל";
    }
  };

  const handleContact = (request: PurchaseRequest) => {
    setShowContactModal(request);

    // עדכון מספר הצפיות
    const updatedRequests = requests.map((req) =>
      req.id === request.id ? { ...req, views: req.views + 1 } : req
    );
    setRequests(updatedRequests);
  };

  const handleMarkAsContacted = (requestId: number) => {
    const updatedRequests = requests.map((req) =>
      req.id === requestId ? { ...req, responses: req.responses + 1 } : req
    );
    setRequests(updatedRequests);
    setShowContactModal(null);
  };

  const getManufacturers = () => {
    const manufacturers = [...new Set(requests.map((req) => req.manufacturer))];
    return manufacturers.sort();
  };

  const getLocations = () => {
    const locations = [...new Set(requests.map((req) => req.location))];
    return locations.sort();
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString("he-IL");
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="h-6 w-6" />
                קונים מחפשים
              </h1>
              <p className="text-gray-600 mt-1">
                {filteredRequests.length} בקשות פעילות •{" "}
                {requests.filter((r) => r.urgency === "high").length} דחופות
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="text-blue-600 border-blue-300"
              >
                <Zap className="h-3 w-3 ml-1" />
                מעודכן בזמן אמת
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* כלי סינון וחיפוש */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              {/* חיפוש */}
              <div className="lg:col-span-2">
                <Label htmlFor="search">חיפוש</Label>
                <div className="relative mt-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="שם, יצרן, דגם, מיקום..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* יצרן */}
              <div>
                <Label htmlFor="manufacturer">יצרן</Label>
                <Select
                  value={selectedManufacturer}
                  onValueChange={setSelectedManufacturer}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל היצרנים</SelectItem>
                    {getManufacturers().map((manufacturer) => (
                      <SelectItem key={manufacturer} value={manufacturer}>
                        {manufacturer}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* דחיפות */}
              <div>
                <Label htmlFor="urgency">דחיפות</Label>
                <Select
                  value={selectedUrgency}
                  onValueChange={setSelectedUrgency}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">הכל</SelectItem>
                    <SelectItem value="high">דחוף</SelectItem>
                    <SelectItem value="medium">רגיל</SelectItem>
                    <SelectItem value="low">לא דחוף</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* מיקום */}
              <div>
                <Label htmlFor="location">מיקום</Label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל המיקומים</SelectItem>
                    {getLocations().map((location) => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* מיון */}
              <div>
                <Label htmlFor="sort">מיון</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">החדשות ביותר</SelectItem>
                    <SelectItem value="oldest">הישנות ביותר</SelectItem>
                    <SelectItem value="urgent">לפי דחיפות</SelectItem>
                    <SelectItem value="price-high">מחיר גבוה לנמוך</SelectItem>
                    <SelectItem value="price-low">מחיר נמוך לגבוה</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* רשימת בקשות */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  אין בקשות תואמות
                </h3>
                <p className="text-gray-600">
                  נסה לשנות את קריטריוני החיפוש או הסינון
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="hover:shadow-md transition-all duration-200"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* מידע ראשי */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            מחפש {request.manufacturer} {request.model}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {request.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {getTimeAgo(request.createdAt)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Eye className="h-4 w-4" />
                              {request.views} צפיות
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              {request.responses} תגובות
                            </div>
                          </div>
                        </div>

                        <Badge
                          className={`${getUrgencyColor(
                            request.urgency
                          )} border`}
                        >
                          {getUrgencyText(request.urgency)}
                        </Badge>
                      </div>

                      {/* פרטים טכניים */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                        {(request.yearFrom || request.yearTo) && (
                          <div>
                            <span className="text-gray-500">שנים:</span>
                            <div className="font-medium">
                              {request.yearFrom || "..."} -{" "}
                              {request.yearTo || "..."}
                            </div>
                          </div>
                        )}

                        {(request.priceFrom || request.priceTo) && (
                          <div>
                            <span className="text-gray-500">מחיר:</span>
                            <div className="font-medium">
                              {request.priceFrom
                                ? formatPrice(request.priceFrom)
                                : "..."}{" "}
                              -{" "}
                              {request.priceTo
                                ? formatPrice(request.priceTo)
                                : "..."}
                            </div>
                          </div>
                        )}

                        {request.mileageMax && (
                          <div>
                            <span className="text-gray-500">קילומטרים:</span>
                            <div className="font-medium">
                              עד {formatMileage(request.mileageMax)}
                            </div>
                          </div>
                        )}

                        {request.transmission && (
                          <div>
                            <span className="text-gray-500">תיבת הילוכים:</span>
                            <div className="font-medium">
                              {request.transmission}
                            </div>
                          </div>
                        )}

                        {request.fuelType && (
                          <div>
                            <span className="text-gray-500">דלק:</span>
                            <div className="font-medium">
                              {request.fuelType}
                            </div>
                          </div>
                        )}

                        {request.interestedInFinancing && (
                          <div>
                            <span className="text-gray-500">מימון:</span>
                            <div className="font-medium text-green-600">
                              מעוניין
                            </div>
                          </div>
                        )}
                      </div>

                      {/* תיאור */}
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {request.description}
                        </p>
                      </div>
                    </div>

                    {/* פעולות */}
                    <div className="lg:w-64 flex flex-col gap-3">
                      <Button
                        onClick={() => handleContact(request)}
                        className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Phone className="h-4 w-4" />
                        פרטי קשר
                      </Button>

                      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                        <div className="font-semibold mb-1">
                          קונה: {request.buyerName}
                        </div>
                        <div>נפתח {getTimeAgo(request.createdAt)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal פרטי קשר */}
      {showContactModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                פרטי קשר
              </CardTitle>
              <p className="text-sm text-gray-600">
                {showContactModal.manufacturer} {showContactModal.model} •{" "}
                {showContactModal.location}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-3">
                  פרטי הקונה:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <strong>שם:</strong> {showContactModal.buyerName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <a
                      href={`tel:${showContactModal.buyerPhone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {showContactModal.buyerPhone}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a
                      href={`mailto:${showContactModal.buyerEmail}`}
                      className="text-blue-600 hover:underline"
                    >
                      {showContactModal.buyerEmail}
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div>
                    <strong className="text-yellow-800">זכור:</strong>
                    <div className="text-yellow-700 mt-1">
                      לאחר שתתקשר לקונה, לחץ על "יצרתי קשר" כדי לעדכן את
                      הסטטיסטיקות.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => handleMarkAsContacted(showContactModal.id)}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle2 className="h-4 w-4 ml-2" />
                  יצרתי קשר
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowContactModal(null)}
                >
                  סגור
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default DealerBuyersPage;
