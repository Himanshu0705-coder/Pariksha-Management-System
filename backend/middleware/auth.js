const jwt = require('jsonwebtoken');

function getToken(req) {
  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) return header.slice(7);
  return null;
}

function verify(req, res, next, allowedRoles) {
  const token = getToken(req);
  if (!token) return res.status(401).json({ error: 'Login required' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!allowedRoles.includes(payload.role)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    req.user = payload; // { id, role }
    next();
  } catch {
    return res.status(401).json({ error: 'Session expired, please login again' });
  }
}

exports.requireAdmin   = (req, res, next) => verify(req, res, next, ['admin']);
exports.requireStudent = (req, res, next) => verify(req, res, next, ['student']);
exports.requireAny     = (req, res, next) => verify(req, res, next, ['admin', 'student']);
