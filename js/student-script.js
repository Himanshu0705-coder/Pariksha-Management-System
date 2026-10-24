/* ============================
   STUDENT DASHBOARD SCRIPT (PostgreSQL API)
   Student sirf apne course/department ke papers dekhta hai
   ============================ */

let allPapersCache = [];
let folders = [];
let currentFolder = '';      // '' = all, 'none', or folder id

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '');
const fmtDateTime = (d) => (d ? new Date(d).toLocaleString() : '');

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.innerHTML.includes('student-layout')) {
        if (!checkLoginStatus('student')) return;
        initializeStudentDashboard();
        setupStudentListeners();
    }
});

async function initializeStudentDashboard() {
    const student = Auth.getUser();
    updateStudentHeader(student);
    updateStudentProfile(student);
    const note = document.getElementById('courseNote');
    if (note && student) note.textContent = `Showing papers for ${student.course}. Papers from other courses are not shown.`;

    await Promise.all([updateStudentStats(), loadAllPapers(), loadFolders(), loadStudentDownloads()]);
}

function updateStudentHeader(student) {
    if (!student) return;
    const avatar = getInitials(student.fullName);
    document.querySelectorAll('#studentName').forEach(el => el.textContent = student.fullName);
    document.querySelectorAll('#studentAvatar').forEach(el => el.textContent = avatar);
    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) welcomeMsg.textContent = `Welcome, ${student.fullName}`;
}

function updateStudentProfile(student) {
    if (!student) return;
    const regDate = fmtDate(student.registeredDate);
    document.getElementById('profileName').textContent = student.fullName;
    document.getElementById('profileEmail').textContent = student.email;
    document.getElementById('profileRoll').textContent = student.rollNo;
    document.getElementById('profileCourse').textContent = student.course;
    document.getElementById('profileRegDate').textContent = regDate;
    document.getElementById('profileAvatar').textContent = getInitials(student.fullName);
    document.getElementById('regDate').textContent = regDate;
    document.getElementById('regCourse').textContent = student.course;
    document.getElementById('regRoll').textContent = student.rollNo;
}

function setupStudentListeners() {
    const searchPaper = document.getElementById('searchPaper');
    if (searchPaper) searchPaper.addEventListener('keyup', debounce(filterPapers, 300));
    const filterSubject = document.getElementById('filterSubject');
    if (filterSubject) filterSubject.addEventListener('change', filterPapers);
    const passwordForm = document.getElementById('passwordForm');
    if (passwordForm) passwordForm.addEventListener('submit', handlePasswordChange);
    document.querySelectorAll('.modal .close').forEach(c =>
        c.addEventListener('click', () => c.closest('.modal').classList.remove('active')));
}

async function updateStudentStats() {
    try {
        const s = await api('/student/stats');
        document.getElementById('stat-available').textContent = s.available;
        document.getElementById('stat-downloads').textContent = s.downloads;
        document.getElementById('stat-subjects').textContent = s.subjects;
        document.getElementById('stat-students').textContent = s.students;
        document.getElementById('profileDownloads').textContent = s.downloads;
    } catch (err) { console.error(err); }
}

// ---------- Folders ----------
async function loadFolders() {
    try { folders = await api('/folders'); } catch (err) { folders = []; }
    renderFolderBar();
}

function renderFolderBar() {
    const bar = document.getElementById('folderBar');
    if (!bar) return;
    const chip = (value, label, count) =>
        `<button class="chip ${currentFolder === value ? 'active' : ''}" onclick="selectFolder('${value}')">${esc(label)}${count !== undefined ? `<small>${count}</small>` : ''}</button>`;
    bar.innerHTML = chip('', 'All papers') + chip('none', 'Not in a folder') +
        folders.map(f => chip(String(f.id), f.name, f.paperCount)).join('');
}

function selectFolder(value) {
    currentFolder = value;
    renderFolderBar();
    filterPapers();
}

// ---------- Papers ----------
function renderLatestPapers(papers) {
    const container = document.getElementById('latestPapers');
    const latest = papers.slice(0, 6);
    if (!latest.length) { container.innerHTML = '<p class="empty-state">No papers for your course yet. Check back soon.</p>'; return; }
    container.innerHTML = latest.map(p => `
        <div class="paper-item">
            <div class="paper-item-info">
                <div class="paper-name">${esc(p.name)}</div>
                <div class="paper-subject">${esc(p.subject)} | ${esc(p.semester)}</div>
            </div>
            <div style="font-size:.85rem;color:#58695F">${fmtDate(p.uploadedAt)}</div>
        </div>`).join('');
}

