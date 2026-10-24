/* ============================
   EMAIL FUNCTIONALITY
   ============================ */

// Send Welcome Email (Mock Implementation)
// In production, integrate with EmailJS or a backend API
async function sendWelcomeEmail(studentName, studentEmail) {
    try {
        const templateParams = {
            student_name: studentName,
            student_email: studentEmail,
            login_email: studentEmail
        };

        // Attempt to send via EmailJS (if configured)
        try {
            const response = await emailjs.send(
                "service_usavslg",
                "template_9my0zp6",
                templateParams
            );
            console.log("Email sent:", response);
        } catch (err) {
            // If emailjs not available or fails, log and continue to store record locally
            console.warn('EmailJS send failed or not configured:', err);
        }

        // Save email record locally
        const emailRecord = {
            id: (typeof generateId === 'function') ? generateId() : Date.now().toString(),
            to: studentEmail,
            subject: 'Welcome to Exam Paper Management System',
            message: getWelcomeEmailTemplate(studentName, studentEmail),
            type: 'welcome',
            sentDate: new Date().toLocaleDateString(),
            sentTime: new Date().toLocaleTimeString(),
            status: 'sent'
        };

        const emails = JSON.parse(localStorage.getItem('sentEmails')) || [];
        emails.push(emailRecord);
        localStorage.setItem('sentEmails', JSON.stringify(emails));

        console.log(`Welcome email sent to ${studentEmail}`);
        return true;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
}

// Send Notification Email
async function sendNotificationEmail(studentEmail, subject, message) {
    try {
        const emailRecord = {
            id: generateId(),
            to: studentEmail,
            subject: subject,
            message: message,
            type: 'notification',
            sentDate: new Date().toLocaleDateString(),
            sentTime: new Date().toLocaleTimeString(),
            status: 'sent'
        };
        
        const emails = JSON.parse(localStorage.getItem('sentEmails')) || [];
        emails.push(emailRecord);
        localStorage.setItem('sentEmails', JSON.stringify(emails));
        
        return true;
    } catch (error) {
        console.error('Error sending notification:', error);
        return false;
    }
}

// Get Email Template
function getWelcomeEmailTemplate(studentName, studentEmail) {
    return `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px;">
                    <h1 style="color: #6366f1; margin: 0;">📚 Exam Paper Management System</h1>
                    <p style="color: #6b7280; margin: 10px 0 0 0;">Welcome to Our Platform!</p>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
                    <h2 style="color: #1f2937; margin-bottom: 15px;">Hello ${studentName}! 👋</h2>
                    
                    <p>Welcome to the <strong>Exam Paper Management System</strong>!</p>
                    
                    <p>We're excited to have you join our platform. Your account has been successfully created with the following details:</p>
                    
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p><strong>Email:</strong> ${studentEmail}</p>
                        <p style="margin-bottom: 0;"><strong>Status:</strong> <span style="color: #10b981; font-weight: bold;">Active</span></p>
                    </div>
                    
                    <h3 style="color: #1f2937; margin-top: 25px;">What you can do now:</h3>
                    <ul style="color: #4b5563;">
                        <li>✅ Access all available exam papers</li>
                        <li>✅ Download papers by subject and semester</li>
                        <li>✅ View your download history</li>
                        <li>✅ Manage your profile settings</li>
                    </ul>
                    
                    <p style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                        If you have any questions or need assistance, please don't hesitate to reach out to our support team.
                    </p>
                    
                    <p style="color: #6b7280; font-size: 0.9em; margin-top: 20px;">
                        Best regards,<br>
                        <strong>Exam Paper Management System Team</strong>
                    </p>
                </div>
                
                <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.85em;">
                    <p>This is an automated email. Please do not reply to this message.</p>
                    <p>&copy; 2024 Exam Paper Management System. All rights reserved.</p>
                </div>
            </div>
        </body>
    </html>
    `;
}

// Get Email Template for Exam Paper Notification
function getPaperNotificationTemplate(studentName, paperName, subject) {
    return `
    <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 20px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px;">
                    <h1 style="color: #6366f1; margin: 0;">📄 New Exam Paper Available</h1>
                </div>
                
                <div style="background: white; padding: 30px; border-radius: 8px;">
                    <h2 style="color: #1f2937; margin-bottom: 15px;">Hi ${studentName}! 👋</h2>
                    
                    <p>Good news! A new exam paper has been added to the system.</p>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0; color: white;">📚 ${paperName}</h3>
                        <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
                        <p style="margin-bottom: 0;"><strong>Available now:</strong> <span style="font-weight: bold;">Yes ✓</span></p>
                    </div>
                    
                    <p>You can now download this paper from your dashboard. Log in to your account to access it.</p>
                    
                    <p style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 0.9em;">
                        Best regards,<br>
                        <strong>Exam Paper Management System</strong>
                    </p>
                </div>
            </div>
        </body>
    </html>
    `;
}

// Display Sent Emails (Admin)
function displaySentEmails() {
    const emails = JSON.parse(localStorage.getItem('sentEmails')) || [];
    const emailCount = emails.length;
    
    return {
        count: emailCount,
        emails: emails
    };
}

// Export for use in admin dashboard
function getEmailStats() {
    const emails = JSON.parse(localStorage.getItem('sentEmails')) || [];
    const students = JSON.parse(localStorage.getItem('students')) || [];
    
    const welcomeEmails = emails.filter(e => e.type === 'welcome').length;
    const notificationEmails = emails.filter(e => e.type === 'notification').length;
    
    return {
        totalEmails: emails.length,
        welcomeEmails: welcomeEmails,
        notificationEmails: notificationEmails,
        registeredStudents: students.length,
        emailList: emails
    };
}
