/* ============================
   ADMIN DASHBOARD SCRIPT (PostgreSQL API)
   Departments, folders, department-wise papers
   ============================ */

let departments = [];
let folders = [];
let allStudentsCache = [];
let currentFolder = '';          // '' = all, 'none' = no folder, or folder id

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '');
const ALLOWED_EXT = ['.pdf', '.doc', '.docx'];
const $ = (id) => document.getElementById(id);

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.innerHTML.includes('admin-layout')) {
        if (!checkLoginStatus('admin')) return;
        initializeAdminDashboard();
        setupAdminListeners();
    }
});

async function initializeAdminDashboard() {
    await loadDepartments();
    await loadFolders();
    await Promise.all([loadAllPapers(), loadAllStudents(), updateAdminStats(), loadRecentPapers()]);
}

// ---------- Stats ----------
async function updateAdminStats() {
    try {
        const s = await api('/admin/stats');
        $('stat-students').textContent = s.students;
        $('stat-papers').textContent = s.papers;
        $('stat-downloads').textContent = s.downloads;
        $('stat-active').textContent = s.students;
        $('info-students').textContent = s.students;
        $('info-papers').textContent = s.papers;
        $('info-updated').textContent = new Date().toLocaleDateString();
    } catch (err) { console.error(err); }
}

// ---------- Departments ----------
function fillDepartmentSelect(el, placeholder) {
    const keep = el.value;
    el.innerHTML = `<option value="">${esc(placeholder)}</option>` +
        departments.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join('');
    if (keep && departments.some(d => String(d.id) === keep)) el.value = keep;
}

async function loadDepartments() {
    try {
        departments = await api('/departments');
        fillDepartmentSelect($('uploadDepartment'), 'Select department');
        fillDepartmentSelect($('libDepartment'), 'All departments');
        fillDepartmentSelect($('folderDepartment'), 'Select department');
        fillDepartmentSelect($('editDepartment'), 'Select department');
        renderDepartments();
    } catch (err) { showAlert(err.message, 'error'); }
}

function renderDepartments() {
    const box = $('departmentsList');
    if (!departments.length) { box.innerHTML = '<p class="empty-state">No departments yet. Add the first one above.</p>'; return; }
    box.innerHTML = departments.map(d => `
        <div class="dept-row">
            <span>${esc(d.name)}</span>
            <button class="btn btn-danger" onclick="deleteDepartment(${d.id})">Delete</button>
        </div>`).join('');
}

async function addDepartment(e) {
    e.preventDefault();
    try {
        await api('/departments', { method: 'POST', body: { name: $('departmentName').value } });
        $('departmentName').value = '';
        await loadDepartments();
        showAlert('Department added.', 'success');
    } catch (err) { showAlert(err.message, 'error'); }
}

function deleteDepartment(id) {
    showConfirmModal('Delete this department? This works only when it has no folders or papers.', async () => {
        try {
            await api('/departments/' + id, { method: 'DELETE' });
            await loadDepartments();
            showAlert('Department deleted.', 'success');
        } catch (err) { showAlert(err.message, 'error'); }
    });
}

// ---------- Folders ----------
async function loadFolders() {
    try {
        folders = await api('/folders');
        renderFolderBar();
        refreshUploadFolders();
    } catch (err) { showAlert(err.message, 'error'); }
}

function visibleFolders() {
    const dept = $('libDepartment').value;
    return dept ? folders.filter(f => String(f.departmentId) === dept) : folders;
}

function renderFolderBar() {
    const dept = $('libDepartment').value;
    const list = visibleFolders();
    if (currentFolder && currentFolder !== 'none' && !list.some(f => String(f.id) === currentFolder)) currentFolder = '';

    const chip = (value, label, count) =>
        `<button class="chip ${currentFolder === value ? 'active' : ''}" onclick="selectFolder('${value}')">${esc(label)}${count !== undefined ? `<small>${count}</small>` : ''}</button>`;

    $('folderBar').innerHTML =
        chip('', 'All papers') + chip('none', 'Not in a folder') +
        list.map(f => chip(String(f.id), dept ? f.name : `${f.name} (${f.departmentName})`, f.paperCount)).join('');

    const actions = $('folderActions');
    if (currentFolder && currentFolder !== 'none') {
        const f = folders.find(x => String(x.id) === currentFolder);
        actions.hidden = false;
        actions.innerHTML = `<strong>${esc(f.name)}</strong>
            <button class="btn btn-secondary" onclick="renameFolder(${f.id})">Rename</button>
            <button class="btn btn-danger" onclick="deleteFolder(${f.id})">Delete folder and its papers</button>`;
    } else {
        actions.hidden = true;
    }
}

