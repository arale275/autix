// server/src/types/auth.types.ts
import { Request } from "express";

export interface User {
  id: number;
  email: string;
  password_hash?: string;
  first_name: string;
  last_name: string;
  phone?: string;
  user_type: "buyer" | "dealer";
  is_verified?: boolean;
  google_id?: string;
  provider?: string;
  avatar_url?: string;
  created_at?: Date;
  updated_at?: Date;
}

// הרחב את Express Request
declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      first_name: string;
      last_name: string;
      user_type: "buyer" | "dealer";
      google_id?: string;
      provider?: string;
      avatar_url?: string;
    }
  }
}

export interface AuthRequest extends Request {
  user?: User;
}

// תקן את AuthenticatedRequest - השתמש בUser המלא
export interface AuthenticatedRequest extends Request {
  user: User; // השתמש בUser המלא במקום אובייקט חלקי
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
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
