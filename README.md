# 📚 Exam Paper Management System

A complete web-based Exam Paper Management System built with HTML, CSS, and JavaScript. This system allows admins to manage exam papers and students to access them.

## 🎯 Features

### Admin Portal
- ✅ **Secure Login** - One admin with username/password authentication
- ✅ **Dashboard** - View statistics and recent activities
- ✅ **Paper Management** - Upload, edit, and delete exam papers
- ✅ **Student Management** - View all registered students
- ✅ **Settings** - Change admin password and view system info
- ✅ **Email Tracking** - Monitor sent emails to students
- ✅ **Real-time Updates** - Auto-refresh dashboard statistics

### Student Portal
- ✅ **Registration** - Easy sign-up process
- ✅ **Login** - Secure student authentication
- ✅ **Dashboard** - View available papers and statistics
- ✅ **Paper Access** - Browse and download exam papers by subject
- ✅ **Download History** - Track previously downloaded papers
- ✅ **Search & Filter** - Find papers by name or subject
- ✅ **Profile Management** - View profile and change password
- ✅ **Welcome Emails** - Automatic email notification upon registration

## 📁 Project Structure

```
exam-paper-system/
├── index.html                 # Landing page with statistics
├── admin/
│   ├── login.html            # Admin login page
│   ├── dashboard.html        # Admin dashboard (main panel)
│   └── admin-script.js       # Admin functionality
├── student/
│   ├── register.html         # Student registration page
│   ├── login.html            # Student login page
│   ├── dashboard.html        # Student dashboard (main panel)
│   └── student-script.js     # Student functionality
├── css/
│   ├── style.css             # Global styles & responsive design
│   ├── admin-style.css       # Admin-specific styles
│   └── student-style.css     # Student-specific styles
├── js/
│   ├── utils.js              # Utility functions (alerts, modals, etc.)
│   ├── email.js              # Email functionality & templates
│   ├── admin-script.js       # Admin dashboard logic
│   └── student-script.js     # Student dashboard logic
├── assets/                   # Images and media files
└── README.md                 # This file
```

## 🚀 Getting Started

### 1. **Open the Application**
- Simply open `index.html` in your web browser
- No server or installation required!

