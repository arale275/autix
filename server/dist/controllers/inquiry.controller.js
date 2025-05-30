"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InquiryController = void 0;
const inquiry_model_1 = require("../models/inquiry.model");
const database_config_1 = __importDefault(require("../config/database.config"));
class InquiryController {
    // יצירת פנייה חדשה (buyers בלבד)
    static async createInquiry(req, res) {
        try {
            const userId = req.user?.id;
            const userType = req.user?.user_type;
            // בדיקה שהמשתמש הוא buyer
            if (userType !== "buyer") {
                return res.status(403).json({
                    success: false,
                    message: "רק קונים יכולים ליצור פניות",
                });
            }
            // מציאת buyer_id לפי user_id
            const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
            const buyerResult = await database_config_1.default.query(buyerQuery, [userId]);
            if (buyerResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "פרופיל קונה לא נמצא",
                });
            }
            const buyerId = buyerResult.rows[0].id;
            const inquiryData = req.body;
            // יצירת הפנייה
            const newInquiry = await inquiry_model_1.InquiryModel.create(buyerId, inquiryData);
            res.status(201).json({
                success: true,
                message: "פנייה נוצרה בהצלחה",
                data: newInquiry,
            });
        }
        catch (error) {
            console.error("Error creating inquiry:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה ביצירת פנייה",
            });
        }
    }
    // קבלת פניות שקיבל הסוחר (dealers בלבד)
    static async getReceivedInquiries(req, res) {
        try {
            const userId = req.user?.id;
            const userType = req.user?.user_type;
            // בדיקה שהמשתמש הוא dealer
            if (userType !== "dealer") {
                return res.status(403).json({
                    success: false,
                    message: "רק סוחרים יכולים לצפות בפניות שהתקבלו",
                });
            }
            // מציאת dealer_id לפי user_id
            const dealerQuery = "SELECT id FROM dealers WHERE user_id = $1";
            const dealerResult = await database_config_1.default.query(dealerQuery, [userId]);
            if (dealerResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "פרופיל סוחר לא נמצא",
                });
            }
            const dealerId = dealerResult.rows[0].id;
            // הכנת פילטרים
            const filters = {
                status: req.query.status,
                car_id: req.query.car_id ? Number(req.query.car_id) : undefined,
                date_from: req.query.date_from,
                date_to: req.query.date_to,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 20,
            };
            // קבלת הפניות
            const inquiries = await inquiry_model_1.InquiryModel.getReceivedInquiries(dealerId, filters);
            res.json({
                success: true,
                data: inquiries,
                pagination: {
                    page: filters.page,
                    limit: filters.limit,
                },
            });
        }
        catch (error) {
            console.error("Error getting received inquiries:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת פניות",
            });
        }
    }
    // קבלת הפניות ששלח הקונה (buyers בלבד)
    static async getMySentInquiries(req, res) {
        try {
            const userId = req.user?.id;
            const userType = req.user?.user_type;
            // בדיקה שהמשתמש הוא buyer
            if (userType !== "buyer") {
                return res.status(403).json({
                    success: false,
                    message: "רק קונים יכולים לצפות בפניות שלהם",
                });
            }
            // מציאת buyer_id
            const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
            const buyerResult = await database_config_1.default.query(buyerQuery, [userId]);
            if (buyerResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "פרופיל קונה לא נמצא",
                });
            }
            const buyerId = buyerResult.rows[0].id;
            // הכנת פילטרים
            const filters = {
                status: req.query.status,
                page: req.query.page ? Number(req.query.page) : 1,
                limit: req.query.limit ? Number(req.query.limit) : 20,
            };
            const inquiries = await inquiry_model_1.InquiryModel.getSentInquiries(buyerId, filters);
            res.json({
                success: true,
                data: inquiries,
            });
        }
        catch (error) {
            console.error("Error getting sent inquiries:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת הפניות ששלחת",
            });
        }
    }
    // קבלת פנייה ספציפית
    static async getInquiryById(req, res) {
        try {
            const inquiryId = Number(req.params.id);
            const userId = req.user?.id;
            const userType = req.user?.user_type;
            const inquiry = await inquiry_model_1.InquiryModel.getById(inquiryId);
            if (!inquiry) {
                return res.status(404).json({
                    success: false,
                    message: "פנייה לא נמצאה",
                });
            }
            // בדיקת הרשאות - רק הקונה שפנה או הסוחר שקיבל יכולים לראות
            if (userType === "buyer") {
                const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
                const buyerResult = await database_config_1.default.query(buyerQuery, [userId]);
                if (buyerResult.rows.length === 0 ||
                    buyerResult.rows[0].id !== inquiry.buyer_id) {
                    return res.status(403).json({
                        success: false,
                        message: "אין הרשאה לצפות בפנייה זו",
                    });
                }
            }
            else if (userType === "dealer") {
                const dealerQuery = "SELECT id FROM dealers WHERE user_id = $1";
                const dealerResult = await database_config_1.default.query(dealerQuery, [userId]);
                if (dealerResult.rows.length === 0 ||
                    dealerResult.rows[0].id !== inquiry.dealer_id) {
                    return res.status(403).json({
                        success: false,
                        message: "אין הרשאה לצפות בפנייה זו",
                    });
                }
            }
            res.json({
                success: true,
                data: inquiry,
            });
        }
        catch (error) {
            console.error("Error getting inquiry by id:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת פנייה",
            });
        }
    }
    // עדכון סטטוס פנייה (dealers בלבד)
    static async updateInquiryStatus(req, res) {
        try {
            const inquiryId = Number(req.params.id);
            const userId = req.user?.id;
            const userType = req.user?.user_type;
            const { status } = req.body;
            // בדיקה שהמשתמש הוא dealer
            if (userType !== "dealer") {
                return res.status(403).json({
                    success: false,
                    message: "רק סוחרים יכולים לעדכן סטטוס פניות",
                });
            }
            // מציאת dealer_id
            const dealerQuery = "SELECT id FROM dealers WHERE user_id = $1";
            const dealerResult = await database_config_1.default.query(dealerQuery, [userId]);
            if (dealerResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "פרופיל סוחר לא נמצא",
                });
            }
            const dealerId = dealerResult.rows[0].id;
            // בדיקה שהפנייה קיימת ושייכת לסוחר
            const inquiryCheckQuery = "SELECT id FROM inquiries WHERE id = $1 AND dealer_id = $2";
            const inquiryCheckResult = await database_config_1.default.query(inquiryCheckQuery, [
                inquiryId,
                dealerId,
            ]);
            if (inquiryCheckResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "פנייה לא נמצאה או שאינה שייכת לך",
                });
            }
            // עדכון הסטטוס
            const updatedInquiry = await inquiry_model_1.InquiryModel.updateStatus(inquiryId, status);
            if (!updatedInquiry) {
                return res.status(400).json({
                    success: false,
                    message: "שגיאה בעדכון סטטוס פנייה",
                });
            }
            res.json({
                success: true,
                message: "סטטוס פנייה עודכן בהצלחה",
                data: updatedInquiry,
            });
        }
        catch (error) {
            console.error("Error updating inquiry status:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בעדכון סטטוס פנייה",
            });
        }
    }
    // מחיקת פנייה (buyers בלבד - רק אם לא נענתה)
    static async deleteInquiry(req, res) {
        try {
            const inquiryId = Number(req.params.id);
            const userId = req.user?.id;
            const userType = req.user?.user_type;
            // בדיקה שהמשתמש הוא buyer
            if (userType !== "buyer") {
                return res.status(403).json({
                    success: false,
                    message: "רק קונים יכולים למחוק פניות",
                });
            }
            // מציאת buyer_id
            const buyerQuery = "SELECT id FROM buyers WHERE user_id = $1";
            const buyerResult = await database_config_1.default.query(buyerQuery, [userId]);
            if (buyerResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "פרופיל קונה לא נמצא",
                });
            }
            const buyerId = buyerResult.rows[0].id;
            // בדיקה שהפנייה שייכת לקונה
            const belongsToBuyer = await inquiry_model_1.InquiryModel.belongsToBuyer(inquiryId, buyerId);
            if (!belongsToBuyer) {
                return res.status(403).json({
                    success: false,
                    message: "אין הרשאה למחוק פנייה זו",
                });
            }
            // מחיקת הפנייה (רק אם בסטטוס new)
            const deleted = await inquiry_model_1.InquiryModel.delete(inquiryId);
            if (!deleted) {
                return res.status(400).json({
                    success: false,
                    message: "לא ניתן למחוק פנייה שכבר נענתה",
                });
            }
            res.json({
                success: true,
                message: "פנייה נמחקה בהצלחה",
            });
        }
        catch (error) {
            console.error("Error deleting inquiry:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה במחיקת פנייה",
            });
        }
    }
    // סטטיסטיקות פניות לסוחר
    static async getDealerStats(req, res) {
        try {
            const userId = req.user?.id;
            const userType = req.user?.user_type;
            // בדיקה שהמשתמש הוא dealer
            if (userType !== "dealer") {
                return res.status(403).json({
                    success: false,
                    message: "רק סוחרים יכולים לצפות בסטטיסטיקות",
                });
            }
            // מציאת dealer_id
            const dealerQuery = "SELECT id FROM dealers WHERE user_id = $1";
            const dealerResult = await database_config_1.default.query(dealerQuery, [userId]);
            if (dealerResult.rows.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "פרופיל סוחר לא נמצא",
                });
            }
            const dealerId = dealerResult.rows[0].id;
            const stats = await inquiry_model_1.InquiryModel.getDealerStats(dealerId);
            res.json({
                success: true,
                data: stats,
            });
        }
        catch (error) {
            console.error("Error getting dealer stats:", error);
            res.status(500).json({
                success: false,
                message: "שגיאה בקבלת סטטיסטיקות",
            });
        }
    }
}
exports.InquiryController = InquiryController;
