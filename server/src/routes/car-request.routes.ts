import { Router } from "express";
import { CarRequestController } from "../controllers/car-request.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateCreateCarRequest,
  validateUpdateCarRequest,
  validateCarRequestFilters,
  validateCarRequestId,
} from "../middleware/car-request.validation";

const router = Router();

// כל המסלולים דורשים אימות
router.use(authenticateToken);

/**
 * @route   POST /api/car-requests
 * @desc    יצירת בקשת רכב חדשה
 * @access  Buyers בלבד
 */
router.post(
  "/",
  validateCreateCarRequest,
  CarRequestController.createCarRequest
);

/**
 * @route   GET /api/car-requests
 * @desc    קבלת כל בקשות הרכב עם סינון
 * @access  Dealers בלבד
 * @query   ?make=Toyota&model=Corolla&year_min=2018&year_max=2022&price_max=100000&page=1&limit=20
 */
router.get(
  "/",
  validateCarRequestFilters,
  CarRequestController.getAllCarRequests
);

/**
 * @route   GET /api/car-requests/my
 * @desc    קבלת בקשות הרכב שלי
 * @access  Buyers בלבד
 */
router.get("/my", CarRequestController.getMyCarRequests);

/**
 * @route   GET /api/car-requests/:id
 * @desc    קבלת בקשת רכב ספציפית
 * @access  Buyers (רק את שלהם) / Dealers (הכל)
 */
router.get(
  "/:id",
  validateCarRequestId,
  CarRequestController.getCarRequestById
);

/**
 * @route   PUT /api/car-requests/:id
 * @desc    עדכון בקשת רכב
 * @access  Buyers בלבד (רק את שלהם)
 */
router.put(
  "/:id",
  validateCarRequestId,
  validateUpdateCarRequest,
  CarRequestController.updateCarRequest
);

/**
 * @route   DELETE /api/car-requests/:id
 * @desc    מחיקת בקשת רכב (soft delete)
 * @access  Buyers בלבד (רק את שלהם)
 */
router.delete(
  "/:id",
  validateCarRequestId,
  CarRequestController.deleteCarRequest
);

export default router;
