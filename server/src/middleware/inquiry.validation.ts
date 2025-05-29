import { Request, Response, NextFunction } from "express";

export const validateCreateInquiry = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { dealer_id, car_id, message } = req.body;
  const errors: string[] = [];

  // dealer_id חובה
  if (!dealer_id) {
    errors.push("יש לציין לאיזה סוחר לפנות");
  } else if (isNaN(Number(dealer_id)) || Number(dealer_id) < 1) {
    errors.push("מזהה סוחר לא תקין");
  }

  // car_id אופציונלי אבל אם מוזן צריך להיות תקין
  if (car_id && (isNaN(Number(car_id)) || Number(car_id) < 1)) {
    errors.push("מזהה רכב לא תקין");
  }

  // message חובה
  if (!message || typeof message !== "string") {
    errors.push("יש לכתוב הודעה");
  } else {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 10) {
      errors.push("ההודעה קצרה מדי (מינימום 10 תווים)");
    } else if (trimmedMessage.length > 2000) {
      errors.push("ההודעה ארוכה מדי (מקסימום 2000 תווים)");
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "נתונים לא תקינים",
      errors,
    });
  }

  // ניקוי ההודעה מרווחים מיותרים
  req.body.message = message.trim();

  next();
};

export const validateUpdateInquiryStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status } = req.body;
  const errors: string[] = [];

  // status חובה
  if (!status) {
    errors.push("יש לציין סטטוס");
  } else if (!["responded", "closed"].includes(status)) {
    errors.push("סטטוס לא תקין (responded או closed בלבד)");
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

export const validateInquiryFilters = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status, car_id, page, limit, date_from, date_to } = req.query;
  const errors: string[] = [];

  // בדיקת סטטוס
  if (status && !["new", "responded", "closed"].includes(status as string)) {
    errors.push("סטטוס לא תקין (new, responded או closed)");
  }

  // בדיקת car_id
  if (car_id && (isNaN(Number(car_id)) || Number(car_id) < 1)) {
    errors.push("מזהה רכב לא תקין");
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

  // בדיקת תאריכים
  if (date_from && isNaN(Date.parse(date_from as string))) {
    errors.push("תאריך התחלה לא תקין");
  }

  if (date_to && isNaN(Date.parse(date_to as string))) {
    errors.push("תאריך סיום לא תקין");
  }

  if (
    date_from &&
    date_to &&
    Date.parse(date_from as string) > Date.parse(date_to as string)
  ) {
    errors.push("תאריך התחלה לא יכול להיות אחרי תאריך הסיום");
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

export const validateInquiryId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id)) || Number(id) < 1) {
    return res.status(400).json({
      success: false,
      message: "מזהה פנייה לא תקין",
    });
  }

  next();
};

export const validateDealerId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { dealerId } = req.params;

  if (!dealerId || isNaN(Number(dealerId)) || Number(dealerId) < 1) {
    return res.status(400).json({
      success: false,
      message: "מזהה סוחר לא תקין",
    });
  }

  next();
};

// בדיקה נוספת - שהסוחר והרכב קיימים ותואמים
export const validateDealerAndCar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { dealer_id, car_id } = req.body;

  try {
    const pool = require("../config/database.config").default;

    // בדיקה שהסוחר קיים ופעיל
    const dealerQuery = `
      SELECT d.id 
      FROM dealers d 
      JOIN users u ON d.user_id = u.id 
      WHERE d.id = $1
    `;

    const dealerResult = await pool.query(dealerQuery, [dealer_id]);

    if (dealerResult.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "סוחר לא נמצא",
      });
    }

    // אם יש car_id, בדוק שהוא שייך לסוחר (אבל אל תחייב זאת)
    if (car_id) {
      const carQuery = `
        SELECT c.id 
        FROM cars c 
        WHERE c.id = $1 AND c.dealer_id = $2 AND c.status = 'active'
      `;

      const carResult = await pool.query(carQuery, [car_id, dealer_id]);

      if (carResult.rows.length === 0) {
        // בדוק אם הרכב קיים בכלל
        const carExistsQuery = `SELECT id FROM cars WHERE id = $1`;
        const carExistsResult = await pool.query(carExistsQuery, [car_id]);

        if (carExistsResult.rows.length === 0) {
          return res.status(400).json({
            success: false,
            message: "רכב לא נמצא",
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "הרכב לא שייך לסוחר זה",
          });
        }
      }
    }

    next();
  } catch (error) {
    console.error("Error validating dealer and car:", error);
    return res.status(500).json({
      success: false,
      message: "שגיאה בבדיקת נתונים",
    });
  }
};

