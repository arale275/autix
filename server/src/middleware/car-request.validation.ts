import { Request, Response, NextFunction } from "express";

export const validateCreateCarRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { make, model, year_min, year_max, price_max, requirements } = req.body;
  const errors: string[] = [];

  // לפחות אחד מהשדות הבסיסיים חייב להיות מלא
  if (!make && !model && !year_min && !year_max && !price_max) {
    errors.push("יש למלא לפחות שדה אחד (מותג, דגם, שנה או מחיר)");
  }

  // בדיקת שנים
  if (
    year_min &&
    (year_min < 1900 || year_min > new Date().getFullYear() + 1)
  ) {
    errors.push("שנה מינימלית לא תקינה");
  }

  if (
    year_max &&
    (year_max < 1900 || year_max > new Date().getFullYear() + 1)
  ) {
    errors.push("שנה מקסימלית לא תקינה");
  }

  if (year_min && year_max && year_min > year_max) {
    errors.push("שנה מינימלית לא יכולה להיות גדולה משנה מקסימלית");
  }

  // בדיקת מחיר
  if (price_max && (price_max < 0 || price_max > 10000000)) {
    errors.push("מחיר מקסימלי לא תקין (0-10,000,000)");
  }

  // בדיקת אורך טקסטים
  if (make && make.length > 50) {
    errors.push("מותג ארוך מדי (מקסימום 50 תווים)");
  }

  if (model && model.length > 50) {
    errors.push("דגם ארוך מדי (מקסימום 50 תווים)");
  }

  if (requirements && requirements.length > 1000) {
    errors.push("דרישות נוספות ארוכות מדי (מקסימום 1000 תווים)");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors,
    });
  }

  next();
};

export const validateUpdateCarRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { make, model, year_min, year_max, price_max, requirements, status } =
    req.body;
  const errors: string[] = [];

  // בדיקת שנים
  if (
    year_min &&
    (year_min < 1900 || year_min > new Date().getFullYear() + 1)
  ) {
    errors.push("שנה מינימלית לא תקינה");
  }

  if (
    year_max &&
    (year_max < 1900 || year_max > new Date().getFullYear() + 1)
  ) {
    errors.push("שנה מקסימלית לא תקינה");
  }

  if (year_min && year_max && year_min > year_max) {
    errors.push("שנה מינימלית לא יכולה להיות גדולה משנה מקסימלית");
  }

  // בדיקת מחיר
  if (price_max && (price_max < 0 || price_max > 10000000)) {
    errors.push("מחיר מקסימלי לא תקין (0-10,000,000)");
  }

  // בדיקת סטטוס
  if (status && !["active", "fulfilled", "cancelled"].includes(status)) {
    errors.push("סטטוס לא תקין (active, fulfilled, cancelled)");
  }

  // בדיקת אורך טקסטים
  if (make && make.length > 50) {
    errors.push("מותג ארוך מדי (מקסימום 50 תווים)");
  }

  if (model && model.length > 50) {
    errors.push("דגם ארוך מדי (מקסימום 50 תווים)");
  }

  if (requirements && requirements.length > 1000) {
    errors.push("דרישות נוספות ארוכות מדי (מקסימום 1000 תווים)");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors,
    });
  }

  next();
};

export const validateCarRequestFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { year_min, year_max, price_min, price_max, page, limit } = req.query;
  const errors: string[] = [];

  // בדיקת שנים
  if (year_min && (isNaN(Number(year_min)) || Number(year_min) < 1900)) {
    errors.push("שנה מינימלית לא תקינה");
  }

  if (year_max && (isNaN(Number(year_max)) || Number(year_max) < 1900)) {
    errors.push("שנה מקסימלית לא תקינה");
  }

  // בדיקת מחירים
  if (price_min && (isNaN(Number(price_min)) || Number(price_min) < 0)) {
    errors.push("מחיר מינימלי לא תקין");
  }

  if (price_max && (isNaN(Number(price_max)) || Number(price_max) < 0)) {
    errors.push("מחיר מקסימלי לא תקין");
  }

  // בדיקת pagination
  if (page && (isNaN(Number(page)) || Number(page) < 1)) {
    errors.push("מספר עמוד לא תקין");
  }

  if (
    limit &&
    (isNaN(Number(limit)) || Number(limit) < 1 || Number(limit) > 100)
  ) {
    errors.push("מגבלת תוצאות לא תקינה (1-100)");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "פרמטרי חיפוש לא תקינים",
      errors,
    });
  }

  next();
};

export const validateCarRequestId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id)) || Number(id) < 1) {
    return res.status(400).json({
      success: false,
      message: "מזהה בקשת רכב לא תקין",
    });
  }

  next();
};
