"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus,
  Eye, 
  MessageSquare,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Car
} from 'lucide-react';

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
  urgency: 'low' | 'medium' | 'high';
  createdAt: string;
  status: 'active' | 'inactive';
  views: number;
  responses: number;
}

interface Inquiry {
  id: number;
  carId: number;
  carManufacturer: string;
  carModel: string;
  carYear: number;
  carPrice: number;
  dealerName: string;
  dealerPhone: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  message: string;
  interestedInTestDrive: boolean;
  interestedInFinancing: boolean;
  offerPrice?: number;
  availableTimes: string;
  sentAt: string;
  status: "sent" | "viewed" | "contacted";
}

interface SavedCar {
  id: number;
  manufacturer: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  transmission: string;
  fuelType: string;
  color: string;
  hand: string;
  location: string;
  views: number;
  inquiries: number;
  savedAt: string;
}

// נתוני דמו - פניות ששלח הקונה
const sampleInquiries: Inquiry[] = [
  {
    id: 1,
    carId: 1,
    carManufacturer: "טויוטה",
    carModel: "קמרי",
    carYear: 2021,
    carPrice: 185000,
    dealerName: "רכבי פרימיום",
    dealerPhone: "050-1234567",
    buyerName: "אליה כהן",
    buyerPhone: "052-9876543",
    buyerEmail: "eliya.cohen@example.com",
    message: "שלום, אני מעוניין ברכב ואשמח לקבוע פגישה לצפייה ונסיעת מבחן.",
    interestedInTestDrive: true,
    interestedInFinancing: false,
    availableTimes: "גמיש עם הזמנים - בוקר או אחר הצהריים",
    sentAt: "2024-05-27",
    status: "contacted"
  },
  {
    id: 2,
    carId: 2,
    carManufacturer: "הונדה",
    carModel: "סיוויק",
    carYear: 2020,
    carPrice: 145000,
    dealerName: "הונדה מרכז",
    dealerPhone: "03-7777888",
    buyerName: "אליה כהן",
    buyerPhone: "052-9876543",
    buyerEmail: "eliya.cohen@example.com",
    message: "מעוניין לדעת עוד פרטים על הרכב ולבדוק אפשרות לנסיעת מבחן השבוע.",
    interestedInTestDrive: true,
    interestedInFinancing: true,
    offerPrice: 140000,
    availableTimes: "רק בסופי שבוע",
    sentAt: "2024-05-25",
    status: "viewed"
  },
  {
    id: 3,
    carId: 3,
    carManufacturer: "מזדה",
    carModel: "CX-5",
    carYear: 2019,
    carPrice: 155000,
    dealerName: "מזדה דרום",
    dealerPhone: "08-9999000",
    buyerName: "אליה כהן",
    buyerPhone: "052-9876543",
    buyerEmail: "eliya.cohen@example.com",
    message: "רכב נראה מעניין, אשמח לשמוע עוד על ההיסטוריה שלו ולקבוע צפייה.",
    interestedInTestDrive: false,
    interestedInFinancing: false,
    availableTimes: "גמיש",
    sentAt: "2024-05-23",
    status: "sent"
  }
];

// נתוני דמו - בקשות של הקונה הנוכחי
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
    description: "מחפש רכב משפחתי אמין עם צריכת דלק נמוכה. אני נוהג הרבה לעבודה ומעוניין ברכב במצב מעולה.",
    interestedInFinancing: true,
    urgency: "high",
    createdAt: "2024-05-27",
    status: "active",
    views: 12,
    responses: 3
  },
  {
    id: 2,
    buyerName: "אליה כהן",
    buyerPhone: "052-9876543",
    buyerEmail: "eliya.cohen@example.com",
    manufacturer: "הונדה",
    model: "סיוויק",
    yearFrom: 2018,
    yearTo: 2022,
    priceFrom: 120000,
    priceTo: 160000,
    mileageMax: 80000,
    transmission: "אוטומט",
    location: "תל אביב",
    description: "חלופה שנייה - מחפש רכב קטן וחסכוני לנסיעות יומיומיות. חשוב לי שיהיה מהימן ועם תחזוקה זולה.",
    interestedInFinancing: false,
    urgency: "medium",
    createdAt: "2024-05-25",
    status: "active",
    views: 8,
    responses: 1
  },
  {
    id: 3,
    buyerName: "אליה כהן",
    buyerPhone: "052-9876543",
    buyerEmail: "eliya.cohen@example.com",
    manufacturer: "מזדה",
    model: "CX-5",
    yearFrom: 2018,
    yearTo: 2021,
    priceFrom: 140000,
    priceTo: 180000,
    location: "תל אביב",
    description: "אולי SUV קטן? רוצה לבדוק אפשרויות של רכב גבוה יותר עם מקום למשפחה.",
    interestedInFinancing: true,
    urgency: "low",
    createdAt: "2024-05-20",
    status: "inactive",
    views: 5,
    responses: 0
  }
];

