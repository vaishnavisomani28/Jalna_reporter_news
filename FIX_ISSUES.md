# Fix Issues Guide

## Current Issues & Solutions

### 1. Admin Login Not Working (500 Error)

**Problem**: Login API returns 500 error

**Solutions**:
1. **Check Supabase Configuration**:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. **Create Admin User**:
   ```bash
   npm run create-admin
   ```
   Default credentials:
   - Username: `admin`
   - Password: `admin123`

3. **Check if users table exists in Supabase**:
   - Go to Supabase Dashboard
   - Check if `users` table exists
   - If not, run the SQL from `supabase-setup.sql`

### 2. Contact Form Email Not Working (500 Error)

**Problem**: Contact form returns 500 error

**Solutions**:
1. **Add Email Configuration** (Optional - form will still work without it):
   ```env
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_TO=recipient@example.com
   ```

2. **For Gmail**:
   - Enable 2-Factor Authentication
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Use App Password instead of regular password

3. **Note**: Contact form will still accept submissions even without email configured - it just won't send emails.

### 3. YouTube Videos Not Showing

**Problem**: Videos not loading from YouTube channel

**Solutions**:
1. **Check YouTube API Configuration**:
   ```env
   YOUTUBE_API_KEY=your_youtube_api_key
   YOUTUBE_CHANNEL_ID=your_channel_id
   ```

2. **Get YouTube API Key**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable "YouTube Data API v3"
   - Create API Key

3. **Get Channel ID**:
   ```bash
   npm run get-channel-id
   ```

4. **Manually Refresh Videos**:
   - Go to Admin Dashboard
   - Click "Refresh Videos" button
   - Or visit: `/api/videos?refresh=true`

5. **Check MongoDB Connection**:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

### 4. Auth Verify 401 Error

**This is NORMAL** - It means you're not logged in. This error appears when:
- User is not authenticated
- No token in cookies
- Token expired

**Solution**: Just login normally - this error will go away.

## Required Environment Variables

Create `.env.local` file with:

```env
# REQUIRED - Authentication
JWT_SECRET=your-random-secret-key-here

# REQUIRED - Database (for videos)
MONGODB_URI=mongodb://localhost:27017/jalnareporternews

# REQUIRED - Supabase (for blogs and users)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

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

## Quick Fix Checklist

- [ ] Check `.env.local` file exists
- [ ] Verify all REQUIRED env vars are set
- [ ] Run `npm run create-admin` to create admin user
- [ ] Check Supabase tables exist (users, blogs)
- [ ] Check MongoDB is running (for videos)
- [ ] Restart dev server after adding env vars

## Testing

1. **Test Login**:
   - Go to `/admin/login`
   - Use: `admin` / `admin123`
   - Should login successfully

2. **Test Contact Form**:
   - Go to `/contact`
   - Fill form and submit
   - Should show success message (even without email configured)

3. **Test Videos**:
   - Go to homepage
   - Should show videos if YouTube API is configured
   - Or go to Admin → Refresh Videos

4. **Test Blogs**:
   - Login to admin
   - Create a blog
   - Publish it
   - Should appear on homepage and `/blogs` page

