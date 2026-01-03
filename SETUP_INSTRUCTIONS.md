# 🚀 Final Setup Instructions

## ✅ Completed
- ✅ Supabase credentials added to .env.local
- ✅ Admin user created (username: admin, password: admin123)

## 📋 Remaining Steps

### Step 1: Create Database Tables in Supabase

1. Go to: https://lnutfwobciqfwuerwimj.supabase.co
2. Login to your Supabase dashboard
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New query"**
5. Copy the entire content from `supabase-setup.sql` file
6. Paste it in the SQL Editor
7. Click **"Run"** button (or press Ctrl+Enter)

**Expected Result:** You should see "Success. No rows returned" - this means tables were created!

### Step 2: Create Storage Bucket

1. In Supabase Dashboard, click **"Storage"** in the left sidebar
2. Click **"New bucket"** button
3. Fill in:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ Check this (make it public)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** `image/jpeg,image/jpg,image/png,image/gif,image/webp`
4. Click **"Create bucket"**

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test Everything

1. **Login to Admin Panel:**
   - Go to: http://localhost:3000/admin/login
   - Username: `admin`
   - Password: `admin123`

2. **Create a Test Blog:**
   - Go to Admin → Blogs → New Blog
   - Add title, content, and upload an image
   - Check "Publish immediately"
   - Click "Create Blog"

3. **Verify Blog:**
   - Go to: http://localhost:3000/blogs
   - Click on your blog
   - Check if it loads without 404 error
   - Check if image displays correctly

4. **Check Supabase Storage:**
   - Go to Supabase Dashboard → Storage → blog-images
   - You should see your uploaded image there

## 🎉 Done!

Your website is now fully set up with Supabase!

---

## Troubleshooting

**If blogs show 404:**
- Make sure you checked "Publish immediately" when creating blog
- Check Supabase → Table Editor → blogs table
- Verify the blog has `published = true`

**If images don't upload:**
- Check Storage bucket exists and is public
- Verify file size is under 5MB
- Check browser console for errors

**If can't login:**
- Admin user is already created (username: admin, password: admin123)
- Check Supabase → Table Editor → users table
- Verify user exists

