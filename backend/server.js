require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

process.on('unhandledRejection', (e) => console.error('Unhandled rejection:', e));
process.on('uncaughtException', (e) => console.error('Uncaught exception:', e));

process.on('SIGTERM', () => { console.log('SIGTERM: Render is stopping this instance'); process.exit(0); });
process.on('exit', (c) => console.log('Process exit, code', c));

const app = express();

// upload par kya hua - Render Logs me dikhega
app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.startsWith('/api/papers')) {
    const t = Date.now();
    console.log('[upload] start, bytes:', req.headers['content-length'] || '?');
    req.on('aborted', () => console.log('[upload] client closed the connection'));
    res.on('finish', () => console.log('[upload] done, HTTP', res.statusCode, 'in', Date.now() - t, 'ms, memory MB:', Math.round(process.memoryUsage().rss / 1048576)));
  }
  next();
});

app.get('/api/health', (req, res) => res.json({ ok: true, uptimeSec: Math.round(process.uptime()) }));

app.use(cors());
app.use(express.json());

// ---------- API ----------
app.use('/api/auth', require('./routes/auth'));
app.use('/api/papers', require('./routes/papers'));
app.use('/api/folders', require('./routes/folders'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api', require('./routes/students'));

// ---------- Frontend ----------
// Sirf frontend folders serve hote hain (backend/.env kabhi expose nahi hoga)
const ROOT = path.join(__dirname, '..');
['admin', 'student', 'css', 'js', 'images'].forEach((dir) =>
  app.use('/' + dir, express.static(path.join(ROOT, dir)))
);
app.get(['/', '/index.html'], (req, res) => res.sendFile(path.join(ROOT, 'index.html')));

// uploads folder public nahi hai - files sirf /api/papers/:id/download se milti hain

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
