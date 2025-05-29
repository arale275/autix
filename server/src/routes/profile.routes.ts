import { Router } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateUpdateUserProfile,
  validateUpdateDealerProfile,
  validateUpdateBuyerProfile,
  validateUserType,
  validateProfileFilters,
} from "../middleware/profile.validation";

const router = Router();

/**
 * @route   GET /api/profile/dealers
 * @desc    קבלת רשימת כל הסוחרים (ציבורי)
 * @access  Public
 * @query   ?limit=50&verified_only=true
 */
router.get("/dealers", validateProfileFilters, ProfileController.getAllDealers);

/**
 * @route   GET /api/profile/dealers/:id
 * @desc    קבלת פרופיל סוחר ספציפי (ציבורי)
 * @access  Public
 */
router.get("/dealers/:id", ProfileController.getDealerById);

// כל המסלולים הבאים דורשים אימות
router.use(authenticateToken);

/**
 * @route   GET /api/profile
 * @desc    קבלת פרופיל בסיסי של המשתמש המחובר
 * @access  Private (All authenticated users)
 */
router.get("/", ProfileController.getUserProfile);

/**
 * @route   GET /api/profile/full
 * @desc    קבלת פרופיל מלא עם כל הפרטים והסטטיסטיקות
 * @access  Private (All authenticated users)
 */
router.get("/full", ProfileController.getFullProfile);

/**
 * @route   GET /api/profile/stats
 * @desc    קבלת סטטיסטיקות פרופיל
 * @access  Private (All authenticated users)
 */
router.get("/stats", ProfileController.getProfileStats);

/**
 * @route   PUT /api/profile
 * @desc    עדכון פרטים בסיסיים של המשתמש
 * @access  Private (All authenticated users)
 * @body    { first_name?: string, last_name?: string, phone?: string }
 */
router.put("/", validateUpdateUserProfile, ProfileController.updateUserProfile);

/**
 * @route   PUT /api/profile/dealer
 * @desc    עדכון פרטי עסק
 * @access  Private (Dealers only)
 * @body    { business_name?: string, license_number?: string, address?: string, city?: string, description?: string }
 */
router.put(
  "/dealer",
  validateUserType(["dealer"]),
  validateUpdateDealerProfile,
  ProfileController.updateDealerProfile
);

/**
 * @route   PUT /api/profile/buyer
 * @desc    עדכון העדפות קונה
 * @access  Private (Buyers only)
 * @body    { preferences?: object, budget_min?: number, budget_max?: number }
 */
router.put(
  "/buyer",
  validateUserType(["buyer"]),
  validateUpdateBuyerProfile,
  ProfileController.updateBuyerProfile
);

/**
 * @route   DELETE /api/profile
 * @desc    מחיקת חשבון משתמש
 * @access  Private (All authenticated users)
 * @body    { confirm_password: string }
 */
router.delete("/", ProfileController.deleteAccount);

export default router;
