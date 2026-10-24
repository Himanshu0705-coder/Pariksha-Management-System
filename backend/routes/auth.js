const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { requireStudent, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const sign = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const studentDto = (s) => ({
  id: s.id,
  fullName: s.full_name,
  email: s.email,
  rollNo: s.roll_no,
  course: s.course,
  registeredDate: s.created_at
});

// ---------- STUDENT REGISTER ----------
router.post('/student/register', async (req, res) => {
  try {
    const { fullName, email, rollNo, course, password } = req.body;
    if (!fullName || !email || !rollNo || !course || !password)
      return res.status(400).json({ error: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters' });

    const exists = await pool.query('SELECT 1 FROM students WHERE email = $1', [email.toLowerCase()]);
    if (exists.rowCount) return res.status(409).json({ error: 'This email is already registered!' });

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      `INSERT INTO students (full_name, email, roll_no, course, password_hash)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [fullName.trim(), email.toLowerCase().trim(), rollNo.trim(), course, hash]
    );
    res.status(201).json({ message: 'Registered', student: studentDto(rows[0]) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- STUDENT LOGIN ----------
router.post('/student/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM students WHERE email = $1', [(email || '').toLowerCase()]);
    const student = rows[0];
    if (!student || !(await bcrypt.compare(password || '', student.password_hash)))
      return res.status(401).json({ error: 'Invalid email or password!' });

    res.json({ token: sign(student.id, 'student'), student: studentDto(student) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- STUDENT CHANGE PASSWORD ----------
router.put('/student/password', requireStudent, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'New password must be at least 6 characters long!' });

    const { rows } = await pool.query('SELECT * FROM students WHERE id = $1', [req.user.id]);
    if (!rows[0] || !(await bcrypt.compare(oldPassword || '', rows[0].password_hash)))
      return res.status(400).json({ error: 'Old password is incorrect!' });

    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE students SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- ADMIN LOGIN ----------
router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const { rows } = await pool.query('SELECT * FROM admins WHERE username = $1', [username]);
    const admin = rows[0];
    if (!admin || !(await bcrypt.compare(password || '', admin.password_hash)))
      return res.status(401).json({ error: 'Invalid username or password!' });

    res.json({ token: sign(admin.id, 'admin'), admin: { id: admin.id, username: admin.username } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- ADMIN CHANGE PASSWORD ----------
router.put('/admin/password', requireAdmin, async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6)
      return res.status(400).json({ error: 'Password must be at least 6 characters long!' });
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [hash, req.user.id]);
    res.json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
