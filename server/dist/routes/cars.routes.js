"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/cars.routes.ts
const express_1 = require("express");
const cars_controller_1 = require("../controllers/cars.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const cars_validation_1 = require("../middleware/cars.validation");
const router = (0, express_1.Router)();
const carsController = new cars_controller_1.CarsController();
// Routes ציבוריים (ללא אימות)
router.get("/", carsController.getAllCars); // קבלת כל הרכבים עם חיפוש וסינון
router.get("/:id", carsController.getCarById); // רכב ספציפי
router.get("/dealer/:dealerId", carsController.getDealerCars); // רכבים של דילר ספציפי
// Routes לדילרים בלבד (עם אימות)
router.post("/", auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(["dealer"]), cars_validation_1.validateAddCar, carsController.addCar); // הוספת רכב
router.put("/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(["dealer"]), cars_validation_1.validateUpdateCar, carsController.updateCar); // עדכון רכב
router.delete("/:id", auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(["dealer"]), carsController.deleteCar); // מחיקת רכב
router.get("/my/cars", auth_middleware_1.authenticateToken, (0, auth_middleware_1.requireRole)(["dealer"]), carsController.getMyCars); // הרכבים שלי
exports.default = router;
