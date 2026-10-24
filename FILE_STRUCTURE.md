# File Structure Documentation

## Complete Directory Tree

```
exam-paper-system/
│
├── 📄 index.html
│   └── Landing page with statistics and quick access buttons
│
├── 📁 admin/
│   ├── login.html          (Admin authentication page)
│   ├── dashboard.html      (Admin main interface)
│   └── admin-script.js     (Admin functionality)
│
├── 📁 student/
│   ├── register.html       (Student registration form)
│   ├── login.html          (Student login page)
│   ├── dashboard.html      (Student main interface)
│   └── student-script.js   (Student functionality)
│
├── 📁 css/
│   ├── style.css           (Global styles + responsive)
│   ├── admin-style.css     (Admin dashboard styling)
│   └── student-style.css   (Student dashboard styling)
│
├── 📁 js/
│   ├── utils.js            (Shared utilities)
│   ├── email.js            (Email functionality)
│   ├── admin-script.js     (Admin logic)
│   └── student-script.js   (Student logic)
│
├── 📁 assets/
│   └── (Images, icons, media files)
│
└── 📄 README.md            (Documentation)
```

## File Descriptions

### HTML Files

#### `index.html`
- **Purpose**: Landing page/Home page
- **Features**: 
  - Statistics display (registered students, available papers, admins)
  - Quick access buttons to Admin/Student portals
  - Feature highlights
  - Responsive grid layout

#### `admin/login.html`
- **Purpose**: Admin authentication
- **Features**:
  - Login form with username and password
  - Demo credentials display
  - Redirect to dashboard on successful login
  - Back to home button

#### `admin/dashboard.html`
- **Purpose**: Main admin control panel
- **Sections**:
  - **Dashboard**: Statistics and recent activities
  - **Manage Papers**: Upload, view, edit, delete papers
  - **View Students**: Table of registered students
  - **Settings**: Change password and system info
- **Components**:
  - Sidebar navigation
  - Header with admin info
  - Statistics cards
  - Data tables
  - Forms for paper upload

#### `student/register.html`
- **Purpose**: Student registration form
- **Fields**:
  - Full Name
  - Email Address
  - Roll Number
  - Course/Class selection
  - Password creation
  - Terms acceptance
- **Features**:
  - Email validation
  - Password confirmation
  - Welcome email sending
  - Link to login page

#### `student/login.html`
- **Purpose**: Student authentication
- **Features**:
  - Email and password login
  - Link to registration page
  - Error handling
  - Redirect to dashboard

#### `student/dashboard.html`
- **Purpose**: Main student interface
- **Sections**:
  - **Dashboard**: Statistics and latest papers
  - **Available Papers**: Browse and download papers
  - **My Downloads**: Download history
  - **My Profile**: Personal information
- **Components**:
  - Sidebar navigation
  - Search and filter functionality
  - Paper grid display
  - Download management

### CSS Files

#### `css/style.css` (Main Stylesheet)
- **Sections**:
  - Global Reset & Variables
  - Typography
  - Buttons (multiple variants)
  - Forms & Input Elements
  - Cards & Containers
  - Landing Page Styles
  - Auth Pages
  - Modals
  - Animations
  - Responsive Design (3 breakpoints)
- **Key Features**:
  - CSS Variables for theming
  - Mobile-first approach
  - Flexbox & Grid layouts
  - Smooth animations
  - Accessibility features

#### `css/admin-style.css` (Admin Dashboard)
- **Sections**:
  - Admin Layout & Sidebar
  - Navigation Items
  - Main Content Area
  - Statistics Grid
  - Dashboard Cards
  - Paper Management
  - Students Table
  - Settings Form
  - Responsive variants
- **Layout**: Fixed sidebar (250px) + main content
- **Colors**: Dark sidebar with purple accent

#### `css/student-style.css` (Student Dashboard)
- **Sections**:
  - Student Layout & Sidebar
  - Welcome Card
  - Papers Display Grid
  - Downloads List
  - Profile Section
  - Quick Statistics
  - Responsive variants
