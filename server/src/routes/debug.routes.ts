// server/src/routes/debug.routes.ts
import { Router } from "express";
import pool from "../config/database.config";

const router = Router();

// בדיקת משתמשים בדאטהבייס
router.get("/users", async (req, res) => {
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
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// בדיקת חיבור דאטהבייס
router.get("/db-status", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as current_time");
    res.json({
      success: true,
      data: {
        status: "Database connected",
        time: result.rows[0].current_time,
      },
    });
  } catch (error) {
    console.error("Database check error:", error);
    res.status(500).json({
      success: false,
      message: "שגיאה בחיבור לדאטהבייס",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
