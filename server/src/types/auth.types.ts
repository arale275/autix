// server/src/types/auth.types.ts
import { Request } from "express";

export interface User {
  id?: number;
  email: string;
  password: string; // 🔥 הוסף
  full_name: string; // 🔥 הוסף
  phone?: string; // 🔥 הוסף
  user_type: "buyer" | "dealer"; // 🔥 שנה מuserType ל-user_type
  is_verified: boolean; // 🔥 הוסף
  created_at?: Date; // 🔥 הוסף
  updated_at?: Date; // 🔥 הוסף
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
