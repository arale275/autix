// server/src/middleware/cars.validation.ts - מתוקן
import { Request, Response, NextFunction } from "express";

// Validation פשוט ללא express-validator
export const validateAddCar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { make, model, year, price } = req.body;
  const errors: string[] = [];

  // בדיקות חובה
  if (!make || typeof make !== "string" || make.trim().length < 2) {
    errors.push("יצרן הרכב חובה (לפחות 2 תווים)");
  }

  if (!model || typeof model !== "string" || model.trim().length < 1) {
    errors.push("דגם הרכב חובה");
  }

  if (
    !year ||
    typeof year !== "number" ||
    year < 1980 ||
    year > new Date().getFullYear() + 1
  ) {
    errors.push(
      `שנת הרכב חייבת להיות בין 1980 ל-${new Date().getFullYear() + 1}`
    );
  }

  if (!price || typeof price !== "number" || price < 1000) {
    errors.push("מחיר הרכב חייב להיות לפחות 1,000 ₪");
  }

  // בדיקות אופציונליות
  if (
    req.body.mileage &&
    (typeof req.body.mileage !== "number" || req.body.mileage < 0)
  ) {
    errors.push("קילומטרז חייב להיות מספר חיובי");
  }

  if (
    req.body.fuelType &&
    !["gasoline", "diesel", "hybrid", "electric", "lpg"].includes(
      req.body.fuelType
    )
  ) {
    errors.push("סוג דלק לא תקין");
  }

  if (
    req.body.transmission &&
    !["manual", "automatic", "cvt"].includes(req.body.transmission)
  ) {
    errors.push("סוג תמסורת לא תקין");
  }

  if (
    req.body.color &&
    (typeof req.body.color !== "string" || req.body.color.length > 50)
  ) {
    errors.push("צבע הרכב לא יכול להיות יותר מ-50 תווים");
  }

  if (
    req.body.description &&
    (typeof req.body.description !== "string" ||
      req.body.description.length > 2000)
  ) {
    errors.push("תיאור הרכב לא יכול להיות יותר מ-2000 תווים");
  }

  if (
    req.body.city &&
    (typeof req.body.city !== "string" || req.body.city.length > 100)
  ) {
    errors.push("שם העיר לא יכול להיות יותר מ-100 תווים");
  }

  if (req.body.images && !Array.isArray(req.body.images)) {
    errors.push("תמונות חייבות להיות מערך");
  }

  // ✅ תיקון - הוסף validation עבור engineSize (לא engine_size)
  if (req.body.engineSize && typeof req.body.engineSize !== "string") {
    errors.push("נפח מנוע לא תקין");
  }

  // ✅ תיקון - הוסף validation עבור bodyType
  if (
    req.body.bodyType &&
    ![
      "sedan",
      "hatchback",
      "suv",
      "crossover",
      "station_wagon",
      "coupe",
      "convertible",
      "pickup",
      "van",
      "minivan",
      "mpv",
      "roadster",
      "targa",
      "limousine",
      "other",
    ].includes(req.body.bodyType)
  ) {
    errors.push("סוג מרכב לא תקין");
  }

  // ✅ הוסף validation עבור condition (מצב רכב)
  if (
    req.body.condition &&
    ![
      "new",
      "demo",
      "excellent",
      "very_good",
      "good",
      "fair",
      "needs_repair",
      "accident",
      "for_parts",
    ].includes(req.body.condition)
  ) {
    errors.push("מצב הרכב לא תקין");
  }

  // ✅ הוסף validation עבור hand (יד מורחבת)
  if (
    req.body.hand &&
    ![
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10+",
      "unknown",
    ].includes(req.body.hand)
  ) {
    errors.push("יד הרכב לא תקינה");
  }

  // ✅ תיקון - הוסף validation מלא עבור features
  if (req.body.features) {
    if (!Array.isArray(req.body.features)) {
      errors.push("תוספות חייבות להיות מערך");
    } else {
      // בדוק שכל תוספת היא string לא ריק
      const invalidFeatures = req.body.features.filter(
        (feature: any) =>
          typeof feature !== "string" || feature.trim().length === 0
      );

      if (invalidFeatures.length > 0) {
        errors.push("כל התוספות חייבות להיות טקסט לא ריק");
      }

      if (req.body.features.length > 50) {
        errors.push("מספר התוספות מוגבל ל-50");
      }

      // בדוק שהתוספות הן מהרשימה המאושרת (אופציונלי)
      const validFeatures = [
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
        "leather_seats",
        "heated_seats",
        "cooled_seats",
        "electric_seats",
        "sunroof",
        "panoramic_roof",
        "automatic_parking",
        "keyless",
        "remote_start",
        "gps",
        "bluetooth",
        "usb",
        "aux",
        "wireless_charging",
        "premium_audio",
        "rear_entertainment",
        "android_auto",
        "apple_carplay",
        "air_conditioning",
        "dual_zone_ac",
        "rear_ac",
        "heated_steering",
        "alloy_wheels",
        "led_lights",
        "xenon_lights",
        "fog_lights",
        "roof_rails",
        "tow_bar",
      ];

      const invalidFeatureValues = req.body.features.filter(
        (feature: string) => !validFeatures.includes(feature)
      );

      if (invalidFeatureValues.length > 0) {
        console.warn("תוספות לא מוכרות:", invalidFeatureValues);
        // לא נכשיל - רק warning
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors: errors,
    });
  }

  next();
};

