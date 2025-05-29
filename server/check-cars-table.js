require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.SSL === "required" ? { rejectUnauthorized: false } : false,
});

async function checkCarsTable() {
  try {
    console.log("Checking cars table structure...");

    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'cars'
      ORDER BY ordinal_position;
    `);

    console.log("Cars table structure:");
    console.table(result.rows);

    // גם נבדוק אם הטבלה בכלל קיימת
    const tableExists = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'cars';
    `);

    console.log("Table exists:", tableExists.rows.length > 0);

    await pool.end();
  } catch (error) {
    console.error("Error:", error);
  }
}

checkCarsTable();
