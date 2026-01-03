# Jalna Reporter News

A production-ready news & media website built with Next.js, featuring automatic YouTube video integration, blog management, and a user-friendly admin dashboard.

## 🚀 Features

- **Automatic YouTube Integration**: Fetches latest videos and live streams from your YouTube channel
- **Blog Management**: Create, edit, and publish articles with a rich text editor
- **Admin Dashboard**: Non-technical admin-friendly content management system
- **SEO Optimized**: Meta tags, OpenGraph support, and share functionality
- **Responsive Design**: Mobile-first, fully responsive layout
- **Secure Authentication**: JWT-based admin authentication

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- MongoDB database (local or cloud like MongoDB Atlas)
- YouTube Data API v3 key

## 🛠️ Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/jalnareporternews
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jalnareporternews

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
YOUTUBE_API_KEY=your-youtube-api-key-here
YOUTUBE_CHANNEL_ID=UCyour-channel-id-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Get YouTube Channel ID

**Option 1: Using the script**
```bash
node scripts/get-channel-id.js
```

**Option 2: Manually**
1. Visit your YouTube channel: https://www.youtube.com/@jalnareporternewsnews
2. View page source (Ctrl+U) and search for "channelId"
3. Or use: https://commentpicker.com/youtube-channel-id.php

### 4. Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "YouTube Data API v3"
4. Create credentials (API Key)
5. Add the API key to `.env.local`

### 5. Create Admin User

```bash
# Default: username=admin, password=admin123
node scripts/create-admin.js

# Or specify custom credentials
node scripts/create-admin.js myusername mypassword
```

**⚠️ Important**: Change the default password after first login!

### 6. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
/app
  /api          # API routes
  /admin        # Admin dashboard pages
  /blogs        # Blog pages
  /videos       # Video pages
  /about        # About page
  /contact      # Contact page
  page.tsx      # Home page
/components     # React components
/lib            # Utility functions
/models         # MongoDB models
/scripts        # Utility scripts
```

## 🎨 Admin Dashboard

Access the admin dashboard at `/admin/login`

**Features:**
- Create, edit, and delete blogs
- Rich text editor (React Quill)
- Image URL support (for featured images)
- Publish/unpublish articles
- Refresh YouTube videos
- View statistics

**Admin Routes:**
- `/admin` - Dashboard
- `/admin/blogs` - Blog list
- `/admin/blogs/new` - Create new blog
- `/admin/blogs/[slug]` - Edit blog
- `/admin/videos` - Video management

## 📝 Creating Content

### Creating a Blog Post

1. Login to admin dashboard
2. Go to "Blogs" → "New Blog"
3. Fill in:
   - Title (required)
   - Excerpt (optional short description)
   - Featured Image URL (optional)
   - Content (use rich text editor)
   - Check "Publish immediately" to publish right away
4. Click "Create Blog"

### Refreshing Videos

1. Go to Admin → Videos
2. Click "🔄 Refresh from YouTube"
3. Latest videos will be fetched automatically

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

**Environment Variables for Vercel:**
- `MONGODB_URI`
- `JWT_SECRET`
- `YOUTUBE_API_KEY`
- `YOUTUBE_CHANNEL_ID`
- `NEXT_PUBLIC_SITE_URL` (your Vercel URL)

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔒 Security Notes

- Change default admin credentials immediately
- Use strong `JWT_SECRET` in production
- Keep `.env.local` out of version control
- Use MongoDB connection string with authentication
- Consider rate limiting for API routes in production

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT
- **Rich Text Editor**: React Quill
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

## 📱 Features in Detail

### Home Page
- Latest YouTube videos (auto-fetched)
- Live stream banner (if active)
- Latest blog articles
- Share buttons (WhatsApp, Facebook, Twitter, Copy link)

### Videos Page
- Grid of all YouTube videos
- Pagination
- Video detail pages with embedded player

### Blogs Page
- List of published articles
- Pagination
- SEO-optimized blog detail pages

### Admin Panel
- Secure login
- Dashboard with statistics
- Blog CRUD operations
- Video refresh functionality
- User-friendly interface for non-technical users

## 🐛 Troubleshooting

**Videos not showing?**
- Check YouTube API key is correct
- Verify Channel ID is correct
- Check API quota limits
- Click "Refresh from YouTube" in admin panel

**Can't login to admin?**
- Make sure admin user exists (run `scripts/create-admin.js`)
- Check MongoDB connection
- Verify JWT_SECRET is set

**Blog images not showing?**
- Use direct image URLs (not relative paths)
- Use image hosting services (Imgur, Cloudinary, etc.)
- Ensure URLs are publicly accessible

## 📄 License

This project is proprietary and confidential.

## 👥 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ for Jalna Reporter News**

