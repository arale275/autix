// lib/formatters.ts - פונקציות עיצוב ועיבוד נתונים
"use client";

/**
 * עיצוב מחיר בשקלים
 */
export const formatPrice = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) return "₪0";

  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};

/**
 * עיצוב מחיר קומפקטי (K, M)
 */
export const formatPriceCompact = (price: number | string): string => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;

  if (isNaN(numPrice)) return "₪0";

  if (numPrice >= 1000000) {
    return `₪${(numPrice / 1000000).toFixed(1)}M`;
  }
  if (numPrice >= 1000) {
    return `₪${(numPrice / 1000).toFixed(0)}K`;
  }

  return `₪${numPrice.toLocaleString("he-IL")}`;
};

/**
 * עיצוב קילומטרז'
 */
export const formatMileage = (mileage: number | string): string => {
  const numMileage =
    typeof mileage === "string" ? parseFloat(mileage) : mileage;

  if (isNaN(numMileage)) return '0 ק"מ';

  return `${numMileage.toLocaleString("he-IL")} ק"מ`;
};

/**
 * עיצוב קילומטרז' קומפקטי
 */
export const formatMileageCompact = (mileage: number | string): string => {
  const numMileage =
    typeof mileage === "string" ? parseFloat(mileage) : mileage;

  if (isNaN(numMileage)) return '0 ק"מ';

  if (numMileage >= 1000000) {
    return `${(numMileage / 1000000).toFixed(1)}M ק"מ`;
  }
  if (numMileage >= 1000) {
    return `${(numMileage / 1000).toFixed(0)}K ק"מ`;
  }

  return `${numMileage.toLocaleString("he-IL")} ק"מ`;
};

/**
 * עיצוב תאריך לעברית
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "תאריך לא תקין";

  return new Intl.DateTimeFormat("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);
};

/**
 * עיצוב תאריך קצר
 */
export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "תאריך לא תקין";

  return new Intl.DateTimeFormat("he-IL", {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
};

/**
 * עיצוב זמן יחסי (לפני כמה זמן)
 */
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMinutes < 1) return "עכשיו";
  if (diffMinutes < 60) return `לפני ${diffMinutes} דקות`;
  if (diffHours < 24) return `לפני ${diffHours} שעות`;
  if (diffDays < 7) return `לפני ${diffDays} ימים`;
  if (diffWeeks < 4) return `לפני ${diffWeeks} שבועות`;
  if (diffMonths < 12) return `לפני ${diffMonths} חודשים`;

  const diffYears = Math.floor(diffMonths / 12);
  return `לפני ${diffYears} שנים`;
};

/**
 * עיצוב מספר טלפון ישראלי
 */
export const formatPhoneNumber = (phone: string): string => {
  // הסרת כל התווים שאינם ספרות
  const cleaned = phone.replace(/\D/g, "");

  // אם מתחיל ב-972, הסרת קידומת המדינה
  let localNumber = cleaned.startsWith("972") ? cleaned.slice(3) : cleaned;

  // אם מתחיל ב-0, הסרתו
  if (localNumber.startsWith("0")) {
    localNumber = localNumber.slice(1);
  }

  // עיצוב לפי סוג המספר
  if (localNumber.length === 9) {
    if (localNumber.startsWith("5")) {
      // נייד: 05X-XXX-XXXX
      return `05${localNumber.slice(1, 2)}-${localNumber.slice(
        2,
        5
      )}-${localNumber.slice(5)}`;
    } else {
      // קווי: 0X-XXX-XXXX
      return `0${localNumber.slice(0, 1)}-${localNumber.slice(
        1,
        4
      )}-${localNumber.slice(4)}`;
    }
  }

  // אם המספר לא תקני, החזרת המקור עם קידומת 0
  return `0${localNumber}`;
};

/**
 * עיצוב מספר רישוי (לוחית רישוי)
 */
export const formatLicensePlate = (plate: string): string => {
  // הסרת רווחים ומקפים
  const cleaned = plate.replace(/[\s-]/g, "");

  // אם יש רק ספרות ואורך 7-8
  if (/^\d{7,8}$/.test(cleaned)) {
    if (cleaned.length === 8) {
      // 123-45-678
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 5)}-${cleaned.slice(
        5
      )}`;
    } else if (cleaned.length === 7) {
      // 12-345-67
      return `${cleaned.slice(0, 2)}-${cleaned.slice(2, 5)}-${cleaned.slice(
        5
      )}`;
    }
  }

  return plate; // החזרת המקור אם לא ניתן לעצב
};

/**
 * עיצוב שם מלא
 */
export const formatFullName = (
  firstName: string = "",
  lastName: string = ""
): string => {
  const first = firstName.trim();
  const last = lastName.trim();

  if (!first && !last) return "משתמש";
  if (!first) return last;
  if (!last) return first;

  return `${first} ${last}`;
};

/**
 * עיצוב אותיות ראשיות (initials)
 */
export const formatInitials = (
  firstName: string = "",
  lastName: string = ""
): string => {
  const first = firstName.trim();
  const last = lastName.trim();

  if (!first && !last) return "M";
  if (!first) return last.charAt(0).toUpperCase();
  if (!last) return first.charAt(0).toUpperCase();

  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
};

/**
 * עיצוב מיקום (עיר + כתובת)
 */
export const formatLocation = (
  city: string = "",
  address: string = ""
): string => {
  const cityTrimmed = city.trim();
  const addressTrimmed = address.trim();

  if (!cityTrimmed && !addressTrimmed) return "מיקום לא זמין";
  if (!addressTrimmed) return cityTrimmed;
  if (!cityTrimmed) return addressTrimmed;

  return `${addressTrimmed}, ${cityTrimmed}`;
};

/**
 * עיצוב טקסט ראשון במשפט באות גדולה
 */
export const formatCapitalize = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

/**
 * עיצוב טקסט כל מילה תתחיל באות גדולה
 */
export const formatTitleCase = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

/**
 * עיצוב מספר עם פסיק אלפים
 */
export const formatNumber = (num: number | string): string => {
  const number = typeof num === "string" ? parseFloat(num) : num;

  if (isNaN(number)) return "0";

  return number.toLocaleString("he-IL");
};

/**
 * עיצוב אחוז
 */
export const formatPercentage = (
  value: number,
  decimals: number = 1
): string => {
  if (isNaN(value)) return "0%";

  return `${value.toFixed(decimals)}%`;
};

/**
 * עיצוב URL (הוספת https אם חסר)
 */
export const formatUrl = (url: string): string => {
  if (!url) return "";

  const trimmed = url.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
};

/**
 * קיצור טקסט עם נקודות
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (!text) return "";

  if (text.length <= maxLength) return text;

  return text.slice(0, maxLength - 3) + "...";
};

/**
 * עיצוב גודל קובץ
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

// ייצוא ברירת מחדל
export default {
  formatPrice,
  formatPriceCompact,
  formatMileage,
  formatMileageCompact,
  formatDate,
  formatDateShort,
  formatRelativeTime,
  formatPhoneNumber,
  formatLicensePlate,
  formatFullName,
  formatInitials,
  formatLocation,
  formatCapitalize,
  formatTitleCase,
  formatNumber,
  formatPercentage,
  formatUrl,
  truncateText,
  formatFileSize,
};
