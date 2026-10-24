# 🚀 Quick Start Guide

## How to Run

### Step 1: Open the Application
1. Navigate to: `c:\Users\panch\OneDrive\Desktop\New folder (4)\exam-paper-system`
2. **Double-click** `index.html` to open in your default browser
3. Or right-click → "Open with" → Choose your preferred browser (Chrome recommended)

### Step 2: Access Admin Portal
1. Click the **"🔐 Admin Portal"** button on the home page
2. **Default Login Credentials**:
   - Username: `admin`
   - Password: `admin123`
3. Click "Login" to enter the Admin Dashboard

### Step 3: Access Student Portal
1. Click the **"👤 Student Portal"** button on the home page
2. Click **"Register here"** to create a new student account
3. Fill in the registration form:
   - Full Name
   - Email Address
   - Roll Number
   - Course/Class
   - Password (min 6 characters)
   - Confirm Password
4. Click "Register" - Welcome email will be sent!
5. Login with your email and password

---

## 📊 Admin Dashboard Tour

### Login Page Features
- Demo credentials are displayed
- Back to home button
- Responsive design for mobile

### Dashboard Section
Shows:
- Total registered students
- Total exam papers uploaded
- Total downloads/emails sent
- Active user count
- Recent student registrations
- Recently uploaded papers

### Manage Papers Section
**Upload New Papers**:
- Enter Paper Name (e.g., "Mathematics Final 2024")
- Select Subject (Math, Physics, Chemistry, etc.)
- Enter Semester/Term info
- Write Description
- Upload File (PDF, DOC, DOCX)
- Click "Upload Paper"

**View All Papers**:
- See all uploaded papers in card format
- Edit button (✏️) - Can modify paper details
- Delete button (🗑️) - Remove papers with confirmation

### View Students Section
- Search for students by email or name
- View complete student list in table format:
  - Full Name
  - Email Address
  - Roll Number
  - Course
  - Registration Date
  - Status (Active/Inactive)

### Settings Section
- Change admin password
- View system statistics:
  - Total students registered
  - Total papers uploaded
  - Last system update time

---

## 👨‍🎓 Student Dashboard Tour

### Login Page Features
- Enter registered email
- Enter password
- Link to registration page
- Back to home button

### Dashboard Section
Shows:
- Welcome message with student name
- Statistics:
  - Available exam papers
  - Your downloads count
  - Number of subjects
  - Total registered students
- Latest papers added to system
- Your registration information

### Available Papers Section
**Search & Filter**:
- Search papers by name
- Filter by subject (dropdown)
- View results in card format

**Download Papers**:
- Click "⬇️ Download" button
- Paper will be saved locally
- Download is recorded in history
- Click "👁️ View" for paper details

**Paper Card Shows**:
- Paper icon (📄)
- Paper name
- Subject (color-coded)
- Semester/term info
- Description
- Download and View buttons

### My Downloads Section
- View all downloaded papers
- See download date and time
- Re-download previous papers
- Track download history

### Profile Section
- View personal information
- See your profile avatar
- Email address
- Roll number
- Course/class
- Registration date
- Total downloads count
- **Change Password** button:
  - Enter old password
  - Enter new password (min 6 chars)
  - Confirm new password
  - Click "Update Password"

---

## 🎯 Key Features Explained

### 📧 Email System
**What Happens**:
- When a student registers → Welcome email is sent
- Email is sent to the registered email address
- Email contains registration confirmation and platform info
- Admin can see all sent emails

**Note**: Currently emails are simulated in localStorage. For production, integrate:
- EmailJS (free service)
- SendGrid (paid service)
- Backend email API

### 💾 Data Storage
**Where is Data Stored?**
- Browser's localStorage (no server needed)
- All data is local to your computer/browser
- Data persists until browser cache is cleared

**Stored Data**:
- Admin credentials
- Student registrations
- Exam papers
- Download history
- Email records

### 🔐 Security
- Admin login required for admin functions
- Student login required to access papers
- Password confirmation on registration
- Password must be at least 6 characters
- Logout functionality available

---

## 📝 Demo Workflow

### Complete Workflow Example

**1. Admin Setup**:
```
Home → Admin Portal → Login (admin/admin123)
  → Manage Papers → Upload Paper
  → Enter details → Upload
  → See papers in dashboard
  → View Students tab → See registrations
```

