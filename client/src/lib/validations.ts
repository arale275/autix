"use client";

import { z } from "zod";

// ========== Auth Schemas ==========

/**
 * סכמת רישום משתמש
 */
export const registerSchema = z
  .object({
    email: z.string().min(1, "אימייל נדרש").email("פורמט אימייל לא תקין"),
    password: z
      .string()
      .min(6, "סיסמה חייבת להכיל לפחות 6 תווים")
      .regex(/[a-zA-Z]/, "סיסמה חייבת להכיל לפחות אות אחת")
      .regex(/[0-9]/, "סיסמה חייבת להכיל לפחות ספרה אחת"),
    confirmPassword: z.string().min(1, "אישור סיסמה נדרש"),
    userType: z.enum(["buyer", "dealer"], {
      required_error: "יש לבחור סוג משתמש",
    }),
    firstName: z
      .string()
      .min(2, "שם פרטי חייב להכיל לפחות 2 תווים")
      .regex(/^[א-ת\s]+$/, "שם פרטי יכול להכיל רק אותיות עבריות"),
    lastName: z
      .string()
      .min(2, "שם משפחה חייב להכיל לפחות 2 תווים")
      .regex(/^[א-ת\s]+$/, "שם משפחה יכול להכיל רק אותיות עבריות"),
    phone: z
      .string()
      .min(1, "מספר טלפון נדרש")
      .regex(/^05[0-9]{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)"),
    // שדות נוספים לסוחר
    businessName: z.string().optional(),
    businessLicense: z.string().optional(),
    businessAddress: z.string().optional(),
    // שדות נוספים לקונה
    budget: z.number().optional(),
    preferredBrand: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "סיסמאות לא תואמות",
    path: ["confirmPassword"],
  })
  .refine(
    (data) => {
      // אם זה סוחר, שדות עסק נדרשים
      if (data.userType === "dealer") {
        return !!(
          data.businessName &&
          data.businessLicense &&
          data.businessAddress
        );
      }
      return true;
    },
    {
      message: "פרטי עסק נדרשים עבור סוחרים",
      path: ["businessName"],
    }
  );

/**
 * סכמת התחברות
 */
export const loginSchema = z.object({
  email: z.string().min(1, "אימייל נדרש").email("פורמט אימייל לא תקין"),
  password: z.string().min(1, "סיסמה נדרשת"),
});

/**
 * סכמת שינוי סיסמה
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "סיסמה נוכחית נדרשת"),
    newPassword: z
      .string()
      .min(6, "סיסמה חייבת להכיל לפחות 6 תווים")
      .regex(/[a-zA-Z]/, "סיסמה חייבת להכיל לפחות אות אחת")
      .regex(/[0-9]/, "סיסמה חייבת להכיל לפחות ספרה אחת"),
    confirmNewPassword: z.string().min(1, "אישור סיסמה נדרש"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "סיסמאות לא תואמות",
    path: ["confirmNewPassword"],
  });

// ========== Car Schemas ==========

/**
 * סכמת רכב
 */
export const carSchema = z.object({
  make: z.string().min(1, "יצרן נדרש"),
  model: z.string().min(1, "דגם נדרש"),
  year: z
    .number()
    .min(1990, "שנת ייצור חייבת להיות מ-1990 ומעלה")
    .max(new Date().getFullYear() + 1, "שנת ייצור לא יכולה להיות בעתיד"),
  price: z
    .number()
    .min(1000, "מחיר חייב להיות לפחות 1,000 ₪")
    .max(10000000, "מחיר לא יכול לעלות על 10,000,000 ₪"),
  mileage: z
    .number()
    .min(0, "קילומטרז' לא יכול להיות שלילי")
    .max(1000000, "קילומטרז' לא יכול לעלות על מיליון"),
  fuelType: z.enum(["gasoline", "diesel", "hybrid", "electric"], {
    required_error: "סוג דלק נדרש",
  }),
  transmission: z.enum(["manual", "automatic"], {
    required_error: "סוג תיבת הילוכים נדרש",
  }),
  color: z.string().min(1, "צבע נדרש"),
  city: z.string().min(1, "עיר נדרשת"),
  description: z
    .string()
    .max(1000, "תיאור לא יכול לעלות על 1000 תווים")
    .optional(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string()).optional(),
  contactPhone: z
    .string()
    .regex(/^05[0-9]{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)")
    .optional(),
  licensePlate: z
    .string()
    .regex(/^\d{2,3}-\d{2,3}-\d{2,3}$/, "מספר רישוי לא תקין (XXX-XX-XXX)")
    .optional(),
});

/**
 * סכמת עדכון רכב (כל השדות אופציונליים)
 */
export const updateCarSchema = carSchema.partial();

// ========== Car Request Schemas ==========

/**
 * סכמת בקשת רכב
 */
export const carRequestSchema = z
  .object({
    make: z.string().min(1, "יצרן נדרש"),
    model: z.string().optional(),
    yearFrom: z.number().min(1990, "שנה מינימלית: 1990").optional(),
    yearTo: z
      .number()
      .max(new Date().getFullYear() + 1, "שנה מקסימלית לא יכולה להיות בעתיד")
      .optional(),
    priceFrom: z.number().min(0, "מחיר מינימלי לא יכול להיות שלילי").optional(),
    priceTo: z
      .number()
      .max(10000000, "מחיר מקסימלי לא יכול לעלות על 10,000,000 ₪")
      .optional(),
    mileageFrom: z
      .number()
      .min(0, "קילומטרז' מינימלי לא יכול להיות שלילי")
      .optional(),
    mileageTo: z
      .number()
      .max(1000000, "קילומטרז' מקסימלי לא יכול לעלות על מיליון")
      .optional(),
    fuelType: z.enum(["gasoline", "diesel", "hybrid", "electric"]).optional(),
    transmission: z.enum(["manual", "automatic"]).optional(),
    city: z.string().optional(),
    description: z
      .string()
      .max(500, "תיאור לא יכול לעלות על 500 תווים")
      .optional(),
    contactPhone: z
      .string()
      .regex(/^05[0-9]{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)"),
  })
  .refine(
    (data) => {
      // בדיקה שהשנה המינימלית קטנה מהמקסימלית
      if (data.yearFrom && data.yearTo) {
        return data.yearFrom <= data.yearTo;
      }
      return true;
    },
    {
      message: "שנה מינימלית חייבת להיות קטנה או שווה לשנה מקסימלית",
      path: ["yearTo"],
    }
  )
  .refine(
    (data) => {
      // בדיקה שהמחיר המינימלי קטן מהמקסימלי
      if (data.priceFrom && data.priceTo) {
        return data.priceFrom <= data.priceTo;
      }
      return true;
    },
    {
      message: "מחיר מינימלי חייב להיות קטן או שווה למחיר מקסימלי",
      path: ["priceTo"],
    }
  )
  .refine(
    (data) => {
      // בדיקה שהקילומטרז' המינימלי קטן מהמקסימלי
      if (data.mileageFrom && data.mileageTo) {
        return data.mileageFrom <= data.mileageTo;
      }
      return true;
    },
    {
      message: "קילומטרז' מינימלי חייב להיות קטן או שווה לקילומטרז' מקסימלי",
      path: ["mileageTo"],
    }
  );

// ========== Inquiry Schemas ==========

/**
 * סכמת פנייה
 */
export const inquirySchema = z.object({
  carId: z.number().min(1, "מזהה רכב נדרש"),
  message: z
    .string()
    .min(10, "הודעה חייבת להכיל לפחות 10 תווים")
    .max(500, "הודעה לא יכולה לעלות על 500 תווים"),
  contactPhone: z
    .string()
    .regex(/^05[0-9]{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)"),
});

/**
 * סכמת תגובה לפנייה
 */
export const inquiryResponseSchema = z.object({
  response: z
    .string()
    .min(5, "תגובה חייבת להכיל לפחות 5 תווים")
    .max(500, "תגובה לא יכולה לעלות על 500 תווים"),
});

// ========== Profile Schemas ==========

/**
 * סכמת עדכון פרופיל קונה
 */
export const buyerProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "שם פרטי חייב להכיל לפחות 2 תווים")
    .regex(/^[א-ת\s]+$/, "שם פרטי יכול להכיל רק אותיות עבריות"),
  lastName: z
    .string()
    .min(2, "שם משפחה חייב להכיל לפחות 2 תווים")
    .regex(/^[א-ת\s]+$/, "שם משפחה יכול להכיל רק אותיות עבריות"),
  phone: z.string().regex(/^05[0-9]{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)"),
  budget: z
    .number()
    .min(1000, "תקציב חייב להיות לפחות 1,000 ₪")
    .max(10000000, "תקציב לא יכול לעלות על 10,000,000 ₪")
    .optional(),
  preferredBrand: z.string().optional(),
  city: z.string().optional(),
});

/**
 * סכמת עדכון פרופיל סוחר
 */
export const dealerProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "שם פרטי חייב להכיל לפחות 2 תווים")
    .regex(/^[א-ת\s]+$/, "שם פרטי יכול להכיל רק אותיות עבריות"),
  lastName: z
    .string()
    .min(2, "שם משפחה חייב להכיל לפחות 2 תווים")
    .regex(/^[א-ת\s]+$/, "שם משפחה יכול להכיל רק אותיות עבריות"),
  phone: z.string().regex(/^05[0-9]{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)"),
  businessName: z.string().min(2, "שם עסק חייב להכיל לפחות 2 תווים"),
  businessLicense: z.string().min(5, "רישיון עסק חייב להכיל לפחות 5 תווים"),
  businessAddress: z.string().min(5, "כתובת עסק חייבת להכיל לפחות 5 תווים"),
  city: z.string().optional(),
  website: z.string().url("כתובת אתר לא תקינה").optional().or(z.literal("")),
});

