// server/src/debug-cars.js
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

async function debugCarsAPI() {
  try {
    console.log("🔍 בודק בעיית Cars API...\n");

    // 1. בדיקת החיבור בין הטבלאות
    console.log("1️⃣ בדיקת חיבור טבלאות:");
    const joinTest = await pool.query(`
            SELECT 
                c.id as car_id,
                c.make,
                c.model,
                d.id as dealer_id,
                d.business_name,
                u.id as user_id,
                u.email
            FROM cars c
            RIGHT JOIN dealers d ON c.dealer_id = d.id
            RIGHT JOIN users u ON d.user_id = u.id
            WHERE u.user_type = 'dealer'
            LIMIT 5
        `);

    if (joinTest.rows.length > 0) {
      joinTest.rows.forEach((row) => {
        console.log(
          `   User: ${row.email} -> Dealer ID: ${row.dealer_id} -> Cars: ${
            row.car_id || "אין רכבים"
          }`
        );
      });
    } else {
      console.log("   ❌ אין נתונים או בעיה בחיבור טבלאות");
    }

    // 2. ספירת רכבים
    console.log("\n2️⃣ ספירת רכבים:");
    const carsCount = await pool.query("SELECT COUNT(*) as total FROM cars");
    console.log(`   סה"כ רכבים: ${carsCount.rows[0].total}`);

    const activeCars = await pool.query(
      "SELECT COUNT(*) as total FROM cars WHERE status = 'active'"
    );
    console.log(`   רכבים פעילים: ${activeCars.rows[0].total}`);

    // 3. נסיון הרצת השאילתה הבעייתית
    console.log("\n3️⃣ בדיקת השאילתה המקורית:");
    try {
      const carsQuery = `
                SELECT 
                  c.id, c.make, c.model, c.year, c.price, c.mileage,
                  c.fuel_type, c.transmission, c.color, c.description,
                  c.images, c.city, c.created_at, c.updated_at,
                  d.business_name as dealer_name,
                  u.first_name || ' ' || u.last_name as dealer_contact,
                  u.phone as dealer_phone
                FROM cars c
                JOIN dealers d ON c.dealer_id = d.id
                JOIN users u ON d.user_id = u.id
                WHERE c.status = 'active'
                ORDER BY c.created_at DESC
                LIMIT 20 OFFSET 0
            `;

      const result = await pool.query(carsQuery);
      console.log(`   ✅ השאילתה עבדה! מצאנו ${result.rows.length} רכבים`);

      result.rows.forEach((car) => {
        console.log(
          `      - ${car.make} ${car.model} (${car.year}) - ₪${car.price}`
        );
      });
    } catch (error) {
      console.log(`   ❌ שגיאה בשאילתה: ${error.message}`);
    }

    // 4. הוספת רכב דוגמה
    console.log("\n4️⃣ נסיון הוספת רכב דוגמה:");
    try {
      // מציאת dealer_id
      const dealerResult = await pool.query(
        "SELECT id FROM dealers WHERE user_id = $1",
        [2] // user_id של dealer@test.com
      );

      if (dealerResult.rows.length > 0) {
        const dealerId = dealerResult.rows[0].id;
        console.log(`   מצאנו Dealer ID: ${dealerId}`);

        // הוספת רכב
        const carResult = await pool.query(
          `
                    INSERT INTO cars (
                        dealer_id, make, model, year, price, mileage, 
                        fuel_type, transmission, color, description, city, status
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                    RETURNING id, make, model, year, price
                `,
          [
            dealerId,
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
          `      ID: ${carResult.rows[0].id}, ${carResult.rows[0].make} ${carResult.rows[0].model}`
        );
      } else {
        console.log(`   ❌ לא נמצא dealer profile עבור user_id 2`);
      }
    } catch (error) {
      console.log(`   ❌ שגיאה בהוספת רכב: ${error.message}`);
    }
  } catch (error) {
    console.error("❌ שגיאה כללית:", error.message);
  } finally {
    await pool.end();
  }
}

debugCarsAPI();
