"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inquiry_controller_1 = require("../controllers/inquiry.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const inquiry_validation_1 = require("../middleware/inquiry.validation");
const router = (0, express_1.Router)();
// כל המסלולים דורשים אימות
router.use(auth_middleware_1.authenticateToken);
/**
 * @route   POST /api/inquiries
 * @desc    יצירת פנייה חדשה לסוחר
 * @access  Buyers בלבד
 * @body    { dealer_id: number, car_id?: number, message: string }
 */
router.post("/", inquiry_validation_1.validateCreateInquiry, inquiry_validation_1.validateDealerAndCar, inquiry_controller_1.InquiryController.createInquiry);
/**
 * @route   GET /api/inquiries/received
 * @desc    קבלת פניות שהתקבלו (לסוחר המחובר)
 * @access  Dealers בלבד
 * @query   ?status=new&car_id=123&date_from=2025-01-01&date_to=2025-01-31&page=1&limit=20
 */
router.get("/received", inquiry_validation_1.validateInquiryFilters, inquiry_controller_1.InquiryController.getReceivedInquiries);
/**
 * @route   GET /api/inquiries/sent
 * @desc    קבלת פניות ששלחתי (לקונה המחובר)
 * @access  Buyers בלבד
 * @query   ?status=new&page=1&limit=20
 */
router.get("/sent", inquiry_validation_1.validateInquiryFilters, inquiry_controller_1.InquiryController.getMySentInquiries);
/**
 * @route   GET /api/inquiries/stats
 * @desc    סטטיסטיקות פניות לסוחר
 * @access  Dealers בלבד
 */
router.get("/stats", inquiry_controller_1.InquiryController.getDealerStats);
/**
 * @route   GET /api/inquiries/:id
 * @desc    קבלת פנייה ספציפית
 * @access  Buyers (רק את שלהם) / Dealers (רק את שקיבלו)
 */
router.get("/:id", inquiry_validation_1.validateInquiryId, inquiry_controller_1.InquiryController.getInquiryById);
/**
 * @route   PUT /api/inquiries/:id/status
 * @desc    עדכון סטטוס פנייה
 * @access  Dealers בלבד (רק פניות שקיבלו)
 * @body    { status: "responded" | "closed" }
 */
router.put("/:id/status", inquiry_validation_1.validateInquiryId, inquiry_validation_1.validateUpdateInquiryStatus, inquiry_controller_1.InquiryController.updateInquiryStatus);
/**
 * @route   DELETE /api/inquiries/:id
 * @desc    מחיקת פנייה (רק אם בסטטוס new)
 * @access  Buyers בלבד (רק את שלהם)
 */
router.delete("/:id", inquiry_validation_1.validateInquiryId, inquiry_controller_1.InquiryController.deleteInquiry);
exports.default = router;
