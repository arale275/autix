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
  Car,
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  Settings,
  CheckCircle,
  Clock,
  PauseCircle,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";

// ממשקים
interface Car {
  id: number;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineSize: number;
  transmission: string;
  fuelType: string;
  color: string;
  hand: string;
  location: string;
  dealerName: string;
  dealerPhone: string;
  views: number;
  inquiries: number;
  status: "active" | "sold" | "pending" | "paused";
  createdAt: string;
  description?: string;
  images?: string[];
}

// נתוני דמו - רכבים של הסוחר
const sampleCars: Car[] = [
  {
    id: 1,
    manufacturer: "טויוטה",
    model: "קמרי",
    year: 2021,
    price: 185000,
    mileage: 45000,
    engineSize: 2.5,
    transmission: "אוטומט",
    fuelType: "היברידי",
    color: "לבן פנינה",
    hand: "יד ראשונה",
    location: "תל אביב",
    dealerName: "רכבי פרימיום",
    dealerPhone: "050-1234567",
    views: 45,
    inquiries: 3,
    status: "active",
    createdAt: "2024-01-15",
    description: "רכב במצב מעולה, שירות מלא בהתאמה לספר השירותים.",
  },
  {
    id: 2,
    manufacturer: "הונדה",
    model: "סיוויק",
    year: 2020,
    price: 145000,
    mileage: 62000,
    engineSize: 1.5,
    transmission: "אוטומט",
    fuelType: "בנזין",
    color: "כחול כהה",
    hand: "יד ראשונה",
    location: "תל אביב",
    dealerName: "רכבי פרימיום",
    dealerPhone: "050-1234567",
    views: 28,
    inquiries: 1,
    status: "active",
    createdAt: "2024-02-20",
    description: "רכב חסכוני ואמין, מושבי בד, מערכת בידור.",
  },
  {
    id: 3,
    manufacturer: "מזדה",
    model: "CX-5",
    year: 2019,
    price: 155000,
    mileage: 78000,
    engineSize: 2.0,
    transmission: "אוטומט",
    fuelType: "בנזין",
    color: "אדום מטאלי",
    hand: "יד שנייה",
    location: "תל אביב",
    dealerName: "רכבי פרימיום",
    dealerPhone: "050-1234567",
    views: 67,
    inquiries: 8,
    status: "pending",
    createdAt: "2024-03-10",
    description: "SUV משפחתי עם מקום רב ונוחות נסיעה מעולה.",
  },
  {
    id: 4,
    manufacturer: "ניסאן",
    model: "אלטימה",
    year: 2018,
    price: 125000,
    mileage: 95000,
    engineSize: 2.5,
    transmission: "אוטומט",
    fuelType: "בנזין",
    color: "שחור",
    hand: "יד שנייה",
    location: "תל אביב",
    dealerName: "רכבי פרימיום",
    dealerPhone: "050-1234567",
    views: 23,
    inquiries: 0,
    status: "paused",
    createdAt: "2024-04-05",
    description: "רכב נוח עם אקזטרה גדולים ומנוע חזק.",
  },
  {
    id: 5,
    manufacturer: "קיה",
    model: "ספורטאז'",
    year: 2022,
    price: 175000,
    mileage: 25000,
    engineSize: 1.6,
    transmission: "אוטומט",
    fuelType: "בנזין",
    color: "כסף מטאלי",
    hand: "יד ראשונה",
    location: "תל אביב",
    dealerName: "רכבי פרימיום",
    dealerPhone: "050-1234567",
    views: 89,
    inquiries: 12,
    status: "active",
    createdAt: "2024-01-30",
    description: "SUV חדש יחסית עם אחריות יצרן מורחבת.",
  },
  {
    id: 6,
    manufacturer: "וולוו",
    model: "XC60",
    year: 2020,
    price: 220000,
    mileage: 55000,
    engineSize: 2.0,
    transmission: "אוטומט",
    fuelType: "היברידי",
    color: "לבן קרח",
    hand: "יד ראשונה",
    location: "תל אביב",
    dealerName: "רכבי פרימיום",
    dealerPhone: "050-1234567",
    views: 34,
    inquiries: 2,
    status: "sold",
    createdAt: "2024-02-15",
    description: "רכב יוקרה עם מערכות בטיחות מתקדמות.",
  },
];