### 2. **Admin Portal**
- **URL**: Click "Admin Portal" on the home page
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123`
- After login, you'll see the admin dashboard

### 3. **Student Portal**
- **Register**: Click "Student Portal" → "Register here"
  - Fill in all required fields
  - You'll receive a welcome email notification
- **Login**: Use your registered email and password
- After login, access available exam papers

## 💾 Data Storage

The application uses **localStorage** for data persistence:
- **Admin Credentials**: `admin` (JSON object)
- **Students**: `students` (Array of student objects)
- **Exam Papers**: `examPapers` (Array of paper objects)
- **Student Downloads**: `studentDownloads` (Array of download records)
- **Sent Emails**: `sentEmails` (Array of email records)

**Note**: Data persists in the browser until manually cleared. To reset data, open Developer Tools → Application → Local Storage → Clear All.

## 📱 Responsive Design

The application is fully responsive and works on:
- ✅ Desktop browsers (1920px and above)
- ✅ Tablets (768px - 1024px)
- ✅ Mobile phones (480px - 767px)

CSS breakpoints are optimized for all screen sizes with proper touch-friendly interfaces.

## 🎨 User Interfaces

### Admin Dashboard
- **Sidebar Navigation** - Quick access to all features
- **Statistics Cards** - Real-time metrics
- **Paper Management** - Upload and manage exam papers
- **Student List** - View all registered students
- **Settings Panel** - Admin preferences

### Student Dashboard
- **Welcome Section** - Personalized greeting
- **Statistics** - Papers available, downloads, subjects
- **Paper Browse** - Grid view of available papers
- **Search & Filter** - Find papers by subject or name
- **Download Management** - Track and re-download papers
- **Profile Section** - Personal information and password change

## 🔒 Security Features

- ✅ Admin login protection (single account)
- ✅ Student authentication required
- ✅ Password minimum length validation (6 characters)
- ✅ Password confirmation on registration
- ✅ Secure logout functionality
- ✅ Session management

## 📧 Email Features

### Welcome Email
- Automatically sent when students register
- Includes student details and platform information
- HTML formatted with professional styling

### Paper Notification
- Can be triggered when new papers are uploaded
- Notifies registered students about new resources

**Note**: Email sending is mocked using localStorage. For real email functionality, integrate with:
- EmailJS API
- SendGrid API
- Your backend email service

## 📊 Admin Panel Features

### Dashboard Section
- Total registered students
- Total uploaded papers
- Email statistics
- Recent registrations
- Recent paper uploads

### Manage Papers Section
- Upload new exam papers with:
  - Paper name
  - Subject category
  - Semester/Term information
  - Description
  - File attachment
- View all uploaded papers
- Edit paper details
- Delete papers with confirmation

### View Students Section
- List of all registered students
- Student details: name, email, roll number, course
- Registration date
- Search functionality
- Filter and sort options

### Settings Section
- Change admin password
- View system statistics
- System information

## 👨‍🎓 Student Dashboard Features

### Dashboard Section
- Welcome message with student name
- Quick statistics
- Latest uploaded papers
- Personal registration information

### Available Papers Section
- Browse all exam papers
- Search by paper name
- Filter by subject
- View paper details
- Download papers

### My Downloads Section
- View download history
- Re-download previously downloaded papers
- Download date and time tracking

### Profile Section
- View personal information
- Download statistics
- Change password
- Edit profile settings

## 🛠️ How to Use

### For Admins

1. **Login**: Use default credentials (admin/admin123)
2. **Upload Papers**:
   - Go to "Manage Papers"
   - Fill in paper details
   - Select file and click "Upload Paper"
3. **View Students**: Check "View Students" to see all registrations
4. **Send Notifications**: Download history shows email activities
5. **Manage System**: Use Settings to change password

### For Students

1. **Register**: Fill in all details and submit
2. **Login**: Use registered email and password
3. **Browse Papers**: Use search and filters to find papers
4. **Download**: Click download button to get papers
5. **Manage Profile**: Update password and view information

## 🎯 Key Functionalities

### Authentication
- Admin: Single admin login (default: admin/admin123)
- Students: Registration and login system
- Password validation and confirmation

### Paper Management
- Upload with description and metadata
- Organize by subject and semester
- Delete with confirmation
- Real-time list updates

### Student Management
- Registration tracking
- Complete student profile
- Download history
- Activity monitoring

### Email System
- Welcome emails on registration
- Email record tracking
- Professional HTML templates
- Notification system

## 🔧 Customization

### Change Admin Credentials
1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find the `admin` entry
4. Change username/password
5. Refresh the page

### Add New Subjects
Edit `student/register.html` and `student/dashboard.html`:
```html
<option value="Your Subject">Your Subject</option>
```

### Modify Color Scheme
Edit `css/style.css` - Change CSS variables:
```css
--primary-color: #6366f1;
--secondary-color: #8b5cf6;
--success-color: #10b981;
```

### Disable Email Functionality
The system works without real email. For production, integrate EmailJS:
```javascript
// In email.js, replace mock implementation with:
// emailjs.send(serviceID, templateID, templateParams)
```

## 📋 Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage support
- No internet connection required (all data local)

## 🐛 Troubleshooting

### Data Not Persisting
- Check if localStorage is enabled in browser settings
- Clear browser cache and reload

### Styles Not Loading
- Check CSS files are in correct path
- Hard refresh browser (Ctrl+F5)

### JavaScript Errors
- Open Developer Console (F12)
- Check for network errors
- Verify file paths are correct

## 📝 Notes

- All data is stored locally in the browser
- Each browser/device has its own separate data
- Clearing browser data will erase all application data
- Email sending is mocked (use EmailJS for production)
- File uploads are simulated (implement backend for real files)

## 🚀 Future Enhancements

- Backend API integration
- Real file storage (AWS S3, Google Drive)
- Real email sending (SendGrid, Gmail API)
- Database integration (MongoDB, Firebase)
- User roles (different student types)
- Assignment submission system
- Grades and marks tracking
- Discussion forums
- Mobile app version

## 📄 License

This project is open-source and free to use for educational purposes.

## 👨‍💻 Developer Notes

- Built with vanilla HTML, CSS, and JavaScript
- No external dependencies or frameworks
- Fully responsive and mobile-friendly
- Progressive enhancement approach
- Clean, modular code structure
- Easy to extend and customize

## ❓ FAQ

**Q: Can I use this in production?**
A: Yes, but integrate with backend services for file storage and email.

**Q: How do I add more students?**
A: Students register themselves through the registration page.

**Q: Can I export student data?**
A: Yes, you can export from browser DevTools → Local Storage.

**Q: Is this secure for real exams?**
A: Add additional security measures for production use.

**Q: Can multiple students register?**
A: Yes, unlimited students can register and access papers.

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Status**: Ready to Use ✅
