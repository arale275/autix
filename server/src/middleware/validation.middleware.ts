// server/src/middleware/validation.middleware.ts
import { Request, Response, NextFunction } from "express";

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, firstName, lastName, userType } = req.body;
  const errors: string[] = [];

  // בדיקת אימייל
  if (!email || typeof email !== "string") {
    errors.push("אימייל חובה");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("פורמט אימייל לא תקין");
  }

  // בדיקת סיסמה
  if (!password || typeof password !== "string") {
    errors.push("סיסמה חובה");
  } else if (password.length < 6) {
    errors.push("סיסמה חייבת להיות לפחות 6 תווים");
  }

  // בדיקת שם פרטי
  if (
    !firstName ||
    typeof firstName !== "string" ||
    firstName.trim().length < 2
  ) {
    errors.push("שם פרטי חובה (לפחות 2 תווים)");
  }

  // בדיקת שם משפחה
  if (!lastName || typeof lastName !== "string" || lastName.trim().length < 2) {
    errors.push("שם משפחה חובה (לפחות 2 תווים)");
  }

  // בדיקת סוג משתמש
  if (!userType || !["buyer", "dealer"].includes(userType)) {
    errors.push("סוג משתמש חייב להיות buyer או dealer");
  }

  // בדיקת טלפון (אופציונלי)
  if (
    req.body.phone &&
    (typeof req.body.phone !== "string" || req.body.phone.length < 10)
  ) {
    errors.push("מספר טלפון לא תקין");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors: errors,
    });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const errors: string[] = [];

  // בדיקת אימייל
  if (!email || typeof email !== "string") {
    errors.push("אימייל חובה");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("פורמט אימייל לא תקין");
  }

  // בדיקת סיסמה
  if (!password || typeof password !== "string") {
    errors.push("סיסמה חובה");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors: errors,
    });
  }

  next();
};
