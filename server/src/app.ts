// server/src/app.ts
import express from "express";
import cors from "cors";
import pool from "./config/database.config";
import debugRoutes from "./routes/debug.routes";
import carRequestRoutes from "./routes/car-request.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import profileRoutes from "./routes/profile.routes";
import passport from "./config/passport";
import googleAuthRoutes from "./routes/google-auth.routes";
import imageRoutes from './routes/image.routes';

// Import routes
import authRoutes from "./routes/auth.routes";
import carsRoutes from "./routes/cars.routes";

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://autix.co.il");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(
  cors({
    origin: "https://autix.co.il",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carsRoutes);
app.use("/api/car-requests", carRequestRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/debug", debugRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/auth", googleAuthRoutes);
app.use('/api', imageRoutes);

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
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({
      status: "OK",
      message: "Database connection successful",
      data: result.rows[0],
    });
  } catch (error) {
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
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);
// server/src/app.ts - הוסף את זה בסוף הendpoints (לפני export)

// Debug endpoint - רק לפיתוח!
app.get("/api/debug/users", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, user_type, created_at FROM users ORDER BY id"
    );

    res.json({
      success: true,
      data: {
        count: result.rows.length,
        users: result.rows,
      },
    });
  } catch (error) {
    console.error("Debug users error:", error);
    res.status(500).json({
      success: false,
      message: "שגיאה בבדיקת משתמשים",
    });
  }
});
export default app;