**2. Student Registration**:
```
Home → Student Portal → Register
  → Enter all details → Register
  → Receive welcome email (notification)
  → Redirected to login page
```

**3. Student Access Papers**:
```
Student Login → Dashboard
  → Available Papers tab
  → Search/Filter papers
  → Click Download
  → Paper downloaded successfully
  → Check My Downloads
  → See download history
```

---

## ⚙️ System Requirements

✅ **Minimum Requirements**:
- Modern Web Browser:
  - Chrome (recommended)
  - Firefox
  - Safari
  - Edge
- JavaScript enabled
- localStorage enabled (default)
- No internet connection needed

### Recommended Settings
- Screen resolution: 1024x768 or higher
- JavaScript: Enabled
- Cookies: Can be disabled (not needed)
- localStorage: Enabled

---

## 🐛 Common Issues & Solutions

### Issue: Files not loading
**Solution**: 
- Make sure all files are in the correct folder structure
- Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
- Check file paths match folder structure

### Issue: Data not saving
**Solution**:
- Make sure JavaScript is enabled
- Make sure localStorage is enabled
- Check browser storage quota
- Try in a different browser

### Issue: Email not showing
**Solution**:
- Check browser console for errors (F12)
- Refresh page
- Email system is mocked (check localStorage records)

### Issue: Can't login
**Solution**:
- Admin: Use "admin" / "admin123"
- Student: Use registered email and password
- Check for typos
- Clear browser cache

### Issue: Responsive design not working
**Solution**:
- Check viewport meta tag in HTML
- Hard refresh browser
- Try different browser window size

---

## 🎨 Customization Tips

### Change Admin Credentials
**Permanent Change**:
1. Open `admin/login.html`
2. Find the line: `localStorage.setItem('admin', JSON.stringify({...}))`
3. Edit username and password
4. Save file

### Add More Subjects
Edit these files and add new options:
- `admin/dashboard.html` - Line with subject select
- `student/dashboard.html` - Line with subject filter

### Change Colors
Edit `css/style.css`:
```css
:root {
    --primary-color: #your-color-code;
    --success-color: #your-color-code;
    /* Change other colors */
}
```

### Add More Features
- Study each JavaScript file
- Follow the existing patterns
- Add HTML elements
- Style in CSS files
- Implement logic in JS

---

## 📱 Mobile Usage

The application is fully responsive!

### Mobile Features
- ✅ Touch-friendly buttons
- ✅ Readable on small screens
- ✅ Optimized sidebar navigation
- ✅ Proper spacing and sizing
- ✅ Works on tablets and phones

### Tested Sizes
- ✅ iPhone (375px)
- ✅ iPad (768px)
- ✅ Desktop (1920px)

---

## 🔄 Data Flow Diagram

```
┌─────────────────────────────────────────────┐
│         INDEX.HTML (Landing Page)           │
└─────────────┬───────────────────────────────┘
              │
        ┌─────┴─────┐
        │           │
   ┌────▼────┐  ┌───▼─────┐
   │ ADMIN    │  │ STUDENT  │
   └────┬────┘  └───┬──────┘
        │           │
    ┌───▼───┐   ┌───▼──────┐
    │Login  │   │Register  │
    └───┬───┘   └───┬──────┘
        │           │
    ┌───▼──────────────────┐
    │ localStorage saves   │
    ├──────────────────────┤
    │ - Admin credentials  │
    │ - Students data      │
    │ - Exam Papers        │
    │ - Downloads          │
    │ - Emails             │
    └──────────────────────┘
        │
    ┌───▼──────────────┐
    │ Dashboard Views  │
    ├──────────────────┤
    │ Admin/Student    │
    │ interfaces       │
    └──────────────────┘
```

---

## 📞 Support

**For questions or issues**:
1. Check this guide first
2. Check FILE_STRUCTURE.md for file details
3. Check README.md for full documentation
4. Open browser console (F12) for error messages

---

## ✅ Testing Checklist

Before deploying, verify:
- [ ] Admin login works
- [ ] Student registration works
- [ ] Student login works
- [ ] Paper upload works
- [ ] Paper download works
- [ ] Search/filter works
- [ ] Password change works
- [ ] Logout works
- [ ] Mobile view responsive
- [ ] All links functional

---

## 🎉 You're Ready!

Everything is set up and ready to use. Just open `index.html` and start using the system!

**Have fun! 🚀**
