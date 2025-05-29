// server/src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/database.config";
import { AuthRequest } from "../types/auth.types";

export class AuthController {
  // רישום משתמש חדש עם יצירת פרופיל אוטומטית
  async register(req: Request, res: Response) {
    try {
      // בדיקת validation
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "נתונים לא תקינים",
          errors: errors.array(),
        });
      }

      const { email, password, firstName, lastName, phone, userType } =
        req.body;

      // בדיקה אם המשתמש כבר קיים
      const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
      );

      if (existingUser.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "משתמש עם אימייל זה כבר קיים",
        });
      }

      // הצפנת סיסמה
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // התחלת transaction
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // יצירת משתמש בטבלת users
        const userResult = await client.query(
          `INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type) 
           VALUES ($1, $2, $3, $4, $5, $6) 
           RETURNING id, email, first_name, last_name, phone, user_type, created_at`,
          [email, hashedPassword, firstName, lastName, phone, userType]
        );

        const newUser = userResult.rows[0];

        // יצירת פרופיל בהתאם לסוג המשתמש
        if (userType === "dealer") {
          await client.query(
            `INSERT INTO dealers (user_id, business_name, license_number, address, city, description, verified, rating) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              newUser.id,
              `${firstName} ${lastName} Motors`, // שם עסק זמני
              `TBD-${newUser.id}`, // מספר רישיון זמני
              "לא צוין", // כתובת
              "לא צוין", // עיר
              "עדיין לא הוזן תיאור עסק", // תיאור
              false, // לא מאומת
              0.0, // דירוג התחלתי
            ]
          );
        } else if (userType === "buyer") {
          await client.query(
            `INSERT INTO buyers (user_id, preferences, budget_min, budget_max) 
             VALUES ($1, $2, $3, $4)`,
            [
              newUser.id,
              "{}", // preferences ריק בהתחלה
              null, // budget_min
              null, // budget_max
            ]
          );
        }

        await client.query("COMMIT");

        // יצירת JWT token
        const token = jwt.sign(
          {
            userId: newUser.id,
            email: newUser.email,
            userType: newUser.user_type,
          },
          process.env.JWT_SECRET!,
          { expiresIn: "24h" }
        );

        res.status(201).json({
          success: true,
          message: "משתמש נוצר בהצלחה",
          data: {
            user: {
              id: newUser.id,
              email: newUser.email,
              firstName: newUser.first_name,
              lastName: newUser.last_name,
              phone: newUser.phone,
              userType: newUser.user_type,
              createdAt: newUser.created_at,
            },
            token,
          },
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה פנימית בשרת",
      });
    }
  }

  // התחברות
  async login(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: "נתונים לא תקינים",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;

      // חיפוש משתמש עם פרטי dealer
      const userResult = await pool.query(
        `SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name, u.phone, u.user_type,
                d.business_name, d.city as dealer_city
         FROM users u
         LEFT JOIN dealers d ON u.id = d.user_id
         WHERE u.email = $1`,
        [email]
      );

      if (userResult.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: "אימייל או סיסמה שגויים",
        });
      }

      const user = userResult.rows[0];

      // בדיקת סיסמה
      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          message: "אימייל או סיסמה שגויים",
        });
      }

      // יצירת JWT token
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          userType: user.user_type,
        },
        process.env.JWT_SECRET!,
        { expiresIn: "24h" }
      );

      // הכנת response עם dealer profile אם קיים
      const userResponse: any = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
      };

      // הוספת dealer profile אם זה דילר
      if (user.user_type === "dealer" && user.business_name) {
        userResponse.dealerProfile = {
          businessName: user.business_name,
          city: user.dealer_city,
        };
      }

      res.json({
        success: true,
        message: "התחברות בוצעה בהצלחה",
        data: {
          user: userResponse,
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה פנימית בשרת",
      });
    }
  }

  // קבלת פרופיל משתמש מחובר - זה התיקון העיקרי!
  async getProfile(req: AuthRequest, res: Response) {
    try {
      console.log("🔍 Profile request for user ID:", req.user?.userId);

      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "לא נמצא מזהה משתמש בטוקן",
        });
      }

      // שאילתה מורחבת עם פרטי dealer
      const userResult = await pool.query(
        `SELECT u.id, u.email, u.first_name, u.last_name, u.phone, u.user_type, u.created_at,
                d.id as dealer_id, d.business_name, d.license_number, d.address, d.city as dealer_city, 
                d.description, d.verified, d.rating,
                b.preferences, b.budget_min, b.budget_max
         FROM users u
         LEFT JOIN dealers d ON u.id = d.user_id
         LEFT JOIN buyers b ON u.id = b.user_id
         WHERE u.id = $1`,
        [userId]
      );

      if (userResult.rows.length === 0) {
        console.log("❌ User not found for ID:", userId);
        return res.status(404).json({
          success: false,
          message: "משתמש לא נמצא",
        });
      }

      const user = userResult.rows[0];
      console.log("👤 Found user:", {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        userType: user.user_type,
        hasDealer: !!user.dealer_id,
      });

      // הכנת response
      const userResponse: any = {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        userType: user.user_type,
        createdAt: user.created_at,
      };

      // הוספת dealer profile אם קיים
      if (user.user_type === "dealer" && user.dealer_id) {
        userResponse.dealerProfile = {
          id: user.dealer_id,
          businessName: user.business_name,
          licenseNumber: user.license_number,
          address: user.address,
          city: user.dealer_city,
          description: user.description,
          verified: user.verified,
          rating: parseFloat(user.rating) || 0,
        };
      }

      // הוספת buyer profile אם קיים
      if (user.user_type === "buyer" && user.preferences !== null) {
        userResponse.buyerProfile = {
          preferences: user.preferences,
          budgetMin: user.budget_min,
          budgetMax: user.budget_max,
        };
      }

      console.log("✅ Returning user profile:", userResponse);

      res.json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      console.error("Profile error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה פנימית בשרת",
      });
    }
  }
}
