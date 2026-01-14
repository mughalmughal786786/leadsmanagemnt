# 📧 EMAIL SYSTEM SETUP GUIDE

## Gmail Configuration for Ali Technologies

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter name: "Ali Technologies Leads Management"
5. Click **Generate**
6. Copy the 16-character password (remove spaces)

### Step 3: Update Backend .env File
Add these lines to your `backend/.env` file:

```env
# Email Configuration
EMAIL_USER=alirazaliaqat0021@gmail.com
EMAIL_PASSWORD=your_16_character_app_password_here
FRONTEND_URL=http://localhost:5174
```

**Important:** Replace `your_16_character_app_password_here` with the actual app password from Step 2.

### Step 4: Test Email System

#### Test Forgot Password:
```bash
# Using curl or Postman
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@example.com"
}
```

#### Expected Response:
```json
{
  "success": true,
  "message": "Password reset email sent successfully"
}
```

### Step 5: Email Templates

The system includes two professional email templates:

#### 1. Password Reset Email
- **Subject:** Password Reset Request - Ali Technologies
- **Features:**
  - Ali Technologies branding with ALI. logo
  - Purple gradient header
  - Reset password button
  - Security warnings
  - 1-hour expiry notice
  - Professional footer

#### 2. Welcome Email (for new CSR users)
- **Subject:** Welcome to Ali Technologies
- **Features:**
  - Ali Technologies branding
  - Login credentials
  - Security reminder
  - Login button
  - Professional footer

### Troubleshooting

#### Error: "Email could not be sent"
**Solutions:**
1. Verify Gmail app password is correct
2. Check 2-Factor Authentication is enabled
3. Ensure EMAIL_USER and EMAIL_PASSWORD are in .env
4. Restart backend server after updating .env
5. Check internet connection
6. Verify Gmail account is not locked

#### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"
**Solutions:**
1. Generate a new app password
2. Make sure you're using the app password, not your Gmail password
3. Remove any spaces from the app password

#### Email Not Received
**Check:**
1. Spam/Junk folder
2. Email address is correct
3. Gmail sending limits (500 emails/day for free accounts)
4. Check backend console for errors

### Production Deployment

For production, consider:
1. **Use a dedicated email service:**
   - SendGrid
   - AWS SES
   - Mailgun
   - Postmark

2. **Update email configuration:**
```javascript
// For SendGrid example
const transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY
  }
});
```

3. **Update environment variables:**
```env
EMAIL_SERVICE=sendgrid
EMAIL_API_KEY=your_sendgrid_api_key
EMAIL_FROM=noreply@alitechnologies.com
```

### Email Sending Limits

**Gmail Free Account:**
- 500 emails per day
- 100 recipients per email
- Suitable for small teams

**For Higher Volume:**
- Use professional email service (SendGrid, AWS SES)
- No daily limits
- Better deliverability
- Advanced analytics

### Security Best Practices

1. ✅ Never commit .env file to Git
2. ✅ Use app passwords, not account passwords
3. ✅ Rotate app passwords regularly
4. ✅ Monitor email sending logs
5. ✅ Implement rate limiting for forgot password
6. ✅ Use HTTPS in production
7. ✅ Validate email addresses before sending

### Testing Checklist

- [ ] App password generated
- [ ] .env file updated
- [ ] Backend server restarted
- [ ] Forgot password endpoint tested
- [ ] Email received successfully
- [ ] Reset link works
- [ ] Password reset successful
- [ ] Welcome email tested (when creating CSR)

---

## 🎉 Email System Ready!

Once configured, the email system will:
- ✅ Send professional password reset emails
- ✅ Send welcome emails to new CSR users
- ✅ Use Ali Technologies branding
- ✅ Include security warnings
- ✅ Provide clear instructions
- ✅ Work reliably

**Support:** If you encounter issues, check the backend console logs for detailed error messages.
