# 📧 Email Troubleshooting Guide

## Problem: Not Receiving Emails

### Step 1: Check Environment Variables

Make sure these are set in `.env.local`:

```env
EMAIL_USER=jalnareporter21@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here
EMAIL_TO=jalnareporter21@gmail.com
```

**Important:** 
- `EMAIL_PASSWORD` should be a **Gmail App Password**, not your regular Gmail password
- Remove all spaces from the app password
- Example: `abcdefghijklmnop` (not `abcd efgh ijkl mnop`)

### Step 2: Test Email Configuration

Run the test script:

```bash
npm run test-email
```

This will:
- Check if environment variables are set
- Test Gmail connection
- Send a test email
- Show specific error messages if something fails

### Step 3: Generate Gmail App Password

If you don't have an app password:

1. **Enable 2-Factor Authentication** on Gmail:
   - Go to: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter: "Jalna Reporter News"
   - Click "Generate"
   - Copy the 16-character password (remove spaces)

3. **Add to .env.local**:
   ```env
   EMAIL_PASSWORD=abcdefghijklmnop
   ```

4. **Restart Server**:
   ```bash
   # Stop server (Ctrl + C)
   npm run dev
   ```

### Step 4: Common Issues

#### ❌ "Invalid login" or "Authentication failed"
**Solution:**
- Make sure you're using App Password, not regular password
- Verify 2-Factor Authentication is enabled
- Regenerate app password if needed
- Check for spaces in password (remove them)

#### ❌ "Email service not configured"
**Solution:**
- Check `.env.local` file exists
- Verify all three variables are set: `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_TO`
- Restart server after adding variables

#### ❌ "Connection timeout" or "Connection failed"
**Solution:**
- Check internet connection
- Verify Gmail SMTP is accessible
- Check firewall settings
- Try again after a few minutes

#### ❌ Email sent but not received
**Solution:**
- Check spam/junk folder
- Verify `EMAIL_TO` is correct
- Check email inbox storage (not full)
- Wait a few minutes (sometimes delayed)

### Step 5: Production (Vercel)

If emails work locally but not in production:

1. **Add Environment Variables in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `EMAIL_USER=jalnareporter21@gmail.com`
     - `EMAIL_PASSWORD=your-app-password`
     - `EMAIL_TO=jalnareporter21@gmail.com`

2. **Redeploy** after adding variables

3. **Check Vercel Logs**:
   - Go to Vercel Dashboard → Your Project → Logs
   - Look for email-related errors

### Step 6: Verify Email is Working

1. **Test Contact Form**:
   - Go to: `/contact`
   - Fill the form
   - Submit
   - Check for success message

2. **Check Email**:
   - Check `jalnareporter21@gmail.com` inbox
   - Check spam folder
   - Subject should be: "Contact Form: [your subject]"

### Step 7: Debug Mode

If still not working, check server logs:

**Local:**
- Check terminal where `npm run dev` is running
- Look for error messages

**Production:**
- Check Vercel logs
- Look for email-related errors

### Quick Checklist

- [ ] `.env.local` file exists
- [ ] `EMAIL_USER` is set to `jalnareporter21@gmail.com`
- [ ] `EMAIL_PASSWORD` is set (Gmail App Password, no spaces)
- [ ] `EMAIL_TO` is set to `jalnareporter21@gmail.com`
- [ ] 2-Factor Authentication enabled on Gmail
- [ ] App Password generated from Google Account
- [ ] Server restarted after adding variables
- [ ] Test script runs successfully: `npm run test-email`
- [ ] Checked spam folder
- [ ] Production: Environment variables added in Vercel

### Still Not Working?

1. Run test script: `npm run test-email`
2. Check the specific error message
3. Follow the fix instructions for that error
4. If using production, check Vercel logs

---

**Need Help?**
- Check error message from test script
- Verify Gmail account settings
- Make sure app password is correct (16 characters, no spaces)
