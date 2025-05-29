// server/src/database/fix-cars-table.js
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

async function fixCarsTable() {
  try {
    console.log("🔧 מתקן טבלת cars...\n");

    // 1. בדיקת מבנה הטבלה הנוכחי
    console.log("1️⃣ מבנה טבלת cars לפני התיקון:");
    const beforeResult = await pool.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'cars' 
            ORDER BY ordinal_position
        `);

    beforeResult.rows.forEach((col) => {
      console.log(
        `   ${col.column_name}: ${col.data_type} ${
          col.is_nullable === "NO" ? "(NOT NULL)" : ""
        }`
      );
    });

    // 2. הוספת עמודות חסרות
    console.log("\n2️⃣ מוסיף עמודות חסרות:");

    const columnsToAdd = [
      { name: "city", type: "VARCHAR(100)", description: "עיר" },
      { name: "engine_size", type: "VARCHAR(10)", description: "נפח מנוע" },
      {
        name: "is_available",
        type: "BOOLEAN DEFAULT true",
        description: "זמין למכירה",
      },
      {
        name: "is_featured",
        type: "BOOLEAN DEFAULT false",
        description: "רכב מומלץ",
      },
    ];

    for (const col of columnsToAdd) {
      try {
        await pool.query(
          `ALTER TABLE cars ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`
        );
        console.log(`   ✅ הוסף עמודה: ${col.name} (${col.description})`);
      } catch (error) {
        console.log(
          `   ℹ️ עמודה ${col.name} כבר קיימת או שגיאה: ${error.message}`
        );
      }
    }

    // 3. בדיקה אחרי התיקון
    console.log("\n3️⃣ מבנה טבלת cars אחרי התיקון:");
    const afterResult = await pool.query(`
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns 
            WHERE table_name = 'cars' 
            ORDER BY ordinal_position
        `);

    afterResult.rows.forEach((col) => {
      console.log(
        `   ${col.column_name}: ${col.data_type} ${
          col.is_nullable === "NO" ? "(NOT NULL)" : ""
        } ${col.column_default ? `DEFAULT ${col.column_default}` : ""}`
      );
    });

    // 4. בדיקת הוספת רכב דוגמה
    console.log("\n4️⃣ בדיקת הוספת רכב דוגמה:");
    try {
      const testResult = await pool.query(
        `
                INSERT INTO cars (
                    dealer_id, make, model, year, price, mileage, 
                    fuel_type, transmission, color, description, city, status
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id, make, model, year, price, city
            `,
        [
          2,
          "Toyota",
          "Corolla",
          2020,
          85000,
          45000,
          "gasoline",
          "automatic",
          "לבן",
          "רכב במצב מעולה",
          "תל אביב",
          "active",
        ]
      );

      console.log(`   ✅ רכב נוסף בהצלחה!`);
      console.log(
        `      ID: ${testResult.rows[0].id}, ${testResult.rows[0].make} ${testResult.rows[0].model} - ${testResult.rows[0].city}`
      );
    } catch (error) {
      console.log(`   ❌ עדיין שגיאה בהוספת רכב: ${error.message}`);
    }

    console.log("\n🎉 תיקון טבלת cars הושלם!");
  } catch (error) {
    console.error("❌ שגיאה בתיקון טבלת cars:", error.message);
  } finally {
    await pool.end();
  }
}

fixCarsTable();
