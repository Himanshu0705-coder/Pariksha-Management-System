const express = require('express');
const pool = require('../config/db');
const { requireAdmin, requireStudent } = require('../middleware/auth');
const { studentDepartmentId } = require('../utils/access');

const router = express.Router();

// ---------- Public stats (landing page) ----------
router.get('/public-stats', async (req, res) => {
  try {
    const s = await pool.query('SELECT COUNT(*)::int AS c FROM students');
    const p = await pool.query('SELECT COUNT(*)::int AS c FROM exam_papers');
    res.json({ students: s.rows[0].c, papers: p.rows[0].c });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Admin: all students ----------
router.get('/students', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id, full_name, email, roll_no, course, created_at FROM students ORDER BY created_at DESC'
    );
    res.json(rows.map(s => ({
      id: s.id, fullName: s.full_name, email: s.email,
      rollNo: s.roll_no, course: s.course, registeredDate: s.created_at
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Admin: delete student ----------
router.delete('/students/:id', requireAdmin, async (req, res) => {
  try {
    await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Admin: dashboard stats ----------
router.get('/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [s, p, d] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM students'),
      pool.query('SELECT COUNT(*)::int AS c FROM exam_papers'),
      pool.query('SELECT COUNT(*)::int AS c FROM downloads')
    ]);
    res.json({ students: s.rows[0].c, papers: p.rows[0].c, downloads: d.rows[0].c });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Student: my downloads ----------
router.get('/student/downloads', requireStudent, async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT d.id, d.downloaded_at, d.paper_id, p.name AS paper_name
       FROM downloads d JOIN exam_papers p ON p.id = d.paper_id
       WHERE d.student_id = $1 ORDER BY d.downloaded_at DESC`,
      [req.user.id]
    );
    res.json(rows.map(r => ({
      id: r.id, paperId: r.paper_id, paperName: r.paper_name, downloadedAt: r.downloaded_at
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- Student: stats (sirf apne department ke papers) ----------
router.get('/student/stats', requireStudent, async (req, res) => {
  try {
    const deptId = await studentDepartmentId(req.user.id);
    const [papers, subjects, mine, students] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS c FROM exam_papers WHERE department_id = $1', [deptId]),
      pool.query('SELECT COUNT(DISTINCT subject)::int AS c FROM exam_papers WHERE department_id = $1', [deptId]),
      pool.query('SELECT COUNT(*)::int AS c FROM downloads WHERE student_id = $1', [req.user.id]),
      pool.query('SELECT COUNT(*)::int AS c FROM students')
    ]);
    res.json({
      available: papers.rows[0].c, subjects: subjects.rows[0].c,
      downloads: mine.rows[0].c, students: students.rows[0].c
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
