# 📧 Contact Form Email Setup

## ✅ Email Updated

**New Email:** somani.vaishnavi28@gmail.com

All contact form submissions will be sent to this email.

---

## 🔧 Setup Email Sending

### Step 1: Get Gmail App Password

1. **Go to:** https://myaccount.google.com/apppasswords
2. **Sign in** with: jalnareporter21@gmail.com
3. **Select app:** Mail
4. **Select device:** Other (Custom name)
5. **Enter name:** Jalna Reporter News
6. **Click:** Generate
7. **Copy** the 16-character password (looks like: `abcd efgh ijkl mnop`)

### Step 2: Add to .env.local

Open `.env.local` file and add:

```env
EMAIL_USER= jalnareporter21@gmail.com
EMAIL_PASSWORD=your-16-character-app-password-here
```

**Important:** 
- Remove spaces from app password
- Example: `abcdefghijklmnop` (not `abcd efgh ijkl mnop`)

### Step 3: Restart Server

```powershell
# Stop server (Ctrl + C)
# Then start again
npm run dev
```

---

## ✅ Test Contact Form

1. Go to: http://localhost:3000/contact
2. Fill the form
3. Click "Send Message"
4. Check somani.vaishnavi28@gmail.com inbox
5. You should receive the email!

---

## 🆘 Troubleshooting

### "Email service not configured"
- Make sure `EMAIL_PASSWORD` is set in `.env.local`
- Restart server after adding

### "Failed to send email"
- Check app password is correct (no spaces)
- Verify 2-factor authentication is enabled on Gmail
- Check spam folder
- Verify email credentials

### "Authentication failed"
- Make sure you're using App Password, not regular password
- Check app password hasn't expired
- Regenerate app password if needed

---

## 📧 Email Configuration

**Receiving Email:** somani.vaishnavi28@gmail.com  
**Sending Email:** somani.vaishnavi28@gmail.com (via Gmail SMTP)

**Email Includes:**
- Sender name
- Sender email
- Subject
- Message content
- Reply-to set to sender's email

---

**Setup karo aur contact form test karo! 📧**

