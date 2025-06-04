// lib/constants.ts - קבועים למערכת
"use client";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/api/auth/login",
  REGISTER: "/api/auth/register",
  PROFILE: "/api/auth/profile",
  CHANGE_PASSWORD: "/api/auth/change-password",
  DELETE_ACCOUNT: "/api/auth/delete-account",

  // Cars
  CARS: "/api/cars",
  CAR_BY_ID: (id: number) => `/api/cars/${id}`,
  CARS_BY_DEALER: (dealerId: number) => `/api/cars/dealer/${dealerId}`,
  MY_CARS: "/api/cars/my/cars",

  // Car Requests
  CAR_REQUESTS: "/api/car-requests",
  MY_REQUESTS: "/api/car-requests/my-requests",
  CAR_REQUEST_BY_ID: (id: number) => `/api/car-requests/${id}`,

  // Inquiries
  INQUIRIES: "/api/inquiries",
  SENT_INQUIRIES: "/api/inquiries/sent",
  RECEIVED_INQUIRIES: "/api/inquiries/received",
  INQUIRY_BY_ID: (id: number) => `/api/inquiries/${id}`,
  INQUIRY_STATUS: (id: number) => `/api/inquiries/${id}/status`,

  // Profile Management
  UPDATE_PROFILE: "/api/profile",

  // Health
  HEALTH: "/api/health",
  DB_TEST: "/api/db-test",
} as const;

// Car Manufacturers
export const CAR_MANUFACTURERS = [
  // יצרנים גרמניים
  { value: "Audi", label: "אאודי" },
  { value: "BMW", label: "ב.מ.וו" },
  { value: "Mercedes-Benz", label: "מרצדס-בנץ" },
  { value: "Porsche", label: "פורשה" },
  { value: "Volkswagen", label: "פולקסווגן" },
  { value: "Opel", label: "אופל" },

  // יצרנים יפניים
  { value: "Toyota", label: "טויוטה" },
  { value: "Honda", label: "הונדה" },
  { value: "Nissan", label: "ניסאן" },
  { value: "Mazda", label: "מאזדה" },
  { value: "Mitsubishi", label: "מיצובישי" },
  { value: "Subaru", label: "סובארו" },
  { value: "Suzuki", label: "סוזוקי" },
  { value: "Lexus", label: "לקסוס" },
  { value: "Infiniti", label: "אינפיניטי" },
  { value: "Acura", label: "אקורה" },

  // יצרנים קוריאניים
  { value: "Hyundai", label: "יונדאי" },
  { value: "Kia", label: "קיה" },
  { value: "Genesis", label: "ג'נסיס" },
  { value: "Daewoo", label: "דאוו" },
  { value: "SsangYong", label: "סאנגיונג" },

  // יצרנים אמריקאים
  { value: "Ford", label: "פורד" },
  { value: "Chevrolet", label: "שברולט" },
  { value: "Jeep", label: "ג'יפ" },
  { value: "Chrysler", label: "קרייזלר" },
  { value: "Dodge", label: "דודג'" },
  { value: "Cadillac", label: "קדילק" },
  { value: "Lincoln", label: "לינקולן" },
  { value: "Buick", label: "ביואיק" },

  // יצרנים איטלקיים
  { value: "Fiat", label: "פיאט" },
  { value: "Alfa Romeo", label: "אלפא רומיאו" },
  { value: "Lancia", label: "לאנצ'יה" },
  { value: "Ferrari", label: "פרארי" },
  { value: "Lamborghini", label: "למבורגיני" },
  { value: "Maserati", label: "מזראטי" },

  // יצרנים צרפתיים
  { value: "Peugeot", label: "פיז'ו" },
  { value: "Renault", label: "רנו" },
  { value: "Citroen", label: "סיטרואן" },

  // יצרנים ספרדיים
  { value: "SEAT", label: "סיאט" },

  // יצרנים צ'כיים
  { value: "Skoda", label: "שקודה" },

  // יצרנים שוודיים
  { value: "Volvo", label: "וולוו" },
  { value: "Saab", label: "סאאב" },

  // יצרנים בריטיים
  { value: "Land Rover", label: "לנד רובר" },
  { value: "Range Rover", label: "ריינג' רובר" },
  { value: "Jaguar", label: "יגואר" },
  { value: "Mini", label: "מיני" },
  { value: "Bentley", label: "בנטלי" },
  { value: "Rolls-Royce", label: "רולס רויס" },
  { value: "MG", label: "MG" },

  // יצרנים רומניים
  { value: "Dacia", label: "דאצ'יה" },

  // יצרנים הודיים
  { value: "Tata", label: "טאטא" },

  // יצרנים מלזיים
  { value: "Proton", label: "פרוטון" },

  // יצרנים סיניים
  { value: "BYD", label: "BYD" },
  { value: "Geely", label: "ג'ילי" },
  { value: "Chery", label: "צ'רי" },
  { value: "Great Wall", label: "גרייט וול" },
  { value: "Haval", label: "האוול" },
  { value: "Lynk & Co", label: "לינק אנד קו" },

  // יצרנים חשמליים/חדשים
  { value: "Tesla", label: "טסלה" },
  { value: "Polestar", label: "פולסטאר" },
  { value: "Lucid", label: "לוסיד" },
  { value: "Rivian", label: "ריוויאן" },

  // יצרנים שכבר לא פעילים בישראל
  { value: "Isuzu", label: "איסוזו" },
  { value: "Daihatsu", label: "דייהטסו" },

  // מותגי יוקרה נוספים
  { value: "McLaren", label: "מקלארן" },
  { value: "Aston Martin", label: "אסטון מרטין" },
  { value: "Lotus", label: "לוטוס" },
] as const;

