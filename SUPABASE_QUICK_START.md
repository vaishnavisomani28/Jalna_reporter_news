# 🚀 Supabase Quick Start Guide

## Step 1: Add Supabase Credentials

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

**Where to find these:**
1. Go to your Supabase project dashboard
2. Click on "Settings" → "API"
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

## Step 2: Create Database Tables

Go to Supabase Dashboard → **SQL Editor** and run this SQL:

```sql
-- Blogs Table
CREATE TABLE IF NOT EXISTS blogs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  published BOOLEAN DEFAULT false,
  author TEXT DEFAULT 'Admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Videos Table
CREATE TABLE IF NOT EXISTS videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail TEXT NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL,
  is_live BOOLEAN DEFAULT false,
  channel_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_videos_video_id ON videos(video_id);
CREATE INDEX IF NOT EXISTS idx_videos_is_live ON videos(is_live);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON videos(published_at DESC);
```

## Step 3: Set Up Row Level Security (RLS)

Run this SQL in the SQL Editor:

```sql
-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Public can read published blogs" ON blogs
  FOR SELECT USING (published = true);

-- Allow all operations (you can restrict later for better security)
CREATE POLICY "Allow all blog operations" ON blogs
  FOR ALL USING (true);

CREATE POLICY "Allow all user operations" ON users
  FOR ALL USING (true);

CREATE POLICY "Public can read videos" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Allow all video operations" ON videos
  FOR ALL USING (true);
```

## Step 4: Create Storage Bucket

1. Go to **Storage** in Supabase Dashboard
2. Click **"New bucket"**
3. Settings:
   - **Name:** `blog-images`
   - **Public bucket:** ✅ Yes (checked)
   - **File size limit:** `5242880` (5MB)
   - **Allowed MIME types:** `image/jpeg,image/jpg,image/png,image/gif,image/webp`
4. Click **"Create bucket"**

## Step 5: Create Admin User

```bash
npm run create-admin
```

Default credentials:
- Username: `admin`
- Password: `admin123`

**⚠️ Change this password immediately after first login!**

## Step 6: Test the Setup

1. Start the dev server: `npm run dev`
2. Visit: http://localhost:3000
3. Login to admin: http://localhost:3000/admin/login
4. Create a blog and upload an image
5. Check Supabase Storage → `blog-images` bucket to see uploaded images

## ✅ Done!

Your app is now using Supabase for:
- ✅ Database (blogs, users, videos)
- ✅ Image storage (Supabase Storage)
- ✅ All blog images stored in Supabase

## Troubleshooting

**404 Error on blogs?**
- Make sure blogs are published (`published = true`)
- Check that the slug is correct
- Verify RLS policies are set correctly

**Images not uploading?**
- Check Storage bucket exists and is public
- Verify SUPABASE_SERVICE_ROLE_KEY is set
- Check file size is under 5MB

**Can't login?**
- Run `npm run create-admin` to create admin user
- Check users table exists in Supabase
- Verify JWT_SECRET is set in .env.local

