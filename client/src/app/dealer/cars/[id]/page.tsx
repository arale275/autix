"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Car,
  ArrowLeft,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Eye,
  MessageSquare,
  Settings,
  Trash2,
  Copy,
  PlayCircle,
  PauseCircle,
  Clock,
} from "lucide-react";
import { useParams } from "next/navigation";

// ממשק רכב - זהה לדף הרשימה
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

// אותם נתוני דמו כמו בדף הרשימה
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

// אפשרויות לטפסים
const manufacturers = [
  "טויוטה",
  "הונדה",
  "מזדה",
  "ניסאן",
  "היונדאי",
  "קיא",
  "סקודה",
  "פולקסווגן",
  "BMW",
  "מרצדס",
  "אאודי",
  "וולוו",
];

const transmissionTypes = ["אוטומט", "ידני", "אוטומט רובוטי", "CVT"];
const fuelTypes = ["בנזין", "דיזל", "היברידי", "חשמלי", "גז"];
const handTypes = ["יד ראשונה", "יד שנייה", "יד שלישית", "יד רביעית+"];
const colors = [
  "לבן",
  "שחור",
  "כסף",
  "אפור",
  "כחול",
  "אדום",
  "ירוק",
  "חום",
  "זהב",
  "לבן פנינה",
  "כסף מטאלי",
  "אפור מטאלי",
  "כחול מטאלי",
  "אדום מטאלי",
  "ירוק מטאלי",
];
const locations = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "באר שבע",
  "נתניה",
  "פתח תקווה",
  "אשדוד",
  "ראשון לציון",
  "אשקלון",
  "רחובות",
  "בת ים",
  "הרצליה",
];

