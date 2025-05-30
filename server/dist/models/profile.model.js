"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
class ProfileModel {
    // קבלת פרופיל משתמש בסיסי
    static async getUserProfile(userId) {
        const query = `
      SELECT 
        id, email, first_name, last_name, 
        phone, user_type, created_at
      FROM users 
      WHERE id = $1
    `;
        const result = await database_config_1.default.query(query, [userId]);
        return result.rows[0] || null;
    }
    // קבלת פרופיל סוחר מלא
    static async getDealerProfile(userId) {
        const query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, 
        u.phone, u.user_type, u.created_at,
        d.id as dealer_id, d.business_name, d.license_number,
        d.address, d.city, d.description, d.verified, d.rating
      FROM users u
      JOIN dealers d ON u.id = d.user_id
      WHERE u.id = $1 AND u.user_type = 'dealer'
    `;
        const result = await database_config_1.default.query(query, [userId]);
        return result.rows[0] || null;
    }
    // קבלת פרופיל קונה מלא
    static async getBuyerProfile(userId) {
        const query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, 
        u.phone, u.user_type, u.created_at,
        b.id as buyer_id, b.preferences, 
        b.budget_min, b.budget_max
      FROM users u
      JOIN buyers b ON u.id = b.user_id
      WHERE u.id = $1 AND u.user_type = 'buyer'
    `;
        const result = await database_config_1.default.query(query, [userId]);
        return result.rows[0] || null;
    }
    // קבלת פרופיל מלא (כל הפרטים ביחד)
    static async getFullProfile(userId) {
        const userProfile = await this.getUserProfile(userId);
        if (!userProfile)
            return null;
        const response = {
            user: userProfile,
            stats: await this.getProfileStats(userId, userProfile.user_type),
        };
        // הוספת פרטים ספציפיים לפי סוג משתמש
        if (userProfile.user_type === "dealer") {
            const dealerQuery = `
        SELECT id as dealer_id, business_name, license_number,
               address, city, description, verified, rating
        FROM dealers WHERE user_id = $1
      `;
            const dealerResult = await database_config_1.default.query(dealerQuery, [userId]);
            if (dealerResult.rows.length > 0) {
                response.dealer_details = dealerResult.rows[0];
            }
        }
        else if (userProfile.user_type === "buyer") {
            const buyerQuery = `
        SELECT id as buyer_id, preferences, budget_min, budget_max
        FROM buyers WHERE user_id = $1
      `;
            const buyerResult = await database_config_1.default.query(buyerQuery, [userId]);
            if (buyerResult.rows.length > 0) {
                response.buyer_details = buyerResult.rows[0];
            }
        }
        return response;
    }
    // עדכון פרטים בסיסיים של משתמש
    static async updateUserProfile(userId, data) {
        const fields = [];
        const values = [];
        let paramCounter = 1;
        if (data.first_name !== undefined) {
            fields.push(`first_name = $${paramCounter}`);
            values.push(data.first_name);
            paramCounter++;
        }
        if (data.last_name !== undefined) {
            fields.push(`last_name = $${paramCounter}`);
            values.push(data.last_name);
            paramCounter++;
        }
        if (data.phone !== undefined) {
            fields.push(`phone = $${paramCounter}`);
            values.push(data.phone);
            paramCounter++;
        }
        if (fields.length === 0) {
            return await this.getUserProfile(userId);
        }
        fields.push(`updated_at = NOW()`);
        const query = `
      UPDATE users 
      SET ${fields.join(", ")}
      WHERE id = $${paramCounter}
      RETURNING id, email, first_name, last_name, phone, user_type, created_at
    `;
        values.push(userId);
        const result = await database_config_1.default.query(query, values);
        return result.rows[0] || null;
    }
    // עדכון פרטי עסק לסוחר
    static async updateDealerProfile(userId, data) {
        const fields = [];
        const values = [];
        let paramCounter = 1;
        if (data.business_name !== undefined) {
            fields.push(`business_name = $${paramCounter}`);
            values.push(data.business_name);
            paramCounter++;
        }
        if (data.license_number !== undefined) {
            fields.push(`license_number = $${paramCounter}`);
            values.push(data.license_number);
            paramCounter++;
        }
        if (data.address !== undefined) {
            fields.push(`address = $${paramCounter}`);
            values.push(data.address);
            paramCounter++;
        }
        if (data.city !== undefined) {
            fields.push(`city = $${paramCounter}`);
            values.push(data.city);
            paramCounter++;
        }
        if (data.description !== undefined) {
            fields.push(`description = $${paramCounter}`);
            values.push(data.description);
            paramCounter++;
        }
        if (fields.length === 0) {
            return true;
        }
        const query = `
      UPDATE dealers 
      SET ${fields.join(", ")}
      WHERE user_id = $${paramCounter}
      RETURNING id
    `;
        values.push(userId);
        const result = await database_config_1.default.query(query, values);
        return result.rows.length > 0;
    }
    // עדכון העדפות קונה
    static async updateBuyerProfile(userId, data) {
        const fields = [];
        const values = [];
        let paramCounter = 1;
        if (data.preferences !== undefined) {
            fields.push(`preferences = $${paramCounter}`);
            values.push(JSON.stringify(data.preferences));
            paramCounter++;
        }
        if (data.budget_min !== undefined) {
            fields.push(`budget_min = $${paramCounter}`);
            values.push(data.budget_min);
            paramCounter++;
        }
        if (data.budget_max !== undefined) {
            fields.push(`budget_max = $${paramCounter}`);
            values.push(data.budget_max);
            paramCounter++;
        }
        if (fields.length === 0) {
            return true;
        }
        const query = `
      UPDATE buyers 
      SET ${fields.join(", ")}
      WHERE user_id = $${paramCounter}
      RETURNING id
    `;
        values.push(userId);
        const result = await database_config_1.default.query(query, values);
        return result.rows.length > 0;
    }
    // קבלת סטטיסטיקות פרופיל
    static async getProfileStats(userId, userType) {
        const baseQuery = `SELECT created_at FROM users WHERE id = $1`;
        const baseResult = await database_config_1.default.query(baseQuery, [userId]);
        const stats = {
            member_since: baseResult.rows[0]?.created_at || new Date(),
        };
        if (userType === "dealer") {
            // סטטיסטיקות סוחר
            const dealerStatsQuery = `
        SELECT 
          -- רכבים
          (SELECT COUNT(*) FROM cars c JOIN dealers d ON c.dealer_id = d.id WHERE d.user_id = $1) as total_cars,
          (SELECT COUNT(*) FROM cars c JOIN dealers d ON c.dealer_id = d.id WHERE d.user_id = $1 AND c.status = 'active') as active_cars,
          -- פניות
          (SELECT COUNT(*) FROM inquiries i JOIN dealers d ON i.dealer_id = d.id WHERE d.user_id = $1) as total_inquiries,
          (SELECT COUNT(*) FROM inquiries i JOIN dealers d ON i.dealer_id = d.id WHERE d.user_id = $1 AND i.status = 'new') as new_inquiries
      `;
            const dealerResult = await database_config_1.default.query(dealerStatsQuery, [userId]);
            const dealerStats = dealerResult.rows[0];
            stats.total_cars = parseInt(dealerStats.total_cars) || 0;
            stats.active_cars = parseInt(dealerStats.active_cars) || 0;
            stats.total_inquiries = parseInt(dealerStats.total_inquiries) || 0;
            stats.new_inquiries = parseInt(dealerStats.new_inquiries) || 0;
        }
        else if (userType === "buyer") {
            // סטטיסטיקות קונה
            const buyerStatsQuery = `
        SELECT 
          -- בקשות רכב
          (SELECT COUNT(*) FROM car_requests cr JOIN buyers b ON cr.buyer_id = b.id WHERE b.user_id = $1) as total_requests,
          (SELECT COUNT(*) FROM car_requests cr JOIN buyers b ON cr.buyer_id = b.id WHERE b.user_id = $1 AND cr.status = 'active') as active_requests,
          -- פניות ששלח
          (SELECT COUNT(*) FROM inquiries i JOIN buyers b ON i.buyer_id = b.id WHERE b.user_id = $1) as total_sent_inquiries
      `;
            const buyerResult = await database_config_1.default.query(buyerStatsQuery, [userId]);
            const buyerStats = buyerResult.rows[0];
            stats.total_requests = parseInt(buyerStats.total_requests) || 0;
            stats.active_requests = parseInt(buyerStats.active_requests) || 0;
            stats.total_sent_inquiries =
                parseInt(buyerStats.total_sent_inquiries) || 0;
        }
        // פעילות אחרונה
        let lastActivityQuery;
        if (userType === "dealer") {
            lastActivityQuery = `
        SELECT MAX(activity_date) as last_activity FROM (
          SELECT MAX(created_at) as activity_date FROM cars c JOIN dealers d ON c.dealer_id = d.id WHERE d.user_id = $1
          UNION ALL
          SELECT MAX(created_at) as activity_date FROM inquiries i JOIN dealers d ON i.dealer_id = d.id WHERE d.user_id = $1
        ) activities
      `;
        }
        else {
            lastActivityQuery = `
        SELECT MAX(activity_date) as last_activity FROM (
          SELECT MAX(created_at) as activity_date FROM car_requests cr JOIN buyers b ON cr.buyer_id = b.id WHERE b.user_id = $1
          UNION ALL
          SELECT MAX(created_at) as activity_date FROM inquiries i JOIN buyers b ON i.buyer_id = b.id WHERE b.user_id = $1
        ) activities
      `;
        }
        const activityResult = await database_config_1.default.query(lastActivityQuery, [userId]);
        stats.last_activity = activityResult.rows[0]?.last_activity || null;
        return stats;
    }
    // בדיקה אם משתמש קיים
    static async userExists(userId) {
        const query = `SELECT id FROM users WHERE id = $1`;
        const result = await database_config_1.default.query(query, [userId]);
        return result.rows.length > 0;
    }
    // קבלת כל הסוחרים (לרשימות ציבוריות)
    static async getAllDealers(limit = 50) {
        const query = `
      SELECT 
        u.id, u.email, u.first_name, u.last_name, 
        u.phone, u.user_type, u.created_at,
        d.id as dealer_id, d.business_name, d.license_number,
        d.address, d.city, d.description, d.verified, d.rating
      FROM users u
      JOIN dealers d ON u.id = d.user_id
      WHERE u.user_type = 'dealer'
      ORDER BY d.verified DESC, d.rating DESC, d.business_name ASC
      LIMIT $1
    `;
        const result = await database_config_1.default.query(query, [limit]);
        return result.rows;
    }
}
exports.ProfileModel = ProfileModel;
