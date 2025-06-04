"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "./ImageUploader";
import { carsApi } from "@/lib/api/cars";
import { useImages } from "@/hooks/useImages";
import { Car } from "@/lib/api/types";
import { toast } from "sonner";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface CarFormProps {
  car?: Car;
  mode?: "create" | "edit";
  onSuccess?: () => void;
}

// נתונים לתפריטים הנפתחים
const CAR_MAKES = [
  "טויוטה",
  "הונדה",
  "מזדה",
  "ניסאן",
  "יונדיי",
  "קיה",
  "מיצובישי",
  "סובארו",
  "BMW",
  "מרצדס",
  "אאודי",
  "פולקסווגן",
  "סקודה",
  "סיאט",
  "פיג'ו",
  "רנו",
  "פורד",
  "שברולט",
  "אופל",
  "סיטרואן",
  "פיאט",
  "אלפא רומיאו",
  "לקסוס",
  "אינפיניטי",
  "אקורה",
  "וולוו",
  "לנד רובר",
  "יגואר",
  "פורשה",
  "מיני",
  "ג'יפ",
  "דודג'",
  "קדילק",
  "לינקולן",
  "טסלא",
  "BYD",
  "MG",
];

const CITIES = [
  "תל אביב",
  "ירושלים",
  "חיפה",
  "ראשון לציון",
  "פתח תקווה",
  "אשדוד",
  "נתניה",
  "באר שבע",
  "בני ברק",
  "חולון",
  "רמת גן",
  "אשקלון",
  "רחובות",
  "בת ים",
  "כפר סבא",
  "הרצליה",
  "חדרה",
  "מודיעין",
  "לוד",
  "רעננה",
  "נהריה",
  "אילת",
  "אריאל",
  "גבעתיים",
  "קריית אתא",
  "עכו",
  "קריית גת",
  "קריית מוצקין",
  "קריית ים",
  "קריית ביאליק",
  "קריית מלאכי",
  "עפולה",
  "נצרת",
  "טבריה",
  "צפת",
  "דימונה",
  "אור יהודה",
  "יהוד מונוסון",
  "גדרה",
  "נס ציונה",
  "אלעד",
  "בית שמש",
  "מעלה אדומים",
  "קרני שומרון",
];

const COLORS = [
  "לבן",
  "שחור",
  "כסף",
  "אפור",
  "כחול",
  "אדום",
  "ירוק",
  "חום",
  "זהוב",
  "ברונזה",
  "סגול",
  "ורוד",
  "צהוב",
  "כתום",
  "בז'",
  "שמפניה",
];

const ENGINE_SIZES = [
  "1.0",
  "1.2",
  "1.3",
  "1.4",
  "1.5",
  "1.6",
  "1.8",
  "2.0",
  "2.2",
  "2.4",
  "2.5",
  "2.7",
  "3.0",
  "3.2",
  "3.5",
  "4.0",
  "4.2",
  "4.4",
  "4.6",
  "5.0",
  "5.2",
  "5.7",
  "6.0",
  "6.2",
];

const FUEL_TYPES = [
  { value: "gasoline", label: "בנזין" },
  { value: "diesel", label: "דיזל" },
  { value: "hybrid", label: "היברידי" },
  { value: "electric", label: "חשמלי" },
];

const TRANSMISSION_TYPES = [
  { value: "manual", label: "ידני" },
  { value: "automatic", label: "אוטומטי" },
];

const CONDITION_TYPES = [
  { value: "new", label: "חדש" },
  { value: "used", label: "משומש" },
];

const HAND_TYPES = [
  { value: "1", label: "יד ראשונה" },
  { value: "2", label: "יד שנייה" },
  { value: "3+", label: "יד שלישית ומעלה" },
];

