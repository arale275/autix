"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarsController = void 0;
const database_config_1 = __importDefault(require("../config/database.config"));
class CarsController {
    // קבלת כל הרכבים (עם חיפוש וסינון)
    async getAllCars(req, res) {
        try {
            const { page = 1, limit = 20, make, model, yearFrom, yearTo, priceFrom, priceTo, fuelType, transmission, city, search, } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            // בניית שאילתה דינמית
            let whereConditions = ["c.status = $1"];
            let queryParams = ["active"];
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
                whereConditions.push(`(c.make ILIKE $${paramIndex} OR c.model ILIKE $${paramIndex} OR c.description ILIKE $${paramIndex})`);
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
            const carsResult = await database_config_1.default.query(carsQuery, queryParams);
            // ספירת סה"כ תוצאות
            const countQuery = `
        SELECT COUNT(*) as total
        FROM cars c
        WHERE ${whereClause}
      `;
            const countResult = await database_config_1.default.query(countQuery, queryParams.slice(0, -2));
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
        }
        catch (error) {
            console.error("Get cars error:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת רכבים",
            });
        }
    }
    // קבלת רכב ספציפי
    async getCarById(req, res) {
        try {
            const { id } = req.params;
            const carResult = await database_config_1.default.query(`
        SELECT 
          c.*,
          d.business_name as dealer_name,
          d.address as dealer_address,
          d.city as dealer_city,
          d.description as dealer_description,
          d.verified as dealer_verified,
          d.rating as dealer_rating,
          u.first_name || ' ' || u.last_name as dealer_contact,
          u.phone as dealer_phone,
          u.email as dealer_email
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        JOIN users u ON d.user_id = u.id
        WHERE c.id = $1 AND c.status = 'active'
      `, [id]);
            if (carResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "רכב לא נמצא",
                });
            }
            res.json({
                success: true,
                data: carResult.rows[0],
            });
        }
        catch (error) {
            console.error("Get car by ID error:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת פרטי רכב",
            });
        }
    }
    // הוספת רכב חדש (רק דילרים)
    async addCar(req, res) {
        try {
            const userId = req.user?.userId;
            // מציאת dealer_id של המשתמש
            const dealerResult = await database_config_1.default.query("SELECT id FROM dealers WHERE user_id = $1", [userId]);
            if (dealerResult.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "רק דילרים יכולים להוסיף רכבים",
                });
            }
            const dealerId = dealerResult.rows[0].id;
            const { make, model, year, price, mileage, fuelType, transmission, color, description, images, city, } = req.body;
            const carResult = await database_config_1.default.query(`
        INSERT INTO cars (
          dealer_id, make, model, year, price, mileage, 
          fuel_type, transmission, color, description, images, city
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
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
            ]);
            res.status(201).json({
                success: true,
                message: "רכב נוסף בהצלחה",
                data: carResult.rows[0],
            });
        }
        catch (error) {
            console.error("Add car error:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בהוספת רכב",
            });
        }
    }
    // עדכון רכב (רק הדילר שהוסיף אותו)
    async updateCar(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            // בדיקה שהרכב שייך לדילר הנוכחי
            const carCheck = await database_config_1.default.query(`
        SELECT c.id 
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE c.id = $1 AND d.user_id = $2
      `, [id, userId]);
            if (carCheck.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "אין לך הרשאה לערוך רכב זה",
                });
            }
            const { make, model, year, price, mileage, fuelType, transmission, color, description, images, city, status, } = req.body;
            const updateResult = await database_config_1.default.query(`
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
      `, [
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
            ]);
            res.json({
                success: true,
                message: "רכב עודכן בהצלחה",
                data: updateResult.rows[0],
            });
        }
        catch (error) {
            console.error("Update car error:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בעדכון רכב",
            });
        }
    }
    // מחיקת רכב (רק הדילר שהוסיף אותו)
    async deleteCar(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.userId;
            // בדיקה שהרכב שייך לדילר הנוכחי
            const carCheck = await database_config_1.default.query(`
        SELECT c.id 
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE c.id = $1 AND d.user_id = $2
      `, [id, userId]);
            if (carCheck.rows.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "אין לך הרשאה למחוק רכב זה",
                });
            }
            // מחיקה רכה - שינוי סטטוס
            await database_config_1.default.query(`
        UPDATE cars SET status = 'deleted', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [id]);
            res.json({
                success: true,
                message: "רכב נמחק בהצלחה",
            });
        }
        catch (error) {
            console.error("Delete car error:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה במחיקת רכב",
            });
        }
    }
    // קבלת רכבים של דילר ספציפי
    async getDealerCars(req, res) {
        try {
            const { dealerId } = req.params;
            const { page = 1, limit = 20 } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const carsResult = await database_config_1.default.query(`
        SELECT 
          c.*,
          d.business_name as dealer_name
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE d.id = $1 AND c.status = 'active'
        ORDER BY c.created_at DESC
        LIMIT $2 OFFSET $3
      `, [dealerId, Number(limit), offset]);
            const countResult = await database_config_1.default.query(`
        SELECT COUNT(*) as total
        FROM cars c
        WHERE c.dealer_id = $1 AND c.status = 'active'
      `, [dealerId]);
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
        }
        catch (error) {
            console.error("Get dealer cars error:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת רכבי הדילר",
            });
        }
    }
    // קבלת הרכבים שלי (לדילר מחובר)
    async getMyCars(req, res) {
        try {
            const userId = req.user?.userId;
            const { page = 1, limit = 20, status = "active" } = req.query;
            const offset = (Number(page) - 1) * Number(limit);
            const carsResult = await database_config_1.default.query(`
        SELECT c.*
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE d.user_id = $1 AND c.status = $2
        ORDER BY c.created_at DESC
        LIMIT $3 OFFSET $4
      `, [userId, status, Number(limit), offset]);
            const countResult = await database_config_1.default.query(`
        SELECT COUNT(*) as total
        FROM cars c
        JOIN dealers d ON c.dealer_id = d.id
        WHERE d.user_id = $1 AND c.status = $2
      `, [userId, status]);
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
        }
        catch (error) {
            console.error("Get my cars error:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת הרכבים שלך",
            });
        }
    }
}
exports.CarsController = CarsController;
