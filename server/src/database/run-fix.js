// server/src/database/run-fix.js
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

async function fixDatabaseIssues() {
  try {
    console.log("🔧 מתחיל תיקון בעיות דאטהבייס...\n");

    // 1. בדיקה איזה dealers חסרים
    console.log("1️⃣ בודק איזה dealers חסרים פרופיל:");
    const missingDealers = await pool.query(`
            SELECT 
                u.id as user_id, 
                u.email, 
                u.first_name, 
                u.last_name,
                d.id as dealer_profile_exists
            FROM users u
            LEFT JOIN dealers d ON u.id = d.user_id
            WHERE u.user_type = 'dealer'
        `);

    missingDealers.rows.forEach((row) => {
      const status = row.dealer_profile_exists
        ? "✅ יש פרופיל"
        : "❌ חסר פרופיל";
      console.log(
        `   User ID: ${row.user_id}, Email: ${row.email} - ${status}`
      );
    });

    // 2. יצירת dealer profiles חסרים
    console.log("\n2️⃣ יוצר dealer profiles חסרים:");
    const createResult = await pool.query(`
            INSERT INTO dealers (user_id, business_name, license_number, address, city, description, verified, rating)
            SELECT 
                u.id,
                CONCAT(u.first_name, ' ', u.last_name, ' Motors') as business_name,
                'TBD-' || u.id as license_number,
                'לא צוין' as address,
                'לא צוין' as city,
                'עדיין לא הוזן תיאור עסק' as description,
                false as verified,
                0.00 as rating
            FROM users u
            LEFT JOIN dealers d ON u.id = d.user_id
            WHERE u.user_type = 'dealer' AND d.id IS NULL
            RETURNING user_id, business_name
        `);

    if (createResult.rows.length > 0) {
      console.log(`   ✅ נוצרו ${createResult.rows.length} פרופילי dealer:`);
      createResult.rows.forEach((row) => {
        console.log(`      - User ID ${row.user_id}: ${row.business_name}`);
      });
    } else {
      console.log("   ℹ️ כל ה-dealers כבר יש להם פרופיל");
    }

    // 3. בדיקה אחרי התיקון
    console.log("\n3️⃣ בדיקה אחרי התיקון:");
    const finalCheck = await pool.query(`
            SELECT 
                u.id as user_id, 
                u.email, 
                u.first_name || ' ' || u.last_name as full_name,
                d.id as dealer_id,
                d.business_name
            FROM users u
            JOIN dealers d ON u.id = d.user_id
            WHERE u.user_type = 'dealer'
            ORDER BY u.id
        `);

    console.log("   📊 כל ה-dealers עם פרופילים:");
    finalCheck.rows.forEach((row) => {
      console.log(
        `      ✅ ${row.full_name} (ID: ${row.user_id}) -> ${row.business_name}`
      );
    });

    // 4. בדיקה שעכשיו אפשר להוסיף רכבים
    console.log("\n4️⃣ בדיקה שעכשיו ניתן להוסיף רכבים:");

    // ננסה להוסיף רכב לדוגמה (רק לבדיקה - לא נשמור)
    const testDealer = finalCheck.rows[0];
    if (testDealer) {
      try {
        await pool.query("BEGIN");

        const testCar = await pool.query(
          `
                    INSERT INTO cars (dealer_id, make, model, year, price, mileage, fuel_type, transmission, color, description)
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING id, make, model, year, price
                `,
          [
            testDealer.dealer_id,
            "Toyota",
            "Corolla",
            2020,
            85000,
            50000,
            "gasoline",
            "automatic",
            "white",
            "רכב מצוין במצב טוב",
          ]
        );

        console.log(`   ✅ בדיקה הצליחה! אפשר להוסיף רכבים.`);
        console.log(
          `      רכב דוגמה: ${testCar.rows[0].make} ${testCar.rows[0].model} (${testCar.rows[0].year}) - ₪${testCar.rows[0].price}`
        );

        // ביטול הרכב הדוגמה
        await pool.query("ROLLBACK");
        console.log(`   ℹ️ רכב הדוגמה בוטל (זו הייתה רק בדיקה)`);
      } catch (error) {
        await pool.query("ROLLBACK");
        console.log(`   ❌ עדיין יש בעיה בהוספת רכבים: ${error.message}`);
      }
    }

    console.log("\n🎉 תיקון הדאטהבייס הושלם בהצלחה!");
    console.log("עכשיו תוכל:");
    console.log("- ✅ להרשם משתמשים חדשים (יקבלו פרופיל אוטומטית)");
    console.log("- ✅ להוסיף רכבים לדילרים");
    console.log("- ✅ לבנות את ה-Cars API");
  } catch (error) {
    console.error("❌ שגיאה בתיקון הדאטהבייס:", error);
  } finally {
    await pool.end();
  }
}

fixDatabaseIssues();
