"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/routes/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
const authController = new auth_controller_1.AuthController();
// רישום משתמש חדש
router.post("/register", validation_middleware_1.validateRegister, authController.register);
// התחברות
router.post("/login", validation_middleware_1.validateLogin, authController.login);
// קבלת פרופיל משתמש מחובר
router.get("/profile", auth_middleware_1.authenticateToken, authController.getProfile);
exports.default = router;