// Fuel Types
export const FUEL_TYPES = [
  { value: "gasoline", label: "בנזין" },
  { value: "diesel", label: "דיזל" },
  { value: "hybrid", label: "היברידי" },
  { value: "electric", label: "חשמלי" },
  { value: "lpg", label: "גז" },
] as const;

// Transmission Types
export const TRANSMISSION_TYPES = [
  { value: "manual", label: "ידנית" },
  { value: "automatic", label: "אוטומטית" },
  { value: "cvt", label: "CVT" },
  { value: "semi-automatic", label: "חצי אוטומטית" },
] as const;

// Colors
export const CAR_COLORS = [
  { value: "white", label: "לבן" },
  { value: "black", label: "שחור" },
  { value: "silver", label: "כסוף" },
  { value: "gray", label: "אפור" },
  { value: "blue", label: "כחול" },
  { value: "red", label: "אדום" },
  { value: "green", label: "ירוק" },
  { value: "yellow", label: "צהוב" },
  { value: "orange", label: "כתום" },
  { value: "brown", label: "חום" },
  { value: "purple", label: "סגול" },
  { value: "gold", label: "זהב" },
  { value: "beige", label: "בז'" },
] as const;

// Status Types
export const CAR_STATUSES = [
  { value: "active", label: "פעיל" },
  { value: "sold", label: "נמכר" },
  { value: "deleted", label: "נמחק" },
] as const;

export const REQUEST_STATUSES = [
  { value: "active", label: "פעיל" },
  { value: "closed", label: "סגור" },
] as const;

export const INQUIRY_STATUSES = [
  { value: "new", label: "חדש" },
  { value: "responded", label: "נענה" },
  { value: "closed", label: "סגור" },
] as const;

// Years range
export const CAR_YEARS = Array.from(
  { length: new Date().getFullYear() - 1990 + 2 },
  (_, i) => new Date().getFullYear() + 1 - i
);

// Price ranges for filters
export const PRICE_RANGES = [
  { value: "0-50000", label: "עד 50,000 ₪" },
  { value: "50000-100000", label: "50,000-100,000 ₪" },
  { value: "100000-150000", label: "100,000-150,000 ₪" },
  { value: "150000-200000", label: "150,000-200,000 ₪" },
  { value: "200000-300000", label: "200,000-300,000 ₪" },
  { value: "300000+", label: "מעל 300,000 ₪" },
] as const;

// Mileage ranges
export const MILEAGE_RANGES = [
  { value: "0-20000", label: 'עד 20,000 ק"מ' },
  { value: "20000-50000", label: '20,000-50,000 ק"מ' },
  { value: "50000-100000", label: '50,000-100,000 ק"מ' },
  { value: "100000-150000", label: '100,000-150,000 ק"מ' },
  { value: "150000+", label: 'מעל 150,000 ק"מ' },
] as const;