function selectFolder(value) {
    currentFolder = value;
    renderFolderBar();
    loadAllPapers();
}

// Upload form: folder dropdown department ke hisaab se
function refreshUploadFolders() {
    const dept = $('uploadDepartment').value;
    const sel = $('uploadFolder');
    const list = dept ? folders.filter(f => String(f.departmentId) === dept) : [];
    sel.innerHTML = '<option value="">No folder</option>' + list.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('');
}

function openFolderModal() {
    $('folderModalTitle').textContent = 'New folder';
    $('folderForm').dataset.editId = '';
    $('folderDepartment').disabled = false;
    $('folderDepartment').value = $('libDepartment').value || '';
    $('folderName').value = '';
    $('folderModal').classList.add('active');
    $('folderName').focus();
}

function renameFolder(id) {
    const f = folders.find(x => x.id === id);
    $('folderModalTitle').textContent = 'Rename folder';
    $('folderForm').dataset.editId = String(id);
    $('folderDepartment').value = String(f.departmentId);
    $('folderDepartment').disabled = true;
    $('folderName').value = f.name;
    $('folderModal').classList.add('active');
}

async function saveFolder(e) {
    e.preventDefault();
    const editId = $('folderForm').dataset.editId;
    try {
        if (editId) {
            await api('/folders/' + editId, { method: 'PUT', body: { name: $('folderName').value } });
        } else {
            const f = await api('/folders', { method: 'POST', body: { name: $('folderName').value, departmentId: $('folderDepartment').value } });
            $('libDepartment').value = String(f.departmentId);
            currentFolder = String(f.id);
        }
        $('folderModal').classList.remove('active');
        await loadFolders();
        loadAllPapers();
        showAlert(editId ? 'Folder renamed.' : 'Folder created. You can upload papers into it now.', 'success');
    } catch (err) { showAlert(err.message, 'error'); }
}

function deleteFolder(id) {
    const f = folders.find(x => x.id === id);
    showConfirmModal(`Delete the folder "${f.name}" and its ${f.paperCount} paper(s)? This cannot be undone.`, async () => {
        try {
            await api('/folders/' + id, { method: 'DELETE' });
            currentFolder = '';
            await loadFolders();
            await Promise.all([loadAllPapers(), updateAdminStats(), loadRecentPapers()]);
            showAlert('Folder deleted.', 'success');
        } catch (err) { showAlert(err.message, 'error'); }
    });
}

// ---------- Upload ----------
function toggleUploadMode() {
    const mode = document.querySelector('input[name="uploadMode"]:checked').value;
    $('filesBox').hidden = mode !== 'files';
    $('nameBox').hidden = mode !== 'files';
    $('folderBox').hidden = mode !== 'folder';
    $('uploadFolder').disabled = mode === 'folder';
}

async function handlePaperUpload(e) {
    e.preventDefault();
    const mode = document.querySelector('input[name="uploadMode"]:checked').value;
    const departmentId = $('uploadDepartment').value;
    if (!departmentId) { showAlert('Select a department first.', 'error'); return; }

    const fd = new FormData();
    fd.append('departmentId', departmentId);
    fd.append('subject', $('subject').value);
    fd.append('semester', $('semester').value);
    fd.append('description', $('description').value);

    let files, skipped = 0;
    if (mode === 'files') {
        files = [...$('paperFile').files];
        if (!files.length) { showAlert('Select at least one file.', 'error'); return; }
        if ($('uploadFolder').value) fd.append('folderId', $('uploadFolder').value);
        if (files.length === 1 && $('paperName').value.trim()) fd.append('name', $('paperName').value.trim());
    } else {
        const all = [...$('paperFolder').files];
        if (!all.length) { showAlert('Choose a folder first.', 'error'); return; }
        files = all.filter(f => ALLOWED_EXT.some(x => f.name.toLowerCase().endsWith(x)));
        skipped = all.length - files.length;
        if (!files.length) { showAlert('That folder has no PDF, DOC or DOCX files.', 'error'); return; }
        const root = (all[0].webkitRelativePath || '').split('/')[0];
        if (root) fd.append('newFolderName', root);
    }
    files.forEach(f => fd.append('paperFiles', f));

    const btn = $('uploadBtn');
    btn.disabled = true; btn.textContent = 'Uploading...';
    try {
        const r = await api('/papers', { method: 'POST', formData: fd });
        showAlert(`${r.count} paper(s) uploaded.` + (skipped ? ` ${skipped} other file(s) were skipped.` : ''), 'success');
        $('uploadForm').reset();
        $('uploadDepartment').value = departmentId;     // same department par agla upload aasaan ho
        refreshUploadFolders();
        toggleUploadMode();
        await loadFolders();
        await Promise.all([loadAllPapers(), updateAdminStats(), loadRecentPapers()]);
    } catch (err) {
        showAlert(err.message, 'error');
    } finally {
        btn.disabled = false; btn.textContent = 'Upload';
    }
}

