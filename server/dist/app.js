"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server/src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_config_1 = __importDefault(require("./config/database.config"));
const debug_routes_1 = __importDefault(require("./routes/debug.routes"));
const car_request_routes_1 = __importDefault(require("./routes/car-request.routes"));
const inquiry_routes_1 = __importDefault(require("./routes/inquiry.routes"));
const profile_routes_1 = __importDefault(require("./routes/profile.routes"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const cars_routes_1 = __importDefault(require("./routes/cars.routes"));
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/cars", cars_routes_1.default);
app.use("/api/car-requests", car_request_routes_1.default);
app.use("/api/inquiries", inquiry_routes_1.default);
app.use("/api/debug", debug_routes_1.default);
app.use('/api/profile', profile_routes_1.default);
// Health check endpoints
app.get("/api/health", (req, res) => {
    res.json({
        status: "OK",
        message: "AUTIX Server is running!",
        timestamp: new Date().toISOString(),
    });
});
app.get("/api/db-test", async (req, res) => {
    try {
        const result = await database_config_1.default.query("SELECT NOW() as current_time");
        res.json({
            status: "OK",
            message: "Database connection successful",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            status: "ERROR",
            message: "Database connection failed",
            error: error instanceof Error ? error.message : "Unknown error",
        });
    }
});
// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found",
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});
// server/src/app.ts - הוסף את זה בסוף הendpoints (לפני export)
// Debug endpoint - רק לפיתוח!
app.get("/api/debug/users", async (req, res) => {
    try {
        const result = await database_config_1.default.query("SELECT id, email, first_name, last_name, user_type, created_at FROM users ORDER BY id");
        res.json({
            success: true,
            data: {
                count: result.rows.length,
                users: result.rows,
            },
        });
    }
    catch (error) {
        console.error("Debug users error:", error);
        res.status(500).json({
            success: false,
            message: "שגיאה בבדיקת משתמשים",
        });
    }
});
exports.default = app;
