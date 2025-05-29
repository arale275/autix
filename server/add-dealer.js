const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.SSL === "required" ? { rejectUnauthorized: false } : false,
});

async function addDealer() {
  try {
    console.log("Adding dealer to dealers table...");

    await pool.query(
      "INSERT INTO dealers (user_id, business_name, address) VALUES ($1, $2, $3)",
      [4, "Test Dealer 3", "Test Address"]
    );

    console.log("Dealer added successfully!");
    await pool.end();
  } catch (error) {
    console.error("Error:", error);
    await pool.end();
  }
}

addDealer();
