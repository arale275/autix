const { Pool } = require('pg');

const pool = new Pool({
  host: 'ls-ea5376db9fba37d4aa3110b9bcd5e9444859b8e7.c3agfyzyhu1d.eu-central-1.rds.amazonaws.com',
  port: 5432,
  database: 'postgres',
  user: 'dbmasteruser',
  password: 'K49lCpDXxftGRvT2NEfmmGag',
  ssl: { rejectUnauthorized: false }
});

async function createImagesTable() {
  try {
    const client = await pool.connect();
    console.log('Ì¥ó Connected to database...');
    
    const createTableSQL = `
      CREATE TABLE car_images (
        id SERIAL PRIMARY KEY,
        car_id INTEGER NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        thumbnail_url TEXT,
        is_main BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        original_filename TEXT,
        file_size INTEGER,
        content_type TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX idx_car_images_car_id ON car_images(car_id);
      CREATE INDEX idx_car_images_main ON car_images(car_id, is_main) WHERE is_main = TRUE;
      CREATE UNIQUE INDEX idx_car_images_one_main ON car_images(car_id) WHERE is_main = TRUE;
    `;
    
    await client.query(createTableSQL);
    console.log('‚úÖ Table car_images created successfully!');
    
    client.release();
    await pool.end();
    
  } catch (error) {
    console.error('‚ùå Error:', error.message);
  }
}

createImagesTable();
