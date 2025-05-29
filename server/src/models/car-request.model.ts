import { Pool } from "pg";
import pool from "../config/database.config";
import {
  CarRequest,
  CreateCarRequestData,
  UpdateCarRequestData,
  CarRequestResponse,
  CarRequestFilters,
} from "../types/car-request.types";

export class CarRequestModel {
  // יצירת בקשת רכב חדשה
  static async create(
    buyerId: number,
    data: CreateCarRequestData
  ): Promise<CarRequest> {
    const query = `
      INSERT INTO car_requests (
        buyer_id, make, model, year_min, year_max, 
        price_max, requirements, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'active', NOW())
      RETURNING *
    `;

    const values = [
      buyerId,
      data.make || null,
      data.model || null,
      data.year_min || null,
      data.year_max || null,
      data.price_max || null,
      data.requirements || null,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // קבלת כל בקשות הרכב (לסוחרים) עם סינון
  static async getAll(
    filters: CarRequestFilters = {}
  ): Promise<CarRequestResponse[]> {
    let query = `
      SELECT 
        cr.*,
        u.first_name || ' ' || u.last_name as buyer_name,
        u.phone as buyer_phone,
        u.email as buyer_email
      FROM car_requests cr
      JOIN buyers b ON cr.buyer_id = b.id
      JOIN users u ON b.user_id = u.id
      WHERE cr.status = 'active'
    `;

    const values: any[] = [];
    let paramCounter = 1;

    // הוספת סינונים
    if (filters.make) {
      query += ` AND LOWER(cr.make) LIKE LOWER($${paramCounter})`;
      values.push(`%${filters.make}%`);
      paramCounter++;
    }

    if (filters.model) {
      query += ` AND LOWER(cr.model) LIKE LOWER($${paramCounter})`;
      values.push(`%${filters.model}%`);
      paramCounter++;
    }

    if (filters.year_min) {
      query += ` AND (cr.year_min IS NULL OR cr.year_min >= $${paramCounter})`;
      values.push(filters.year_min);
      paramCounter++;
    }

    if (filters.year_max) {
      query += ` AND (cr.year_max IS NULL OR cr.year_max <= $${paramCounter})`;
      values.push(filters.year_max);
      paramCounter++;
    }

    if (filters.price_max) {
      query += ` AND (cr.price_max IS NULL OR cr.price_max <= $${paramCounter})`;
      values.push(filters.price_max);
      paramCounter++;
    }

    // מיון וחלוקה לעמודים
    query += ` ORDER BY cr.created_at DESC`;

    const limit = filters.limit || 20;
    const page = filters.page || 1;
    const offset = (page - 1) * limit;

    query += ` LIMIT $${paramCounter} OFFSET $${paramCounter + 1}`;
    values.push(limit, offset);

    const result = await pool.query(query, values);
    return result.rows;
  }

  // קבלת בקשות רכב של קונה ספציפי
  static async getByBuyerId(buyerId: number): Promise<CarRequest[]> {
    const query = `
      SELECT * FROM car_requests 
      WHERE buyer_id = $1 
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [buyerId]);
    return result.rows;
  }

  // קבלת בקשת רכב לפי ID
  static async getById(id: number): Promise<CarRequestResponse | null> {
    const query = `
      SELECT 
        cr.*,
        u.first_name || ' ' || u.last_name as buyer_name,
        u.phone as buyer_phone,
        u.email as buyer_email
      FROM car_requests cr
      JOIN buyers b ON cr.buyer_id = b.id
      JOIN users u ON b.user_id = u.id
      WHERE cr.id = $1
    `;

    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  // עדכון בקשת רכב
  static async update(
    id: number,
    data: UpdateCarRequestData
  ): Promise<CarRequest | null> {
    const fields = [];
    const values = [];
    let paramCounter = 1;

    if (data.make !== undefined) {
      fields.push(`make = $${paramCounter}`);
      values.push(data.make);
      paramCounter++;
    }

    if (data.model !== undefined) {
      fields.push(`model = $${paramCounter}`);
      values.push(data.model);
      paramCounter++;
    }

    if (data.year_min !== undefined) {
      fields.push(`year_min = $${paramCounter}`);
      values.push(data.year_min);
      paramCounter++;
    }

    if (data.year_max !== undefined) {
      fields.push(`year_max = $${paramCounter}`);
      values.push(data.year_max);
      paramCounter++;
    }

    if (data.price_max !== undefined) {
      fields.push(`price_max = $${paramCounter}`);
      values.push(data.price_max);
      paramCounter++;
    }

    if (data.requirements !== undefined) {
      fields.push(`requirements = $${paramCounter}`);
      values.push(data.requirements);
      paramCounter++;
    }

    if (data.status !== undefined) {
      fields.push(`status = $${paramCounter}`);
      values.push(data.status);
      paramCounter++;
    }

    if (fields.length === 0) {
      return null;
    }

    const query = `
      UPDATE car_requests 
      SET ${fields.join(", ")}
      WHERE id = $${paramCounter}
      RETURNING *
    `;

    values.push(id);
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  // מחיקת בקשת רכב (soft delete)
  static async delete(id: number): Promise<boolean> {
    const query = `
      UPDATE car_requests 
      SET status = 'cancelled' 
      WHERE id = $1
      RETURNING id
    `;

    const result = await pool.query(query, [id]);
    return result.rows.length > 0;
  }

  // ספירת בקשות פעילות
  static async getActiveCount(): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM car_requests WHERE status = 'active'`;
    const result = await pool.query(query);
    return parseInt(result.rows[0].count);
  }
}
