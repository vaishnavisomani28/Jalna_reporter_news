# Setup Guide for JalnaReporterNews

## ⚠️ Important Note About API Keys

You provided an **OpenAI API key**, but this project needs a **YouTube Data API v3 key**. These are different services!

## Step-by-Step Setup

### 1. Get YouTube Data API v3 Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Navigate to **APIs & Services** → **Library**
4. Search for "YouTube Data API v3"
5. Click **Enable**
6. Go to **APIs & Services** → **Credentials**
7. Click **Create Credentials** → **API Key**
8. Copy the API key

### 2. Get YouTube Channel ID

Your channel URL: `www.youtube.com/@jalnareporternewsnews`

**Option A: Using Script (Recommended)**
1. Add your YouTube API key to `.env.local`:
   ```env
   YOUTUBE_API_KEY=your-youtube-api-key-here
   ```
2. Run:
   ```bash
   npm run get-channel-id
   ```
3. Copy the Channel ID shown

**Option B: Manual Method**
1. Visit: https://www.youtube.com/@jalnareporternewsnews
2. Press `Ctrl+U` (or `Cmd+U` on Mac) to view page source
3. Press `Ctrl+F` (or `Cmd+F`) and search for `"channelId"`
4. Copy the Channel ID (starts with `UC`)

### 3. Create .env.local File

Create `.env.local` in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/jalnareporternews
# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jalnareporternews

# JWT Secret (use a random strong string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# YouTube API (NOT OpenAI!)
YOUTUBE_API_KEY=your-youtube-data-api-v3-key-here
YOUTUBE_CHANNEL_ID=UCyour-channel-id-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Create Admin User

```bash
npm run create-admin
```

This creates:
- Username: `admin`
- Password: `admin123`

**⚠️ Change this password immediately after first login!**

### 6. Start Development Server

```bash
npm run dev
```

### 7. Access the Website

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

## First Steps After Setup

1. **Login to Admin Panel**
   - Go to `/admin/login`
   - Username: `admin`
   - Password: `admin123`

2. **Refresh YouTube Videos**
   - Go to Admin → Videos
   - Click "🔄 Refresh from YouTube"
   - This fetches all videos from your channel

3. **Create Your First Blog**
   - Go to Admin → Blogs → New Blog
   - Fill in title, content, etc.
   - Check "Publish immediately"
   - Click "Create Blog"

4. **Change Admin Password**
   - Create a new admin user with strong password:
     ```bash
     npm run create-admin newusername strongpassword123
     ```
   - Login with new credentials
   - Delete the default admin user from database

## Common Issues

### "YOUTUBE_API_KEY not found"
- Make sure `.env.local` exists in root directory
- Check the file name is exactly `.env.local` (not `.env.local.txt`)
- Restart the dev server after adding environment variables

### "Videos not showing"
- Verify YouTube API key is correct (not OpenAI key!)
- Check Channel ID is correct
- Make sure YouTube Data API v3 is enabled in Google Cloud
- Click "Refresh from YouTube" in admin panel

### "Can't login to admin"
- Make sure MongoDB is running
- Verify admin user exists: `npm run create-admin`
- Check `JWT_SECRET` is set in `.env.local`

### "MongoDB connection error"
- If using local MongoDB: Make sure MongoDB service is running
- If using MongoDB Atlas: Check connection string is correct
- Verify network access in MongoDB Atlas (add your IP)

## Production Deployment

### For Vercel:

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Update `NEXT_PUBLIC_SITE_URL` to your Vercel domain
5. Deploy!

### Environment Variables for Production:

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=strong-random-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=UCyour-channel-id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Need Help?

- Check [README.md](./README.md) for detailed documentation
- Check [QUICK_START.md](./QUICK_START.md) for quick reference

---

**Remember**: You need a **YouTube Data API v3 key**, not an OpenAI key!