// ---------- Papers ----------
function paperQuery() {
    const q = new URLSearchParams();
    if ($('libDepartment').value) q.set('department', $('libDepartment').value);
    if (currentFolder) q.set('folder', currentFolder);
    if ($('libSearch').value.trim()) q.set('search', $('libSearch').value.trim());
    return q.toString();
}

let papersCache = [];
async function loadAllPapers() {
    const container = $('papersList');
    try {
        papersCache = await api('/papers?' + paperQuery());
        if (!papersCache.length) { container.innerHTML = '<p class="empty-state">No papers here yet. Upload one above.</p>'; return; }
        container.innerHTML = papersCache.map(p => `
            <div class="paper-card">
                <div class="paper-header">
                    <div class="paper-icon">📄</div>
                    <div class="paper-actions">
                        <button class="action-btn" onclick="editPaper(${p.id})" title="Edit">✏️</button>
                        <button class="action-btn" onclick="deletePaper(${p.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="paper-title">${esc(p.name)}</div>
                <span class="paper-subject">${esc(p.subject)}</span>
                <div class="paper-meta">${esc(p.semester)} | ${formatBytes(p.fileSize)}</div>
                <div class="paper-where">Department: ${esc(p.departmentName || 'Not assigned')}<br>Folder: ${esc(p.folderName || 'None')}</div>
                <div class="paper-description">${esc(p.description) || 'No description'}</div>
                <div class="paper-footer"><small style="color:#58695F">Uploaded ${fmtDate(p.uploadedAt)}</small></div>
            </div>`).join('');
    } catch (err) {
        container.innerHTML = `<p class="empty-state">${esc(err.message)}</p>`;
    }
}

async function loadRecentPapers() {
    const box = $('recentPapers');
    try {
        const list = (await api('/papers')).slice(0, 5);
        box.innerHTML = list.length ? list.map(p => `
            <div class="paper-item">
                <div class="paper-item-info">
                    <div class="paper-name">${esc(p.name)}</div>
                    <div class="paper-subject">${esc(p.departmentName || 'Not assigned')} | ${esc(p.subject)}</div>
                </div>
                <div style="font-size:.85rem;color:#58695F">${fmtDate(p.uploadedAt)}</div>
            </div>`).join('') : '<p class="empty-state">No papers uploaded yet</p>';
    } catch (err) { box.innerHTML = `<p class="empty-state">${esc(err.message)}</p>`; }
}

function deletePaper(id) {
    showConfirmModal('Delete this paper? This cannot be undone.', async () => {
        try {
            await api('/papers/' + id, { method: 'DELETE' });
            showAlert('Paper deleted.', 'success');
            await loadFolders();
            await Promise.all([loadAllPapers(), updateAdminStats(), loadRecentPapers()]);
        } catch (err) { showAlert(err.message, 'error'); }
    });
}

function fillEditFolders(deptId, selected) {
    const list = deptId ? folders.filter(f => String(f.departmentId) === String(deptId)) : [];
    $('editFolder').innerHTML = '<option value="">No folder</option>' +
        list.map(f => `<option value="${f.id}">${esc(f.name)}</option>`).join('');
    $('editFolder').value = selected ? String(selected) : '';
}

function editPaper(id) {
    const p = papersCache.find(x => x.id === id);
    if (!p) return;
    $('editPaperForm').dataset.id = String(id);
    $('editName').value = p.name;
    $('editSubject').value = p.subject;
    $('editSemester').value = p.semester;
    $('editDescription').value = p.description || '';
    $('editDepartment').value = p.departmentId ? String(p.departmentId) : '';
    fillEditFolders(p.departmentId, p.folderId);
    $('editPaperModal').classList.add('active');
}