// ========== Search Schemas ==========

/**
 * סכמת חיפוש רכבים
 */
export const carSearchSchema = z.object({
  search: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  yearFrom: z.number().min(1990).optional(),
  yearTo: z
    .number()
    .max(new Date().getFullYear() + 1)
    .optional(),
  priceFrom: z.number().min(0).optional(),
  priceTo: z.number().max(10000000).optional(),
  mileageFrom: z.number().min(0).optional(),
  mileageTo: z.number().max(1000000).optional(),
  fuelType: z.enum(["gasoline", "diesel", "hybrid", "electric"]).optional(),
  transmission: z.enum(["manual", "automatic"]).optional(),
  city: z.string().optional(),
  sortBy: z
    .enum([
      "newest",
      "oldest",
      "price-low",
      "price-high",
      "mileage-low",
      "mileage-high",
    ])
    .optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// ========== Contact Schemas ==========

/**
 * סכמת צור קשר
 */
export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "שם חייב להכיל לפחות 2 תווים")
    .max(50, "שם לא יכול לעלות על 50 תווים"),
  email: z.string().min(1, "אימייל נדרש").email("פורמט אימייל לא תקין"),
  phone: z
    .string()
    .regex(/^05[0-9]{8}$/, "מספר טלפון לא תקין (05XXXXXXXX)")
    .optional(),
  subject: z
    .string()
    .min(5, "נושא חייב להכיל לפחות 5 תווים")
    .max(100, "נושא לא יכול לעלות על 100 תווים"),
  message: z
    .string()
    .min(20, "הודעה חייבת להכיל לפחות 20 תווים")
    .max(1000, "הודעה לא יכולה לעלות על 1000 תווים"),
});