const DealerCarsPage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedManufacturer, setSelectedManufacturer] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // טעינת רכבים
  useEffect(() => {
    // בפועל יבוא מ-API עם ID של הסוחר
    setCars(sampleCars);
    setFilteredCars(sampleCars);
  }, []);

  // סינון וחיפוש
  useEffect(() => {
    let filtered = cars.filter((car) => {
      const matchesSearch =
        car.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.color.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.year.toString().includes(searchTerm);

      const matchesStatus =
        selectedStatus === "all" || car.status === selectedStatus;
      const matchesManufacturer =
        selectedManufacturer === "all" ||
        car.manufacturer === selectedManufacturer;

      return matchesSearch && matchesStatus && matchesManufacturer;
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
        case "price-high":
          return b.price - a.price;
        case "price-low":
          return a.price - b.price;
        case "views-high":
          return b.views - a.views;
        case "inquiries-high":
          return b.inquiries - a.inquiries;
        default:
          return 0;
      }
    });

    setFilteredCars(filtered);
  }, [cars, searchTerm, selectedStatus, selectedManufacturer, sortBy]);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat("he-IL").format(price) + " ₪";
  };

  const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "sold":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "paused":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case "active":
        return "פעיל";
      case "sold":
        return "נמכר";
      case "pending":
        return "בהליך מכירה";
      case "paused":
        return "מושהה";
      default:
        return "לא ידוע";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-3 w-3" />;
      case "sold":
        return <CheckCircle className="h-3 w-3" />;
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "paused":
        return <PauseCircle className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getManufacturers = () => {
    const manufacturers = [...new Set(cars.map((car) => car.manufacturer))];
    return manufacturers.sort();
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "היום";
    if (diffDays === 1) return "אתמול";
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    if (diffDays < 30) return `לפני ${Math.floor(diffDays / 7)} שבועות`;
    return `לפני ${Math.floor(diffDays / 30)} חודשים`;
  };

  const getTotalStats = () => {
    return {
      total: cars.length,
      active: cars.filter((car) => car.status === "active").length,
      sold: cars.filter((car) => car.status === "sold").length,
      pending: cars.filter((car) => car.status === "pending").length,
      totalViews: cars.reduce((sum, car) => sum + car.views, 0),
      totalInquiries: cars.reduce((sum, car) => sum + car.inquiries, 0),
    };
  };

  const handleCarClick = (carId: number) => {
    console.log(`נווט לעריכת רכב ${carId}`);
    // ניווט אמיתי לדף עריכת הרכב
    window.location.href = `/dealer/cars/${carId}`;
  };

  const stats = getTotalStats();

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Car className="h-6 w-6" />
                ניהול מלאי רכבים
              </h1>
              <p className="text-gray-600 mt-1">
                {stats.total} רכבים • {stats.active} פעילים • {stats.sold} נמכרו
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                הוסף רכב חדש
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* כלי סינון וחיפוש */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* חיפוש */}
              <div className="lg:col-span-2">
                <Label htmlFor="search">חיפוש</Label>
                <div className="relative mt-1">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    id="search"
                    placeholder="יצרן, דגם, שנה, צבע..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>

              {/* סטטוס */}
              <div>
                <Label htmlFor="status">סטטוס</Label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">כל הסטטוסים</SelectItem>
                    <SelectItem value="active">פעיל</SelectItem>
                    <SelectItem value="pending">בהליך מכירה</SelectItem>
                    <SelectItem value="paused">מושהה</SelectItem>
                    <SelectItem value="sold">נמכר</SelectItem>
                  </SelectContent>
                </Select>
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

              {/* מיון */}
              <div>
                <Label htmlFor="sort">מיון</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">החדשים ביותר</SelectItem>
                    <SelectItem value="oldest">הישנים ביותר</SelectItem>
                    <SelectItem value="price-high">מחיר גבוה לנמוך</SelectItem>
                    <SelectItem value="price-low">מחיר נמוך לגבוה</SelectItem>
                    <SelectItem value="views-high">הכי נצפים</SelectItem>
                    <SelectItem value="inquiries-high">הכי מבוקשים</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* רשימת רכבים */}
        <div className="space-y-4">
          {filteredCars.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  אין רכבים תואמים
                </h3>
                <p className="text-gray-600">
                  נסה לשנות את קריטריוני החיפוש או הסינון
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredCars.map((car) => (
              <Card
                key={car.id}
                className="hover:shadow-md transition-all duration-200 cursor-pointer hover:bg-gray-50"
                onClick={() => handleCarClick(car.id)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* תמונה placeholder */}
                    <div className="w-full lg:w-48 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                      <Car className="h-8 w-8 text-gray-400" />
                    </div>

                    {/* מידע ראשי */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {car.manufacturer} {car.model} {car.year}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>{formatMileage(car.mileage)}</span>
                            <span>{car.transmission}</span>
                            <span>{car.fuelType}</span>
                            <span>{car.color}</span>
                            <span>נפרסם {getTimeAgo(car.createdAt)}</span>
                          </div>
                        </div>

                        <div className="text-left flex items-center gap-4">
                          <div>
                            <div className="text-xl font-bold text-blue-600 mb-1">
                              {formatPrice(car.price)}
                            </div>
                            <Badge
                              className={`${getStatusColor(
                                car.status
                              )} border flex items-center gap-1`}
                            >
                              {getStatusIcon(car.status)}
                              {getStatusText(car.status)}
                            </Badge>
                          </div>
                          <ChevronLeft className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>

                      {/* סטטיסטיקות בסיסיות */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>{car.views}</strong> צפיות
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            <strong>{car.inquiries}</strong> פניות
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{car.hand}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Settings className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{car.engineSize} ליטר</span>
                        </div>
                      </div>

                      {/* תיאור */}
                      {car.description && (
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                          {car.description}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DealerCarsPage;
