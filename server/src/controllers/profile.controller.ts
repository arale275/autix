import { Request, Response } from "express";
import { ProfileModel } from "../models/profile.model";
import {
  UpdateUserProfileData,
  UpdateDealerProfileData,
  UpdateBuyerProfileData,
} from "../types/profile.types";
import { AuthRequest } from '../types/auth.types';

export class ProfileController {
  // קבלת פרופיל משתמש בסיסי
  static async getUserProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "משתמש לא מחובר",
        });
      }

      const profile = await ProfileModel.getUserProfile(userId);

      if (!profile) {
        return res.status(404).json({
          success: false,
          message: "פרופיל לא נמצא",
        });
      }

      res.json({
        success: true,
        data: profile,
      });
    } catch (error) {
      console.error("Error getting user profile:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת פרופיל משתמש",
      });
    }
  }

  // קבלת פרופיל מלא (כל הפרטים)
  static async getFullProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "משתמש לא מחובר",
        });
      }

      const fullProfile = await ProfileModel.getFullProfile(userId);

      if (!fullProfile) {
        return res.status(404).json({
          success: false,
          message: "פרופיל לא נמצא",
        });
      }

      res.json({
        success: true,
        data: fullProfile,
      });
    } catch (error) {
      console.error("Error getting full profile:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת פרופיל מלא",
      });
    }
  }

  // עדכון פרטים בסיסיים של משתמש
  static async updateUserProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "משתמש לא מחובר",
        });
      }

      const updateData: UpdateUserProfileData = req.body;

      // בדיקה שיש לפחות שדה אחד לעדכון
      if (
        !updateData.first_name &&
        !updateData.last_name &&
        !updateData.phone
      ) {
        return res.status(400).json({
          success: false,
          message: "יש לציין לפחות שדה אחד לעדכון",
        });
      }

      const updatedProfile = await ProfileModel.updateUserProfile(
        userId,
        updateData
      );

      if (!updatedProfile) {
        return res.status(400).json({
          success: false,
          message: "שגיאה בעדכון פרופיל",
        });
      }

      res.json({
        success: true,
        message: "פרופיל עודכן בהצלחה",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בעדכון פרופיל",
      });
    }
  }

  // עדכון פרטי עסק (dealers בלבד)
  static async updateDealerProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "משתמש לא מחובר",
        });
      }

      if (userType !== "dealer") {
        return res.status(403).json({
          success: false,
          message: "רק סוחרים יכולים לעדכן פרטי עסק",
        });
      }

      const updateData: UpdateDealerProfileData = req.body;

      // בדיקה שיש לפחות שדה אחד לעדכון
      if (
        !updateData.business_name &&
        !updateData.license_number &&
        !updateData.address &&
        !updateData.city &&
        !updateData.description
      ) {
        return res.status(400).json({
          success: false,
          message: "יש לציין לפחות שדה אחד לעדכון",
        });
      }

      const updated = await ProfileModel.updateDealerProfile(
        userId,
        updateData
      );

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "שגיאה בעדכון פרטי עסק",
        });
      }

      // החזרת פרופיל מעודכן
      const updatedProfile = await ProfileModel.getDealerProfile(userId);

      res.json({
        success: true,
        message: "פרטי עסק עודכנו בהצלחה",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating dealer profile:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בעדכון פרטי עסק",
      });
    }
  }

  // עדכון העדפות קונה (buyers בלבד)
  static async updateBuyerProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "משתמש לא מחובר",
        });
      }

      if (userType !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "רק קונים יכולים לעדכן העדפות",
        });
      }

      const updateData: UpdateBuyerProfileData = req.body;

      // בדיקה שיש לפחות שדה אחד לעדכון
      if (
        !updateData.preferences &&
        updateData.budget_min === undefined &&
        updateData.budget_max === undefined
      ) {
        return res.status(400).json({
          success: false,
          message: "יש לציין לפחות שדה אחד לעדכון",
        });
      }

      const updated = await ProfileModel.updateBuyerProfile(userId, updateData);

      if (!updated) {
        return res.status(400).json({
          success: false,
          message: "שגיאה בעדכון העדפות",
        });
      }

      // החזרת פרופיל מעודכן
      const updatedProfile = await ProfileModel.getBuyerProfile(userId);

      res.json({
        success: true,
        message: "העדפות עודכנו בהצלחה",
        data: updatedProfile,
      });
    } catch (error) {
      console.error("Error updating buyer profile:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בעדכון העדפות",
      });
    }
  }

  // קבלת סטטיסטיקות פרופיל
  static async getProfileStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      if (!userId || !userType) {
        return res.status(401).json({
          success: false,
          message: "משתמש לא מחובר",
        });
      }

      const stats = await ProfileModel.getProfileStats(userId, userType);

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error getting profile stats:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת סטטיסטיקות",
      });
    }
  }

  // קבלת רשימת סוחרים (ציבורי)
  static async getAllDealers(req: AuthRequest, res: Response) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 50;
      const verifiedOnly = req.query.verified_only === "true";

      let dealers = await ProfileModel.getAllDealers(limit);

      // סינון סוחרים מאומתים בלבד אם נדרש
      if (verifiedOnly) {
        dealers = dealers.filter((dealer) => dealer.verified);
      }

      res.json({
        success: true,
        data: dealers,
        meta: {
          total: dealers.length,
          limit,
          verified_only: verifiedOnly,
        },
      });
    } catch (error) {
      console.error("Error getting all dealers:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת רשימת סוחרים",
      });
    }
  }

  // קבלת פרופיל סוחר ספציפי (ציבורי)
  static async getDealerById(req: AuthRequest, res: Response) {
    try {
      const dealerId = Number(req.params.id);

      if (isNaN(dealerId) || dealerId < 1) {
        return res.status(400).json({
          success: false,
          message: "מזהה סוחר לא תקין",
        });
      }

      // מציאת user_id של הסוחר
      const dealerQuery = "SELECT user_id FROM dealers WHERE id = $1";
      const pool = require("../config/database.config").default;
      const dealerResult = await pool.query(dealerQuery, [dealerId]);

      if (dealerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "סוחר לא נמצא",
        });
      }

      const userId = dealerResult.rows[0].user_id;
      const dealerProfile = await ProfileModel.getDealerProfile(userId);

      if (!dealerProfile) {
        return res.status(404).json({
          success: false,
          message: "פרופיל סוחר לא נמצא",
        });
      }

      // מידע ציבורי בלבד (הסרת פרטים רגישים)
      const publicProfile = {
        dealer_id: dealerProfile.dealer_id,
        business_name: dealerProfile.business_name,
        city: dealerProfile.city,
        description: dealerProfile.description,
        verified: dealerProfile.verified,
        rating: dealerProfile.rating,
        first_name: dealerProfile.first_name,
        created_at: dealerProfile.created_at,
      };

      res.json({
        success: true,
        data: publicProfile,
      });
    } catch (error) {
      console.error("Error getting dealer by id:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת פרופיל סוחר",
      });
    }
  }

  // מחיקת חשבון (soft delete)
  static async deleteAccount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { confirm_password } = req.body;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "משתמש לא מחובר",
        });
      }

      if (!confirm_password) {
        return res.status(400).json({
          success: false,
          message: "יש לאשר את הסיסמה למחיקת החשבון",
        });
      }

      // TODO: בעתיד - בדיקת סיסמה ומחיקה רכה
      // כרגע רק הודעה שהתכונה בפיתוח
      res.status(501).json({
        success: false,
        message: "מחיקת חשבון תהיה זמינה בקרוב",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה במחיקת חשבון",
      });
    }
  }
}