// ========== Validation Helper Functions ==========

/**
 * בדיקת תקינות אימייל
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * בדיקת תקינות מספר טלפון ישראלי
 */
export const isValidIsraeliPhone = (phone: string): boolean => {
  const phoneRegex = /^05[0-9]{8}$/;
  return phoneRegex.test(phone);
};

/**
 * בדיקת חוזק סיסמה
 */
export const getPasswordStrength = (
  password: string
): {
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push("סיסמה חייבת להכיל לפחות 8 תווים");
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("הוסף אותיות קטנות באנגלית");
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push("הוסף אותיות גדולות באנגלית");
  }

  if (/[0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("הוסף ספרות");
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1;
  } else {
    feedback.push("הוסף תווים מיוחדים (!@#$%^&*)");
  }

  return { score, feedback };
};

/**
 * בדיקת תקינות מספר רישוי
 */
export const isValidLicensePlate = (plate: string): boolean => {
  const plateRegex = /^\d{2,3}-\d{2,3}-\d{2,3}$/;
  return plateRegex.test(plate);
};

/**
 * בדיקת תקינות שנה
 */
export const isValidYear = (year: number): boolean => {
  const currentYear = new Date().getFullYear();
  return year >= 1990 && year <= currentYear + 1;
};

/**
 * בדיקת תקינות מחיר
 */
