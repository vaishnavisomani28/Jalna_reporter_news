# Quick Fix Guide - All Issues

## 🔧 Issues Fixed

✅ **Login Error Handling** - Better error messages for Supabase connection issues
✅ **Contact Form** - Now works even without email configuration
✅ **Error Messages** - More helpful error messages for debugging

## 📋 Required Setup Steps

### Step 1: Check Environment Variables

Create/update `.env.local` file with these **REQUIRED** variables:

```env
# REQUIRED - Authentication (MUST HAVE)
JWT_SECRET=your-random-secret-key-min-32-characters

# REQUIRED - Supabase (for blogs and admin login)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# REQUIRED - MongoDB (for videos)
MONGODB_URI=mongodb://localhost:27017/jalnareporternews
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# OPTIONAL - YouTube (for videos)
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id

# OPTIONAL - Email (for contact form)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=recipient@example.com

# OPTIONAL - Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Setup Supabase

1. **Create Supabase Project**: https://supabase.com
2. **Run SQL Setup**: Go to SQL Editor and run `supabase-setup.sql`
3. **Get Keys**: 
   - Settings → API
   - Copy `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 3: Create Admin User

```bash
npm run create-admin
```

This creates:
- Username: `admin`
- Password: `admin123`

**⚠️ Change password after first login!**

### Step 4: Restart Server

After adding environment variables:

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

## 🐛 Troubleshooting

### Issue 1: Login Returns 500 Error

**Check**:
1. Supabase env vars are set correctly
2. `users` table exists in Supabase
3. Admin user created: `npm run create-admin`

**Fix**:
- Verify Supabase connection in dashboard
- Check server logs for specific error
- Ensure `SUPABASE_SERVICE_ROLE_KEY` is correct

### Issue 2: Contact Form Returns 500 Error

**This is now FIXED** - Form will work even without email config!

**To enable email**:
1. Add email env vars to `.env.local`
2. For Gmail: Use App Password (not regular password)
3. Restart server

### Issue 3: Videos Not Showing

**Check**:
1. MongoDB is running
2. `MONGODB_URI` is correct
3. YouTube API key is set (optional)

**Fix**:
- Start MongoDB: `mongod` (if local)
- Or use MongoDB Atlas (cloud)
- Refresh videos: Admin Dashboard → "Refresh Videos"

### Issue 4: Auth Verify 401 Error

**This is NORMAL** - Means you're not logged in.

**Fix**: Just login - error will disappear.

## ✅ Verification Checklist

- [ ] `.env.local` file exists
- [ ] `JWT_SECRET` is set (min 32 characters)
- [ ] Supabase env vars are set
- [ ] MongoDB connection string is correct
- [ ] Admin user created (`npm run create-admin`)
- [ ] Server restarted after env changes
- [ ] Can access http://localhost:3000
- [ ] Can login at http://localhost:3000/admin/login

## 🚀 After Setup

1. **Login to Admin**: `/admin/login` (admin/admin123)
2. **Create Blog**: Admin → Blogs → New Blog
3. **Refresh Videos**: Admin Dashboard → Refresh Videos
4. **Test Contact**: `/contact` page

## 📞 Still Having Issues?

1. Check server console for errors
2. Check browser console (F12)
3. Verify all env vars are set
4. Check Supabase dashboard for table existence
5. Check MongoDB connection

---

**Note**: Port 3001 errors in console are normal if you're accessing from a different port. Make sure you're using the correct port (usually 3000).

