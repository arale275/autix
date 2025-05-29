// server/src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JWTPayload } from "../types/auth.types";
import { User } from "../types/auth.types";

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "גישה נדחתה - לא נמצא טוקן",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;

    // הגדרת המשתמש ב-request
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email,
      password: "", // ריק - לא נדרש במידלוור
      full_name: "", // ריק - לא נדרש במידלוור
      phone: "",
      user_type: decoded.userType,
      userType: decoded.userType,
      is_verified: true,
    } as User;

    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "טוקן לא תקין",
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "גישה נדחתה - לא מחובר",
      });
    }

    if (!req.user?.userType || !roles.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: "אין לך הרשאה לפעולה זו",
      });
    }

    next();
  };
};