export const isValidPrice = (price: number): boolean => {
  return price >= 1000 && price <= 10000000;
};

/**
 * בדיקת תקינות קילומטרז'
 */
export const isValidMileage = (mileage: number): boolean => {
  return mileage >= 0 && mileage <= 1000000;
};

/**
 * ניקוי וועיצוב מספר טלפון
 */
export const sanitizePhoneNumber = (phone: string): string => {
  // הסרת כל התווים שאינם ספרות
  const cleaned = phone.replace(/\D/g, "");

  // אם מתחיל ב-972, הסרת קידומת המדינה והוספת 0
  if (cleaned.startsWith("972")) {
    return "0" + cleaned.slice(3);
  }

  // אם לא מתחיל ב-0, הוספתו
  if (!cleaned.startsWith("0")) {
    return "0" + cleaned;
  }

  return cleaned;
};

/**
 * ניקוי טקסט מתווים מיוחדים
 */
export const sanitizeText = (text: string): string => {
  return text
    .trim()
    .replace(/\s+/g, " ") // החלפת רווחים מרובים ברווח יחיד
    .replace(/[<>\"']/g, ""); // הסרת תווים מסוכנים
};

/**
 * בדיקה אם URL תקין
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// ========== Type Definitions ==========

// סוגי נתונים לטפסים
export type RegisterFormData = z.infer<typeof registerSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type CarFormData = z.infer<typeof carSchema>;
export type UpdateCarFormData = z.infer<typeof updateCarSchema>;
export type CarRequestFormData = z.infer<typeof carRequestSchema>;
export type InquiryFormData = z.infer<typeof inquirySchema>;
export type InquiryResponseFormData = z.infer<typeof inquiryResponseSchema>;
export type BuyerProfileFormData = z.infer<typeof buyerProfileSchema>;
export type DealerProfileFormData = z.infer<typeof dealerProfileSchema>;
export type CarSearchFormData = z.infer<typeof carSearchSchema>;
export type ContactFormData = z.infer<typeof contactSchema>;

// ========== Form Validation Helpers ==========

/**
 * פונקציה כללית לvalidation עם Zod
 */
export const validateForm = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
):
  | { success: true; data: T }
  | { success: false; errors: Record<string, string> } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join(".");
        errors[path] = err.message;
      });
      return { success: false, errors };
    }
    return {
      success: false,
      errors: { general: "שגיאה בבדיקת הנתונים" },
    };
  }
};

/**
 * בדיקת שדה יחיד
 */
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  fieldName: string,
  value: unknown
): string | null => {
  try {
    // יצירת אובייקט זמני עם השדה לבדיקה
    const testObject = { [fieldName]: value };

    // ניסיון לvalidate רק את השדה הרלוונטי
    schema.parse(testObject as T);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find((err) =>
        err.path.includes(fieldName)
      );
      return fieldError?.message || null;
    }
    return null; // אם אין שגיאה ספציפית לשדה, נחזיר null
  }
};

// ייצוא כל הסכמות
export const schemas = {
  register: registerSchema,
  login: loginSchema,
  changePassword: changePasswordSchema,
  car: carSchema,
  updateCar: updateCarSchema,
  carRequest: carRequestSchema,
  inquiry: inquirySchema,
  inquiryResponse: inquiryResponseSchema,
  buyerProfile: buyerProfileSchema,
  dealerProfile: dealerProfileSchema,
  carSearch: carSearchSchema,
  contact: contactSchema,
};

// ייצוא פונקציות עזר
export const validators = {
  isValidEmail,
  isValidIsraeliPhone,
  getPasswordStrength,
  isValidLicensePlate,
  isValidYear,
  isValidPrice,
  isValidMileage,
  sanitizePhoneNumber,
  sanitizeText,
  isValidUrl,
  validateForm,
  validateField,
};

// ייצוא ברירת מחדל
export default {
  schemas,
  validators,
};
