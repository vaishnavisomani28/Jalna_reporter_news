# Supabase Migration Guide

## Quick Setup Steps

### 1. Add Supabase Credentials to .env.local

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 2. Create Database Tables in Supabase

Go to Supabase Dashboard → SQL Editor and run:

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

### 3. Set Up Row Level Security (RLS)

```sql
-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Public can read published blogs
CREATE POLICY "Public can read published blogs" ON blogs
  FOR SELECT USING (published = true);

-- Allow all operations for now (you can restrict later)
CREATE POLICY "Allow all operations" ON blogs
  FOR ALL USING (true);

CREATE POLICY "Allow all operations" ON users
  FOR ALL USING (true);

CREATE POLICY "Public can read videos" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Allow all operations" ON videos
  FOR ALL USING (true);
```

### 4. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Click "New bucket"
3. Name: `blog-images`
4. Make it **Public**
5. File size limit: 5242880 (5MB)
6. Allowed MIME types: `image/jpeg,image/jpg,image/png,image/gif,image/webp`

### 5. Create Admin User

Run the create-admin script (it will be updated to use Supabase):

```bash
npm run create-admin
```

## Migration Complete!

Your app is now using Supabase instead of MongoDB. All blog images will be stored in Supabase Storage.

