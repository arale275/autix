// server/src/types/auth.types.ts
import { Request } from "express";

export interface User {
  id?: number;
  userId?: number; // 🔥 הוסף את השניים - לתאימות
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  user_type: "buyer" | "dealer";
  userType?: "buyer" | "dealer"; // 🔥 הוסף גם את זה לתאימות
  is_verified: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string; // 🔥 שנה מfirstName+lastName ל-fullName
  phone?: string;
  userType: "buyer" | "dealer";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  userType: "buyer" | "dealer";
}
