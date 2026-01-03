# 📧 Email Setup Guide

## Contact Form Email Configuration

The contact form sends emails to: **rekhab.parshapogu@gmail.com**

### Setup Steps:

#### Option 1: Gmail (Recommended for Testing)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Jalna Reporter News"
   - Copy the 16-character password

3. **Add to `.env.local`:**
   ```env
   EMAIL_USER=rekhab.parshapogu@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

#### Option 2: Other Email Services

Update `app/api/contact/route.ts` with your email service configuration:

**For Outlook:**
```typescript
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'your-email@outlook.com',
    pass: 'your-password',
  },
});
```

**For Custom SMTP:**
```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp.your-domain.com',
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@domain.com',
    pass: 'your-password',
  },
});
```

### Testing:

1. Fill out the contact form
2. Click "Send Message"
3. Check `rekhab.parshapogu@gmail.com` inbox
4. You should receive the email

### Troubleshooting:

**"Failed to send email" error:**
- Check EMAIL_USER and EMAIL_PASSWORD in `.env.local`
- For Gmail: Make sure you're using App Password, not regular password
- Check spam folder
- Verify email service credentials

**Production Deployment:**
- Use environment variables in production
- Consider using email services like:
  - SendGrid
  - Mailgun
  - AWS SES
  - Resend

---

**Note:** For production, it's recommended to use a dedicated email service instead of Gmail.

