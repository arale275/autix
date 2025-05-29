"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Car, 
  Plus,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Info,
  Eye,
  Calculator,
  FileText,
  Settings,
  Users
} from 'lucide-react';

// ממשקים
interface CarFormData {
  manufacturer: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  engineSize: string;
  transmission: string;
  fuelType: string;
  color: string;
  hand: string;
  location: string;
  description: string;
}

// נתונים לטפסים
const manufacturers = [
  "טויוטה", "הונדה", "מזדה", "ניסאן", "היונדאי", "קיא", 
  "סקודה", "פולקסווגן", "BMW", "מרצדס", "אאודי", "וולוו",
  "פורד", "שברולט", "מיצובישי", "סובארו", "לקסוס", "אינפיניטי"
];

const transmissionTypes = ["אוטומט", "ידני", "אוטומט רובוטי", "CVT"];
const fuelTypes = ["בנזין", "דיזל", "היברידי", "חשמלי", "גז"];
const handTypes = ["יד ראשונה", "יד שנייה", "יד שלישית", "יד רביעית+"];
const colors = [
  "לבן", "שחור", "כסף", "אפור", "כחול", "אדום", "ירוק", "חום", 
  "זהב", "לבן פנינה", "כסף מטאלי", "אפור מטאלי", "כחול מטאלי", 
  "אדום מטאלי", "ירוק מטאלי"
];

const locations = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "נתניה", "פתח תקווה",
  "אשדוד", "ראשון לציון", "אשקלון", "רחובות", "בת ים", "הרצליה",
  "רמת גן", "בני ברק", "חולון", "רמלה", "לוד", "נס ציונה"
];

// דוגמאות לדגמים לפי יצרן
const modelsByManufacturer: { [key: string]: string[] } = {
  "טויוטה": ["קורולה", "קמרי", "ראב 4", "היילנדר", "פריוס", "יאריס", "אוריס"],
  "הונדה": ["סיוויק", "אקורד", "CR-V", "HR-V", "פיט", "פילוט"],
  "מזדה": ["3", "6", "CX-3", "CX-5", "CX-7", "CX-9", "MX-5"],
  "ניסאן": ["סנטרה", "אלטימה", "ג'וק", "קשקאי", "X-Trail", "פתפיינדר"],
  "היונדאי": ["i20", "i30", "אלנטרה", "סונטה", "טוסון", "סנטה פה"],
  "קיא": ["ריו", "סראטו", "אופטימה", "ספורטאז'", "סורנטו", "קרנבל"]
};

