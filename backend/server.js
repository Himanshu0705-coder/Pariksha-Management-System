require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

process.on('unhandledRejection', (e) => console.error('Unhandled rejection:', e));
process.on('uncaughtException', (e) => console.error('Uncaught exception:', e));

const app = express();

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
app.get('/', (req, res) => res.sendFile(path.join(ROOT, 'index.html')));

// uploads folder public nahi hai - files sirf /api/papers/:id/download se milti hain

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