export const validateUpdateCar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors: string[] = [];

  // בדיקות אופציונליות (כי זה עדכון)
  if (
    req.body.make &&
    (typeof req.body.make !== "string" || req.body.make.trim().length < 2)
  ) {
    errors.push("יצרן הרכב חייב להיות לפחות 2 תווים");
  }

  if (
    req.body.model &&
    (typeof req.body.model !== "string" || req.body.model.trim().length < 1)
  ) {
    errors.push("דגם הרכב לא יכול להיות ריק");
  }

  if (
    req.body.year &&
    (typeof req.body.year !== "number" ||
      req.body.year < 1980 ||
      req.body.year > new Date().getFullYear() + 1)
  ) {
    errors.push(
      `שנת הרכב חייבת להיות בין 1980 ל-${new Date().getFullYear() + 1}`
    );
  }

  if (
    req.body.price &&
    (typeof req.body.price !== "number" || req.body.price < 1000)
  ) {
    errors.push("מחיר הרכב חייב להיות לפחות 1,000 ₪");
  }

  if (
    req.body.mileage &&
    (typeof req.body.mileage !== "number" || req.body.mileage < 0)
  ) {
    errors.push("קילומטרז חייב להיות מספר חיובי");
  }

  if (
    req.body.fuelType &&
    !["gasoline", "diesel", "hybrid", "electric", "lpg"].includes(
      req.body.fuelType
    )
  ) {
    errors.push("סוג דלק לא תקין");
  }

  if (
    req.body.transmission &&
    !["manual", "automatic", "cvt"].includes(req.body.transmission)
  ) {
    errors.push("סוג תמסורת לא תקין");
  }

  if (
    req.body.status &&
    !["active", "sold", "pending", "deleted"].includes(req.body.status)
  ) {
    errors.push("סטטוס רכב לא תקין");
  }

  if (
    req.body.color &&
    (typeof req.body.color !== "string" || req.body.color.length > 50)
  ) {
    errors.push("צבע הרכב לא יכול להיות יותר מ-50 תווים");
  }

  if (
    req.body.description &&
    (typeof req.body.description !== "string" ||
      req.body.description.length > 2000)
  ) {
    errors.push("תיאור הרכב לא יכול להיות יותר מ-2000 תווים");
  }

  if (
    req.body.city &&
    (typeof req.body.city !== "string" || req.body.city.length > 100)
  ) {
    errors.push("שם העיר לא יכול להיות יותר מ-100 תווים");
  }

  if (req.body.images && !Array.isArray(req.body.images)) {
    errors.push("תמונות חייבות להיות מערך");
  }

  // ✅ תיקון - הוסף validation עבור engineSize
  if (req.body.engineSize && typeof req.body.engineSize !== "string") {
    errors.push("נפח מנוע לא תקין");
  }

  // ✅ תיקון - הוסף validation עבור bodyType
  if (
    req.body.bodyType &&
    ![
      "sedan",
      "hatchback",
      "suv",
      "crossover",
      "station_wagon",
      "coupe",
      "convertible",
      "pickup",
      "van",
      "minivan",
      "mpv",
      "roadster",
      "targa",
      "limousine",
      "other",
    ].includes(req.body.bodyType)
  ) {
    errors.push("סוג מרכב לא תקין");
  }

  // ✅ condition validation
  if (
    req.body.condition &&
    ![
      "new",
      "demo",
      "excellent",
      "very_good",
      "good",
      "fair",
      "needs_repair",
      "accident",
      "for_parts",
    ].includes(req.body.condition)
  ) {
    errors.push("מצב הרכב לא תקין");
  }

  // ✅ hand validation מורחב
  if (
    req.body.hand &&
    ![
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10+",
      "unknown",
    ].includes(req.body.hand)
  ) {
    errors.push("יד הרכב לא תקינה");
  }

  // ✅ הוסף validation עבור features (תוספות)
  if (req.body.features) {
    if (!Array.isArray(req.body.features)) {
      errors.push("תוספות חייבות להיות מערך");
    } else {
      // בדוק שכל תוספת היא string
      const invalidFeatures = req.body.features.filter(
        (feature: any) =>
          typeof feature !== "string" || feature.trim().length === 0
      );

      if (invalidFeatures.length > 0) {
        errors.push("כל התוספות חייבות להיות טקסט לא ריק");
      }

      if (req.body.features.length > 50) {
        errors.push("מספר התוספות מוגבל ל-50");
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors: errors,
    });
  }

  next();
};