- **Layout**: Fixed sidebar (250px) + main content
- **Colors**: Green accent (#10b981) theme

### JavaScript Files

#### `js/utils.js` (Shared Utilities)
```javascript
Functions:
- showAlert(message, type)      // Display alert modal
- getInitials(name)             // Get name initials
- formatDate(dateString)        // Format dates
- formatBytes(bytes)            // Format file sizes
- generateId()                  // Create unique IDs
- downloadFile()                // Trigger downloads
- checkLoginStatus(type)        // Verify authentication
- logout(type)                  // Handle logout
- setupSectionNavigation()      // Setup nav listeners
- showConfirmModal()            // Confirmation dialogs
- debounce(func, wait)          // Debounce function
```

#### `js/email.js` (Email System)
```javascript
Functions:
- sendWelcomeEmail()            // Send registration email
- sendNotificationEmail()       // Send updates to students
- getWelcomeEmailTemplate()     // HTML email template
- getPaperNotificationTemplate() // Paper notification template
- displaySentEmails()           // Show email history
- getEmailStats()               // Email statistics
```

#### `js/admin-script.js` (Admin Logic)
```javascript
Functions:
- initializeAdminDashboard()    // Setup dashboard
- updateAdminStats()            // Refresh statistics
- loadRecentStudents()          // Display new registrations
- loadRecentPapers()            // Show latest uploads
- setupAdminListeners()         // Event listeners
- handlePaperUpload()           // Paper upload logic
- loadAllPapers()               // Display all papers
- deletePaper(paperId)          // Delete paper
- loadAllStudents()             // List all students
- filterStudents(searchTerm)    // Search students
- changeAdminPassword()         // Update password
```

#### `js/student-script.js` (Student Logic)
```javascript
Functions:
- initializeStudentDashboard()  // Setup dashboard
- updateStudentHeader()         // Update user info
- updateStudentProfile()        // Load profile data
- setupStudentListeners()       // Event listeners
- updateStudentStats()          // Refresh statistics
- loadLatestPapers()            // Show new papers
- loadAllPapers()               // Display papers list
- downloadPaper()               // Download functionality
- viewPaperDetails()            // Show paper info
- filterPapers()                // Search/filter papers
- loadStudentDownloads()        // Show download history
- changePassword()              // Password change
- handlePasswordChange()        // Update password
```

## Data Structure

### localStorage Keys

#### `admin`
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### `students` (Array)
```json
[
  {
    "id": 1234567890,
    "fullName": "John Doe",
    "email": "john@example.com",
    "rollNo": "A001",
    "course": "BSC Computer Science",
    "password": "password123",
    "registeredDate": "12/15/2024",
    "registeredTime": "3:45:23 PM"
  }
]
```

#### `examPapers` (Array)
```json
[
  {
    "id": "uniqueId123",
    "name": "Mathematics Final 2024",
    "subject": "Mathematics",
    "semester": "Sem 1 2024",
    "description": "Final exam paper for mathematics",
    "fileName": "math_exam.pdf",
    "fileSize": 2048576,
    "uploadDate": "12/15/2024",
    "uploadTime": "2:30:15 PM"
  }
]
```

#### `studentDownloads` (Array)
```json
[
  {
    "id": "uniqueId456",
    "studentId": 1234567890,
    "paperId": "uniqueId123",
    "paperName": "Mathematics Final 2024",
    "downloadDate": "12/16/2024",
    "downloadTime": "10:45:30 AM"
  }
]
```

#### `sentEmails` (Array)
```json
[
  {
    "id": "emailId789",
    "to": "john@example.com",
    "studentName": "John Doe",
    "subject": "Welcome to Exam System",
    "type": "welcome",
    "sentDate": "12/15/2024",
    "sentTime": "3:45:45 PM",
    "status": "sent"
  }
]
```

## Responsive Breakpoints

### Mobile (max-width: 480px)
- Single column layouts
- Sidebar becomes dropdown
- Touch-friendly buttons
- Stack all elements vertically

### Tablet (481px - 768px)
- 2-column layouts for papers
- Flexible sidebar
- Optimized spacing
- Better touch targets

### Desktop (769px - 1024px)
- 2-3 column layouts
- Fixed sidebar (250px)
- Full feature display
- Hover effects enabled

### Large Desktop (1025px+)
- Full multi-column layouts
- Maximum content display
- Advanced interactions
- Full animations

## Navigation Hierarchy

```
Landing Page (index.html)
├── Admin Portal
│   ├── Login (admin/login.html)
│   └── Dashboard (admin/dashboard.html)
│       ├── Dashboard
│       ├── Manage Papers
│       ├── View Students
│       └── Settings
└── Student Portal
    ├── Register (student/register.html)
    ├── Login (student/login.html)
    └── Dashboard (student/dashboard.html)
        ├── Dashboard
        ├── Available Papers
        ├── My Downloads
        └── My Profile
```

## Color Scheme

### Primary Colors
- Purple: `#6366f1` (Primary actions)
- Purple-dark: `#8b5cf6` (Hover/secondary)
- Red: `#ef4444` (Danger/delete)
- Green: `#10b981` (Success/student)
- Amber: `#f59e0b` (Warning)

### Neutral Colors
- Dark: `#1f2937` (Text)
- Light: `#f9fafb` (Background)
- Gray: `#6b7280` (Secondary text)
- Border: `#e5e7eb` (Borders)

## Typography

- **Font Family**: 'Segoe UI', Tahoma, Geneva, sans-serif
- **Headings**: 700 weight (Bold)
- **Body**: 400 weight (Regular)
- **Buttons**: 600 weight (Semibold)

## How to Extend

### Add New Admin Feature
1. Add HTML section in `admin/dashboard.html`
2. Style in `css/admin-style.css`
3. Add JavaScript logic in `js/admin-script.js`
4. Add navigation item to sidebar

### Add New Subject
Edit course/subject options in:
- `student/register.html` (course select)
- `admin/dashboard.html` (subject filter)
- `student/dashboard.html` (subject filter)

### Change Theme Colors
Edit CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* etc */
}
```

---

This structure ensures clean code organization, easy maintenance, and scalability!
