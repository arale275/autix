// server/src/routes/auth.routes.ts
import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  validateRegister,
  validateLogin,
} from "../middleware/validation.middleware";

const router = Router();
const authController = new AuthController();

// רישום משתמש חדש
router.post("/register", validateRegister, authController.register);

// התחברות
router.post("/login", validateLogin, authController.login);

// קבלת פרופיל משתמש מחובר
router.get("/profile", authenticateToken, authController.getProfile);

export default router;