const BuyerRequestsPage = () => {
  const [requests, setRequests] = useState<PurchaseRequest[]>([]);
  const [savedCars, setSavedCars] = useState<SavedCar[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [showInactiveModal, setShowInactiveModal] = useState<PurchaseRequest | null>(null);

  // טעינת בקשות, רכבים שמורים ופניות מ-localStorage ומיזוג עם דמו
  useEffect(() => {
    const savedRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
    const allRequests = [...sampleRequests, ...savedRequests];
    setRequests(allRequests);
    
    // טעינת רכבים שמורים
    const savedCarsData = JSON.parse(localStorage.getItem('savedCars') || '[]');
    setSavedCars(savedCarsData);
    
    // טעינת פניות ששלח הקונה
    const savedInquiries = JSON.parse(localStorage.getItem('userInquiries') || '[]');
    const allInquiries = [...sampleInquiries, ...savedInquiries];
    setInquiries(allInquiries);
  }, []);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('he-IL').format(price) + ' ₪';
  };

  const formatMileage = (mileage: number): string => {
    return new Intl.NumberFormat('he-IL').format(mileage) + ' ק"מ';
  };

  const getUrgencyColor = (urgency: string): string => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUrgencyText = (urgency: string): string => {
    switch (urgency) {
      case 'high': return 'דחוף';
      case 'medium': return 'רגיל';
      case 'low': return 'לא דחוף';
      default: return 'רגיל';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active': return 'פעיל';
      case 'inactive': return 'לא רלוונטי';
      default: return 'לא ידוע';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-3 w-3" />;
      case 'inactive': return <XCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getInquiryStatusColor = (status: string): string => {
    switch (status) {
      case 'sent': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'viewed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contacted': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInquiryStatusText = (status: string): string => {
    switch (status) {
      case 'sent': return 'נשלח';
      case 'viewed': return 'נצפה';
      case 'contacted': return 'התקשרו אלי';
      default: return 'לא ידוע';
    }
  };

  const getInquiryStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Clock className="h-3 w-3" />;
      case 'viewed': return <Eye className="h-3 w-3" />;
      case 'contacted': return <CheckCircle className="h-3 w-3" />;
      default: return <AlertCircle className="h-3 w-3" />;
    }
  };

  const handleStatusChange = (request: PurchaseRequest) => {
    if (request.status === 'active') {
      setShowInactiveModal(request);
    } else {
      // החזרה לפעיל
      const updatedRequests = requests.map(req => 
        req.id === request.id ? { ...req, status: 'active' as const } : req
      );
      setRequests(updatedRequests);
      
      // עדכון ב-localStorage
      const userRequests = updatedRequests.filter(req => 
        req.buyerName === "אליה כהן" && req.id > 1000
      );
      localStorage.setItem('userRequests', JSON.stringify(userRequests));
    }
  };

  const confirmInactive = () => {
    if (showInactiveModal) {
      const updatedRequests = requests.map(req => 
        req.id === showInactiveModal.id ? { ...req, status: 'inactive' as const } : req
      );
      setRequests(updatedRequests);
      
      // עדכון ב-localStorage
      const userRequests = updatedRequests.filter(req => 
        req.buyerName === "אליה כהן" && req.id > 1000
      );
      localStorage.setItem('userRequests', JSON.stringify(userRequests));
      
      setShowInactiveModal(null);
    }
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'היום';
    if (diffDays === 1) return 'אתמול';
    if (diffDays < 7) return `לפני ${diffDays} ימים`;
    return date.toLocaleDateString('he-IL');
  };

  const activeRequests = requests.filter(req => req.status === 'active');
  const inactiveRequests = requests.filter(req => req.status === 'inactive');

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Search className="h-6 w-6" />
                הבקשות והמודעות שלי
              </h1>
              <p className="text-gray-600 mt-1">
                {activeRequests.length} בקשות פעילות • {savedCars.length} מודעות שמורות • {inquiries.length} פניות ששלחתי
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                בקשה חדשה
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">

        {/* רשימת בקשות פעילות */}
        {activeRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              בקשות פעילות ({activeRequests.length})
            </h2>
            
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-md transition-all duration-200">
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
                          
                          <div className="flex items-center gap-2">
                            <Badge className={`${getUrgencyColor(request.urgency)} border`}>
                              {getUrgencyText(request.urgency)}
                            </Badge>
                            <Badge className={`${getStatusColor(request.status)} border flex items-center gap-1`}>
                              {getStatusIcon(request.status)}
                              {getStatusText(request.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* פרטים טכניים */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          {(request.yearFrom || request.yearTo) && (
                            <div>
                              <span className="text-gray-500">שנים:</span>
                              <div className="font-medium">
                                {request.yearFrom || '...'} - {request.yearTo || '...'}
                              </div>
                            </div>
                          )}
                          
                          {(request.priceFrom || request.priceTo) && (
                            <div>
                              <span className="text-gray-500">מחיר:</span>
                              <div className="font-medium">
                                {request.priceFrom ? formatPrice(request.priceFrom) : '...'} - {request.priceTo ? formatPrice(request.priceTo) : '...'}
                              </div>
                            </div>
                          )}
                          
                          {request.mileageMax && (
                            <div>
                              <span className="text-gray-500">קילומטרים:</span>
                              <div className="font-medium">עד {formatMileage(request.mileageMax)}</div>
                            </div>
                          )}
                          
                          {request.transmission && (
                            <div>
                              <span className="text-gray-500">תיבת הילוכים:</span>
                              <div className="font-medium">{request.transmission}</div>
                            </div>
                          )}
                          
                          {request.fuelType && (
                            <div>
                              <span className="text-gray-500">דלק:</span>
                              <div className="font-medium">{request.fuelType}</div>
                            </div>
                          )}
                          
                          {request.interestedInFinancing && (
                            <div>
                              <span className="text-gray-500">מימון:</span>
                              <div className="font-medium text-green-600">מעוניין</div>
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
                      <div className="lg:w-48 flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <XCircle className="h-4 w-4" />
                          סמן כלא רלוונטי
                        </Button>
                        
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                          <div className="font-semibold mb-1">
                            {request.responses > 0 ? `${request.responses} סוחרים התקשרו` : 'אין תגובות עדיין'}
                          </div>
                          <div>
                            {request.responses === 0 ? 'תן לסוחרים עוד זמן' : 'הבקשה עובדת טוב!'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* מודעות ששמרתי */}
        {savedCars.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              מודעות ששמרתי ({savedCars.length})
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedCars.map((car) => (
                <Card key={car.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {car.manufacturer} {car.model} {car.year}
                        </h3>
                        <div className="text-sm text-gray-600">{car.location}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-blue-600">
                          {formatPrice(car.price)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 space-y-1 mb-3">
                      <div>{formatMileage(car.mileage)}</div>
                      <div>{car.transmission} • {car.fuelType}</div>
                      <div>{car.color} • {car.hand}</div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>נשמר ב-{new Date(car.savedAt).toLocaleDateString('he-IL')}</span>
                      <span>{car.views} צפיות • {car.inquiries} פניות</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        צפה במודעה
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const updatedCars = savedCars.filter(savedCar => savedCar.id !== car.id);
                          setSavedCars(updatedCars);
                          localStorage.setItem('savedCars', JSON.stringify(updatedCars));
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        הסר
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* הפניות ששלחתי */}
        {inquiries.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              הפניות ששלחתי ({inquiries.length})
            </h2>
            
            <div className="space-y-4">
              {inquiries.map((inquiry) => (
                <Card key={inquiry.id} className="hover:shadow-md transition-all duration-200">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                      
                      {/* מידע הרכב */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {inquiry.carManufacturer} {inquiry.carModel} {inquiry.carYear}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center gap-1">
                                <DollarSign className="h-4 w-4" />
                                {formatPrice(inquiry.carPrice)}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {getTimeAgo(inquiry.sentAt)}
                              </div>
                              <div>
                                סוחר: {inquiry.dealerName}
                              </div>
                            </div>
                          </div>
                          
                          <Badge className={`${getInquiryStatusColor(inquiry.status)} border flex items-center gap-1`}>
                            {getInquiryStatusIcon(inquiry.status)}
                            {getInquiryStatusText(inquiry.status)}
                          </Badge>
                        </div>

                        {/* הודעה ששלחתי */}
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                          <div className="text-sm font-medium text-blue-900 mb-2">ההודעה ששלחתי:</div>
                          <p className="text-blue-700 text-sm leading-relaxed">
                            {inquiry.message}
                          </p>
                        </div>

                        {/* פרטים נוספים */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">נסיעת מבחן:</span>
                            <div className="font-medium">
                              {inquiry.interestedInTestDrive ? 'מעוניין' : 'לא מעוניין'}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">מימון:</span>
                            <div className="font-medium">
                              {inquiry.interestedInFinancing ? 'מעוניין' : 'לא מעוניין'}
                            </div>
                          </div>
                          
                          {inquiry.offerPrice && (
                            <div>
                              <span className="text-gray-500">הצעת מחיר:</span>
                              <div className="font-medium text-green-600">
                                {formatPrice(inquiry.offerPrice)}
                              </div>
                            </div>
                          )}
                        </div>

                        {inquiry.availableTimes && (
                          <div className="mt-3 text-sm">
                            <span className="text-gray-500">זמנים נוחים: </span>
                            <span className="font-medium">{inquiry.availableTimes}</span>
                          </div>
                        )}
                      </div>

                      {/* פעולות */}
                      <div className="lg:w-48 flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          צפה ברכב
                        </Button>
                        
                        {inquiry.status === 'contacted' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            הסוחר התקשר
                          </Button>
                        )}
                        
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded mt-2">
                          <div className="font-semibold mb-1">
                            {inquiry.status === 'sent' && 'הפניה נשלחה'}
                            {inquiry.status === 'viewed' && 'הסוחר ראה את הפניה'}
                            {inquiry.status === 'contacted' && 'הסוחר התקשר אליך'}
                          </div>
                          <div>
                            {inquiry.status === 'sent' && 'הסוחר יקבל התראה'}
                            {inquiry.status === 'viewed' && 'ימתין לחזרה'}
                            {inquiry.status === 'contacted' && 'תהליך בעיצומו'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* רשימת בקשות לא רלוונטיות */}
        {inactiveRequests.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-gray-600" />
              בקשות לא רלוונטיות ({inactiveRequests.length})
            </h2>
            
            <div className="space-y-4">
              {inactiveRequests.map((request) => (
                <Card key={request.id} className="opacity-60">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-700 mb-1">
                          מחפש {request.manufacturer} {request.model}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{request.location}</span>
                          <span>{getTimeAgo(request.createdAt)}</span>
                          <span>{request.views} צפיות</span>
                          <span>{request.responses} תגובות</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Badge className={`${getStatusColor(request.status)} border flex items-center gap-1`}>
                          {getStatusIcon(request.status)}
                          {getStatusText(request.status)}
                        </Badge>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(request)}
                          className="flex items-center gap-2 text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <CheckCircle className="h-4 w-4" />
                          החזר לפעיל
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* מסך ריק */}
        {requests.length === 0 && savedCars.length === 0 && inquiries.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">אין פעילות עדיין</h3>
              <p className="text-gray-600 mb-6">
                פרסם בקשת "אני מחפש", שמור מודעות או שלח פניות לסוחרים
              </p>
              <div className="flex gap-3 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 ml-2" />
                  פרסם בקשה
                </Button>
                <Button variant="outline">
                  <Car className="h-4 w-4 ml-2" />
                  חפש רכבים
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal אישור */}
      {showInactiveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                סימון כלא רלוונטי
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                האם אתה בטוח שברצונך לסמן את הבקשה כלא רלוונטית?
                <br />
                <strong>{showInactiveModal.manufacturer} {showInactiveModal.model}</strong>
              </p>
              
              <div className="bg-yellow-50 p-3 rounded-lg text-sm text-yellow-700">
                <strong>שים לב:</strong> הבקשה תיעלם מחיפושי הסוחרים, אבל תוכל להחזיר אותה לפעילות מתי שתרצה.
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={confirmInactive}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  כן, סמן כלא רלוונטי
                </Button>
                <Button
                  onClick={() => setShowInactiveModal(null)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  ביטול
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default BuyerRequestsPage;