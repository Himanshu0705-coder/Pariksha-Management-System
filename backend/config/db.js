const { Pool } = require('pg');
require('dotenv').config();

const poolOptions = {
  max: 5,
  idleTimeoutMillis: 10000,       // idle connections close fast (Neon sleeps after 5 min idle)
  connectionTimeoutMillis: 15000, // fail with an error instead of hanging while Neon wakes up
  keepAlive: true
};

const pool = new Pool(
  process.env.DATABASE_URL
    ? { ...poolOptions, connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
    : {
        ...poolOptions,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
      }
);

pool.on('error', (err) => console.error('PostgreSQL pool error:', err.message));

module.exports = pool;
