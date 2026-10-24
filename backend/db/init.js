// Run: npm run db:init
// Tables banata hai + default admin create karta hai.
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

(async () => {
  try {
    const sql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    await pool.query(sql);
    console.log('✅ Tables ready');

    const defaults = [
      'B.Tech Computer Science', 'B.Tech Data Science', 'BSC Physics', 'BSC Chemistry',
      'BA History', 'BA Economics', 'BE Mechanical', 'BE Electrical', 'BE Civil', 'Other'
    ];
    for (const name of defaults) {
      await pool.query('INSERT INTO departments (name) VALUES ($1) ON CONFLICT (name) DO NOTHING', [name]);
    }
    console.log('✅ Departments ready');

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';
    const exists = await pool.query('SELECT id FROM admins WHERE username = $1', [username]);
    if (exists.rowCount === 0) {
      const hash = await bcrypt.hash(password, 10);
      await pool.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', [username, hash]);
      console.log(`✅ Admin created -> username: ${username}`);
    } else {
      console.log('ℹ️  Admin already exists');
    }
  } catch (err) {
    console.error('❌ DB init failed:', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
})();