// Israeli Cities (ערים מרכזיות)
export const ISRAELI_CITIES = [
  "אשדוד",
  "אשקלון",
  "באר שבע",
  "בני ברק",
  "בת ים",
  "גבעתיים",
  "הוד השרון",
  "הרצליה",
  "חולון",
  "חיפה",
  "טבריה",
  "יקנעם",
  "ירושלים",
  "כפר סבא",
  "מודיעין",
  "נהריה",
  "נס ציונה",
  "נתניה",
  "עכו",
  "פתח תקווה",
  "צפת",
  "קריית גת",
  "קריית מוצקין",
  "ראש העין",
  "ראשון לציון",
  "רחובות",
  "רמלה",
  "רמת גן",
  "רמת השרון",
  "תל אביב",
] as const;

// Sort Options
export const SORT_OPTIONS = [
  { value: "newest", label: "החדשים ביותר" },
  { value: "oldest", label: "הישנים ביותר" },
  { value: "priceLow", label: "מחיר: נמוך לגבוה" },
  { value: "priceHigh", label: "מחיר: גבוה לנמוך" },
  { value: "mileageLow", label: "קילומטראז: נמוך לגבוה" },
  { value: "mileageHigh", label: "קילומטראז: גבוה לנמוך" },
  { value: "yearNew", label: "שנה: חדש לישן" },
  { value: "yearOld", label: "שנה: ישן לחדש" },
] as const;

// Pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  MIN_LIMIT: 5,
} as const;

// Validation Constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_MAX_LENGTH: 50,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  PHONE_PATTERN: /^05\d{8}$|^\+972-?5\d{8}$/,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  // Car validation
  CAR_YEAR_MIN: 1990,
  CAR_YEAR_MAX: new Date().getFullYear() + 1,
  CAR_PRICE_MIN: 1000,
  CAR_PRICE_MAX: 5000000,
  CAR_MILEAGE_MAX: 1000000,

  // Text lengths
  DESCRIPTION_MAX_LENGTH: 1000,
  REQUIREMENTS_MAX_LENGTH: 500,
  MESSAGE_MAX_LENGTH: 500,
  BUSINESS_NAME_MAX_LENGTH: 100,
} as const;

// Messages
export const MESSAGES = {
  SUCCESS: {
    SAVED: "נשמר בהצלחה!",
    DELETED: "נמחק בהצלחה!",
    SENT: "נשלח בהצלחה!",
    UPDATED: "עודכן בהצלחה!",
    CAR_SAVED: "הרכב נשמר למועדפים!",
    CAR_REMOVED: "הרכב הוסר מהמועדפים!",
    REQUEST_CREATED: "הבקשה נוצרה בהצלחה!",
    INQUIRY_SENT: "הפנייה נשלחה בהצלחה!",
  },

  ERROR: {
    NETWORK: "בעיית חיבור לאינטרנט. אנא נסה שוב",
    SERVER: "שגיאת שרת. אנא נסה שוב מאוחר יותר",
    UNAUTHORIZED: "תם תוקף ההתחברות. אנא התחבר שוב",
    FORBIDDEN: "אין לך הרשאה לפעולה זו",
    NOT_FOUND: "המשאב המבוקש לא נמצא",
    VALIDATION: "שגיאה בנתונים. אנא בדוק ונסה שוב",
    UNKNOWN: "שגיאה לא צפויה. אנא נסה שוב",
  },

  EMPTY_STATES: {
    NO_CARS: "לא נמצאו רכבים",
    NO_REQUESTS: "אין בקשות רכב",
    NO_INQUIRIES: "אין הודעות",
    NO_SAVED_CARS: "אין רכבים שמורים",
    NO_RESULTS: "לא נמצאו תוצאות",
  },
} as const;

// User Types
export const USER_TYPES = [
  { value: "buyer", label: "קונה" },
  { value: "dealer", label: "סוחר" },
] as const;

// Navigation paths
export const ROUTES = {
  HOME: "/",

  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",

  // Buyer
  BUYER_HOME: "/buyer/home",
  BUYER_CARS: "/buyer/cars",
  BUYER_CAR: (id: number) => `/buyer/cars/${id}`,
  BUYER_POST_REQUEST: "/buyer/post-request",
  BUYER_REQUESTS: "/buyer/requests",
  BUYER_PROFILE: "/buyer/profile",

  // Dealer
  DEALER_HOME: "/dealer/home",
  DEALER_CARS: "/dealer/cars",
  DEALER_CAR: (id: number) => `/dealer/cars/${id}`,
  DEALER_ADD_CAR: "/dealer/add-car",
  DEALER_BUYERS: "/dealer/buyers",
  DEALER_INQUIRIES: "/dealer/inquiries",
  DEALER_PROFILE: "/dealer/profile",

  // Info
  ABOUT: "/info/about autix",
  CONTACT: "/info/contact",
  PRIVACY: "/info/privacy policy",
  TERMS: "/info/terms of use",
} as const;

