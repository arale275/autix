"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_config_1 = __importDefault(require("../config/database.config"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function runMigration() {
    try {
        console.log("🔄 Running database migration...");
        const migrationPath = path_1.default.join(__dirname, "migrations", "001_create_tables.sql");
        const sql = fs_1.default.readFileSync(migrationPath, "utf8");
        await database_config_1.default.query(sql);
        console.log("✅ Migration completed successfully!");
        console.log("📋 Created tables: users, dealers, buyers, cars, car_requests, inquiries");
    }
    catch (error) {
        console.error("❌ Migration failed:", error);
    }
    finally {
        await database_config_1.default.end();
    }
}
runMigration();
