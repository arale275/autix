import { Pool } from "pg";
import pool from "../config/database.config";
import {
  Car,
  CreateCarRequest,
  UpdateCarRequest,
  CarFilters,
} from "../types/car.types";

export class CarModel {
  static async create(userId: number, carData: CreateCarRequest): Promise<Car> {
    const {
      make,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      color,
      description,
    } = carData;

    const query = `
      INSERT INTO cars (
        user_id, make, model, year, price, mileage, 
        fuel_type, transmission, color, description, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      userId,
      make,
      model,
      year,
      price,
      mileage,
      fuel_type,
      transmission,
      color,
      description,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findById(id: number): Promise<Car | null> {
    const query = "SELECT * FROM cars WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findAll(filters: CarFilters = {}): Promise<Car[]> {
    let query = "SELECT * FROM cars WHERE 1=1";
    const values: any[] = [];
    let paramCount = 1;

    // הוספת פילטרים
    if (filters.make) {
      query += ` AND LOWER(make) LIKE LOWER($${paramCount})`;
      values.push(`%${filters.make}%`);
      paramCount++;
    }

    if (filters.model) {
      query += ` AND LOWER(model) LIKE LOWER($${paramCount})`;
      values.push(`%${filters.model}%`);
      paramCount++;
    }

    if (filters.year_min) {
      query += ` AND year >= $${paramCount}`;
      values.push(filters.year_min);
      paramCount++;
    }

    if (filters.year_max) {
      query += ` AND year <= $${paramCount}`;
      values.push(filters.year_max);
      paramCount++;
    }

    if (filters.price_min) {
      query += ` AND price >= $${paramCount}`;
      values.push(filters.price_min);
      paramCount++;
    }

    if (filters.price_max) {
      query += ` AND price <= $${paramCount}`;
      values.push(filters.price_max);
      paramCount++;
    }

    if (filters.mileage_max) {
      query += ` AND mileage <= $${paramCount}`;
      values.push(filters.mileage_max);
      paramCount++;
    }

    if (filters.fuel_type) {
      query += ` AND fuel_type = $${paramCount}`;
      values.push(filters.fuel_type);
      paramCount++;
    }

    if (filters.transmission) {
      query += ` AND transmission = $${paramCount}`;
      values.push(filters.transmission);
      paramCount++;
    }

    if (filters.dealer_id) {
      query += ` AND user_id = $${paramCount}`;
      values.push(filters.dealer_id);
      paramCount++;
    }

    query += " ORDER BY created_at DESC";

    const result = await pool.query(query, values);
    return result.rows;
  }

  static async update(
    id: number,
    carData: UpdateCarRequest
  ): Promise<Car | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // בניית שדות לעדכון
    Object.entries(carData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) return null;

    fields.push(`updated_at = $${paramCount}`);
    values.push(new Date());
    values.push(id);

    const query = `
      UPDATE cars 
      SET ${fields.join(", ")}
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const query = "DELETE FROM cars WHERE id = $1";
    const result = await pool.query(query, [id]);
    return result.rowCount! > 0;
  }

  static async findByUserId(userId: number): Promise<Car[]> {
    const query =
      "SELECT * FROM cars WHERE user_id = $1 ORDER BY created_at DESC";
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  // שמירה על תאימות לאחור
  static async findByDealerId(dealerId: number): Promise<Car[]> {
    return this.findByUserId(dealerId);
  }
}
