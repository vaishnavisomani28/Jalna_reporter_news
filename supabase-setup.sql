-- ============================================
-- SUPABASE DATABASE SETUP SQL
-- ============================================
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================

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

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read published blogs" ON blogs;
DROP POLICY IF EXISTS "Allow all blog operations" ON blogs;
DROP POLICY IF EXISTS "Allow all user operations" ON users;
DROP POLICY IF EXISTS "Public can read videos" ON videos;
DROP POLICY IF EXISTS "Allow all video operations" ON videos;

-- Blogs: Public can read published blogs, admin can do everything
CREATE POLICY "Public can read published blogs" ON blogs
  FOR SELECT USING (published = true);

CREATE POLICY "Allow all blog operations" ON blogs
  FOR ALL USING (true);

-- Users: Allow all operations (admin only in practice)
CREATE POLICY "Allow all user operations" ON users
  FOR ALL USING (true);

-- Videos: Public can read all
CREATE POLICY "Public can read videos" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Allow all video operations" ON videos
  FOR ALL USING (true);

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
-- Tables created successfully!
-- Next: Create storage bucket named "blog-images" in Storage section

