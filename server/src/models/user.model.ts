import { Pool } from "pg";
import pool from "../config/database.config";
import { User, RegisterRequest } from "../types/auth.types";

export class UserModel {
  private db: Pool;

  constructor() {
    this.db = pool;
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const query = `
        SELECT id, email, password_hash, first_name, last_name, phone, user_type, created_at, updated_at
        FROM users 
        WHERE email = $1
      `;
      const result = await this.db.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        password_hash: row.password_hash,
        phone: row.phone,
        user_type: row.user_type,
        is_verified: true, // ברירת מחדל - אין עמודה כזאת בדאטהבייס
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw new Error("Database error");
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      const query = `
        SELECT id, email, password_hash, first_name, last_name, phone, user_type, created_at, updated_at
        FROM users 
        WHERE id = $1
      `;
      const result = await this.db.query(query, [id]);

      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return {
        id: row.id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        password_hash: row.password_hash,
        phone: row.phone,
        user_type: row.user_type,
        is_verified: true, // ברירת מחדל - אין עמודה כזאת בדאטהבייס
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch (error) {
      console.error("Error finding user by id:", error);
      throw new Error("Database error");
    }
  }

  async create(
    userData: RegisterRequest,
    hashedPassword: string
  ): Promise<User> {
    try {
      const nameParts = userData.fullName.trim().split(" ");
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(" ") || "";

      const query = `
        INSERT INTO users (email, password_hash, first_name, last_name, phone, user_type)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, email, password_hash, first_name, last_name, phone, user_type, created_at, updated_at
      `;

      const values = [
        userData.email,
        hashedPassword,
        firstName,
        lastName,
        userData.phone,
        userData.userType,
      ];

      const result = await this.db.query(query, values);
      const row = result.rows[0];

      return {
        id: row.id,
        email: row.email,
        first_name: row.first_name,
        last_name: row.last_name,
        password_hash: row.password_hash,
        phone: row.phone,
        user_type: row.user_type,
        is_verified: true, // ברירת מחדל - אין עמודה כזאת בדאטהבייס
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Database error");
    }
  }

  async getPasswordHash(email: string): Promise<string | null> {
    try {
      const query = `SELECT password_hash FROM users WHERE email = $1`;
      const result = await this.db.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      return result.rows[0].password_hash;
    } catch (error) {
      console.error("Error getting password hash:", error);
      throw new Error("Database error");
    }
  }
}