export default function CarForm({
  car,
  mode = "create",
  onSuccess,
}: CarFormProps) {
  const router = useRouter();
  const { uploadMultipleImages } = useImages();

  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [showImageSection, setShowImageSection] = useState(false);

  const [formData, setFormData] = useState({
    make: car?.make || "",
    model: car?.model || "",
    year: car?.year?.toString() || "",
    price: car?.price?.toString() || "",
    mileage: car?.mileage?.toString() || "",
    fuelType: car?.fuelType || "",
    transmission: car?.transmission || "",
    condition: "", // השדה לא קיים ב-Car type עדיין, נתחיל עם ערך ריק
    hand: car?.hand || "",
    color: car?.color || "",
    description: car?.description || "",
    city: car?.city || "",
    engineSize: car?.engineSize || "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImagesChange = (files: File[]) => {
    setSelectedImages(files);
  };

  const validateForm = (): boolean => {
    if (!formData.make.trim()) {
      toast.error("נדרש לציין יצרן");
      return false;
    }
    if (!formData.model.trim()) {
      toast.error("נדרש לציין דגם");
      return false;
    }
    if (
      !formData.year ||
      parseInt(formData.year) < 1990 ||
      parseInt(formData.year) > 2025
    ) {
      toast.error("שנת ייצור לא תקינה (1990-2025)");
      return false;
    }
    if (!formData.price || parseInt(formData.price) <= 0) {
      toast.error("מחיר חייב להיות גדול מאפס");
      return false;
    }
    if (!formData.mileage || parseInt(formData.mileage) < 0) {
      toast.error("קילומטראז' לא תקין");
      return false;
    }
    if (!formData.fuelType) {
      toast.error("נדרש לבחור סוג דלק");
      return false;
    }
    if (!formData.transmission) {
      toast.error("נדרש לבחור סוג תיבת הילוכים");
      return false;
    }
    if (!formData.condition) {
      toast.error("נדרש לבחור מצב הרכב");
      return false;
    }
    if (!formData.hand) {
      toast.error("נדרש לבחור יד");
      return false;
    }
    if (!formData.city.trim()) {
      toast.error("נדרש לציין עיר");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        price: parseInt(formData.price),
        mileage: parseInt(formData.mileage),
      };

      let carResult;

      if (mode === "edit" && car?.id) {
        carResult = await carsApi.updateCar(car.id, carData);
        toast.success("הרכב עודכן בהצלחה");
      } else {
        carResult = await carsApi.addCar(carData);
        toast.success("הרכב נוסף בהצלחה");
      }

      // העלאת תמונות לרכב חדש
      if (mode === "create" && selectedImages.length > 0 && carResult?.id) {
        toast.info("מעלה תמונות...");

        try {
          const uploadResult = await uploadMultipleImages(
            carResult.id,
            selectedImages
          );

          // תיקון השגיאה - בדיקה אם זה array או boolean
          if (Array.isArray(uploadResult) && uploadResult.length > 0) {
            toast.success(`${uploadResult.length} תמונות הועלו בהצלחה!`);
          } else if (uploadResult === true) {
            toast.success("תמונות הועלו בהצלחה!");
          } else {
            toast.warning("הרכב נוסף בהצלחה, אך יתכן שחלק מהתמונות לא הועלו");
          }
        } catch (imageError) {
          console.error("שגיאה בהעלאת תמונות:", imageError);
          toast.warning(
            "הרכב נוסף בהצלחה, אך התמונות לא הועלו. תוכל להעלות אותן מאוחר יותר."
          );
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push("/dealer/cars");
      }
    } catch (error: any) {
      console.error("שגיאה בשמירת הרכב:", error);
      toast.error(error.message || "אירעה שגיאה בשמירת הרכב");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueToImages = () => {
    if (validateForm()) {
      setShowImageSection(true);
    }
  };

  const handleBackToForm = () => {
    setShowImageSection(false);
  };

  // פונקציה לקבלת תווית מתפריט
  const getLabelByValue = (
    options: { value: string; label: string }[],
    value: string
  ) => {
    return options.find((option) => option.value === value)?.label || value;
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          {mode === "edit" ? "עריכת רכב" : "הוספת רכב חדש"}
        </CardTitle>

        {/* Progress indicator for create mode */}
        {mode === "create" && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <div
              className={`flex items-center gap-2 ${
                !showImageSection ? "text-blue-600" : "text-green-600"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  !showImageSection
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {!showImageSection ? "1" : "✓"}
              </div>
              <span className="hidden sm:inline">פרטי הרכב</span>
            </div>

            <div
              className={`w-12 h-1 ${
                showImageSection ? "bg-blue-600" : "bg-gray-200"
              }`}
            />

            <div
              className={`flex items-center gap-2 ${
                showImageSection ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  showImageSection
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                2
              </div>
              <span className="hidden sm:inline">תמונות</span>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {!showImageSection ? (
          // Step 1: Car Details Form
          <form
            onSubmit={
              mode === "create"
                ? (e) => {
                    e.preventDefault();
                    handleContinueToImages();
                  }
                : handleSubmit
            }
            className="space-y-6"
          >
            {/* פרטי רכב בסיסיים */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">פרטי הרכב</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>יצרן *</Label>
                  <Select
                    value={formData.make}
                    onValueChange={(value) => handleChange("make", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר יצרן" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {CAR_MAKES.map((make) => (
                        <SelectItem key={make} value={make}>
                          {make}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">דגם *</Label>
                  <Input
                    id="model"
                    value={formData.model}
                    onChange={(e) => handleChange("model", e.target.value)}
                    placeholder="קורולה, סיוויק, גולף..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">שנת יצור *</Label>
                  <Input
                    id="year"
                    type="number"
                    min="1990"
                    max="2025"
                    value={formData.year}
                    onChange={(e) => handleChange("year", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">מחיר (₪) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleChange("price", e.target.value)}
                    placeholder="150000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mileage">קילומטראז' *</Label>
                  <Input
                    id="mileage"
                    type="number"
                    min="0"
                    value={formData.mileage}
                    onChange={(e) => handleChange("mileage", e.target.value)}
                    placeholder="50000"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>צבע</Label>
                  <Select
                    value={formData.color}
                    onValueChange={(value) => handleChange("color", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר צבע" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {COLORS.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* מאפיינים טכניים */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                מאפיינים טכניים
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>סוג דלק *</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => handleChange("fuelType", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר סוג דלק" />
                    </SelectTrigger>
                    <SelectContent>
                      {FUEL_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>תיבת הילוכים *</Label>
                  <Select
                    value={formData.transmission}
                    onValueChange={(value) =>
                      handleChange("transmission", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר תיבת הילוכים" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRANSMISSION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>מצב הרכב *</Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value) => handleChange("condition", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר מצב" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDITION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>יד *</Label>
                  <Select
                    value={formData.hand}
                    onValueChange={(value) => handleChange("hand", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר יד" />
                    </SelectTrigger>
                    <SelectContent>
                      {HAND_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>נפח מנוע (ליטר)</Label>
                  <Select
                    value={formData.engineSize}
                    onValueChange={(value) => handleChange("engineSize", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר נפח מנוע" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {ENGINE_SIZES.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size} ליטר
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>עיר *</Label>
                  <Select
                    value={formData.city}
                    onValueChange={(value) => handleChange("city", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר עיר" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {CITIES.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* תיאור */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                תיאור נוסף
              </h3>

              <div className="space-y-2">
                <Label htmlFor="description">תיאור מפורט</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="פרטים נוספים על הרכב, ציוד מיוחד, מצב כללי, שדרוגים, היסטוריית תחזוקה..."
                  rows={4}
                />
              </div>
            </div>

            {/* כפתורי פעולה */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? (
                  <>
                    <LoadingSpinner className="w-4 h-4 mr-2" />
                    שומר...
                  </>
                ) : mode === "edit" ? (
                  "עדכן רכב"
                ) : (
                  "המשך לתמונות"
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/dealer/cars")}
                disabled={loading}
              >
                ביטול
              </Button>
            </div>
          </form>
        ) : (
          // Step 2: Images Upload (Create mode only)
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">העלה תמונות של הרכב</h3>
              <p className="text-gray-600">
                תמונות איכותיות מגדילות את הסיכויים למכירה מהירה
              </p>
            </div>

            <ImageUploader
              onImagesChange={handleImagesChange}
              maxImages={5}
              disabled={loading}
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">
                טיפים לתמונות מושלמות:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• צלם בתאורה טבעית (יום)</li>
                <li>• כלול תמונות של החזית, האחורה והצדדים</li>
                <li>• צלם את פנים הרכב ולוח המחוונים</li>
                <li>• הצג אביזרים מיוחדים או שדרוגים</li>
                <li>• וודא שהרכב נקי לפני הצילום</li>
              </ul>
            </div>

            {/* Car Summary */}
            <Card className="bg-gray-50">
              <CardHeader>
                <CardTitle className="text-lg">סיכום פרטי הרכב</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <strong>רכב:</strong> {formData.make} {formData.model}
                  </div>
                  <div>
                    <strong>שנה:</strong> {formData.year}
                  </div>
                  <div>
                    <strong>מחיר:</strong> ₪
                    {parseInt(formData.price || "0").toLocaleString()}
                  </div>
                  <div>
                    <strong>ק"מ:</strong>{" "}
                    {parseInt(formData.mileage || "0").toLocaleString()}
                  </div>
                  <div>
                    <strong>דלק:</strong>{" "}
                    {getLabelByValue(FUEL_TYPES, formData.fuelType)}
                  </div>
                  <div>
                    <strong>תיבה:</strong>{" "}
                    {getLabelByValue(TRANSMISSION_TYPES, formData.transmission)}
                  </div>
                  <div>
                    <strong>מצב:</strong>{" "}
                    {getLabelByValue(CONDITION_TYPES, formData.condition)}
                  </div>
                  <div>
                    <strong>יד:</strong>{" "}
                    {getLabelByValue(HAND_TYPES, formData.hand)}
                  </div>
                  {formData.engineSize && (
                    <div>
                      <strong>נפח מנוע:</strong> {formData.engineSize} ליטר
                    </div>
                  )}
                  {formData.color && (
                    <div>
                      <strong>צבע:</strong> {formData.color}
                    </div>
                  )}
                  <div>
                    <strong>עיר:</strong> {formData.city}
                  </div>
                </div>
                <div className="pt-2 border-t">
                  <strong>תמונות:</strong> {selectedImages.length} תמונות נבחרו
                </div>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex justify-between gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToForm}
                disabled={loading}
              >
                חזור לעריכה
              </Button>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/dealer/cars")}
                  disabled={loading}
                >
                  ביטול
                </Button>

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  {loading ? (
                    <>
                      <LoadingSpinner className="w-4 h-4 mr-2" />
                      שומר...
                    </>
                  ) : (
                    "פרסם רכב"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
