import { Request, Response } from "express";
import { CarRequestModel } from "../models/car-request.model";
import {
  CreateCarRequestData,
  UpdateCarRequestData,
  CarRequestFilters,
} from "../types/car-request.types";
import pool from "../config/database.config";
import { AuthRequest } from '../types/auth.types';

export class CarRequestController {
  // יצירת בקשת רכב חדשה (buyers בלבד)
  static async createCarRequest(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      // בדיקה שהמשתמש הוא buyer
      if (userType !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "רק קונים יכולים ליצור בקשות רכב",
        });
      }

      // מציאת buyer_id לפי user_id
      const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
      const buyerResult = await pool.query(buyerQuery, [userId]);

      if (buyerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "פרופיל קונה לא נמצא",
        });
      }

      const buyerId = buyerResult.rows[0].id;
      const carRequestData: CreateCarRequestData = req.body;

      // יצירת בקשת הרכב
      const newCarRequest = await CarRequestModel.create(
        buyerId,
        carRequestData
      );

      res.status(201).json({
        success: true,
        message: "בקשת רכב נוצרה בהצלחה",
        data: newCarRequest,
      });
    } catch (error) {
      console.error("Error creating car request:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה ביצירת בקשת רכב",
      });
    }
  }

  // קבלת כל בקשות הרכב (dealers בלבד) עם סינון
  static async getAllCarRequests(req: AuthRequest, res: Response) {
    try {
      const userType = req.user?.user_type;

      // בדיקה שהמשתמש הוא dealer
      if (userType !== "dealer") {
        return res.status(403).json({
          success: false,
          message: "רק סוחרים יכולים לצפות בבקשות רכב",
        });
      }

      // הכנת פילטרים
      const filters: CarRequestFilters = {
        make: req.query.make as string,
        model: req.query.model as string,
        year_min: req.query.year_min ? Number(req.query.year_min) : undefined,
        year_max: req.query.year_max ? Number(req.query.year_max) : undefined,
        price_min: req.query.price_min
          ? Number(req.query.price_min)
          : undefined,
        price_max: req.query.price_max
          ? Number(req.query.price_max)
          : undefined,
        status: req.query.status as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 20,
      };

      // קבלת בקשות הרכב
      const carRequests = await CarRequestModel.getAll(filters);
      const totalCount = await CarRequestModel.getActiveCount();

      res.json({
        success: true,
        data: carRequests,
        pagination: {
          page: filters.page,
          limit: filters.limit,
          total: totalCount,
          pages: Math.ceil(totalCount / (filters.limit || 20)),
        },
      });
    } catch (error) {
      console.error("Error getting car requests:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת בקשות רכב",
      });
    }
  }

  // קבלת בקשות הרכב שלי (buyer בלבד)
  static async getMyCarRequests(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      // בדיקה שהמשתמש הוא buyer
      if (userType !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "רק קונים יכולים לצפות בבקשות שלהם",
        });
      }

      // מציאת buyer_id
      const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
      const buyerResult = await pool.query(buyerQuery, [userId]);

      if (buyerResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "פרופיל קונה לא נמצא",
        });
      }

      const buyerId = buyerResult.rows[0].id;
      const carRequests = await CarRequestModel.getByBuyerId(buyerId);

      res.json({
        success: true,
        data: carRequests,
      });
    } catch (error) {
      console.error("Error getting my car requests:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת בקשות הרכב שלך",
      });
    }
  }

  // קבלת בקשת רכב ספציפית
  static async getCarRequestById(req: AuthRequest, res: Response) {
    try {
      const carRequestId = Number(req.params.id);
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      const carRequest = await CarRequestModel.getById(carRequestId);

      if (!carRequest) {
        return res.status(404).json({
          success: false,
          message: "בקשת רכב לא נמצאה",
        });
      }

      // בדיקת הרשאות - buyer יכול לראות רק את שלו, dealer יכול לראות הכל
      if (userType === "buyer") {
        const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
        const buyerResult = await pool.query(buyerQuery, [userId]);

        if (
          buyerResult.rows.length === 0 ||
          buyerResult.rows[0].id !== carRequest.buyer_id
        ) {
          return res.status(403).json({
            success: false,
            message: "אין הרשאה לצפות בבקשה זו",
          });
        }
      }

      res.json({
        success: true,
        data: carRequest,
      });
    } catch (error) {
      console.error("Error getting car request by id:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת בקשת רכב",
      });
    }
  }

  // עדכון בקשת רכב (buyer בלבד - רק את שלו)
  static async updateCarRequest(req: AuthRequest, res: Response) {
    try {
      const carRequestId = Number(req.params.id);
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      // בדיקה שהמשתמש הוא buyer
      if (userType !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "רק קונים יכולים לעדכן בקשות רכב",
        });
      }

      // בדיקה שהבקשה קיימת ושייכת למשתמש
      const existingRequest = await CarRequestModel.getById(carRequestId);
      if (!existingRequest) {
        return res.status(404).json({
          success: false,
          message: "בקשת רכב לא נמצאה",
        });
      }

      // וידוא שהבקשה שייכת למשתמש
      const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
      const buyerResult = await pool.query(buyerQuery, [userId]);

      if (
        buyerResult.rows.length === 0 ||
        buyerResult.rows[0].id !== existingRequest.buyer_id
      ) {
        return res.status(403).json({
          success: false,
          message: "אין הרשאה לעדכן בקשה זו",
        });
      }

      const updateData: UpdateCarRequestData = req.body;
      const updatedCarRequest = await CarRequestModel.update(
        carRequestId,
        updateData
      );

      if (!updatedCarRequest) {
        return res.status(400).json({
          success: false,
          message: "שגיאה בעדכון בקשת רכב",
        });
      }

      res.json({
        success: true,
        message: "בקשת רכב עודכנה בהצלחה",
        data: updatedCarRequest,
      });
    } catch (error) {
      console.error("Error updating car request:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בעדכון בקשת רכב",
      });
    }
  }

  // מחיקת בקשת רכב (buyer בלבד - רק את שלו)
  static async deleteCarRequest(req: AuthRequest, res: Response) {
    try {
      const carRequestId = Number(req.params.id);
      const userId = req.user?.id;
      const userType = req.user?.user_type;

      // בדיקה שהמשתמש הוא buyer
      if (userType !== "buyer") {
        return res.status(403).json({
          success: false,
          message: "רק קונים יכולים למחוק בקשות רכב",
        });
      }

      // בדיקה שהבקשה קיימת ושייכת למשתמש
      const existingRequest = await CarRequestModel.getById(carRequestId);
      if (!existingRequest) {
        return res.status(404).json({
          success: false,
          message: "בקשת רכב לא נמצאה",
        });
      }

      // וידוא שהבקשה שייכת למשתמש
      const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
      const buyerResult = await pool.query(buyerQuery, [userId]);

      if (
        buyerResult.rows.length === 0 ||
        buyerResult.rows[0].id !== existingRequest.buyer_id
      ) {
        return res.status(403).json({
          success: false,
          message: "אין הרשאה למחוק בקשה זו",
        });
      }

      const deleted = await CarRequestModel.delete(carRequestId);

      if (!deleted) {
        return res.status(400).json({
          success: false,
          message: "שגיאה במחיקת בקשת רכב",
        });
      }

      res.json({
        success: true,
        message: "בקשת רכב נמחקה בהצלחה",
      });
    } catch (error) {
      console.error("Error deleting car request:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה במחיקת בקשת רכב",
      });
    }
  }
}
