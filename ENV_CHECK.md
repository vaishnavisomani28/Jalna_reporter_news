# Environment Variables Check Guide

## 🔍 How to Verify Environment Variables are Loading

### Method 1: Check Server Logs

When server starts, check for these messages:
- ✅ "MongoDB connected successfully" - MongoDB is working
- ✅ No "Missing required environment variable" errors
- ⚠️ "YouTube API not configured" - YouTube vars missing (optional)

### Method 2: Create Test Endpoint

Visit: http://localhost:3000/api/health

This will show which env vars are configured (without exposing secrets).

### Method 3: Check .env.local File

Make sure `.env.local` file exists in root directory with:

```env
# REQUIRED
JWT_SECRET=your-secret-here
MONGODB_URI=mongodb://localhost:27017/jalnareporternews
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# OPTIONAL - YouTube
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id
```

### Method 4: Restart Server After Changes

**IMPORTANT**: After adding/changing `.env.local`, you MUST restart the server:

```bash
# Stop server (Ctrl+C)
# Then restart:
npm run dev
```

## 🐛 Common Issues

### Issue: Variables Not Loading

**Solution**:
1. File must be named `.env.local` (not `.env`)
2. Must be in root directory (same level as `package.json`)
3. No spaces around `=` sign
4. Restart server after changes

### Issue: YouTube Videos Not Showing

**Check**:
1. `YOUTUBE_API_KEY` is set
2. `YOUTUBE_CHANNEL_ID` is correct (starts with `UC`)
3. API key has YouTube Data API v3 enabled
4. Check server logs for YouTube API errors

**Fix**:
- Get API key from Google Cloud Console
- Get Channel ID: `npm run get-channel-id`
- Restart server

### Issue: Login Not Working

**Check**:
1. `JWT_SECRET` is set (min 32 characters)
2. `SUPABASE_SERVICE_ROLE_KEY` is correct
3. Admin user exists: `npm run create-admin`

## ✅ Verification Checklist

- [ ] `.env.local` file exists in root
- [ ] All REQUIRED vars are set
- [ ] No typos in variable names
- [ ] Server restarted after changes
- [ ] Check server console for errors
- [ ] Test login works
- [ ] Test videos load (if YouTube API set)

