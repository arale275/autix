import { Pool } from 'pg';


console.log('=== DATABASE CONFIG LOADING ===');

console.log('Working directory:', process.cwd());

console.log('NODE_ENV:', process.env.NODE_ENV);

console.log('Before dotenv - DB_HOST:', process.env.DB_HOST);


// טוען dotenv מפורשות

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });


console.log('After dotenv - DB_HOST:', process.env.DB_HOST);

console.log('DB_PORT:', process.env.DB_PORT);

console.log('DB_NAME:', process.env.DB_NAME);

console.log('DB_USER:', process.env.DB_USER);


const config = {

  host: process.env.DB_HOST,

  port: parseInt(process.env.DB_PORT || '5432'),

  database: process.env.DB_NAME,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  ssl: {

    rejectUnauthorized: false

  }

};


console.log('=== POOL CONFIG ===');

console.log('Config host:', config.host);

console.log('Config database:', config.database);

console.log('Config user:', config.user);


const pool = new Pool(config);


pool.on('connect', () => {

  console.log('✅ Connected to PostgreSQL database');

});


pool.on('error', (err) => {

  console.error('❌ Database connection error:', err.message);

  console.error('❌ Attempted host:', config.host);

});


export default pool;
