"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRole = exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "גישה נדחתה - לא נמצא טוקן",
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // הגדרת המשתמש ב-request
        req.user = {
            id: decoded.userId,
            userId: decoded.userId,
            email: decoded.email,
            password: "", // ריק - לא נדרש במידלוור
            full_name: "", // ריק - לא נדרש במידלוור
            phone: "",
            user_type: decoded.userType,
            userType: decoded.userType,
            is_verified: true,
        };
        next();
    }
    catch (error) {
        return res.status(403).json({
            success: false,
            message: "טוקן לא תקין",
        });
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "גישה נדחתה - לא מחובר",
            });
        }
        if (!req.user?.userType || !roles.includes(req.user.userType)) {
            return res.status(403).json({
                success: false,
                message: "אין לך הרשאה לפעולה זו",
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