// Theme colors
export const COLORS = {
  PRIMARY: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    900: "#1e3a8a",
  },
  SUCCESS: {
    50: "#f0fdf4",
    100: "#dcfce7",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
  },
  WARNING: {
    50: "#fffbeb",
    100: "#fef3c7",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
  },
  ERROR: {
    50: "#fef2f2",
    100: "#fee2e2",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
  },
} as const;

// Local Storage Keys (already defined in localStorage.ts but exported here for convenience)
export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "user_data",
  PREFERENCES: "userPreferences",
  SAVED_CARS: "savedCars",
  THEME: "theme",
  LANGUAGE: "language",
} as const;

// Image placeholders
export const PLACEHOLDERS = {
  CAR_IMAGE: "/images/car-placeholder.jpg",
  AVATAR: "/images/avatar-placeholder.png",
  DEALER_LOGO: "/images/dealer-placeholder.png",
} as const;

// Feature flags (for future use)
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_CHAT: false,
  ENABLE_VIDEO_CALLS: false,
  ENABLE_FINANCING: false,
  ENABLE_INSURANCE: false,
  ENABLE_ANALYTICS: true,
} as const;

// External URLs
export const EXTERNAL_URLS = {
  WHATSAPP: (phone: string, message: string) =>
    `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
      message
    )}`,
  GOOGLE_MAPS: (address: string) =>
    `https://maps.google.com/maps?q=${encodeURIComponent(address)}`,
  WAZE: (address: string) =>
    `https://waze.com/ul?q=${encodeURIComponent(address)}`,
} as const;

// Default values
export const DEFAULTS = {
  PAGINATION_LIMIT: 20,
  SEARCH_DEBOUNCE: 500, // ms
  API_TIMEOUT: 10000, // ms
  IMAGE_QUALITY: 80,
  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5MB

  // Car defaults
  CAR_IMAGES_LIMIT: 10,
  CAR_DESCRIPTION_PLACEHOLDER:
    "תאר את הרכב - מצב, שירותים, ציוד נוסף וכל מידע רלוונטי לקונים פוטנציאליים...",

  // Request defaults
  REQUEST_REQUIREMENTS_PLACEHOLDER:
    "אני מחפש רכב אמין ובמצב טוב. אשמח לקבל הצעות מסוחרים מקצועיים עם רכבים מתאימים לדרישות שלי.",

  // Inquiry defaults
  INQUIRY_MESSAGE_PLACEHOLDER:
    "שלום, אני מעוניין ברכב שפורסם. אשמח לקבל פרטים נוספים ולתאם צפייה. תודה!",
} as const;

// Regular expressions
export const REGEX = {
  PHONE_IL: /^0(5[0-9]|7[2-9])[0-9]{7}$/,
  PHONE_INTERNATIONAL: /^\+972[0-9]{9}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  HEBREW: /[\u0590-\u05FF]/,
  ENGLISH: /[a-zA-Z]/,
  NUMBERS_ONLY: /^\d+$/,
  LICENSE_PLATE: /^\d{2,3}-\d{2,3}-\d{2,3}$/,
} as const;

// Breakpoints (matching Tailwind)
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  "2XL": 1536,
} as const;

// Animation durations (ms)
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

export default {
  API_ENDPOINTS,
  CAR_MANUFACTURERS,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  CAR_COLORS,
  CAR_STATUSES,
  REQUEST_STATUSES,
  INQUIRY_STATUSES,
  CAR_YEARS,
  PRICE_RANGES,
  MILEAGE_RANGES,
  ISRAELI_CITIES,
  SORT_OPTIONS,
  PAGINATION,
  VALIDATION,
  MESSAGES,
  USER_TYPES,
  ROUTES,
  COLORS,
  STORAGE_KEYS,
  PLACEHOLDERS,
  FEATURES,
  EXTERNAL_URLS,
  DEFAULTS,
  REGEX,
  BREAKPOINTS,
  ANIMATIONS,
};
