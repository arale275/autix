import { Request, Response, NextFunction } from "express";

export const validateUpdateUserProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { first_name, last_name, phone } = req.body;
  const errors: string[] = [];

  // בדיקת שם פרטי
  if (first_name !== undefined) {
    if (typeof first_name !== "string" || first_name.trim().length < 2) {
      errors.push("שם פרטי חייב להכיל לפחות 2 תווים");
    } else if (first_name.trim().length > 50) {
      errors.push("שם פרטי ארוך מדי (מקסימום 50 תווים)");
    }
  }

  // בדיקת שם משפחה
  if (last_name !== undefined) {
    if (typeof last_name !== "string" || last_name.trim().length < 2) {
      errors.push("שם משפחה חייב להכיל לפחות 2 תווים");
    } else if (last_name.trim().length > 50) {
      errors.push("שם משפחה ארוך מדי (מקסימום 50 תווים)");
    }
  }

  // בדיקת טלפון
  if (phone !== undefined) {
    if (typeof phone !== "string") {
      errors.push("מספר טלפון לא תקין");
    } else {
      const phoneRegex = /^0[2-9]\d{8}$|^05[0-9]\d{7}$/;
      if (!phoneRegex.test(phone.replace(/[-\s]/g, ""))) {
        errors.push("מספר טלפון לא תקין (פורמט ישראלי)");
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors,
    });
  }

  // ניקוי נתונים
  if (first_name) req.body.first_name = first_name.trim();
  if (last_name) req.body.last_name = last_name.trim();
  if (phone) req.body.phone = phone.replace(/[-\s]/g, "");

  next();
};

export const validateUpdateDealerProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { business_name, license_number, address, city, description } =
    req.body;
  const errors: string[] = [];

  // בדיקת שם עסק
  if (business_name !== undefined) {
    if (typeof business_name !== "string" || business_name.trim().length < 2) {
      errors.push("שם עסק חייב להכיל לפחות 2 תווים");
    } else if (business_name.trim().length > 100) {
      errors.push("שם עסק ארוך מדי (מקסימום 100 תווים)");
    }
  }

  // בדיקת מספר רישיון
  if (license_number !== undefined && license_number !== null) {
    if (typeof license_number !== "string") {
      errors.push("מספר רישיון לא תקין");
    } else if (
      license_number.trim().length > 0 &&
      license_number.trim().length < 5
    ) {
      errors.push("מספר רישיון קצר מדי (מינימום 5 תווים)");
    } else if (license_number.trim().length > 50) {
      errors.push("מספר רישיון ארוך מדי (מקסימום 50 תווים)");
    }
  }

  // בדיקת כתובת
  if (address !== undefined && address !== null) {
    if (typeof address !== "string") {
      errors.push("כתובת לא תקינה");
    } else if (address.trim().length > 200) {
      errors.push("כתובת ארוכה מדי (מקסימום 200 תווים)");
    }
  }

  // בדיקת עיר
  if (city !== undefined && city !== null) {
    if (typeof city !== "string") {
      errors.push("עיר לא תקינה");
    } else if (city.trim().length > 50) {
      errors.push("שם עיר ארוך מדי (מקסימום 50 תווים)");
    }
  }

  // בדיקת תיאור
  if (description !== undefined && description !== null) {
    if (typeof description !== "string") {
      errors.push("תיאור לא תקין");
    } else if (description.trim().length > 1000) {
      errors.push("תיאור ארוך מדי (מקסימום 1000 תווים)");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors,
    });
  }

  // ניקוי נתונים
  if (business_name) req.body.business_name = business_name.trim();
  if (license_number) req.body.license_number = license_number.trim();
  if (address) req.body.address = address.trim();
  if (city) req.body.city = city.trim();
  if (description) req.body.description = description.trim();

  next();
};

