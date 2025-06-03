const { Pool } = require('pg');

const pool = new Pool({
  host: 'ls-ea5376db9fba37d4aa3110b9bcd5e9444859b8e7.c3agfyzyhu1d.eu-central-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'dbmasteruser',
  password: 'K49lCpDXxftGRvT2NEfmmGag',
  ssl: { rejectUnauthorized: false }
});

async function checkDatabase() {
  try {
    const client = await pool.connect();
    console.log('✅ Connected to database!');
    
    // רשימת טבלאות
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'
    `);
    console.log('\n��� Tables:');
    tables.rows.forEach(row => console.log(`- ${row.table_name}`));
    
    // מבנה טבלת cars
    const carsCols = await client.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'cars'
      ORDER BY ordinal_position
    `);
    console.log('\n��� Cars table:');
    carsCols.rows.forEach(row => {
      console.log(`- ${row.column_name}: ${row.data_type}`);
    });
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkDatabase();
