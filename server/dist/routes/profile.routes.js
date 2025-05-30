"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profile_controller_1 = require("../controllers/profile.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const profile_validation_1 = require("../middleware/profile.validation");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/profile/dealers
 * @desc    קבלת רשימת כל הסוחרים (ציבורי)
 * @access  Public
 * @query   ?limit=50&verified_only=true
 */
router.get("/dealers", profile_validation_1.validateProfileFilters, profile_controller_1.ProfileController.getAllDealers);
/**
 * @route   GET /api/profile/dealers/:id
 * @desc    קבלת פרופיל סוחר ספציפי (ציבורי)
 * @access  Public
 */
router.get("/dealers/:id", profile_controller_1.ProfileController.getDealerById);
// כל המסלולים הבאים דורשים אימות
router.use(auth_middleware_1.authenticateToken);
/**
 * @route   GET /api/profile
 * @desc    קבלת פרופיל בסיסי של המשתמש המחובר
 * @access  Private (All authenticated users)
 */
router.get("/", profile_controller_1.ProfileController.getUserProfile);
/**
 * @route   GET /api/profile/full
 * @desc    קבלת פרופיל מלא עם כל הפרטים והסטטיסטיקות
 * @access  Private (All authenticated users)
 */
router.get("/full", profile_controller_1.ProfileController.getFullProfile);
/**
 * @route   GET /api/profile/stats
 * @desc    קבלת סטטיסטיקות פרופיל
 * @access  Private (All authenticated users)
 */
router.get("/stats", profile_controller_1.ProfileController.getProfileStats);
/**
 * @route   PUT /api/profile
 * @desc    עדכון פרטים בסיסיים של המשתמש
 * @access  Private (All authenticated users)
 * @body    { first_name?: string, last_name?: string, phone?: string }
 */
router.put("/", profile_validation_1.validateUpdateUserProfile, profile_controller_1.ProfileController.updateUserProfile);
/**
 * @route   PUT /api/profile/dealer
 * @desc    עדכון פרטי עסק
 * @access  Private (Dealers only)
 * @body    { business_name?: string, license_number?: string, address?: string, city?: string, description?: string }
 */
router.put("/dealer", (0, profile_validation_1.validateUserType)(["dealer"]), profile_validation_1.validateUpdateDealerProfile, profile_controller_1.ProfileController.updateDealerProfile);
/**
 * @route   PUT /api/profile/buyer
 * @desc    עדכון העדפות קונה
 * @access  Private (Buyers only)
 * @body    { preferences?: object, budget_min?: number, budget_max?: number }
 */
router.put("/buyer", (0, profile_validation_1.validateUserType)(["buyer"]), profile_validation_1.validateUpdateBuyerProfile, profile_controller_1.ProfileController.updateBuyerProfile);
/**
 * @route   DELETE /api/profile
 * @desc    מחיקת חשבון משתמש
 * @access  Private (All authenticated users)
 * @body    { confirm_password: string }
 */
router.delete("/", profile_controller_1.ProfileController.deleteAccount);
exports.default = router;