async function saveEditedPaper(e) {
    e.preventDefault();
    const id = $('editPaperForm').dataset.id;
    try {
        await api('/papers/' + id, {
            method: 'PUT',
            body: {
                name: $('editName').value, subject: $('editSubject').value, semester: $('editSemester').value,
                description: $('editDescription').value, departmentId: $('editDepartment').value,
                folderId: $('editFolder').value || null
            }
        });
        $('editPaperModal').classList.remove('active');
        showAlert('Paper updated.', 'success');
        await loadFolders();
        await Promise.all([loadAllPapers(), loadRecentPapers()]);
    } catch (err) { showAlert(err.message, 'error'); }
}

// ---------- Students ----------
function studentsTable(list) {
    if (!list.length) return '<p class="empty-state" style="padding:1rem">No students found</p>';
    return `<table><thead><tr><th>Full name</th><th>Email</th><th>Roll number</th><th>Course</th><th>Registered</th><th>Status</th><th></th></tr></thead><tbody>
        ${list.map(s => `<tr>
            <td data-label="Full name">${esc(s.fullName)}</td><td data-label="Email">${esc(s.email)}</td><td data-label="Roll number">${esc(s.rollNo)}</td><td data-label="Course">${esc(s.course)}</td>
            <td data-label="Registered">${fmtDate(s.registeredDate)}</td>
            <td data-label="Status"><span class="status-badge status-active">Active</span></td>
            <td><button class="btn btn-danger" onclick="deleteStudent(${s.id})">Delete</button></td></tr>`).join('')}
        </tbody></table>`;
}

async function loadAllStudents() {
    try {
        allStudentsCache = await api('/students');
        $('studentsList').innerHTML = studentsTable(allStudentsCache);
        const recent = allStudentsCache.slice(0, 5);
        $('recentStudents').innerHTML = recent.length ? recent.map(s => `
            <div class="student-item">
                <div class="student-item-info">
                    <div class="student-name">${esc(s.fullName)}</div>
                    <div class="student-email">${esc(s.course)}</div>
                </div>
                <div style="font-size:.85rem;color:#58695F">${fmtDate(s.registeredDate)}</div>
            </div>`).join('') : '<p class="empty-state">No recent registrations</p>';
    } catch (err) { $('studentsList').innerHTML = `<p class="empty-state">${esc(err.message)}</p>`; }
}

function filterStudents(e) {
    const t = e.target.value.toLowerCase();
    $('studentsList').innerHTML = studentsTable(allStudentsCache.filter(s =>
        s.email.toLowerCase().includes(t) || s.fullName.toLowerCase().includes(t) || s.course.toLowerCase().includes(t)));
}

function deleteStudent(id) {
    showConfirmModal('Delete this student? This cannot be undone.', async () => {
        try {
            await api('/students/' + id, { method: 'DELETE' });
            showAlert('Student deleted.', 'success');
            loadAllStudents(); updateAdminStats();
        } catch (err) { showAlert(err.message, 'error'); }
    });
}

// ---------- Settings ----------
async function changeAdminPassword() {
    const newPassword = $('adminPassword').value;
    if (!newPassword) { showAlert('Enter a new password.', 'error'); return; }
    if (newPassword.length < 6) { showAlert('Password must be at least 6 characters long.', 'error'); return; }
    try {
        await api('/auth/admin/password', { method: 'PUT', body: { newPassword } });
        showAlert('Password changed.', 'success');
        $('adminPassword').value = '';
    } catch (err) { showAlert(err.message, 'error'); }
}

// ---------- Wiring ----------
function setupAdminListeners() {
    $('uploadForm').addEventListener('submit', handlePaperUpload);
    document.querySelectorAll('input[name="uploadMode"]').forEach(r => r.addEventListener('change', toggleUploadMode));
    $('uploadDepartment').addEventListener('change', refreshUploadFolders);

    $('libDepartment').addEventListener('change', () => { currentFolder = ''; renderFolderBar(); loadAllPapers(); });
    $('libSearch').addEventListener('keyup', debounce(loadAllPapers, 300));
    $('newFolderBtn').addEventListener('click', openFolderModal);

    $('folderForm').addEventListener('submit', saveFolder);
    $('editPaperForm').addEventListener('submit', saveEditedPaper);
    $('editDepartment').addEventListener('change', () => fillEditFolders($('editDepartment').value, ''));
    $('departmentForm').addEventListener('submit', addDepartment);
    $('searchStudent').addEventListener('keyup', debounce(filterStudents, 300));

    document.querySelectorAll('.modal .close').forEach(c =>
        c.addEventListener('click', () => c.closest('.modal').classList.remove('active')));
    toggleUploadMode();
}
