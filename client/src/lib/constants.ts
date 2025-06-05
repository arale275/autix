// lib/constants.ts - קבועים למערכת (מעודכן ומורחב)
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

// Car Manufacturers (אלפבתי באנגלית)
export const CAR_MANUFACTURERS = [
  "Audi",
  "BMW",
  "Chevrolet",
  "Citroen",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Infiniti",
  "Jeep",
  "Kia",
  "Lexus",
  "Mazda",
  "Mercedes",
  "Mitsubishi",
  "Nissan",
  "Opel",
  "Peugeot",
  "Renault",
  "Seat",
  "Skoda",
  "Subaru",
  "Suzuki",
  "Toyota",
  "Volkswagen",
  "Volvo",
] as const;

// Car Manufacturers Hebrew (מורחב ומעודכן)
export const CAR_MANUFACTURERS_HEBREW = [
  // יצרנים גרמניים
  { value: "Audi", label: "אאודי" },
  { value: "BMW", label: "ב.מ.וו" },
  { value: "Mercedes-Benz", label: "מרצדס" },
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
  { value: "Skoda", label: "סקודה" },

  // יצרנים שוודיים
  { value: "Volvo", label: "וולוו" },
  { value: "Saab", label: "סאאב" },

  // יצרנים בריטיים
  { value: "Land Rover", label: "לנד רובר" },
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

// ✅ Engine Sizes (גדלי מנוע מורחבים)
export const ENGINE_SIZES = [
  { value: "1.0", label: "1.0 ליטר" },
  { value: "1.1", label: "1.1 ליטר" },
  { value: "1.2", label: "1.2 ליטר" },
  { value: "1.3", label: "1.3 ליטר" },
  { value: "1.4", label: "1.4 ליטר" },
  { value: "1.5", label: "1.5 ליטר" },
  { value: "1.6", label: "1.6 ליטר" },
  { value: "1.7", label: "1.7 ליטר" },
  { value: "1.8", label: "1.8 ליטר" },
  { value: "1.9", label: "1.9 ליטר" },
  { value: "2.0", label: "2.0 ליטר" },
  { value: "2.2", label: "2.2 ליטר" },
  { value: "2.4", label: "2.4 ליטר" },
  { value: "2.5", label: "2.5 ליטר" },
  { value: "2.7", label: "2.7 ליטר" },
  { value: "3.0", label: "3.0 ליטר" },
  { value: "3.2", label: "3.2 ליטר" },
  { value: "3.5", label: "3.5 ליטר" },
  { value: "3.6", label: "3.6 ליטר" },
  { value: "3.8", label: "3.8 ליטר" },
  { value: "4.0", label: "4.0 ליטר" },
  { value: "4.2", label: "4.2 ליטר" },
  { value: "4.4", label: "4.4 ליטר" },
  { value: "4.6", label: "4.6 ליטר" },
  { value: "5.0", label: "5.0 ליטר" },
  { value: "5.2", label: "5.2 ליטר" },
  { value: "5.7", label: "5.7 ליטר" },
  { value: "6.0", label: "6.0 ליטר" },
  { value: "6.2", label: "6.2 ליטר" },
  { value: "6.3", label: "6.3 ליטר" },
  { value: "6.7", label: "6.7 ליטר" },
  { value: "electric", label: "חשמלי" },
  { value: "other", label: "אחר" },
] as const;

// ✅ Car Conditions (מצב הרכב מורחב)
export const CAR_CONDITIONS = [
  { value: "new", label: "חדש מהסוכנות" },
  { value: "demo", label: "רכב הדגמה" },
  { value: "excellent", label: "במצב מעולה" },
  { value: "very_good", label: "במצב טוב מאוד" },
  { value: "good", label: "במצב טוב" },
  { value: "fair", label: "במצב סביר" },
  { value: "needs_repair", label: "זקוק לתיקונים" },
  { value: "accident", label: "לאחר תאונה" },
  { value: "for_parts", label: "למכירת חלקים" },
] as const;

// ✅ Car Hands (יד מורחבת)
export const CAR_HANDS = [
  { value: "0", label: "קילומטר" },
  { value: "1", label: "יד ראשונה" },
  { value: "2", label: "יד שנייה" },
  { value: "3", label: "יד שלישית" },
  { value: "4", label: "יד רביעית" },
  { value: "5", label: "יד חמישית" },
  { value: "6", label: "יד שישית" },
  { value: "7", label: "יד שביעית" },
  { value: "8", label: "יד שמינית" },
  { value: "9", label: "יד תשיעית" },
  { value: "10+", label: "יד עשירית ומעלה" },
  { value: "unknown", label: "לא ידוע" },
] as const;

// ✅ Body Types (סוגי מרכב)
export const BODY_TYPES = [
  { value: "sedan", label: "סדאן" },
  { value: "hatchback", label: "האצ'בק" },
  { value: "suv", label: "SUV" },
  { value: "crossover", label: "קרוסאובר" },
  { value: "station_wagon", label: "סטיישן" },
  { value: "coupe", label: "קופה" },
  { value: "convertible", label: "גג נפתח" },
  { value: "pickup", label: "טנדר" },
  { value: "van", label: "מסחרי" },
  { value: "minivan", label: "מיניוון" },
  { value: "mpv", label: "MPV" },
  { value: "roadster", label: "רודסטר" },
  { value: "targa", label: "טארגה" },
  { value: "limousine", label: "לימוזינה" },
  { value: "other", label: "אחר" },
] as const;

// Fuel Types (מעודכן)
export const FUEL_TYPES = [
  { value: "gasoline", label: "בנזין" },
  { value: "diesel", label: "דיזל" },
  { value: "hybrid", label: "היברידי" },
  { value: "electric", label: "חשמלי" },
  { value: "lpg", label: "גז" },
] as const;

// Transmission Types (מעודכן)
export const TRANSMISSION_TYPES = [
  { value: "manual", label: "ידנית" },
  { value: "automatic", label: "אוטומטית" },
  { value: "cvt", label: "CVT" },
  { value: "semi-automatic", label: "חצי אוטומטית" },
] as const;

// Colors (מעודכן)
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

// ✅ Price ranges (מורחבות)
export const PRICE_RANGES = [
  { value: "0-30000", label: "עד 30,000 ₪" },
  { value: "30000-50000", label: "30,000-50,000 ₪" },
  { value: "50000-70000", label: "50,000-70,000 ₪" },
  { value: "70000-100000", label: "70,000-100,000 ₪" },
  { value: "100000-120000", label: "100,000-120,000 ₪" },
  { value: "120000-150000", label: "120,000-150,000 ₪" },
  { value: "150000-180000", label: "150,000-180,000 ₪" },
  { value: "180000-220000", label: "180,000-220,000 ₪" },
  { value: "220000-250000", label: "220,000-250,000 ₪" },
  { value: "250000-300000", label: "250,000-300,000 ₪" },
  { value: "300000-400000", label: "300,000-400,000 ₪" },
  { value: "400000-500000", label: "400,000-500,000 ₪" },
  { value: "500000-700000", label: "500,000-700,000 ₪" },
  { value: "700000-1000000", label: "700,000-1,000,000 ₪" },
  { value: "1000000+", label: "מעל 1,000,000 ₪" },
] as const;

// ✅ Mileage ranges (מורחבות)
export const MILEAGE_RANGES = [
  { value: "0-5000", label: 'עד 5,000 ק"מ' },
  { value: "5000-10000", label: '5,000-10,000 ק"מ' },
  { value: "10000-20000", label: '10,000-20,000 ק"מ' },
  { value: "20000-30000", label: '20,000-30,000 ק"מ' },
  { value: "30000-50000", label: '30,000-50,000 ק"מ' },
  { value: "50000-70000", label: '50,000-70,000 ק"מ' },
  { value: "70000-100000", label: '70,000-100,000 ק"מ' },
  { value: "100000-120000", label: '100,000-120,000 ק"מ' },
  { value: "120000-150000", label: '120,000-150,000 ק"מ' },
  { value: "150000-200000", label: '150,000-200,000 ק"מ' },
  { value: "200000-250000", label: '200,000-250,000 ק"מ' },
  { value: "250000+", label: 'מעל 250,000 ק"מ' },
] as const;

// ✅ Israeli Cities (רשימת ערים מורחבת)
export const ISRAELI_CITIES = [
  // ערים מרכזיות
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

  // אזור המרכז
  "כפר סבא",
  "הרצליה",
  "רעננה",
  "הוד השרון",
  "רמת השרון",
  "גבעתיים",
  "יהוד מונוסון",
  "אור יהודה",
  "אזור",
  "גדרה",
  "נס ציונה",
  "ויצמן",
  "מזכרת בתיה",
  "קרית עקרון",
  "יבנה",
  "גן יבנה",

  // אזור השפלה והדרום
  "קריית גת",
  "קריית מלאכי",
  "שדרות",
  "נתיבות",
  "אופקים",
  "דימונה",
  "ערד",
  "מצפה רמון",
  "אילת",

  // אזור הצפון
  "חדרה",
  "נהריה",
  "עכו",
  "קריית שמונה",
  "מעלות תרשיחא",
  "צפת",
  "טבריה",
  "נצרת",
  "עפולה",
  "בית שאן",
  "קריית ביאליק",
  "קריית ים",
  "קריית מוצקין",
  "קריית אתא",

  // יהודה ושומרון
  "מודיעין",
  "מודיעין עילית",
  "בית שמש",
  "מעלה אדומים",
  "ביתר עילית",
  "אפרת",
  "אריאל",
  "קרני שומרון",
  "כוכב יעקב",
  "אלעד",
  "עמנואל",

  // גוש דן מורחב
  "קריית אונו",
  "ראש העין",
  "רמלה",
  "לוד",

  // ערים נוספות
  "באר יעקב",
  "תל מונד",
  "צורן",
  "צוקי ים",
  "כרמיאל",
  "מגדל העמק",
  "יקנעם",
  "קצרין",
  "זכרון יעקב",
  "בנימינה",
  "גבעת שמואל",
  "קדימה צורן",
  "שוהם",
  "מכמורת",
  "כפר יונה",
  "פרדס חנה כרכור",
  "אור עקיבא",

  // ערים ערביות
  "כפר קאסם",
  "תירה",
  "טייבה",
  "כפר ברא",
  "באקה אל גרביה",
  "אום אל פחם",
  "שפרעם",
  "סכנין",
] as const;

// ✅ Additional Car Features (תכונות נוספות)
export const CAR_FEATURES = [
  // בטיחות
  { value: "abs", label: "ABS" },
  { value: "airbags", label: "כריות אוויר" },
  { value: "esp", label: "יציבות אלקטרונית" },
  { value: "parking_sensors", label: "חיישני חניה" },
  { value: "reverse_camera", label: "מצלמת רוחה" },
  { value: "360_camera", label: "מצלמה 360" },
  { value: "blind_spot", label: "ניטור נקודה עיוורת" },
  { value: "lane_assist", label: "סיוע נתיב" },
  { value: "cruise_control", label: "בקרת שיוט" },
  { value: "adaptive_cruise", label: "בקרת שיוט מסתגלת" },

  // נוחות
  { value: "leather_seats", label: "ריפוד עור" },
  { value: "heated_seats", label: "מושבים מחוממים" },
  { value: "cooled_seats", label: "מושבים מקוררים" },
  { value: "electric_seats", label: "מושבים חשמליים" },
  { value: "sunroof", label: "חלון גג" },
  { value: "panoramic_roof", label: "גג פנורמי" },
  { value: "automatic_parking", label: "חניה אוטומטית" },
  { value: "keyless", label: "התנעה ללא מפתח" },
  { value: "remote_start", label: "התנעה מרחוק" },

  // מולטימדיה
  { value: "gps", label: "GPS ניווט" },
  { value: "bluetooth", label: "Bluetooth" },
  { value: "usb", label: "חיבור USB" },
  { value: "aux", label: "חיבור AUX" },
  { value: "wireless_charging", label: "טעינה אלחוטית" },
  { value: "premium_audio", label: "מערכת שמע מתקדמת" },
  { value: "rear_entertainment", label: "בידור אחורי" },
  { value: "android_auto", label: "Android Auto" },
  { value: "apple_carplay", label: "Apple CarPlay" },

  // אקלים
  { value: "air_conditioning", label: "מזגן" },
  { value: "dual_zone_ac", label: "מזגן דו אזורי" },
  { value: "rear_ac", label: "מזגן אחורי" },
  { value: "heated_steering", label: "הגה מחומם" },

  // חיצוני
  { value: "alloy_wheels", label: "חישוקי סגסוגת" },
  { value: "led_lights", label: "פנסי LED" },
  { value: "xenon_lights", label: "פנסי קסנון" },
  { value: "fog_lights", label: "פנסי ערפל" },
  { value: "roof_rails", label: "מתלי גג" },
  { value: "tow_bar", label: "וו גרירה" },
] as const;

// ✅ Test Results (תוצאות מבדקים)
export const TEST_RESULTS = [
  { value: "valid", label: "תקף" },
  { value: "expires_soon", label: "פג תוקף בקרוב" },
  { value: "expired", label: "פג תוקף" },
  { value: "pending", label: "ממתין למבדק" },
  { value: "unknown", label: "לא ידוע" },
] as const;

// ✅ Previous Ownership (בעלות קודמת)
export const PREVIOUS_OWNERSHIP = [
  { value: "private", label: "בעלות פרטית" },
  { value: "company", label: "רכב חברה" },
  { value: "lease", label: "ליסינג" },
  { value: "rental", label: "השכרה" },
  { value: "taxi", label: "מונית" },
  { value: "driving_school", label: "בית ספר לנהיגה" },
  { value: "police", label: "משטרה" },
  { value: "government", label: "ממשלתי" },
  { value: "unknown", label: "לא ידוע" },
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

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "auth_token",
  USER: "user_data",
  PREFERENCES: "userPreferences",
  SAVED_CARS: "savedCars",
  THEME: "theme",
  LANGUAGE: "language",
  CAR_DRAFT: "car_draft", // ✅ הוספה לשמירת טיוטות
} as const;

// Image placeholders
export const PLACEHOLDERS = {
  CAR_IMAGE: "/images/car-placeholder.jpg",
  AVATAR: "/images/avatar-placeholder.png",
  DEALER_LOGO: "/images/dealer-placeholder.png",
} as const;

// Feature flags
export const FEATURES = {
  ENABLE_NOTIFICATIONS: true,
  ENABLE_CHAT: false,
  ENABLE_VIDEO_CALLS: false,
  ENABLE_FINANCING: false,
  ENABLE_INSURANCE: false,
  ENABLE_ANALYTICS: true,
  ENABLE_AUTO_SAVE: true, // ✅ הוספה לאוטו-שמירה
  ENABLE_PRICE_VALIDATION: true, // ✅ הוספה לבדיקת מחירים
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
  AUTO_SAVE_DELAY: 2000, // ✅ הוספה לאוטו-שמירה

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

// ✅ Form Progress Thresholds (לmeter התקדמות)
export const FORM_PROGRESS = {
  REQUIRED_FIELDS: [
    "make",
    "model",
    "year",
    "price",
    "mileage",
    "fuelType",
    "transmission",
    "condition",
    "hand",
    "city",
  ],
  OPTIONAL_BONUS: {
    engineSize: 5,
    color: 5,
    bodyType: 5,
    description: 10,
    features: 15,
    images: 20,
  },
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 70,
  FAIR_THRESHOLD: 50,
} as const;

// ✅ Price Validation Ranges (לבדיקת מחירים)
export const PRICE_VALIDATION = {
  SUSPICIOUS_LOW_THRESHOLD: 0.7, // 70% מהמחיר הממוצע
  SUSPICIOUS_HIGH_THRESHOLD: 1.5, // 150% מהמחיר הממוצע
  DEPRECIATION_RATE: 0.15, // 15% בשנה
  MIN_SAMPLE_SIZE: 3, // מינימום רכבים דומים לחישוב
} as const;

// Export all as default
export default {
  API_ENDPOINTS,
  CAR_MANUFACTURERS,
  CAR_MANUFACTURERS_HEBREW,
  ENGINE_SIZES,
  CAR_CONDITIONS,
  CAR_HANDS,
  BODY_TYPES,
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
  CAR_FEATURES,
  TEST_RESULTS,
  PREVIOUS_OWNERSHIP,
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
  FORM_PROGRESS,
  PRICE_VALIDATION,
};