function renderPapers(papers) {
    const container = document.getElementById('papersList');
    if (!papers.length) { container.innerHTML = '<p class="empty-state">No papers found</p>'; return; }
    container.innerHTML = papers.map(p => `
        <div class="paper-card">
            <div class="paper-icon">📄</div>
            <div class="paper-title">${esc(p.name)}</div>
            <span class="paper-subject">${esc(p.subject)}</span>
            <div class="paper-semester">${esc(p.semester)}${p.folderName ? ' | Folder: ' + esc(p.folderName) : ''}</div>
            <div class="paper-description">${esc(p.description) || 'No description available'}</div>
            <div class="paper-footer">
                <button class="btn btn-primary" onclick="downloadPaper(${p.id})">Download</button>
                <button class="btn btn-secondary" onclick="viewPaperDetails(${p.id})">Details</button>
            </div>
        </div>`).join('');
}

async function loadAllPapers() {
    try {
        allPapersCache = await api('/papers');
        renderLatestPapers(allPapersCache);
        renderPapers(allPapersCache);
    } catch (err) {
        document.getElementById('papersList').innerHTML = `<p class="empty-state">${esc(err.message)}</p>`;
    }
}

async function downloadPaper(paperId) {
    const paper = allPapersCache.find(p => p.id === paperId);
    try {
        await downloadWithAuth(`/papers/${paperId}/download`, paper ? paper.fileName : 'paper');
        showAlert(`Downloaded "${paper ? paper.name : 'paper'}".`, 'success');
        updateStudentStats();
        loadStudentDownloads();
    } catch (err) { showAlert(err.message, 'error'); }
}

function viewPaperDetails(paperId) {
    const p = allPapersCache.find(x => x.id === paperId);
    if (!p) return;
    showAlert(
        `${p.name}\nSubject: ${p.subject}\nSemester: ${p.semester}\nFolder: ${p.folderName || 'None'}\n` +
        `${p.description || 'No description'}\nUploaded: ${fmtDateTime(p.uploadedAt)}\nSize: ${formatBytes(p.fileSize)}`, 'info');
}

async function filterPapers() {
    const q = new URLSearchParams();
    const search = document.getElementById('searchPaper')?.value.trim();
    const subject = document.getElementById('filterSubject')?.value;
    if (search) q.set('search', search);
    if (subject) q.set('subject', subject);
    if (currentFolder) q.set('folder', currentFolder);
    try { renderPapers(await api('/papers?' + q.toString())); }
    catch (err) { showAlert(err.message, 'error'); }
}

async function loadStudentDownloads() {
    const container = document.getElementById('downloadsList');
    try {
        const downloads = await api('/student/downloads');
        if (!downloads.length) { container.innerHTML = '<p class="empty-state">You have not downloaded any papers yet.</p>'; return; }
        container.innerHTML = downloads.map(d => `
            <div class="download-item">
                <div class="download-info">
                    <div class="download-name">${esc(d.paperName)}</div>
                    <div class="download-date">Downloaded on ${fmtDateTime(d.downloadedAt)}</div>
                </div>
                <div class="download-actions">
                    <button class="btn btn-secondary" onclick="downloadPaper(${d.paperId})">Download again</button>
                </div>
            </div>`).join('');
    } catch (err) { container.innerHTML = `<p class="empty-state">${esc(err.message)}</p>`; }
}

function changePassword() {
    document.getElementById('passwordModal')?.classList.add('active');
}

async function handlePasswordChange(e) {
    e.preventDefault();
    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    if (newPassword !== confirmNewPassword) { showAlert('New passwords do not match.', 'error'); return; }
    if (newPassword.length < 6) { showAlert('New password must be at least 6 characters long.', 'error'); return; }
    try {
        await api('/auth/student/password', { method: 'PUT', body: { oldPassword, newPassword } });
        showAlert('Password changed.', 'success');
        document.getElementById('passwordModal').classList.remove('active');
        document.getElementById('passwordForm').reset();
    } catch (err) { showAlert(err.message, 'error'); }
}
