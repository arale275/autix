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
import { carEvents } from "@/lib/events/carEvents";

// ✅ Import from central constants file (מעודכן עם כל הנתונים החדשים)
import {
  CAR_MANUFACTURERS_HEBREW,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  CAR_COLORS,
  ISRAELI_CITIES,
  CAR_YEARS,
  VALIDATION,
  ENGINE_SIZES,
  CAR_CONDITIONS,
  CAR_HANDS,
  BODY_TYPES,
  CAR_FEATURES,
  DEFAULTS,
} from "@/lib/constants";
import { invalidateCarCache } from "@/hooks/api/useCars";

interface CarFormProps {
  car?: Car;
  mode?: "create" | "edit";
  onSuccess?: (carId?: number) => void; // ✅ הוספת carId לcallback
}

// ✅ הסרת ההגדרות המקומיות - הכל מגיע מהקובץ המרכזי כעת

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
    fuelType: car?.fuelTypeOriginal || "", // ✅ ערך מקורי
    transmission: car?.transmissionOriginal || "", // ✅ ערך מקורי
    condition: car?.conditionOriginal || "", // ✅ ערך מקורי
    hand: car?.hand || "",
    color: car?.color || "",
    description: car?.description || "",
    city: car?.city || "",
    engineSize: car?.engineSize || "",
    bodyType: car?.bodyTypeOriginal || "", // ✅ ערך מקורי
    features: car?.features || [],
  });

  const handleFeatureToggle = (featureValue: string) => {
    // ✅ טיפוס מפורש
    const currentFeatures = formData.features || [];
    const isSelected = currentFeatures.includes(featureValue);

    const updatedFeatures = isSelected
      ? currentFeatures.filter((f: string) => f !== featureValue) // ✅ טיפוס מפורש
      : [...currentFeatures, featureValue];

    handleChange("features", updatedFeatures);
  };

  const handleChange = (field: string, value: string | string[]) => {
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
      parseInt(formData.year) < VALIDATION.CAR_YEAR_MIN ||
      parseInt(formData.year) > VALIDATION.CAR_YEAR_MAX
    ) {
      toast.error(
        `שנת ייצור לא תקינה (${VALIDATION.CAR_YEAR_MIN}-${VALIDATION.CAR_YEAR_MAX})`
      );
      return false;
    }
    if (
      !formData.price ||
      parseInt(formData.price) < VALIDATION.CAR_PRICE_MIN
    ) {
      toast.error(
        `מחיר חייב להיות גדול מ-${VALIDATION.CAR_PRICE_MIN.toLocaleString()} ₪`
      );
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

        // ✅ שלח event עם carId הנכון
        carEvents.emitCarUpdate(car.id, "update", {
          action: "car_updated",
          carId: car.id,
          updatedData: carResult,
        });

        // ✅ רענון cache
        invalidateCarCache(car.id);
      } else {
        carResult = await carsApi.addCar(carData);
        toast.success("הרכב נוסף בהצלחה");

        // ✅ שלח event לרכב חדש
        carEvents.emitCarListUpdate("add", {
          action: "car_added",
          carId: carResult?.id,
          newCar: carResult,
        });

        // ✅ רענון cache
        invalidateCarCache();
      }

      // העלאת תמונות לרכב חדש
      if (mode === "create" && selectedImages.length > 0 && carResult?.id) {
        toast.info("מעלה תמונות...");

        try {
          const uploadResult = await uploadMultipleImages(
            carResult.id,
            selectedImages
          );

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
        onSuccess(carResult?.id); // ✅ העברת carId לcallback
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
    options: readonly { readonly value: string; readonly label: string }[],
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
                      {CAR_MANUFACTURERS_HEBREW.map((manufacturer) => (
                        <SelectItem
                          key={manufacturer.value}
                          value={manufacturer.label}
                        >
                          {manufacturer.label}
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
                  <Select
                    value={formData.year}
                    onValueChange={(value) => handleChange("year", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר שנה" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {CAR_YEARS.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">מחיר (₪) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min={VALIDATION.CAR_PRICE_MIN}
                    max={VALIDATION.CAR_PRICE_MAX}
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
                    max={VALIDATION.CAR_MILEAGE_MAX}
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
                      {CAR_COLORS.map((color) => (
                        <SelectItem key={color.value} value={color.label}>
                          {color.label}
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
                      {CAR_CONDITIONS.map((type) => (
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
                      {CAR_HANDS.map((type) => (
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
                        <SelectItem key={size.value} value={size.value}>
                          {size.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>סוג מרכב</Label>
                  <Select
                    value={formData.bodyType}
                    onValueChange={(value) => handleChange("bodyType", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="בחר סוג מרכב" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {BODY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
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
                      {ISRAELI_CITIES.map((city) => (
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
                  placeholder={DEFAULTS.CAR_DESCRIPTION_PLACEHOLDER}
                  rows={4}
                  maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
                />
                <div className="text-xs text-gray-500 text-left">
                  {formData.description.length}/
                  {VALIDATION.DESCRIPTION_MAX_LENGTH} תווים
                </div>
              </div>
            </div>

            {/* תוספות ואביזרים */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                תוספות ואביזרים
              </h3>

              <div className="text-sm text-gray-600 mb-4">
                בחר את התוספות והאביזרים הקיימים ברכב (אופציונלי)
              </div>

              {/* חלוקה לקטגוריות */}
              <div className="space-y-6">
                {/* בטיחות */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    🛡️ בטיחות
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CAR_FEATURES.filter(
                      (
                        f: { value: string; label: string } // ✅ טיפוס מפורש
                      ) =>
                        [
                          "abs",
                          "airbags",
                          "esp",
                          "parking_sensors",
                          "reverse_camera",
                          "360_camera",
                          "blind_spot",
                          "lane_assist",
                          "cruise_control",
                          "adaptive_cruise",
                        ].includes(f.value)
                    ).map((feature) => (
                      <label
                        key={feature.value}
                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.value)}
                          onChange={() => handleFeatureToggle(feature.value)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* נוחות */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    🛋️ נוחות
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CAR_FEATURES.filter((f) =>
                      [
                        "leather_seats",
                        "heated_seats",
                        "cooled_seats",
                        "electric_seats",
                        "sunroof",
                        "panoramic_roof",
                        "automatic_parking",
                        "keyless",
                        "remote_start",
                      ].includes(f.value)
                    ).map((feature) => (
                      <label
                        key={feature.value}
                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.value)}
                          onChange={() => handleFeatureToggle(feature.value)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* מולטימדיה */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    📱 מולטימדיה
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CAR_FEATURES.filter((f) =>
                      [
                        "gps",
                        "bluetooth",
                        "usb",
                        "aux",
                        "wireless_charging",
                        "premium_audio",
                        "rear_entertainment",
                        "android_auto",
                        "apple_carplay",
                      ].includes(f.value)
                    ).map((feature) => (
                      <label
                        key={feature.value}
                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.value)}
                          onChange={() => handleFeatureToggle(feature.value)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* אקלים */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    ❄️ אקלים
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CAR_FEATURES.filter((f) =>
                      [
                        "air_conditioning",
                        "dual_zone_ac",
                        "rear_ac",
                        "heated_steering",
                      ].includes(f.value)
                    ).map((feature) => (
                      <label
                        key={feature.value}
                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.value)}
                          onChange={() => handleFeatureToggle(feature.value)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* חיצוני */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    🚗 חיצוני
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {CAR_FEATURES.filter((f) =>
                      [
                        "alloy_wheels",
                        "led_lights",
                        "xenon_lights",
                        "fog_lights",
                        "roof_rails",
                        "tow_bar",
                      ].includes(f.value)
                    ).map((feature) => (
                      <label
                        key={feature.value}
                        className="flex items-center gap-2 p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature.value)}
                          onChange={() => handleFeatureToggle(feature.value)}
                          className="rounded text-blue-600"
                        />
                        <span className="text-sm">{feature.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* סיכום תוספות */}
              {formData.features &&
                formData.features.length > 0 && ( // ✅ בדיקת קיום
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-sm font-medium text-blue-900 mb-2">
                      תוספות נבחרות ({formData.features.length}):
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.features.map((featureValue: string) => {
                        // ✅ טיפוס מפורש
                        const feature = CAR_FEATURES.find(
                          (f: { value: string; label: string }) =>
                            f.value === featureValue
                        ); // ✅ טיפוס מפורש
                        return (
                          <span
                            key={featureValue}
                            className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                          >
                            {feature?.label || featureValue}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
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
                    {getLabelByValue(CAR_CONDITIONS, formData.condition)}
                  </div>
                  <div>
                    <strong>יד:</strong>{" "}
                    {getLabelByValue(CAR_HANDS, formData.hand)}
                  </div>
                  {formData.bodyType && (
                    <div>
                      <strong>סוג מרכב:</strong>{" "}
                      {getLabelByValue(BODY_TYPES, formData.bodyType)}
                    </div>
                  )}
                  {formData.engineSize && (
                    <div>
                      <strong>נפח מנוע:</strong>{" "}
                      {getLabelByValue(ENGINE_SIZES, formData.engineSize)}
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
                {formData.features &&
                  formData.features.length > 0 && ( // ✅ בדיקת קיום
                    <div>
                      <strong>תוספות:</strong> {formData.features.length} תוספות
                      נבחרו
                    </div>
                  )}
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
