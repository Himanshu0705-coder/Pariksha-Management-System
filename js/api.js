/* ============================
   API HELPER (backend se baat karta hai)
   ============================ */

const API_BASE = '/api';

const Auth = {
  getToken: () => localStorage.getItem('token'),
  getRole: () => localStorage.getItem('role'),
  getUser: () => JSON.parse(localStorage.getItem('user') || 'null'),
  save(token, role, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('user', JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
  }
};

async function api(path, { method = 'GET', body, formData } = {}) {
  const headers = {};
  const token = Auth.getToken();
  if (token) headers['Authorization'] = 'Bearer ' + token;

  const options = { method, headers };
  if (formData) {
    options.body = formData; // browser khud Content-Type set karega
  } else if (body) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  const res = await fetch(API_BASE + path, options);

  if (res.status === 401 && token) {
    // token expire / invalid
    const role = Auth.getRole();
    Auth.clear();
    window.location.href = role === 'admin' ? '/admin/login.html' : '/student/login.html';
    throw new Error('Session expired');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

// File download (token ke saath)
async function downloadWithAuth(path, fallbackName) {
  const res = await fetch(API_BASE + path, {
    headers: { Authorization: 'Bearer ' + Auth.getToken() }
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Download failed');
  }
  let filename = fallbackName;
  const cd = res.headers.get('Content-Disposition') || '';
  const m = cd.match(/filename\*=UTF-8''([^;]+)/i) || cd.match(/filename="?([^";]+)"?/i);
  if (m) filename = decodeURIComponent(m[1]);

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// XSS se bachne ke liye - DB ka text HTML me daalne se pehle escape karo
function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
