// Profile Management Types

// פרופיל בסיסי של משתמש
export interface UserProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: "buyer" | "dealer";
  created_at: Date;
}

// פרופיל מלא של סוחר
export interface DealerProfile extends UserProfile {
  dealer_id: number;
  business_name: string;
  license_number?: string;
  address?: string;
  city?: string;
  description?: string;
  verified: boolean;
  rating: number;
}

// פרופיל מלא של קונה
export interface BuyerProfile extends UserProfile {
  buyer_id: number;
  preferences?: any; // JSON object
  budget_min?: number;
  budget_max?: number;
}

// עדכון פרטים בסיסיים של משתמש
export interface UpdateUserProfileData {
  first_name?: string;
  last_name?: string;
  phone?: string;
}

// עדכון פרטי עסק לסוחר
export interface UpdateDealerProfileData {
  business_name?: string;
  license_number?: string;
  address?: string;
  city?: string;
  description?: string;
}

// עדכון העדפות קונה
export interface UpdateBuyerProfileData {
  preferences?: {
    preferred_makes?: string[];
    preferred_fuel_types?: string[];
    preferred_transmission?: "manual" | "automatic" | "both";
    max_mileage?: number;
    min_year?: number;
    preferred_colors?: string[];
    other_requirements?: string;
  };
  budget_min?: number;
  budget_max?: number;
}

// סטטיסטיקות פרופיל
export interface ProfileStats {
  // עבור סוחרים
  total_cars?: number;
  active_cars?: number;
  total_inquiries?: number;
  new_inquiries?: number;

  // עבור קונים
  total_requests?: number;
  active_requests?: number;
  total_sent_inquiries?: number;

  // משותף
  member_since: Date;
  last_activity?: Date;
}

// הגדרות פרטיות
export interface PrivacySettings {
  show_phone_to_dealers: boolean;
  show_email_to_dealers: boolean;
  receive_marketing_emails: boolean;
  receive_inquiry_notifications: boolean;
  receive_new_cars_notifications: boolean;
}

// תגובה מלאה של פרופיל
export interface FullProfileResponse {
  user: UserProfile;
  dealer_details?: {
    dealer_id: number;
    business_name: string;
    license_number?: string;
    address?: string;
    city?: string;
    description?: string;
    verified: boolean;
    rating: number;
  };
  buyer_details?: {
    buyer_id: number;
    preferences?: any;
    budget_min?: number;
    budget_max?: number;
  };
  stats: ProfileStats;
  privacy_settings?: PrivacySettings;
}
