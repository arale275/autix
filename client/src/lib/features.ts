// client/src/lib/features.ts

export const FEATURE_LABELS: Record<string, string> = {
  // בטיחות
  abs: "ABS",
  airbags: "כריות אוויר",
  esp: "ESP",
  parking_sensors: "חיישני חניה",
  reverse_camera: "מצלמת רוורס",
  "360_camera": "מצלמה 360°",
  blind_spot: "ניטור נקודה עיוורת",
  lane_assist: "סיוע שמירה על נתיב",
  cruise_control: "בקרת שיוט",
  adaptive_cruise: "בקרת שיוט אדפטיבית",

  // נוחות
  leather_seats: "מושבי עור",
  heated_seats: "מושבים מחוממים",
  cooled_seats: "מושבים מקוררים",
  electric_seats: "מושבים חשמליים",
  sunroof: "גג נפתח",
  panoramic_roof: "גג פנורמי",
  automatic_parking: "חניה אוטומטית",
  keyless: "כניסה ללא מפתח",
  remote_start: "הדלקה מרחוק",

  // מולטימדיה
  gps: "GPS",
  bluetooth: "Bluetooth",
  usb: "USB",
  aux: "AUX",
  wireless_charging: "טעינה אלחוטית",
  premium_audio: "מערכת שמע פרימיום",
  rear_entertainment: "בידור אחורי",
  android_auto: "Android Auto",
  apple_carplay: "Apple CarPlay",

  // אקלים
  air_conditioning: "מיזוג אוויר",
  dual_zone_ac: "מיזוג דו אזורי",
  rear_ac: "מיזוג אחורי",
  heated_steering: "הגה מחומם",

  // חיצוני
  alloy_wheels: "חישוקי סגסוגת",
  led_lights: "פנסי LED",
  xenon_lights: "פנסי קסנון",
  fog_lights: "פנסי ערפל",
  roof_rails: "פסי גג",
  tow_bar: "וו גרירה",
};

export const getFeatureLabel = (feature: string): string => {
  return FEATURE_LABELS[feature] || feature;
};

// קטגוריות לסידור
export const FEATURE_CATEGORIES = {
  safety: [
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
  ],
  comfort: [
    "leather_seats",
    "heated_seats",
    "cooled_seats",
    "electric_seats",
    "sunroof",
    "panoramic_roof",
    "automatic_parking",
    "keyless",
    "remote_start",
  ],
  multimedia: [
    "gps",
    "bluetooth",
    "usb",
    "aux",
    "wireless_charging",
    "premium_audio",
    "rear_entertainment",
    "android_auto",
    "apple_carplay",
  ],
  climate: ["air_conditioning", "dual_zone_ac", "rear_ac", "heated_steering"],
  exterior: [
    "alloy_wheels",
    "led_lights",
    "xenon_lights",
    "fog_lights",
    "roof_rails",
    "tow_bar",
  ],
};
