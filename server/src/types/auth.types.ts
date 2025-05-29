// server/src/types/auth.types.ts
import { Request } from 'express';

export interface User {
  userId: number;
  email: string;
  userType: 'buyer' | 'dealer';
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  userType: 'buyer' | 'dealer';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JWTPayload {
  userId: number;
  email: string;
  userType: 'buyer' | 'dealer';
}