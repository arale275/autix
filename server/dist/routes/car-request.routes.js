"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const car_request_controller_1 = require("../controllers/car-request.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const car_request_validation_1 = require("../middleware/car-request.validation");
const router = (0, express_1.Router)();
// כל המסלולים דורשים אימות
router.use(auth_middleware_1.authenticateToken);
/**
 * @route   POST /api/car-requests
 * @desc    יצירת בקשת רכב חדשה
 * @access  Buyers בלבד
 */
router.post("/", car_request_validation_1.validateCreateCarRequest, car_request_controller_1.CarRequestController.createCarRequest);
/**
 * @route   GET /api/car-requests
 * @desc    קבלת כל בקשות הרכב עם סינון
 * @access  Dealers בלבד
 * @query   ?make=Toyota&model=Corolla&year_min=2018&year_max=2022&price_max=100000&page=1&limit=20
 */
router.get("/", car_request_validation_1.validateCarRequestFilters, car_request_controller_1.CarRequestController.getAllCarRequests);
/**
 * @route   GET /api/car-requests/my
 * @desc    קבלת בקשות הרכב שלי
 * @access  Buyers בלבד
 */
router.get("/my", car_request_controller_1.CarRequestController.getMyCarRequests);
/**
 * @route   GET /api/car-requests/:id
 * @desc    קבלת בקשת רכב ספציפית
 * @access  Buyers (רק את שלהם) / Dealers (הכל)
 */
router.get("/:id", car_request_validation_1.validateCarRequestId, car_request_controller_1.CarRequestController.getCarRequestById);
/**
 * @route   PUT /api/car-requests/:id
 * @desc    עדכון בקשת רכב
 * @access  Buyers בלבד (רק את שלהם)
 */
router.put("/:id", car_request_validation_1.validateCarRequestId, car_request_validation_1.validateUpdateCarRequest, car_request_controller_1.CarRequestController.updateCarRequest);
/**
 * @route   DELETE /api/car-requests/:id
 * @desc    מחיקת בקשת רכב (soft delete)
 * @access  Buyers בלבד (רק את שלהם)
 */
router.delete("/:id", car_request_validation_1.validateCarRequestId, car_request_controller_1.CarRequestController.deleteCarRequest);
exports.default = router;
