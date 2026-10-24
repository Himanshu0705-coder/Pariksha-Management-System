const express = require('express');
const pool = require('../config/db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Public: register page me dropdown ke liye
router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name FROM departments ORDER BY name');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Department name is required' });
    const { rows } = await pool.query('INSERT INTO departments (name) VALUES ($1) RETURNING id, name', [name]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'This department already exists' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const used = await pool.query(
      `SELECT (SELECT COUNT(*) FROM exam_papers WHERE department_id = $1)::int AS papers,
              (SELECT COUNT(*) FROM folders WHERE department_id = $1)::int AS folders`,
      [req.params.id]
    );
    const { papers, folders } = used.rows[0];
    if (papers || folders)
      return res.status(409).json({ error: `Cannot delete: it still has ${papers} paper(s) and ${folders} folder(s). Remove them first.` });
    await pool.query('DELETE FROM departments WHERE id = $1', [req.params.id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
