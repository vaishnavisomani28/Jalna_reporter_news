# Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment Variables
Create `.env.local` file:
```env
MONGODB_URI=mongodb://localhost:27017/jalnareporternews
JWT_SECRET=change-this-to-a-random-secret-key
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=your-channel-id
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Get YouTube Channel ID
```bash
npm run get-channel-id
```
Copy the Channel ID to `.env.local`

### Step 4: Create Admin User
```bash
npm run create-admin
```
Default: username=`admin`, password=`admin123`

### Step 5: Start Development Server
```bash
npm run dev
```

Visit:
- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

## 📝 First Steps After Setup

1. **Login to Admin Panel**
   - Go to `/admin/login`
   - Use credentials from Step 4

2. **Refresh YouTube Videos**
   - Go to Admin → Videos
   - Click "🔄 Refresh from YouTube"

3. **Create Your First Blog**
   - Go to Admin → Blogs → New Blog
   - Fill in the form and publish

4. **Change Admin Password**
   - Create a new admin user with a strong password
   - Delete the default admin user

## 🔑 Getting YouTube API Key

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable "YouTube Data API v3"
4. Create API Key credentials
5. Add to `.env.local`

## ⚠️ Important Notes

- Change default admin password immediately
- Use a strong JWT_SECRET in production
- Keep `.env.local` secure and never commit it
- For production, use MongoDB Atlas or similar cloud database

## 🆘 Troubleshooting

**Videos not showing?**
- Verify YouTube API key is correct
- Check Channel ID is correct
- Click "Refresh from YouTube" in admin panel

**Can't login?**
- Make sure MongoDB is running
- Verify admin user exists (run create-admin script)
- Check JWT_SECRET is set

---

For detailed documentation, see [README.md](./README.md)

