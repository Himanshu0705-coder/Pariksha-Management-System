const express = require('express');
const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const upload = require('../middleware/upload');
const { requireAdmin, requireStudent, requireAny } = require('../middleware/auth');
const { studentDepartmentId } = require('../utils/access');

const router = express.Router();

const BASE = `SELECT p.*, d.name AS department_name, f.name AS folder_name
  FROM exam_papers p
  LEFT JOIN departments d ON d.id = p.department_id
  LEFT JOIN folders f ON f.id = p.folder_id`;

const dto = (p) => ({
  id: p.id,
  name: p.name,
  subject: p.subject,
  semester: p.semester,
  description: p.description,
  fileName: p.file_name,
  fileSize: Number(p.file_size),
  uploadedAt: p.uploaded_at,
  departmentId: p.department_id,
  departmentName: p.department_name || null,
  folderId: p.folder_id,
  folderName: p.folder_name || null
});

// ---------- LIST ----------
// Admin: sab (filters: department, folder, subject, search)
// Student: sirf APNE department ke papers (server khud enforce karta hai)
router.get('/', requireAny, async (req, res) => {
  try {
    const { search = '', subject = '', folder = '', department = '' } = req.query;
    const params = [];
    const where = [];
    const add = (v) => { params.push(v); return '$' + params.length; };

    if (req.user.role === 'student') {
      const deptId = await studentDepartmentId(req.user.id);
      if (!deptId) return res.json([]);
      where.push(`p.department_id = ${add(deptId)}`);
    } else if (department) {
      where.push(`p.department_id = ${add(Number(department))}`);
    }

    if (folder === 'none') where.push('p.folder_id IS NULL');
    else if (folder) where.push(`p.folder_id = ${add(Number(folder))}`);

    if (subject) where.push(`p.subject = ${add(subject)}`);
    if (search) {
      const t = add(search);
      where.push(`(p.name ILIKE '%' || ${t} || '%' OR COALESCE(p.description,'') ILIKE '%' || ${t} || '%')`);
    }

    const sql = `${BASE} ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY p.uploaded_at DESC`;
    const { rows } = await pool.query(sql, params);
    res.json(rows.map(dto));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- UPLOAD (admin): ek ya zyada files, folder me ya bina folder ke ----------
router.post('/', requireAdmin, (req, res) => {
  upload.array('paperFiles', 100)(req, res, async (err) => {
    const files = req.files || [];
    const cleanup = () => files.forEach((f) => fs.unlink(f.path, () => {}));

    if (err) { cleanup(); return res.status(400).json({ error: err.message }); }
    if (!files.length) return res.status(400).json({ error: 'Select at least one file' });

    const { name, subject, semester, description, departmentId, folderId, newFolderName } = req.body;
    if (!departmentId || !subject || !semester) {
      cleanup();
      return res.status(400).json({ error: 'Department, subject and semester are required' });
    }

    let client;
    try {
      client = await pool.connect();
      const dep = await client.query('SELECT id FROM departments WHERE id = $1', [departmentId]);
      if (!dep.rowCount) { cleanup(); return res.status(400).json({ error: 'Department not found' }); }

      await client.query('BEGIN');

      let fid = null;
      if (newFolderName && newFolderName.trim()) {
        // computer ka poora folder upload: usi naam ka folder find/create
        const r = await client.query(
          `INSERT INTO folders (name, department_id) VALUES ($1, $2)
           ON CONFLICT (department_id, name) DO UPDATE SET name = EXCLUDED.name RETURNING id`,
          [newFolderName.trim(), departmentId]
        );
        fid = r.rows[0].id;
      } else if (folderId) {
        const r = await client.query('SELECT id FROM folders WHERE id = $1 AND department_id = $2', [folderId, departmentId]);
        if (!r.rowCount) {
          await client.query('ROLLBACK');
          cleanup();
          return res.status(400).json({ error: 'This folder does not belong to the selected department' });
        }
        fid = r.rows[0].id;
      }

      const created = [];
      for (const f of files) {
        const title = files.length === 1 && name && name.trim() ? name.trim() : path.parse(f.originalname).name;
        const r = await client.query(
          `INSERT INTO exam_papers
             (name, subject, semester, description, file_name, file_path, file_size, mime_type, uploaded_by, department_id, folder_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
          [title, subject, semester, description || '', f.originalname, f.filename, f.size, f.mimetype, req.user.id, departmentId, fid]
        );
        created.push(r.rows[0]);
      }

      await client.query('COMMIT');
      res.status(201).json({ count: created.length, folderId: fid, papers: created.map(dto) });
    } catch (e) {
      if (client) await client.query('ROLLBACK').catch(() => {});
      console.error(e);
      cleanup();
      res.status(500).json({ error: 'Server error, please try again' });
    } finally {
      if (client) client.release();
    }
  });
});

// ---------- UPDATE details (admin) ----------
router.put('/:id', requireAdmin, async (req, res) => {
  try {
    const { name, subject, semester, description, departmentId, folderId } = req.body;
    if (!name || !subject || !semester || !departmentId)
      return res.status(400).json({ error: 'Name, subject, semester and department are required' });

    if (folderId) {
      const f = await pool.query('SELECT 1 FROM folders WHERE id = $1 AND department_id = $2', [folderId, departmentId]);
      if (!f.rowCount) return res.status(400).json({ error: 'This folder does not belong to the selected department' });
    }

    const { rows } = await pool.query(
      `UPDATE exam_papers
       SET name=$1, subject=$2, semester=$3, description=$4, department_id=$5, folder_id=$6
       WHERE id=$7 RETURNING *`,
      [name, subject, semester, description || '', departmentId, folderId || null, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Paper not found' });
    res.json(dto(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- DELETE (admin) ----------
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM exam_papers WHERE id = $1 RETURNING file_path', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Paper not found' });
    fs.unlink(path.join(upload.UPLOAD_DIR, rows[0].file_path), () => {});
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ---------- DOWNLOAD (student, sirf apne department ka) ----------
router.get('/:id/download', requireStudent, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM exam_papers WHERE id = $1', [req.params.id]);
    const paper = rows[0];
    if (!paper) return res.status(404).json({ error: 'Paper not found' });

    const deptId = await studentDepartmentId(req.user.id);
    if (!deptId || paper.department_id !== deptId)
      return res.status(403).json({ error: 'This paper is not available for your course' });

    const filePath = path.join(upload.UPLOAD_DIR, paper.file_path);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File missing on server' });

    await pool.query('INSERT INTO downloads (student_id, paper_id) VALUES ($1,$2)', [req.user.id, paper.id]);
    res.download(filePath, paper.file_name);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
