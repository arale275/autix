"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Mail, 
  MapPin, 
  Calendar, 
  Eye, 
  MessageCircle, 
  Car, 
  Fuel, 
  Gauge, 
  Settings, 
  Palette,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from 'lucide-react';

// הגדרת ממשקים
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
  status: string;
  createdAt: string;
  description?: string;
  images?: string[];
}

interface SavedCar extends Car {
  savedAt: string;
}

// דוגמת רכב (בפועל יגיע מה-API)
const sampleCar = {
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
  description: "רכב במצב מעולה, שירות מלא בהתאמה לספר השירותים. צבע יפה ונדיר, מושבי עור, מערכת מולטימדיה מתקדמת ומערכות בטיחות חדישות.",
  images: []
};

// דוגמת משתמש מחובר
const currentUser = {
  name: "אליה כהן",
  phone: "052-9876543",
  email: "eliya.cohen@example.com"
};

const CarDetailPage = () => {
  const [car, setCar] = useState(sampleCar);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  
  // טופס הפניה
  const [inquiryForm, setInquiryForm] = useState({
    message: "שלום, אני מעוניין ברכב ואשמח לקבוע פגישה לצפייה ונסיעת מבחן.",
    interestedInTestDrive: true,
    interestedInFinancing: false,
    offerPrice: "",
    availableTimes: "גמיש עם הזמנים - בוקר או אחר הצהריים"
  });

  // בדיקה אם הרכב כבר שמור במודעות שלי
  useEffect(() => {
    // סימולציה של הגדלת מספר הצפיות
    setCar(prev => ({ ...prev, views: prev.views + 1 }));
    
    // בדיקה אם הרכב שמור במודעות שלי
    const savedCars: SavedCar[] = JSON.parse(localStorage.getItem('savedCars') || '[]');
    const isCarSaved = savedCars.some((savedCar: SavedCar) => savedCar.id === car.id);
    setIsFavorite(isCarSaved);
  }, [car.id]);

  const handleInquirySubmit = () => {
    
    const inquiry = {
      id: Date.now(),
      carId: car.id,
      buyerName: currentUser.name,
      buyerPhone: currentUser.phone,
      buyerEmail: currentUser.email,
      message: inquiryForm.message,
      interestedInTestDrive: inquiryForm.interestedInTestDrive,
      interestedInFinancing: inquiryForm.interestedInFinancing,
      offerPrice: inquiryForm.offerPrice ? parseInt(inquiryForm.offerPrice) : null,
      availableTimes: inquiryForm.availableTimes,
      sentAt: new Date().toISOString().split('T')[0],
      status: "sent"
    };

    // שמירה ב-localStorage (בפועל ישלח לשרת)
    const existingInquiries = JSON.parse(localStorage.getItem('userInquiries') || '[]');
    localStorage.setItem('userInquiries', JSON.stringify([...existingInquiries, inquiry]));
    
    // עדכון מספר הפניות ברכב
    setCar(prev => ({ ...prev, inquiries: prev.inquiries + 1 }));
    
    setInquirySubmitted(true);
    setShowInquiryForm(false);
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('he-IL').format(price) + ' ₪';
  };

  const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat('he-IL').format(mileage) + ' ק"מ';
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    
    // שמירה ב-localStorage במודעות שלי
    const savedCars: SavedCar[] = JSON.parse(localStorage.getItem('savedCars') || '[]');
    
    if (!isFavorite) {
      // הוספה למודעות שלי
      const carToSave: SavedCar = {
        ...car,
        savedAt: new Date().toISOString().split('T')[0]
      };
      localStorage.setItem('savedCars', JSON.stringify([...savedCars, carToSave]));
    } else {
      // הסרה מהמודעות שלי
      const updatedCars = savedCars.filter((savedCar: SavedCar) => savedCar.id !== car.id);
      localStorage.setItem('savedCars', JSON.stringify(updatedCars));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                חזרה לתוצאות
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost" 
                size="sm"
                onClick={toggleFavorite}
                className={`flex items-center gap-2 ${isFavorite ? 'text-red-600' : ''}`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'שמור במודעות שלי' : 'שמור במודעות שלי'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* עמודה ראשית - פרטי הרכב */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* תמונה ראשית */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Car className="h-16 w-16 mx-auto mb-2 opacity-50" />
                    <p>תמונות הרכב יתווספו בקרוב</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* כותרת ומחיר */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {car.manufacturer} {car.model} {car.year}
                    </h1>
                    <p className="text-gray-600 mt-1">
                      {car.hand} • {car.location} • פורסם ב-{new Date(car.createdAt).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                  <div className="text-left md:text-right">
                    <div className="text-3xl font-bold text-blue-600">
                      {formatPrice(car.price)}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                      <Eye className="h-4 w-4" />
                      {car.views} צפיות
                      <MessageCircle className="h-4 w-4 mr-2" />
                      {car.inquiries} פניות
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* פרטים טכניים */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  פרטים טכניים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <Gauge className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">קילומטרים</div>
                      <div className="font-semibold">{formatMileage(car.mileage)}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">תיבת הילוכים</div>
                      <div className="font-semibold">{car.transmission}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Fuel className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">סוג דלק</div>
                      <div className="font-semibold">{car.fuelType}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Car className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">נפח מנוע</div>
                      <div className="font-semibold">{car.engineSize} ליטר</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Palette className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">צבע</div>
                      <div className="font-semibold">{car.color}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-600">מיקום</div>
                      <div className="font-semibold">{car.location}</div>
                    </div>
                  </div>
                </div>
                
                <Badge className="mt-4 bg-green-100 text-green-800 hover:bg-green-100">
                  {car.status === 'active' ? 'זמין למכירה' : 'לא זמין'}
                </Badge>
              </CardContent>
            </Card>

            {/* תיאור */}
            {car.description && (
              <Card>
                <CardHeader>
                  <CardTitle>תיאור הרכב</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{car.description}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* עמודה שמאלית - פרטי הסוחר ופעולות */}
          <div className="space-y-6">
            
            {/* פרטי הסוחר */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">פרטי הסוחר</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="font-semibold text-gray-900">{car.dealerName}</div>
                  <div className="text-sm text-gray-600 mt-1">סוחר מורשה</div>
                </div>
              </CardContent>
            </Card>

            {/* שליחת פניה */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">מעוניין ברכב?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!inquirySubmitted ? (
                  <>
                    <p className="text-sm text-gray-600">
                      שלח פניה לסוחר וקבל חזרה התקשרות תוך זמן קצר
                    </p>
                    
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => setShowInquiryForm(true)}
                    >
                      <MessageCircle className="h-4 w-4 ml-2" />
                      שלח פניה לסוחר
                    </Button>
                  </>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <div className="font-semibold text-green-700 mb-1">הפניה נשלחה בהצלחה!</div>
                    <div className="text-sm text-gray-600">הסוחר יחזור אליך בהקדם</div>
                  </div>
                )}
                
                <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                  <strong>איך זה עובד?</strong><br />
                  שלח פניה → הסוחר רואה את הפרטים שלך → הסוחר מתקשר אליך ישירות
                </div>
              </CardContent>
            </Card>

            {/* רכבים דומים */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">רכבים דומים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-sm">טויוטה קמרי 2020</div>
                      <div className="text-xs text-gray-600">175,000 ₪</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-semibold text-sm">הונדה אקורד 2021</div>
                      <div className="text-xs text-gray-600">195,000 ₪</div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  רכבים דומים נוספים
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal טופס פניה */}
      {showInquiryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>שלח פניה לסוחר</CardTitle>
              <p className="text-sm text-gray-600">
                {car.manufacturer} {car.model} {car.year} • {formatPrice(car.price)}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                
                <div>
                  <Label htmlFor="message">הודעה לסוחר</Label>
                  <Textarea
                    id="message"
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({...inquiryForm, message: e.target.value})}
                    rows={4}
                    className="mt-1"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="testDrive"
                      checked={inquiryForm.interestedInTestDrive}
                      onCheckedChange={(checked) => 
                        setInquiryForm({...inquiryForm, interestedInTestDrive: checked})
                      }
                    />
                    <Label htmlFor="testDrive" className="text-sm">
                      מעוניין בנסיעת מבחן
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="financing"
                      checked={inquiryForm.interestedInFinancing}
                      onCheckedChange={(checked) => 
                        setInquiryForm({...inquiryForm, interestedInFinancing: checked})
                      }
                    />
                    <Label htmlFor="financing" className="text-sm">
                      מעוניין במימון
                    </Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor="offerPrice">הצעת מחיר (אופציונלי)</Label>
                  <Input
                    id="offerPrice"
                    type="number"
                    placeholder="למשל: 180000"
                    value={inquiryForm.offerPrice}
                    onChange={(e) => setInquiryForm({...inquiryForm, offerPrice: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="availableTimes">זמנים נוחים לפגישה</Label>
                  <Textarea
                    id="availableTimes"
                    value={inquiryForm.availableTimes}
                    onChange={(e) => setInquiryForm({...inquiryForm, availableTimes: e.target.value})}
                    rows={2}
                    className="mt-1"
                  />
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-sm">
                  <div className="font-semibold text-blue-900">הפרטים שיישלחו לסוחר:</div>
                  <div className="text-blue-700 mt-1">
                    {currentUser.name} • {currentUser.phone} • {currentUser.email}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleInquirySubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    שלח פניה
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowInquiryForm(false)}
                  >
                    ביטול
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CarDetailPage;