const CarEditPage = () => {
  const params = useParams();
  const carId = parseInt(params.id as string);

  const [car, setCar] = useState<Car | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editForm, setEditForm] = useState({
    manufacturer: "",
    model: "",
    year: "",
    price: "",
    mileage: "",
    engineSize: "",
    transmission: "",
    fuelType: "",
    color: "",
    hand: "",
    location: "",
    description: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // טעינת נתוני הרכב
  useEffect(() => {
    const foundCar = sampleCars.find((c) => c.id === carId);
    if (foundCar) {
      setCar(foundCar);
      setEditForm({
        manufacturer: foundCar.manufacturer,
        model: foundCar.model,
        year: foundCar.year.toString(),
        price: foundCar.price.toString(),
        mileage: foundCar.mileage.toString(),
        engineSize: foundCar.engineSize.toString(),
        transmission: foundCar.transmission,
        fuelType: foundCar.fuelType,
        color: foundCar.color,
        hand: foundCar.hand,
        location: foundCar.location,
        description: foundCar.description || "",
      });
    }
  }, [carId]);

  // אם הרכב לא נמצא
  if (!car) {
    return (
      <div
        className="min-h-screen bg-gray-50 flex items-center justify-center"
        dir="rtl"
      >
        <Card className="w-96">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              רכב לא נמצא
            </h3>
            <p className="text-gray-600 mb-4">
              רכב עם ID {carId} לא נמצא במערכת
            </p>
            <Button onClick={() => (window.location.href = "/dealer/cars")}>
              חזרה לרשימת הרכבים
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // פונקציות עזר
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!editForm.manufacturer) newErrors.manufacturer = "יש לבחור יצרן";
    if (!editForm.model) newErrors.model = "יש להזין דגם";
    if (!editForm.year) newErrors.year = "יש להזין שנת יצור";
    if (!editForm.price) newErrors.price = "יש להזין מחיר";
    if (!editForm.mileage) newErrors.mileage = "יש להזין קילומטרים";

    if (
      editForm.year &&
      (parseInt(editForm.year) < 1990 ||
        parseInt(editForm.year) > new Date().getFullYear() + 1)
    ) {
      newErrors.year = "שנה לא תקינה";
    }
    if (editForm.price && parseInt(editForm.price) < 1000) {
      newErrors.price = "מחיר נמוך מדי";
    }
    if (editForm.mileage && parseInt(editForm.mileage) < 0) {
      newErrors.mileage = "קילומטרים לא יכולים להיות שליליים";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedCar = {
      ...car,
      manufacturer: editForm.manufacturer,
      model: editForm.model,
      year: parseInt(editForm.year),
      price: parseInt(editForm.price),
      mileage: parseInt(editForm.mileage),
      engineSize: parseFloat(editForm.engineSize),
      transmission: editForm.transmission,
      fuelType: editForm.fuelType,
      color: editForm.color,
      hand: editForm.hand,
      location: editForm.location,
      description: editForm.description,
    };

    setCar(updatedCar);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCancel = () => {
    setEditForm({
      manufacturer: car.manufacturer,
      model: car.model,
      year: car.year.toString(),
      price: car.price.toString(),
      mileage: car.mileage.toString(),
      engineSize: car.engineSize.toString(),
      transmission: car.transmission,
      fuelType: car.fuelType,
      color: car.color,
      hand: car.hand,
      location: car.location,
      description: car.description || "",
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleStatusChange = (newStatus: string) => {
    setCar({ ...car, status: newStatus as any });
  };

  const handleDelete = () => {
    alert("הרכב נמחק בהצלחה");
    setShowDeleteModal(false);
    window.location.href = "/dealer/cars";
  };

  // פונקציות עיצוב
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("he-IL").format(price) + " ₪";
  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat("he-IL").format(mileage) + ' ק"מ';

  const getStatusColor = (status: string) => {
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

  const getStatusText = (status: string) => {
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

  const getTimeAgo = (dateString: string) => {
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

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => (window.location.href = "/dealer/cars")}
              >
                <ArrowLeft className="h-4 w-4" />
                חזרה לניהול מלאי
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {car.manufacturer} {car.model} {car.year}
                </h1>
                <p className="text-sm text-gray-600">
                  עריכת פרטי הרכב • נפרסם {getTimeAgo(car.createdAt)}
                </p>
              </div>
            </div>

            {saved && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                השינויים נשמרו
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* עמודה ראשית */}
          <div className="lg:col-span-2 space-y-6">
            {/* תמונה placeholder */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Car className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p>תמונות הרכב</p>
                    <p className="text-sm">ניתן להוסיף בעתיד</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* פרטי הרכב */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    פרטי הרכב
                    {isEditing && (
                      <Badge className="bg-blue-100 text-blue-800">
                        במצב עריכה
                      </Badge>
                    )}
                  </CardTitle>

                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Settings className="h-4 w-4" />
                      ערוך פרטים
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  // תצוגת עריכה
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="manufacturer">יצרן *</Label>
                        <Select
                          value={editForm.manufacturer}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, manufacturer: value })
                          }
                        >
                          <SelectTrigger
                            className={`mt-1 ${
                              errors.manufacturer ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder="בחר יצרן" />
                          </SelectTrigger>
                          <SelectContent>
                            {manufacturers.map((manufacturer) => (
                              <SelectItem
                                key={manufacturer}
                                value={manufacturer}
                              >
                                {manufacturer}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.manufacturer && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.manufacturer}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="model">דגם *</Label>
                        <Input
                          id="model"
                          value={editForm.model}
                          onChange={(e) =>
                            setEditForm({ ...editForm, model: e.target.value })
                          }
                          className={`mt-1 ${
                            errors.model ? "border-red-500" : ""
                          }`}
                        />
                        {errors.model && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.model}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="year">שנת יצור *</Label>
                        <Input
                          id="year"
                          type="number"
                          value={editForm.year}
                          onChange={(e) =>
                            setEditForm({ ...editForm, year: e.target.value })
                          }
                          className={`mt-1 ${
                            errors.year ? "border-red-500" : ""
                          }`}
                        />
                        {errors.year && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.year}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="price">מחיר (₪) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={editForm.price}
                          onChange={(e) =>
                            setEditForm({ ...editForm, price: e.target.value })
                          }
                          className={`mt-1 ${
                            errors.price ? "border-red-500" : ""
                          }`}
                        />
                        {errors.price && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="mileage">קילומטרים *</Label>
                        <Input
                          id="mileage"
                          type="number"
                          value={editForm.mileage}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              mileage: e.target.value,
                            })
                          }
                          className={`mt-1 ${
                            errors.mileage ? "border-red-500" : ""
                          }`}
                        />
                        {errors.mileage && (
                          <p className="text-xs text-red-600 mt-1">
                            {errors.mileage}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="engineSize">נפח מנוע (ליטר)</Label>
                        <Input
                          id="engineSize"
                          type="number"
                          step="0.1"
                          value={editForm.engineSize}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              engineSize: e.target.value,
                            })
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="transmission">תיבת הילוכים</Label>
                        <Select
                          value={editForm.transmission}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, transmission: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {transmissionTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="fuelType">סוג דלק</Label>
                        <Select
                          value={editForm.fuelType}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, fuelType: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fuelTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="color">צבע</Label>
                        <Select
                          value={editForm.color}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, color: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {colors.map((color) => (
                              <SelectItem key={color} value={color}>
                                {color}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="hand">יד</Label>
                        <Select
                          value={editForm.hand}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, hand: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {handTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="location">מיקום</Label>
                        <Select
                          value={editForm.location}
                          onValueChange={(value) =>
                            setEditForm({ ...editForm, location: value })
                          }
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map((location) => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">תיאור הרכב</Label>
                      <Textarea
                        id="description"
                        rows={4}
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        שמור שינויים
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        ביטול
                      </Button>
                    </div>
                  </div>
                ) : (
                  // תצוגת קריאה
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm text-gray-600">
                          יצרן ודגם
                        </Label>
                        <div className="font-medium text-gray-900 mt-1 text-lg">
                          {car.manufacturer} {car.model}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          שנת יצור
                        </Label>
                        <div className="font-medium text-gray-900 mt-1 text-lg">
                          {car.year}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">מחיר</Label>
                        <div className="font-bold text-blue-600 mt-1 text-xl">
                          {formatPrice(car.price)}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          קילומטרים
                        </Label>
                        <div className="font-medium text-gray-900 mt-1 text-lg">
                          {formatMileage(car.mileage)}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          תיבת הילוכים
                        </Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {car.transmission}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">סוג דלק</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {car.fuelType}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">צבע</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {car.color}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">יד</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {car.hand}
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">
                          נפח מנוע
                        </Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {car.engineSize} ליטר
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm text-gray-600">מיקום</Label>
                        <div className="font-medium text-gray-900 mt-1">
                          {car.location}
                        </div>
                      </div>
                    </div>

                    {car.description && (
                      <div>
                        <Label className="text-sm text-gray-600">תיאור</Label>
                        <div className="bg-gray-50 p-4 rounded-lg mt-2">
                          <p className="text-gray-700 leading-relaxed">
                            {car.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* סייד-בר */}
          <div className="space-y-6">
            {/* סטטוס הרכב */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">סטטוס הרכב</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">סטטוס נוכחי</span>
                  <Badge
                    className={`${getStatusColor(
                      car.status
                    )} border flex items-center gap-1`}
                  >
                    {getStatusIcon(car.status)}
                    {getStatusText(car.status)}
                  </Badge>
                </div>

                <div>
                  <Label htmlFor="status">שנה סטטוס</Label>
                  <Select value={car.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <PlayCircle className="h-3 w-3" />
                          פעיל
                        </div>
                      </SelectItem>
                      <SelectItem value="pending">
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          בהליך מכירה
                        </div>
                      </SelectItem>
                      <SelectItem value="paused">
                        <div className="flex items-center gap-2">
                          <PauseCircle className="h-3 w-3" />
                          מושהה
                        </div>
                      </SelectItem>
                      <SelectItem value="sold">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          נמכר
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* סטטיסטיקות */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">סטטיסטיקות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">צפיות</span>
                  </div>
                  <span className="font-semibold">{car.views}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-green-600" />
                    <span className="text-sm">פניות</span>
                  </div>
                  <span className="font-semibold">{car.inquiries}</span>
                </div>
              </CardContent>
            </Card>

            {/* פעולות */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">פעולות</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  onClick={() => setShowDeleteModal(true)}
                  variant="destructive"
                  className="w-full flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                  מחק רכב
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal מחיקה */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">אישור מחיקה</h2>
            <p className="text-gray-700">
              האם אתה בטוח שברצונך למחוק את הרכב הזה? פעולה זו לא ניתנת לביטול.
            </p>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
              >
                ביטול
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={handleDelete}
              >
                מחק
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CarEditPage;
