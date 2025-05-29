// server/src/routes/cars.routes.ts
import { Router } from "express";
import { CarsController } from "../controllers/cars.controller";
import { authenticateToken, requireRole } from "../middleware/auth.middleware";
import {
  validateAddCar,
  validateUpdateCar,
} from "../middleware/cars.validation";

const router = Router();
const carsController = new CarsController();

// Routes ציבוריים (ללא אימות)
router.get("/", carsController.getAllCars); // קבלת כל הרכבים עם חיפוש וסינון
router.get("/:id", carsController.getCarById); // רכב ספציפי
router.get("/dealer/:dealerId", carsController.getDealerCars); // רכבים של דילר ספציפי

// Routes לדילרים בלבד (עם אימות)
router.post(
  "/",
  authenticateToken,
  requireRole(["dealer"]),
  validateAddCar,
  carsController.addCar
); // הוספת רכב

router.put(
  "/:id",
  authenticateToken,
  requireRole(["dealer"]),
  validateUpdateCar,
  carsController.updateCar
); // עדכון רכב

router.delete(
  "/:id",
  authenticateToken,
  requireRole(["dealer"]),
  carsController.deleteCar
); // מחיקת רכב

router.get(
  "/my/cars",
  authenticateToken,
  requireRole(["dealer"]),
  carsController.getMyCars
); // הרכבים שלי

export default router;
