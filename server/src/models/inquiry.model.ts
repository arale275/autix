import pool from "../config/database.config";
import {
  Inquiry,
  CreateInquiryData,
  UpdateInquiryStatusData,
  InquiryResponse,
  InquiryFilters,
  DealerInquiryStats,
} from "../types/inquiry.types";

export class InquiryModel {
  // יצירת פנייה חדשה (buyers בלבד)
  static async create(
    buyerId: number,
    data: CreateInquiryData
  ): Promise<Inquiry> {
    const query = `
      INSERT INTO inquiries (
        buyer_id, dealer_id, car_id, message, status, created_at
      ) VALUES ($1, $2, $3, $4, 'new', NOW())
      RETURNING *
    `;

    const values = [buyerId, data.dealer_id, data.car_id || null, data.message];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // קבלת פניות שקיבל סוחר ספציפי
  static async getReceivedInquiries(
    dealerId: number,
    filters: InquiryFilters = {}
  ): Promise<InquiryResponse[]> {
    let query = `
      SELECT 
        i.*,
        u_buyer.first_name || ' ' || u_buyer.last_name as buyer_name,
        u_buyer.phone as buyer_phone,
        u_buyer.email as buyer_email,
        d.business_name as dealer_business_name,
        u_dealer.phone as dealer_phone,
        u_dealer.email as dealer_email,
        c.make as car_make,
        c.model as car_model,
        c.year as car_year,
        c.price as car_price,
        c.color as car_color
      FROM inquiries i
      -- חיבור לקונה
      JOIN buyers b ON i.buyer_id = b.id
      JOIN users u_buyer ON b.user_id = u_buyer.id
      -- חיבור לסוחר
      JOIN dealers d ON i.dealer_id = d.id
      JOIN users u_dealer ON d.user_id = u_dealer.id
      -- חיבור לרכב (אופציונלי)
      LEFT JOIN cars c ON i.car_id = c.id
      WHERE i.dealer_id = $1
    `;

    const values: any[] = [dealerId];
    let paramCounter = 2;

    // סינון לפי סטטוס
    if (filters.status) {
      query += ` AND i.status = $${paramCounter}`;
      values.push(filters.status);
      paramCounter++;
    }

    // סינון לפי רכב ספציפי
    if (filters.car_id) {
      query += ` AND i.car_id = $${paramCounter}`;
      values.push(filters.car_id);
      paramCounter++;
    }

    // סינון לפי תאריך
    if (filters.date_from) {
      query += ` AND i.created_at >= $${paramCounter}`;
      values.push(filters.date_from);
      paramCounter++;
    }

    if (filters.date_to) {
      query += ` AND i.created_at <= $${paramCounter}`;
      values.push(filters.date_to);
      paramCounter++;
    }

    // מיון - חדשות ראשונות
    query += ` ORDER BY 
      CASE i.status 
        WHEN 'new' THEN 1 
        WHEN 'responded' THEN 2 
        ELSE 3 
      END,
      i.created_at DESC
    `;

    // Pagination
    const limit = filters.limit || 20;
    const page = filters.page || 1;
    const offset = (page - 1) * limit;

    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  // קבלת פניות ששלח קונה ספציפי
  static async getSentInquiries(
    buyerId: number,
    filters: InquiryFilters = {}
  ): Promise<InquiryResponse[]> {
    let query = `
      SELECT 
        i.*,
        u_buyer.first_name || ' ' || u_buyer.last_name as buyer_name,
        u_buyer.phone as buyer_phone,
        u_buyer.email as buyer_email,
        d.business_name as dealer_business_name,
        u_dealer.phone as dealer_phone,
        u_dealer.email as dealer_email,
        c.make as car_make,
        c.model as car_model,
        c.year as car_year,
        c.price as car_price,
        c.color as car_color
      FROM inquiries i
      -- חיבור לקונה
      JOIN buyers b ON i.buyer_id = b.id
      JOIN users u_buyer ON b.user_id = u_buyer.id
      -- חיבור לסוחר
      JOIN dealers d ON i.dealer_id = d.id
      JOIN users u_dealer ON d.user_id = u_dealer.id
      -- חיבור לרכב (אופציונלי)
      LEFT JOIN cars c ON i.car_id = c.id
      WHERE i.buyer_id = $1
    `;

    const values: any[] = [buyerId];
    let paramCounter = 2;

    // סינון לפי סטטוס
    if (filters.status) {
      query += ` AND i.status = $${paramCounter}`;
      values.push(filters.status);
      paramCounter++;
    }

    // מיון לפי תאריך יצירה
    query += ` ORDER BY i.created_at DESC`;

    // Pagination
    const limit = filters.limit || 20;
    const page = filters.page || 1;
    const offset = (page - 1) * limit;

    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  // קבלת פנייה ספציפית
  static async getById(inquiryId: number): Promise<InquiryResponse | null> {
    const query = `
      SELECT 
        i.*,
        u_buyer.first_name || ' ' || u_buyer.last_name as buyer_name,
        u_buyer.phone as buyer_phone,
        u_buyer.email as buyer_email,
        d.business_name as dealer_business_name,
        u_dealer.phone as dealer_phone,
        u_dealer.email as dealer_email,
        c.make as car_make,
        c.model as car_model,
        c.year as car_year,
        c.price as car_price,
        c.color as car_color
      FROM inquiries i
      -- חיבור לקונה
      JOIN buyers b ON i.buyer_id = b.id
      JOIN users u_buyer ON b.user_id = u_buyer.id
      -- חיבור לסוחר
      JOIN dealers d ON i.dealer_id = d.id
      JOIN users u_dealer ON d.user_id = u_dealer.id
      -- חיבור לרכב (אופציונלי)
      LEFT JOIN cars c ON i.car_id = c.id
      WHERE i.id = $1
    `;

    const result = await pool.query(query, [inquiryId]);
    return result.rows[0] || null;
  }

  // עדכון סטטוס פנייה (dealers בלבד)
  static async updateStatus(
    inquiryId: number,
    status: "responded" | "closed"
  ): Promise<Inquiry | null> {
    try {
      const query = `
        UPDATE inquiries 
        SET status = $1
        WHERE id = $2
        RETURNING *
      `;

      const result = await pool.query(query, [status, inquiryId]);
      console.log("Update result:", result.rows); // Debug log
      return result.rows[0] || null;
    } catch (error) {
      console.error("Error in updateStatus:", error);
      return null;
    }
  }

  // בדיקה אם פנייה שייכת לסוחר ספציפי
  static async belongsToDealer(
    inquiryId: number,
    dealerId: number
  ): Promise<boolean> {
    const query = `SELECT id FROM inquiries WHERE id = $1 AND dealer_id = $2`;
    const result = await pool.query(query, [inquiryId, dealerId]);
    return result.rows.length > 0;
  }

  // בדיקה אם פנייה שייכת לקונה ספציפי
  static async belongsToBuyer(
    inquiryId: number,
    buyerId: number
  ): Promise<boolean> {
    const query = `SELECT id FROM inquiries WHERE id = $1 AND buyer_id = $2`;
    const result = await pool.query(query, [inquiryId, buyerId]);
    return result.rows.length > 0;
  }

  // סטטיסטיקות לסוחר
  static async getDealerStats(dealerId: number): Promise<DealerInquiryStats> {
    // ספירה כללית
    const statsQuery = `
      SELECT 
        COUNT(*) as total_inquiries,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_inquiries,
        COUNT(CASE WHEN status = 'responded' THEN 1 END) as responded_inquiries,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_inquiries,
        COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as inquiries_this_month
      FROM inquiries 
      WHERE dealer_id = $1
    `;

    const statsResult = await pool.query(statsQuery, [dealerId]);
    const stats = statsResult.rows[0];

    // הרכב הכי מבוקש
    const mostRequestedQuery = `
      SELECT 
        c.make, 
        c.model, 
        COUNT(*) as inquiries_count
      FROM inquiries i
      JOIN cars c ON i.car_id = c.id
      WHERE i.dealer_id = $1 AND i.car_id IS NOT NULL
      GROUP BY c.make, c.model
      ORDER BY inquiries_count DESC
      LIMIT 1
    `;

    const mostRequestedResult = await pool.query(mostRequestedQuery, [
      dealerId,
    ]);
    const mostRequested = mostRequestedResult.rows[0] || null;

    return {
      total_inquiries: parseInt(stats.total_inquiries),
      new_inquiries: parseInt(stats.new_inquiries),
      responded_inquiries: parseInt(stats.responded_inquiries),
      closed_inquiries: parseInt(stats.closed_inquiries),
      inquiries_this_month: parseInt(stats.inquiries_this_month),
      most_requested_car: mostRequested
        ? {
            make: mostRequested.make,
            model: mostRequested.model,
            inquiries_count: parseInt(mostRequested.inquiries_count),
          }
        : undefined,
    };
  }

  // מחיקת פנייה (רק אם לא נענתה)
  static async delete(inquiryId: number): Promise<boolean> {
    const query = `
      DELETE FROM inquiries 
      WHERE id = $1 AND status = 'new'
      RETURNING id
    `;

    const result = await pool.query(query, [inquiryId]);
    return result.rows.length > 0;
  }
}
