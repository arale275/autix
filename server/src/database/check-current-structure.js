// קובץ: server/src/database/check-current-structure.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
});

async function checkDatabaseStructure() {
  try {
    console.log("🔍 בודק מבנה דאטהבייס נוכחי...\n");

    // 1. רשימת טבלאות
    const tablesResult = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
            ORDER BY table_name;
        `);

    console.log("📋 טבלאות קיימות:");
    tablesResult.rows.forEach((row) => {
      console.log(`   - ${row.table_name}`);
    });
    console.log("");

    // 2. מבנה כל טבלה
    for (const table of tablesResult.rows) {
      const tableName = table.table_name;

      console.log(`📊 מבנה טבלת ${tableName}:`);

      // עמודות
      const columnsResult = await pool.query(
        `
                SELECT 
                    column_name,
                    data_type,
                    is_nullable,
                    column_default
                FROM information_schema.columns 
                WHERE table_name = $1 
                ORDER BY ordinal_position;
            `,
        [tableName]
      );

      columnsResult.rows.forEach((col) => {
        console.log(
          `   ${col.column_name}: ${col.data_type} ${
            col.is_nullable === "NO" ? "(NOT NULL)" : ""
          } ${col.column_default ? `DEFAULT ${col.column_default}` : ""}`
        );
      });

      // Foreign Keys
      const fkResult = await pool.query(
        `
                SELECT
                    tc.constraint_name,
                    kcu.column_name,
                    ccu.table_name AS foreign_table_name,
                    ccu.column_name AS foreign_column_name
                FROM
                    information_schema.table_constraints AS tc
                    JOIN information_schema.key_column_usage AS kcu
                      ON tc.constraint_name = kcu.constraint_name
                    JOIN information_schema.constraint_column_usage AS ccu
                      ON ccu.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name = $1;
            `,
        [tableName]
      );

      if (fkResult.rows.length > 0) {
        console.log(`   🔗 Foreign Keys:`);
        fkResult.rows.forEach((fk) => {
          console.log(
            `     ${fk.column_name} -> ${fk.foreign_table_name}.${fk.foreign_column_name}`
          );
        });
      }

      // נתונים דוגמה אם יש
      const countResult = await pool.query(`SELECT COUNT(*) FROM ${tableName}`);
      console.log(`   📈 מספר רשומות: ${countResult.rows[0].count}\n`);
    }

    // 3. בדיקת נתונים בטבלת users
    if (tablesResult.rows.some((row) => row.table_name === "users")) {
      console.log("👥 דוגמאות משתמשים:");
      const usersResult = await pool.query(
        "SELECT id, email, user_type FROM users LIMIT 5"
      );
      usersResult.rows.forEach((user) => {
        console.log(
          `   ID: ${user.id}, Email: ${user.email}, Type: ${user.user_type}`
        );
      });
      console.log("");
    }
  } catch (error) {
    console.error("❌ שגיאה בבדיקת דאטהבייס:", error.message);
  } finally {
    await pool.end();
  }
}

checkDatabaseStructure();