export const validateUpdateBuyerProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { preferences, budget_min, budget_max } = req.body;
  const errors: string[] = [];

  // בדיקת תקציב מינימלי
  if (budget_min !== undefined && budget_min !== null) {
    if (isNaN(Number(budget_min)) || Number(budget_min) < 0) {
      errors.push("תקציב מינימלי לא תקין");
    } else if (Number(budget_min) > 10000000) {
      errors.push("תקציב מינימלי גבוה מדי");
    }
  }

  // בדיקת תקציב מקסימלי
  if (budget_max !== undefined && budget_max !== null) {
    if (isNaN(Number(budget_max)) || Number(budget_max) < 0) {
      errors.push("תקציב מקסימלי לא תקין");
    } else if (Number(budget_max) > 10000000) {
      errors.push("תקציב מקסימלי גבוה מדי");
    }
  }

  // בדיקה שתקציב מינימלי לא גדול ממקסימלי
  if (
    budget_min !== undefined &&
    budget_max !== undefined &&
    budget_min !== null &&
    budget_max !== null
  ) {
    if (Number(budget_min) > Number(budget_max)) {
      errors.push("תקציב מינימלי לא יכול להיות גדול מהמקסימלי");
    }
  }

  // בדיקת העדפות
  if (preferences !== undefined && preferences !== null) {
    if (typeof preferences !== "object") {
      errors.push("העדפות חייבות להיות אובייקט");
    } else {
      // בדיקת מותגים מועדפים
      if (
        preferences.preferred_makes &&
        !Array.isArray(preferences.preferred_makes)
      ) {
        errors.push("מותגים מועדפים חייבים להיות רשימה");
      }

      // בדיקת סוגי דלק מועדפים
      if (
        preferences.preferred_fuel_types &&
        !Array.isArray(preferences.preferred_fuel_types)
      ) {
        errors.push("סוגי דלק מועדפים חייבים להיות רשימה");
      }

      // בדיקת תמסורת מועדפת
      if (
        preferences.preferred_transmission &&
        !["manual", "automatic", "both"].includes(
          preferences.preferred_transmission
        )
      ) {
        errors.push("תמסורת מועדפת לא תקינה (manual, automatic, both)");
      }

      // בדיקת קילומטרז' מקסימלי
      if (
        preferences.max_mileage !== undefined &&
        preferences.max_mileage !== null
      ) {
        if (
          isNaN(Number(preferences.max_mileage)) ||
          Number(preferences.max_mileage) < 0
        ) {
          errors.push("קילומטרז' מקסימלי לא תקין");
        } else if (Number(preferences.max_mileage) > 1000000) {
          errors.push("קילומטרז' מקסימלי גבוה מדי");
        }
      }

      // בדיקת שנה מינימלית
      if (preferences.min_year !== undefined && preferences.min_year !== null) {
        const currentYear = new Date().getFullYear();
        if (
          isNaN(Number(preferences.min_year)) ||
          Number(preferences.min_year) < 1900 ||
          Number(preferences.min_year) > currentYear + 1
        ) {
          errors.push("שנה מינימלית לא תקינה");
        }
      }

      // בדיקת צבעים מועדפים
      if (
        preferences.preferred_colors &&
        !Array.isArray(preferences.preferred_colors)
      ) {
        errors.push("צבעים מועדפים חייבים להיות רשימה");
      }

      // בדיקת דרישות נוספות
      if (
        preferences.other_requirements !== undefined &&
        preferences.other_requirements !== null
      ) {
        if (typeof preferences.other_requirements !== "string") {
          errors.push("דרישות נוספות חייבות להיות טקסט");
        } else if (preferences.other_requirements.length > 500) {
          errors.push("דרישות נוספות ארוכות מדי (מקסימום 500 תווים)");
        }
      }
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors,
    });
  }

  next();
};

export const validateUserType = (allowedTypes: ("buyer" | "dealer")[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    const userType = req.user?.user_type;

    if (!userType || !allowedTypes.includes(userType)) {
      return res.status(403).json({
        success: false,
        message: `גישה מותרת רק ל${allowedTypes.join(" או ")}`,
      });
    }

    next();
  };
};

export const validateProfileFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { limit, verified_only } = req.query;
  const errors: string[] = [];

  // בדיקת מגבלת תוצאות
  if (
    limit &&
    (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
  ) {
    errors.push("מגבלת תוצאות לא תקינה (1-100)");
  }

  // בדיקת סינון מאומתים בלבד
  if (verified_only && !["true", "false"].includes(verified_only as string)) {
    errors.push("פרמטר verified_only חייב להיות true או false");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "פרמטרי חיפוש לא תקינים",
      errors,
    });
  }

  next();
};
