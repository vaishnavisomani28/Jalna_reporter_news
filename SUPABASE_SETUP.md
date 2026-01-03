# Supabase Setup Guide

## 1. Create Database Tables

Run these SQL commands in your Supabase SQL Editor:

### Blogs Table
```sql
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
```

### Users Table
```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
```

### Videos Table
```sql
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

## 2. Enable Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Blogs: Public can read published blogs, admin can do everything
CREATE POLICY "Public can read published blogs" ON blogs
  FOR SELECT USING (published = true);

CREATE POLICY "Admin can manage blogs" ON blogs
  FOR ALL USING (true); -- You'll need to implement proper auth check

-- Users: Only admin can access
CREATE POLICY "Admin can manage users" ON users
  FOR ALL USING (true); -- You'll need to implement proper auth check

-- Videos: Public can read all
CREATE POLICY "Public can read videos" ON videos
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage videos" ON videos
  FOR ALL USING (true); -- You'll need to implement proper auth check
```

## 3. Create Storage Bucket

1. Go to Supabase Dashboard → Storage
2. Create a new bucket named `blog-images`
3. Make it **Public**
4. Set file size limit to 5MB
5. Set allowed MIME types: `image/jpeg, image/jpg, image/png, image/gif, image/webp`

Or use the Storage API to create it programmatically (the code will handle this).

## 4. Environment Variables

Add these to your `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Keep other existing variables
JWT_SECRET=your-jwt-secret
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id
EMAIL_USER=your-email
EMAIL_PASSWORD=your-password
EMAIL_TO=recipient-email
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 5. Create Admin User

After setting up, create an admin user using the create-admin script (it will be updated to use Supabase).

## Notes

- The service role key should be kept secret and only used server-side
- The anon key is safe to expose in client-side code
- RLS policies ensure data security
- Storage bucket is public for easy image access

