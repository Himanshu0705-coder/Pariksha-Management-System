/* ============================
   UTILITY FUNCTIONS
   ============================ */

// Show Alert Modal
function showAlert(message, type = 'info') {
    const modal = document.getElementById('alertModal');
    const messageEl = document.getElementById('alertMessage');
    
    if (!modal) return; // Skip if modal doesn't exist on page
    
    messageEl.textContent = message;
    modal.classList.add('active');
    
    const closeBtn = modal.querySelector('.close');
    const alertBtn = document.getElementById('alertBtn');
    
    const closeModal = () => {
        modal.classList.remove('active');
    };
    
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (alertBtn) alertBtn.addEventListener('click', closeModal);
    
    // Close on outside click
    window.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// Get Initials from Name
function getInitials(name) {
    return name
        .split(' ')
        .map(word => word.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
}

// Format Date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format Bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

// Generate Unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save File (Mock)
function downloadFile(filename, content) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

// Check Login Status (JWT token + role)
function checkLoginStatus(type) {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== type) {
        window.location.href = type === 'admin' ? '/admin/login.html' : '/student/login.html';
        return false;
    }
    return true;
}

// Logout
function logout(type) {
    ['token', 'role', 'user'].forEach(k => localStorage.removeItem(k));
    window.location.href = type === 'admin' ? '/admin/login.html' : '/index.html';
}

// Section Navigation
function setupSectionNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = item.dataset.section;
            
            if (!sectionName) return;
            
            // Remove active class from all sections and nav items
            document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
            navItems.forEach(ni => ni.classList.remove('active'));
            
            // Add active class to clicked section and nav item
            const section = document.getElementById(sectionName);
            if (section) {
                section.classList.add('active');
                item.classList.add('active');
                
                const titleEl = document.getElementById('section-title');
                if (titleEl) {
                    titleEl.textContent = item.textContent.trim();
                }
            }
        });
    });
}

// Modal Confirm
function showConfirmModal(message, onConfirm, onCancel) {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;
    
    document.getElementById('confirmMessage').textContent = message;
    modal.classList.add('active');
    
    const yesBtn = document.getElementById('confirmYes');
    const noBtn = document.getElementById('confirmNo');
    const closeBtn = modal.querySelector('.close');
    
    const close = () => {
        modal.classList.remove('active');
    };
    
    yesBtn.onclick = () => {
        close();
        onConfirm();
    };
    
    noBtn.onclick = () => {
        close();
        if (onCancel) onCancel();
    };
    
    if (closeBtn) {
        closeBtn.onclick = () => {
            close();
            if (onCancel) onCancel();
        };
    }
}

// Debounce Function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Common Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Setup navigation
    setupSectionNavigation();
    
    // Setup logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            logout(localStorage.getItem('role') === 'admin' ? 'admin' : 'student');
        });
    }
});