const DealerAddCarPage = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<CarFormData>({
    manufacturer: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    engineSize: '',
    transmission: '',
    fuelType: '',
    color: '',
    hand: '',
    location: '',
    description: 'רכב במצב מעולה, שירות מלא בהתאמה לספר השירותים. אפשרות למימון ולהחלפה.'
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // נתוני סוחר נוכחי
  const currentDealer = {
    name: "רכבי פרימיום",
    phone: "050-1234567"
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.manufacturer) newErrors.manufacturer = 'יש לבחור יצרן';
    if (!formData.model) newErrors.model = 'יש להזין דגם';
    if (!formData.year) newErrors.year = 'יש להזין שנת יצור';
    if (!formData.price) newErrors.price = 'יש להזין מחיר';
    if (!formData.mileage) newErrors.mileage = 'יש להזין קילומטרים';
    if (!formData.transmission) newErrors.transmission = 'יש לבחור תיבת הילוכים';
    if (!formData.fuelType) newErrors.fuelType = 'יש לבחור סוג דלק';
    if (!formData.color) newErrors.color = 'יש לבחור צבע';
    if (!formData.hand) newErrors.hand = 'יש לבחור יד';
    if (!formData.location) newErrors.location = 'יש לבחור מיקום';

    // בדיקות ספציפיות
    if (formData.year && (parseInt(formData.year) < 1990 || parseInt(formData.year) > new Date().getFullYear() + 1)) {
      newErrors.year = 'שנה לא תקינה';
    }
    if (formData.price && parseInt(formData.price) < 1000) {
      newErrors.price = 'מחיר נמוך מדי';
    }
    if (formData.mileage && parseInt(formData.mileage) < 0) {
      newErrors.mileage = 'קילומטרים לא יכולים להיות שליליים';
    }
    if (formData.engineSize && (parseFloat(formData.engineSize) < 0.8 || parseFloat(formData.engineSize) > 8.0)) {
      newErrors.engineSize = 'נפח מנוע לא תקין';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const newCar = {
      id: Date.now(),
      manufacturer: formData.manufacturer,
      model: formData.model,
      year: parseInt(formData.year),
      price: parseInt(formData.price),
      mileage: parseInt(formData.mileage),
      engineSize: parseFloat(formData.engineSize || '2.0'),
      transmission: formData.transmission,
      fuelType: formData.fuelType,
      color: formData.color,
      hand: formData.hand,
      location: formData.location,
      dealerName: currentDealer.name,
      dealerPhone: currentDealer.phone,
      views: 0,
      inquiries: 0,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      description: formData.description,
      images: []
    };

    // שמירה ב-localStorage (בפועל ישלח לשרת)
    const existingCars = JSON.parse(localStorage.getItem('dealerCars') || '[]');
    localStorage.setItem('dealerCars', JSON.stringify([newCar, ...existingCars]));

    setIsSubmitted(true);
  };

  const formatPrice = (price: string): string => {
    if (!price) return '';
    return new Intl.NumberFormat('he-IL').format(parseInt(price)) + ' ₪';
  };

  const formatMileage = (mileage: string): string => {
    if (!mileage) return '';
    return new Intl.NumberFormat('he-IL').format(parseInt(mileage)) + ' ק"מ';
  };

  const getModelSuggestions = () => {
    if (!formData.manufacturer || !modelsByManufacturer[formData.manufacturer]) {
      return [];
    }
    return modelsByManufacturer[formData.manufacturer];
  };

  const fillSampleData = () => {
    setFormData({
      manufacturer: 'טויוטה',
      model: 'קמרי',
      year: '2021',
      price: '185000',
      mileage: '45000',
      engineSize: '2.5',
      transmission: 'אוטומט',
      fuelType: 'היברידי',
      color: 'לבן פנינה',
      hand: 'יד ראשונה',
      location: 'תל אביב',
      description: 'רכב במצב מעולה, שירות מלא בהתאמה לספר השירותים. צבע יפה ונדיר, מושבי עור, מערכת מולטימדיה מתקדמת ומערכות בטיחות חדישות.'
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50" dir="rtl">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="text-center">
            <CardContent className="py-12">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                הרכב נוסף בהצלחה!
              </h1>
              <p className="text-gray-600 mb-8">
                הרכב {formData.manufacturer} {formData.model} {formData.year} נפרסם ופעיל לחיפוש.
                <br />קונים יוכלו לראות אותו ולשלוח פניות.
              </p>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-8">
                <h3 className="font-semibold text-blue-900 mb-3">מה קורה עכשיו?</h3>
                <div className="text-blue-700 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>הרכב מופיע בחיפושים של קונים</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>קונים מעוניינים יוכלו לשלוח פניות</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>תוכל לעקוב אחר צפיות ופניות בניהול המלאי</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 ml-2" />
                  הוסף רכב נוסף
                </Button>
                <Button variant="outline">
                  <Car className="h-4 w-4 ml-2" />
                  ניהול מלאי
                </Button>
                <Button variant="outline">
                  חזרה לדף הבית
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              חזרה לניהול מלאי
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">הוספת רכב חדש</h1>
              <p className="text-sm text-gray-600">פרסם רכב חדש במלאי שלך</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* טופס ראשי */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* פרטי הרכב הבסיסיים */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  פרטי הרכב
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                {/* יצרן ודגם */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="manufacturer">יצרן *</Label>
                    <Select 
                      value={formData.manufacturer} 
                      onValueChange={(value) => setFormData({...formData, manufacturer: value, model: ''})}
                    >
                      <SelectTrigger className={`mt-1 ${errors.manufacturer ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="בחר יצרן" />
                      </SelectTrigger>
                      <SelectContent>
                        {manufacturers.map(manufacturer => (
                          <SelectItem key={manufacturer} value={manufacturer}>
                            {manufacturer}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.manufacturer && <p className="text-xs text-red-600 mt-1">{errors.manufacturer}</p>}
                  </div>

                  <div>
                    <Label htmlFor="model">דגם *</Label>
                    <div className="relative">
                      <Input
                        id="model"
                        placeholder="למשל: קמרי, סיוויק, CX-5..."
                        value={formData.model}
                        onChange={(e) => setFormData({...formData, model: e.target.value})}
                        className={`mt-1 ${errors.model ? 'border-red-500' : ''}`}
                      />
                      {getModelSuggestions().length > 0 && !formData.model && (
                        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-10 mt-1">
                          <div className="p-2 text-xs text-gray-500 border-b">דגמים פופולריים:</div>
                          {getModelSuggestions().slice(0, 5).map(model => (
                            <button
                              key={model}
                              type="button"
                              className="w-full text-right px-3 py-2 text-sm hover:bg-gray-50"
                              onClick={() => setFormData({...formData, model})}
                            >
                              {model}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {errors.model && <p className="text-xs text-red-600 mt-1">{errors.model}</p>}
                  </div>
                </div>

                {/* שנה ומחיר */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year">שנת יצור *</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="2021"
                      min="1990"
                      max={new Date().getFullYear() + 1}
                      value={formData.year}
                      onChange={(e) => setFormData({...formData, year: e.target.value})}
                      className={`mt-1 ${errors.year ? 'border-red-500' : ''}`}
                    />
                    {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year}</p>}
                  </div>

                  <div>
                    <Label htmlFor="price">מחיר (₪) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="185000"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className={`mt-1 ${errors.price ? 'border-red-500' : ''}`}
                    />
                    {formData.price && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatPrice(formData.price)}
                      </div>
                    )}
                    {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
                  </div>
                </div>

                {/* קילומטרים ונפח מנוע */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="mileage">קילומטרים *</Label>
                    <Input
                      id="mileage"
                      type="number"
                      placeholder="45000"
                      min="0"
                      value={formData.mileage}
                      onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                      className={`mt-1 ${errors.mileage ? 'border-red-500' : ''}`}
                    />
                    {formData.mileage && (
                      <div className="text-xs text-gray-500 mt-1">
                        {formatMileage(formData.mileage)}
                      </div>
                    )}
                    {errors.mileage && <p className="text-xs text-red-600 mt-1">{errors.mileage}</p>}
                  </div>

                  <div>
                    <Label htmlFor="engineSize">נפח מנוע (ליטר)</Label>
                    <Input
                      id="engineSize"
                      type="number"
                      step="0.1"
                      placeholder="2.0"
                      min="0.8"
                      max="8.0"
                      value={formData.engineSize}
                      onChange={(e) => setFormData({...formData, engineSize: e.target.value})}
                      className={`mt-1 ${errors.engineSize ? 'border-red-500' : ''}`}
                    />
                    {errors.engineSize && <p className="text-xs text-red-600 mt-1">{errors.engineSize}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* מפרט טכני */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  מפרט טכני
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="transmission">תיבת הילוכים *</Label>
                    <Select 
                      value={formData.transmission} 
                      onValueChange={(value) => setFormData({...formData, transmission: value})}
                    >
                      <SelectTrigger className={`mt-1 ${errors.transmission ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="בחר תיבת הילוכים" />
                      </SelectTrigger>
                      <SelectContent>
                        {transmissionTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.transmission && <p className="text-xs text-red-600 mt-1">{errors.transmission}</p>}
                  </div>

                  <div>
                    <Label htmlFor="fuelType">סוג דלק *</Label>
                    <Select 
                      value={formData.fuelType} 
                      onValueChange={(value) => setFormData({...formData, fuelType: value})}
                    >
                      <SelectTrigger className={`mt-1 ${errors.fuelType ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="בחר סוג דלק" />
                      </SelectTrigger>
                      <SelectContent>
                        {fuelTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.fuelType && <p className="text-xs text-red-600 mt-1">{errors.fuelType}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="color">צבע *</Label>
                    <Select 
                      value={formData.color} 
                      onValueChange={(value) => setFormData({...formData, color: value})}
                    >
                      <SelectTrigger className={`mt-1 ${errors.color ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="בחר צבע" />
                      </SelectTrigger>
                      <SelectContent>
                        {colors.map(color => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.color && <p className="text-xs text-red-600 mt-1">{errors.color}</p>}
                  </div>

                  <div>
                    <Label htmlFor="hand">יד *</Label>
                    <Select 
                      value={formData.hand} 
                      onValueChange={(value) => setFormData({...formData, hand: value})}
                    >
                      <SelectTrigger className={`mt-1 ${errors.hand ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="בחר יד" />
                      </SelectTrigger>
                      <SelectContent>
                        {handTypes.map(type => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.hand && <p className="text-xs text-red-600 mt-1">{errors.hand}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* מיקום ותיאור */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  מיקום ותיאור
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <div>
                  <Label htmlFor="location">מיקום הרכב *</Label>
                  <Select 
                    value={formData.location} 
                    onValueChange={(value) => setFormData({...formData, location: value})}
                  >
                    <SelectTrigger className={`mt-1 ${errors.location ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="בחר מיקום" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.location && <p className="text-xs text-red-600 mt-1">{errors.location}</p>}
                </div>

                <div>
                  <Label htmlFor="description">תיאור הרכב</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="mt-1"
                    placeholder="תאר את מצב הרכב, ציוד מיוחד, הסטוריה וכל פרט נוסף שחשוב לקונים..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    תיאור איכותי עוזר לקונים להבין מה מיוחד ברכב שלך
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* כפתורי פעולה */}
            <Card>
              <CardContent className="py-6">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleSubmit}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                  >
                    <Plus className="h-5 w-5 ml-2" />
                    פרסם רכב
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(!showPreview)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {showPreview ? 'הסתר תצוגה' : 'תצוגה מקדימה'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* סייד-בר עם מידע ועזרה */}
          <div className="space-y-6">
            
            {/* מילוי מהיר לדמו */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  מילוי מהיר
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  רוצה לראות איך הטופס נראה עם נתונים מלאים?
                </p>
                <Button
                  variant="outline"
                  onClick={fillSampleData}
                  className="w-full"
                >
                  מלא נתוני דמו
                </Button>
              </CardContent>
            </Card>

            {/* תצוגה מקדימה */}
            {showPreview && formData.manufacturer && formData.model && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">תצוגה מקדימה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">
                          {formData.manufacturer} {formData.model} {formData.year}
                        </h3>
                        <div className="text-sm text-gray-600">{formData.location}</div>
                      </div>
                      <div className="text-right">
                        {formData.price && (
                          <div className="font-bold text-blue-600">
                            {formatPrice(formData.price)}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-700 space-y-1">
                      {formData.mileage && (
                        <div>{formatMileage(formData.mileage)}</div>
                      )}
                      {formData.transmission && formData.fuelType && (
                        <div>{formData.transmission} • {formData.fuelType}</div>
                      )}
                      {formData.color && formData.hand && (
                        <div>{formData.color} • {formData.hand}</div>
                      )}
                    </div>
                    
                    {formData.description && (
                      <div className="text-sm text-gray-600 mt-3 line-clamp-3">
                        {formData.description}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* טיפים */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  טיפים למודעה מוצלחת
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>כתב תיאור מפורט - ציין מצב הרכב, שירותים שנעשו ואקסטרה</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>ציין אם הרכב עבר תאונות או יש לו בעיות ידועות - זה יוצר אמון</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>בדוק את המחיר מול רכבים דומים בשוק לפני פרסום</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2"></div>
                  <span>תמונות איכותיות יגדילו משמעותית את מספר הפניות</span>
                </div>
              </CardContent>
            </Card>

            {/* סטטיסטיקות */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  הפלטפורמה שלנו
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">חיפושים חודשיים</span>
                    <span className="font-semibold">12,000+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">רכבים פעילים</span>
                    <span className="font-semibold">850+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">פניות השבוع</span>
                    <span className="font-semibold">145</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">זמן ממוצע למכירה</span>
                    <span className="font-semibold">18 ימים</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* תנאים */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  חשוב לדעת
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div>• הרכב יופיע בחיפושים תוך כמה דקות</div>
                <div>• תוכל לערוך או להשהות את המודעה בכל עת</div>
                <div>• פניות מקונים יגיעו ישירות אליך בטלפון</div>
                <div>• אין עמלה על פרסום - רק על מכירה מוצלחת</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerAddCarPage;