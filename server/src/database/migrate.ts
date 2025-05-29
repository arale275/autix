import pool from "../config/database.config";
import fs from "fs";
import path from "path";

async function runMigration() {
  try {
    console.log("🔄 Running database migration...");

    const migrationPath = path.join(
      __dirname,
      "migrations",
      "001_create_tables.sql"
    );
    const sql = fs.readFileSync(migrationPath, "utf8");

    await pool.query(sql);

    console.log("✅ Migration completed successfully!");
    console.log(
      "📋 Created tables: users, dealers, buyers, cars, car_requests, inquiries"
    );
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await pool.end();
  }
}

runMigration();
