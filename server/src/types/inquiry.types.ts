// Inquiry Types - פניות חד-כיווניות: קונים → סוחרים בלבד
export interface Inquiry {
  id: number;
  buyer_id: number; // המשתמש שפונה (תמיד buyer)
  dealer_id: number; // הסוחר שמקבל את הפנייה
  car_id?: number; // אופציונלי - פנייה על רכב ספציפי או כללית
  message: string; // הודעת הקונה לסוחר
  status: "new" | "responded" | "closed";
  created_at: Date;
}

export interface CreateInquiryData {
  dealer_id: number; // איזה סוחר לפנות אליו
  car_id?: number; // על איזה רכב (אופציונלי)
  message: string; // מה הקונה רוצה לשאול/לומר
}

// רק הסוחר יכול לעדכן סטטוס (לא את ההודעה)
export interface UpdateInquiryStatusData {
  status: "responded" | "closed"; // רק סוחר יכול לשנות ל-responded או closed
}

export interface InquiryResponse extends Inquiry {
  // פרטי הקונה שפנה
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;

  // פרטי הסוחר שקיבל את הפנייה
  dealer_business_name: string;
  dealer_phone?: string;
  dealer_email: string;

  // פרטי הרכב (אם הפנייה על רכב ספציפי)
  car_make?: string;
  car_model?: string;
  car_year?: number;
  car_price?: number;
  car_color?: string;
}

export interface InquiryFilters {
  status?: "new" | "responded" | "closed";
  car_id?: number;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

// סטטיסטיקות לסוחר
export interface DealerInquiryStats {
  total_inquiries: number;
  new_inquiries: number;
  responded_inquiries: number;
  closed_inquiries: number;
  inquiries_this_month: number;
  most_requested_car?: {
    make: string;
    model: string;
    inquiries_count: number;
  };
}
