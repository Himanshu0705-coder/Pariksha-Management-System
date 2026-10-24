const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const upload = require('../middleware/upload');
const { requireAdmin, requireAny } = require('../middleware/auth');
const { studentDepartmentId } = require('../utils/access');

const router = express.Router();

const dto = (f) => ({
  id: f.id,
  name: f.name,
  departmentId: f.department_id,
  departmentName: f.department_name,
  paperCount: f.paper_count
});

// Admin: sab folders (optional ?department=ID). Student: sirf apne department ke.
router.get('/', requireAny, async (req, res) => {
  try {
    let departmentId = req.query.department ? Number(req.query.department) : null;
    if (req.user.role === 'student') {
      departmentId = await studentDepartmentId(req.user.id);
      if (!departmentId) return res.json([]);
    }
    const { rows } = await pool.query(
      `SELECT f.*, d.name AS department_name,
              (SELECT COUNT(*)::int FROM exam_papers p WHERE p.folder_id = f.id) AS paper_count
       FROM folders f JOIN departments d ON d.id = f.department_id
       WHERE ($1::int IS NULL OR f.department_id = $1)
       ORDER BY d.name, f.name`,
      [departmentId]
    );
    res.json(rows.map(dto));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', requireAdmin, async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    const { departmentId } = req.body;
    if (!name || !departmentId) return res.status(400).json({ error: 'Folder name and department are required' });
    const { rows } = await pool.query(
      'INSERT INTO folders (name, department_id) VALUES ($1, $2) RETURNING *',
      [name, departmentId]
    );
    res.status(201).json(dto({ ...rows[0], paper_count: 0 }));
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A folder with this name already exists in this department' });
    if (err.code === '23503') return res.status(400).json({ error: 'Department not found' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const name = (req.body.name || '').trim();
    if (!name) return res.status(400).json({ error: 'Folder name is required' });
    const { rows } = await pool.query('UPDATE folders SET name = $1 WHERE id = $2 RETURNING *', [name, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Folder not found' });
    res.json({ id: rows[0].id, name: rows[0].name });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A folder with this name already exists in this department' });
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Folder delete = folder + uske andar ke saare papers (files bhi) delete
router.delete('/:id', requireAdmin, async (req, res) => {
  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');
    const files = await client.query('DELETE FROM exam_papers WHERE folder_id = $1 RETURNING file_path', [req.params.id]);
    const del = await client.query('DELETE FROM folders WHERE id = $1', [req.params.id]);
    if (!del.rowCount) { await client.query('ROLLBACK'); return res.status(404).json({ error: 'Folder not found' }); }
    await client.query('COMMIT');
    files.rows.forEach((r) => fs.unlink(path.join(upload.UPLOAD_DIR, r.file_path), () => {}));
    res.json({ message: 'Deleted', papersDeleted: files.rowCount });
  } catch (err) {
    if (client) await client.query('ROLLBACK').catch(() => {});
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  } finally {
    if (client) client.release();
  }
});

module.exports = router;
