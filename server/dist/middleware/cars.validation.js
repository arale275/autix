"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUpdateCar = exports.validateAddCar = void 0;
// Validation פשוט ללא express-validator
const validateAddCar = (req, res, next) => {
    const { make, model, year, price } = req.body;
    const errors = [];
    // בדיקות חובה
    if (!make || typeof make !== "string" || make.trim().length < 2) {
        errors.push("יצרן הרכב חובה (לפחות 2 תווים)");
    }
    if (!model || typeof model !== "string" || model.trim().length < 1) {
        errors.push("דגם הרכב חובה");
    }
    if (!year ||
        typeof year !== "number" ||
        year < 1980 ||
        year > new Date().getFullYear() + 1) {
        errors.push(`שנת הרכב חייבת להיות בין 1980 ל-${new Date().getFullYear() + 1}`);
    }
    if (!price || typeof price !== "number" || price < 1000) {
        errors.push("מחיר הרכב חייב להיות לפחות 1,000 ₪");
    }
    // בדיקות אופציונליות
    if (req.body.mileage &&
        (typeof req.body.mileage !== "number" || req.body.mileage < 0)) {
        errors.push("קילומטרז חייב להיות מספר חיובי");
    }
    if (req.body.fuelType &&
        !["gasoline", "diesel", "hybrid", "electric", "lpg"].includes(req.body.fuelType)) {
        errors.push("סוג דלק לא תקין");
    }
    if (req.body.transmission &&
        !["manual", "automatic", "cvt"].includes(req.body.transmission)) {
        errors.push("סוג תמסורת לא תקין");
    }
    if (req.body.color &&
        (typeof req.body.color !== "string" || req.body.color.length > 50)) {
        errors.push("צבע הרכב לא יכול להיות יותר מ-50 תווים");
    }
    if (req.body.description &&
        (typeof req.body.description !== "string" ||
            req.body.description.length > 2000)) {
        errors.push("תיאור הרכב לא יכול להיות יותר מ-2000 תווים");
    }
    if (req.body.city &&
        (typeof req.body.city !== "string" || req.body.city.length > 100)) {
        errors.push("שם העיר לא יכול להיות יותר מ-100 תווים");
    }
    if (req.body.images && !Array.isArray(req.body.images)) {
        errors.push("תמונות חייבות להיות מערך");
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
exports.validateAddCar = validateAddCar;
const validateUpdateCar = (req, res, next) => {
    const errors = [];
    // בדיקות אופציונליות (כי זה עדכון)
    if (req.body.make &&
        (typeof req.body.make !== "string" || req.body.make.trim().length < 2)) {
        errors.push("יצרן הרכב חייב להיות לפחות 2 תווים");
    }
    if (req.body.model &&
        (typeof req.body.model !== "string" || req.body.model.trim().length < 1)) {
        errors.push("דגם הרכב לא יכול להיות ריק");
    }
    if (req.body.year &&
        (typeof req.body.year !== "number" ||
            req.body.year < 1980 ||
            req.body.year > new Date().getFullYear() + 1)) {
        errors.push(`שנת הרכב חייבת להיות בין 1980 ל-${new Date().getFullYear() + 1}`);
    }
    if (req.body.price &&
        (typeof req.body.price !== "number" || req.body.price < 1000)) {
        errors.push("מחיר הרכב חייב להיות לפחות 1,000 ₪");
    }
    if (req.body.mileage &&
        (typeof req.body.mileage !== "number" || req.body.mileage < 0)) {
        errors.push("קילומטרז חייב להיות מספר חיובי");
    }
    if (req.body.fuelType &&
        !["gasoline", "diesel", "hybrid", "electric", "lpg"].includes(req.body.fuelType)) {
        errors.push("סוג דלק לא תקין");
    }
    if (req.body.transmission &&
        !["manual", "automatic", "cvt"].includes(req.body.transmission)) {
        errors.push("סוג תמסורת לא תקין");
    }
    if (req.body.status &&
        !["active", "sold", "pending", "deleted"].includes(req.body.status)) {
        errors.push("סטטוס רכב לא תקין");
    }
    if (req.body.color &&
        (typeof req.body.color !== "string" || req.body.color.length > 50)) {
        errors.push("צבע הרכב לא יכול להיות יותר מ-50 תווים");
    }
    if (req.body.description &&
        (typeof req.body.description !== "string" ||
            req.body.description.length > 2000)) {
        errors.push("תיאור הרכב לא יכול להיות יותר מ-2000 תווים");
    }
    if (req.body.city &&
        (typeof req.body.city !== "string" || req.body.city.length > 100)) {
        errors.push("שם העיר לא יכול להיות יותר מ-100 תווים");
    }
    if (req.body.images && !Array.isArray(req.body.images)) {
        errors.push("תמונות חייבות להיות מערך");
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
exports.validateUpdateCar = validateUpdateCar;
