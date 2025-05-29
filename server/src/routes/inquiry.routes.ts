import { Router } from "express";
import { InquiryController } from "../controllers/inquiry.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateCreateInquiry,
  validateUpdateInquiryStatus,
  validateInquiryFilters,
  validateInquiryId,
  validateDealerAndCar,
} from "../middleware/inquiry.validation";

const router = Router();

// כל המסלולים דורשים אימות
router.use(authenticateToken);

/**
 * @route   POST /api/inquiries
 * @desc    יצירת פנייה חדשה לסוחר
 * @access  Buyers בלבד
 * @body    { dealer_id: number, car_id?: number, message: string }
 */
router.post(
  "/",
  validateCreateInquiry,
  validateDealerAndCar,
  InquiryController.createInquiry
);

/**
 * @route   GET /api/inquiries/received
 * @desc    קבלת פניות שהתקבלו (לסוחר המחובר)
 * @access  Dealers בלבד
 * @query   ?status=new&car_id=123&date_from=2025-01-01&date_to=2025-01-31&page=1&limit=20
 */
router.get(
  "/received",
  validateInquiryFilters,
  InquiryController.getReceivedInquiries
);

/**
 * @route   GET /api/inquiries/sent
 * @desc    קבלת פניות ששלחתי (לקונה המחובר)
 * @access  Buyers בלבד
 * @query   ?status=new&page=1&limit=20
 */
router.get(
  "/sent",
  validateInquiryFilters,
  InquiryController.getMySentInquiries
);

/**
 * @route   GET /api/inquiries/stats
 * @desc    סטטיסטיקות פניות לסוחר
 * @access  Dealers בלבד
 */
router.get("/stats", InquiryController.getDealerStats);

/**
 * @route   GET /api/inquiries/:id
 * @desc    קבלת פנייה ספציפית
 * @access  Buyers (רק את שלהם) / Dealers (רק את שקיבלו)
 */
router.get("/:id", validateInquiryId, InquiryController.getInquiryById);

/**
 * @route   PUT /api/inquiries/:id/status
 * @desc    עדכון סטטוס פנייה
 * @access  Dealers בלבד (רק פניות שקיבלו)
 * @body    { status: "responded" | "closed" }
 */
router.put(
  "/:id/status",
  validateInquiryId,
  validateUpdateInquiryStatus,
  InquiryController.updateInquiryStatus
);

/**
 * @route   DELETE /api/inquiries/:id
 * @desc    מחיקת פנייה (רק אם בסטטוס new)
 * @access  Buyers בלבד (רק את שלהם)
 */
router.delete("/:id", validateInquiryId, InquiryController.deleteInquiry);

export default router;
