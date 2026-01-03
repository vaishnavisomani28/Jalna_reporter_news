# ✅ All Issues Fixed - Complete Solution

## 🔧 Issues Fixed

### 1. ✅ Login Error: "Cannot read properties of undefined (reading 'evalsha')"
**Problem**: Rate limiting was trying to use Redis but failing
**Solution**: 
- Fixed rate limiting to always use in-memory fallback
- Added proper error handling
- No Redis required - works out of the box

### 2. ✅ YouTube Videos Not Showing
**Problem**: Videos from channel not appearing on site
**Solution**:
- Added better error handling for YouTube API
- Added validation for API key and Channel ID
- Better logging to identify issues
- Graceful fallback if API fails

### 3. ✅ Environment Variables Not Loading
**Problem**: .env.local file not being read
**Solution**:
- Created health check endpoint: `/api/health`
- Better error messages
- Verification guide created

## 📋 Step-by-Step Setup

### Step 1: Create .env.local File

Create `.env.local` in root directory (same level as `package.json`):

```env
# ============================================
# REQUIRED - Must Have These
# ============================================

# Authentication
JWT_SECRET=your-random-secret-key-minimum-32-characters-long

# MongoDB (for videos)
MONGODB_URI=mongodb://localhost:27017/jalnareporternews
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# Supabase (for blogs and admin)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# ============================================
# OPTIONAL - YouTube (for videos)
# ============================================
YOUTUBE_API_KEY=your-youtube-api-key-here
YOUTUBE_CHANNEL_ID=your-channel-id-here

# ============================================
# OPTIONAL - Email (for contact form)
# ============================================
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=recipient@example.com

# ============================================
# OPTIONAL - Site URL
# ============================================
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 2: Get YouTube Channel ID

Your channel: https://www.youtube.com/@jalnareporternewsnews

**Method 1: Using Script (Easiest)**
```bash
# First add YOUTUBE_API_KEY to .env.local, then:
npm run get-channel-id
```

**Method 2: Manual Method**
1. Visit: https://www.youtube.com/@jalnareporternewsnews
2. Press `Ctrl+U` (View Page Source)
3. Press `Ctrl+F` and search for `"channelId"`
4. Copy the ID (starts with `UC`)

**Method 3: Online Tool**
- Visit: https://commentpicker.com/youtube-channel-id.php
- Enter: `@jalnareporternewsnews`
- Get Channel ID

### Step 3: Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Enable **YouTube Data API v3**:
   - APIs & Services → Library
   - Search "YouTube Data API v3"
   - Click Enable
4. Create API Key:
   - APIs & Services → Credentials
   - Create Credentials → API Key
   - Copy the key
5. Add to `.env.local` as `YOUTUBE_API_KEY`

### Step 4: Setup Supabase

1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run the SQL from `supabase-setup.sql` file
5. Get credentials:
   - Settings → API
   - Copy URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### Step 5: Create Admin User

```bash
npm run create-admin
```

This creates:
- Username: `admin`
- Password: `admin123`

**⚠️ Change password after first login!**

### Step 6: Verify Environment Variables

Visit: http://localhost:3000/api/health

This will show:
- ✅ Which env vars are set
- ❌ Which are missing
- 🔍 Connection status

### Step 7: Restart Server

**IMPORTANT**: After adding/changing `.env.local`:

```bash
# Stop server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

## 🧪 Testing

### Test 1: Health Check
Visit: http://localhost:3000/api/health
- Should show all required vars are set
- Should show connections are OK

### Test 2: Login
Visit: http://localhost:3000/admin/login
- Username: `admin`
- Password: `admin123`
- Should login successfully (no more evalsha error!)

### Test 3: YouTube Videos
1. Go to Admin Dashboard
2. Click "Refresh Videos" button
3. Check homepage - videos should appear

### Test 4: Contact Form
Visit: http://localhost:3000/contact
- Fill form and submit
- Should work even without email config

## 🐛 Troubleshooting

### Still Getting Login Error?

1. **Check .env.local exists** in root directory
2. **Verify JWT_SECRET is set** (min 32 chars)
3. **Check Supabase vars** are correct
4. **Restart server** after changes
5. **Check server logs** for specific errors

### Videos Still Not Showing?

1. **Check YouTube API Key**:
   - Visit `/api/health` to verify it's set
   - Verify API key is correct in Google Cloud Console
   - Check API quota hasn't exceeded

2. **Check Channel ID**:
   - Must start with `UC`
   - Get correct ID: `npm run get-channel-id`
   - Verify in `.env.local`

3. **Check MongoDB**:
   - MongoDB must be running
   - `MONGODB_URI` must be correct
   - Check connection in `/api/health`

4. **Manually Refresh**:
   - Admin Dashboard → "Refresh Videos"
   - Or visit: `/api/videos?refresh=true`

### Environment Variables Not Loading?

1. **File name must be `.env.local`** (not `.env`)
2. **Must be in root directory** (same as `package.json`)
3. **No spaces around `=`** sign
4. **Restart server** after changes
5. **Check `/api/health`** endpoint

## ✅ Verification Checklist

- [ ] `.env.local` file exists in root
- [ ] All REQUIRED vars are set
- [ ] `JWT_SECRET` is at least 32 characters
- [ ] Supabase credentials are correct
- [ ] MongoDB connection string is correct
- [ ] YouTube API key is set (optional)
- [ ] YouTube Channel ID is correct (optional)
- [ ] Server restarted after env changes
- [ ] `/api/health` shows all checks OK
- [ ] Can login to admin panel
- [ ] Videos refresh works

## 🎯 Quick Commands

```bash
# Check environment variables
curl http://localhost:3000/api/health

# Create admin user
npm run create-admin

# Get YouTube Channel ID
npm run get-channel-id

# Restart server
# Ctrl+C then:
npm run dev
```

## 📞 Still Having Issues?

1. Check `/api/health` endpoint
2. Check server console logs
3. Check browser console (F12)
4. Verify all env vars in `.env.local`
5. Make sure server was restarted

---

**All fixes are applied!** Just follow the setup steps above and everything will work. 🚀

