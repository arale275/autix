// server/src/controllers/cars.controller.ts
import { Request, Response } from "express";
import pool from "../config/database.config";
import { AuthRequest } from "../types/auth.types";
import jwt from "jsonwebtoken";

export class CarsController {
  // קבלת כל הרכבים (עם חיפוש וסינון)
  async getAllCars(req: Request, res: Response) {
    try {
      const {
        page = 1,
        limit = 20,
        make,
        model,
        yearFrom,
        yearTo,
        priceFrom,
        priceTo,
        fuelType,
        transmission,
        city,
        search,
      } = req.query;

      const offset = (Number(page) - 1) * Number(limit);

      // בניית שאילתה דינמית
      let whereConditions = ["c.status = $1"];
      let queryParams: any[] = ["active"];
      let paramIndex = 2;

      if (make) {
        whereConditions.push(`c.make ILIKE $${paramIndex}`);
        queryParams.push(`%${make}%`);
        paramIndex++;
      }

      if (model) {
        whereConditions.push(`c.model ILIKE $${paramIndex}`);
        queryParams.push(`%${model}%`);
        paramIndex++;
      }

      if (yearFrom) {
        whereConditions.push(`c.year >= $${paramIndex}`);
        queryParams.push(Number(yearFrom));
        paramIndex++;
      }

      if (yearTo) {
        whereConditions.push(`c.year <= $${paramIndex}`);
        queryParams.push(Number(yearTo));
        paramIndex++;
      }

      if (priceFrom) {
        whereConditions.push(`c.price >= $${paramIndex}`);
        queryParams.push(Number(priceFrom));
        paramIndex++;
      }

      if (priceTo) {
        whereConditions.push(`c.price <= $${paramIndex}`);
        queryParams.push(Number(priceTo));
        paramIndex++;
      }

      if (fuelType) {
        whereConditions.push(`c.fuel_type = $${paramIndex}`);
        queryParams.push(fuelType);
        paramIndex++;
      }

      if (transmission) {
        whereConditions.push(`c.transmission = $${paramIndex}`);
        queryParams.push(transmission);
        paramIndex++;
      }

      if (city) {
        whereConditions.push(`c.city ILIKE $${paramIndex}`);
        queryParams.push(`%${city}%`);
        paramIndex++;
      }

      if (search) {
        whereConditions.push(
          `(c.make ILIKE $${paramIndex} OR c.model ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`
        );
        queryParams.push(`%${search}%`);
        paramIndex++;
      }

      const whereClause = whereConditions.join(" AND ");

      // שאילתה עיקרית
      const carsQuery = `
        SELECT 
          c.id, c.make, c.model, c.year, c.price, c.mileage,
          c.fuel_type, c.transmission, c.color, c.description,
          c.images, c.city, c.created_at, c.updated_at,
          d.business_name as dealer_name,
          u.first_name || ' ' || u.last_name as dealer_contact,
          u.phone as dealer_phone
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE ${whereClause}
        ORDER BY c.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      queryParams.push(Number(limit), offset);

      const carsResult = await pool.query(carsQuery, queryParams);

      // ספירת סה"כ תוצאות
      const countQuery = `
        SELECT COUNT(*) as total
        FROM cars c
        WHERE ${whereClause}
      `;

      const countResult = await pool.query(
        countQuery,
        queryParams.slice(0, -2)
      );
      const total = parseInt(countResult.rows[0].total);

      res.json({
        success: true,
        data: {
          cars: carsResult.rows,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get cars error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת רכבים",
      });
    }
  }

  // קבלת רכב ספציפי - עם תמונות ובדיקת בעלות
  async getCarById(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const carResult = await pool.query(
        `
        SELECT 
          c.*,
          c.dealer_id,
          d.business_name as dealer_name,
          d.address as dealer_address,
          d.city as dealer_city,
          d.description as dealer_description,
          d.verified as dealer_verified,
          d.rating as dealer_rating,
          d.user_id as dealer_user_id,
          u.first_name || ' ' || u.last_name as dealer_contact,
          u.phone as dealer_phone,
          u.email as dealer_email
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE c.id = $1
        `,
        [id]
      );

      if (carResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "רכב לא נמצא",
        });
      }

      const car = carResult.rows[0];

      // בדיקה אם הרכב לא פעיל והמשתמש לא הבעלים
      if (car.status !== "active") {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
          return res.status(404).json({
            success: false,
            message: "רכב לא נמצא",
          });
        }

        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

          // בדיקה אם המשתמש הוא הבעלים של הרכב
          if (decoded.userId !== car.dealer_user_id) {
            return res.status(404).json({
              success: false,
              message: "רכב לא נמצא",
            });
          }
        } catch (error) {
          return res.status(404).json({
            success: false,
            message: "רכב לא נמצא",
          });
        }
      }

      // המרה לcamelCase לתואמות עם Frontend
      const transformedCar = {
        ...car,
        isAvailable: car.is_available,
        fuelType: car.fuel_type,
        createdAt: car.created_at,
        updatedAt: car.updated_at,
        dealerId: car.dealer_id,
        dealerUserId: car.dealer_user_id,
        dealerName: car.dealer_name,
        dealerAddress: car.dealer_address,
        dealerCity: car.dealer_city,
        dealerDescription: car.dealer_description,
        dealerVerified: car.dealer_verified,
        dealerRating: car.dealer_rating,
        dealerContact: car.dealer_contact,
        dealerPhone: car.dealer_phone,
        dealerEmail: car.dealer_email,
      };

      // הוסף תמונות לרכב
      const imagesResult = await pool.query(
        `
        SELECT 
          id, car_id, image_url, thumbnail_url, is_main, 
          display_order, original_filename, file_size, 
          content_type, created_at, updated_at
        FROM car_images 
        WHERE car_id = $1 
        ORDER BY display_order ASC, created_at ASC
        `,
        [id]
      );

      transformedCar.images = imagesResult.rows;

      res.json({
        success: true,
        data: transformedCar,
      });
    } catch (error) {
      console.error("Get car by ID error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת פרטי רכב",
      });
    }
  }

  // הוספת רכב חדש (רק דילרים)
  async addCar(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;

      // מציאת dealer_id של המשתמש
      const dealerResult = await pool.query(
        "SELECT id FROM dealers WHERE user_id = $1",
        [userId]
      );

      if (dealerResult.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "רק דילרים יכולים להוסיף רכבים",
        });
      }

      const dealerId = dealerResult.rows[0].id;

      const {
        make,
        model,
        year,
        price,
        mileage,
        fuelType,
        transmission,
        color,
        description,
        images,
        city,
      } = req.body;

      const carResult = await pool.query(
        `
        INSERT INTO cars (
          dealer_id, make, model, year, price, mileage, 
          fuel_type, transmission, color, description, images, city
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
        `,
        [
          dealerId,
          make,
          model,
          year,
          price,
          mileage,
          fuelType,
          transmission,
          color,
          description,
          JSON.stringify(images || []),
          city,
        ]
      );

      res.status(201).json({
        success: true,
        message: "רכב נוסף בהצלחה",
        data: carResult.rows[0],
      });
    } catch (error) {
      console.error("Add car error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בהוספת רכב",
      });
    }
  }

  // עדכון רכב (רק הדילר שהוסיף אותו)
  async updateCar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // בדיקה שהרכב שייך לדילר הנוכחי
      const carCheck = await pool.query(
        `
        SELECT c.id 
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE c.id = $1 AND d.user_id = $2
        `,
        [id, userId]
      );

      if (carCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "אין לך הרשאה לערוך רכב זה",
        });
      }

      const {
        make,
        model,
        year,
        price,
        mileage,
        fuelType,
        transmission,
        color,
        description,
        images,
        city,
        status,
      } = req.body;

      const updateResult = await pool.query(
        `
        UPDATE cars SET
          make = COALESCE($2, make),
          model = COALESCE($3, model),
          year = COALESCE($4, year),
          price = COALESCE($5, price),
          mileage = COALESCE($6, mileage),
          fuel_type = COALESCE($7, fuel_type),
          transmission = COALESCE($8, transmission),
          color = COALESCE($9, color),
          description = COALESCE($10, description),
          images = COALESCE($11, images),
          city = COALESCE($12, city),
          status = COALESCE($13, status),
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
        `,
        [
          id,
          make,
          model,
          year,
          price,
          mileage,
          fuelType,
          transmission,
          color,
          description,
          images ? JSON.stringify(images) : null,
          city,
          status,
        ]
      );

      // המרה לcamelCase לתואמות עם Frontend
      const transformedCar = {
        ...updateResult.rows[0],
        isAvailable: updateResult.rows[0].is_available,
        fuelType: updateResult.rows[0].fuel_type,
        createdAt: updateResult.rows[0].created_at,
        updatedAt: updateResult.rows[0].updated_at,
        dealerId: updateResult.rows[0].dealer_id,
      };

      res.json({
        success: true,
        message: "רכב עודכן בהצלחה",
        data: transformedCar,
      });
    } catch (error) {
      console.error("Update car error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בעדכון רכב",
      });
    }
  }

  // מחיקת רכב (רק הדילר שהוסיף אותו)
  async deleteCar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      // בדיקה שהרכב שייך לדילר הנוכחי
      const carCheck = await pool.query(
        `
        SELECT c.id 
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE c.id = $1 AND d.user_id = $2
        `,
        [id, userId]
      );

      if (carCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "אין לך הרשאה למחוק רכב זה",
        });
      }

      // מחיקה רכה - שינוי סטטוס
      await pool.query(
        `
        UPDATE cars SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        `,
        [id]
      );

      res.json({
        success: true,
        message: "רכב נמחק בהצלחה",
      });
    } catch (error) {
      console.error("Delete car error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה במחיקת רכב",
      });
    }
  }

  // קבלת רכבים של דילר ספציפי
  async getDealerCars(req: AuthRequest, res: Response) {
    try {
      const { dealerId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const offset = (Number(page) - 1) * Number(limit);

      const carsResult = await pool.query(
        `
        SELECT 
          c.*,
          d.business_name as dealer_name
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE d.id = $1 AND c.status = 'active'
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
        `,
        [dealerId, Number(limit), offset]
      );

      const countResult = await pool.query(
        `
        SELECT COUNT(*) as total
        FROM cars c
        WHERE c.dealer_id = $1 AND c.status = 'active'
        `,
        [dealerId]
      );

      const total = parseInt(countResult.rows[0].total);

      res.json({
        success: true,
        data: {
          cars: carsResult.rows,
          pagination: {
            page: Number(page),
            limit: Number(limit),
            total,
            totalPages: Math.ceil(total / Number(limit)),
          },
        },
      });
    } catch (error) {
      console.error("Get dealer cars error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת רכבי הדילר",
      });
    }
  }

  // קבלת הרכבים שלי (לדילר מחובר) - מחזיר את כל הסטטוסים
  async getMyCars(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const { page = "1", limit = "20", status = "all" } = req.query;
      const pageNum = Number(page);
      const limitNum = Number(limit);
      const offset = (pageNum - 1) * limitNum;

      // בניית תנאי הסטטוס
      let statusCondition = "";
      let queryParams: any[] = [userId];
      let paramIndex = 2;

      if (status !== "all") {
        statusCondition = `AND c.status = $${paramIndex}`;
        queryParams.push(status);
        paramIndex++;
      }

      const carsResult = await pool.query(
        `
        SELECT c.*
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE d.user_id = $1 ${statusCondition}
        ORDER BY c.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `,
        [...queryParams, limitNum, offset]
      );

      const countResult = await pool.query(
        `
        SELECT COUNT(*) as total
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE d.user_id = $1 ${statusCondition}
        `,
        queryParams
      );

      const total = parseInt(countResult.rows[0].total);

      res.json({
        success: true,
        data: {
          cars: carsResult.rows,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error) {
      console.error("Get my cars error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בקבלת הרכבים שלך",
      });
    }
  }

  // טוגל זמינות רכב (הצגה/הסתרה)
  async toggleCarAvailability(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { isAvailable } = req.body;
      const userId = req.user?.id;

      // בדיקה שהרכב שייך לדילר הנוכחי
      const carCheck = await pool.query(
        `
        SELECT c.id 
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE c.id = $1 AND d.user_id = $2
        `,
        [id, userId]
      );

      if (carCheck.rows.length === 0) {
        return res.status(403).json({
          success: false,
          message: "אין לך הרשאה לערוך רכב זה",
        });
      }

      // עדכון is_available בלבד
      const updateResult = await pool.query(
        `
        UPDATE cars SET
          is_available = $2,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING *
        `,
        [id, isAvailable]
      );

      // המרה לcamelCase
      const transformedCar = {
        ...updateResult.rows[0],
        isAvailable: updateResult.rows[0].is_available,
        fuelType: updateResult.rows[0].fuel_type,
        createdAt: updateResult.rows[0].created_at,
        updatedAt: updateResult.rows[0].updated_at,
        dealerId: updateResult.rows[0].dealer_id,
      };

      res.json({
        success: true,
        message: `רכב ${isAvailable ? "הוצג" : "הוסתר"} בהצלחה`,
        data: transformedCar,
      });
    } catch (error) {
      console.error("Toggle availability error:", error);
      res.status(500).json({
        success: false,
        message: "שגיאה בעדכון זמינות הרכב",
      });
    }
  }
}
