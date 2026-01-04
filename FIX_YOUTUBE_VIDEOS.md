# 🎬 Fix YouTube Videos Not Showing

## Issues Identified

1. ✅ **Channel ID Found**: `UCL4LvX4wjmwI8ZLpH4Yp3PQ`
2. ✅ **YouTube API Key**: Provided
3. ❌ **MongoDB Connection**: IP whitelist issue (blocking video storage)

## Step 1: Verify Vercel Environment Variables

Make sure these are set in Vercel Dashboard:

1. Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
2. Verify these values:

```
YOUTUBE_API_KEY=AIzaSyCb2k2-FWIsgWKAFn4fa2el6Hp_hQ-Ntv0
YOUTUBE_CHANNEL_ID=UCL4LvX4wjmwI8ZLpH4Yp3PQ
```

**IMPORTANT**: 
- Make sure `YOUTUBE_CHANNEL_ID` is set to `UCL4LvX4wjmwI8ZLpH4Yp3PQ` (not the URL)
- Both should be set for **Production** environment

## Step 2: Fix MongoDB IP Whitelist (CRITICAL!)

This is the main issue blocking videos:

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Login** to your account
3. **Select your cluster** (the one used in MONGODB_URI)
4. Click **"Network Access"** in the left sidebar
5. Click **"Add IP Address"** button (green button)
6. Click **"Allow Access from Anywhere"** button
   - OR manually enter: `0.0.0.0/0`
7. Add a comment: "Vercel deployment"
8. Click **"Confirm"**
9. **Wait 1-2 minutes** for changes to apply

## Step 3: Redeploy on Vercel (if you changed environment variables)

If you just updated environment variables:

1. Vercel Dashboard → **Deployments**
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

## Step 4: Test

After MongoDB IP whitelist is fixed:

1. **Test Videos API**:
   ```
   https://jalna-reporter-news.vercel.app/api/videos?refresh=true
   ```
   Should return videos array (not empty)

2. **Check Vercel Logs**:
   - Dashboard → Logs tab
   - Look for "Successfully fetched X videos from YouTube"
   - Should NOT see MongoDB connection errors

3. **Visit Videos Page**:
   ```
   https://jalna-reporter-news.vercel.app/videos
   ```
   Should show videos from your channel

## Why Videos Aren't Showing

The flow is:
1. ✅ YouTube API fetches videos (works if API key is correct)
2. ❌ MongoDB stores videos (FAILS due to IP whitelist)
3. ❌ Site reads from MongoDB (no videos stored, so empty)

**Once MongoDB IP whitelist is fixed, videos will start appearing!**

## Quick Checklist

- [ ] MongoDB IP whitelist includes `0.0.0.0/0`
- [ ] `YOUTUBE_API_KEY` is set in Vercel
- [ ] `YOUTUBE_CHANNEL_ID=UCL4LvX4wjmwI8ZLpH4Yp3PQ` is set in Vercel
- [ ] Redeployed after setting variables (if needed)
- [ ] Tested `/api/videos` endpoint
- [ ] Videos page shows videos

## Troubleshooting

### Still No Videos?

1. **Check Vercel Logs**:
   - Look for YouTube API errors
   - Check MongoDB connection status

2. **Test YouTube API Directly**:
   Visit in browser:
   ```
   https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=UCL4LvX4wjmwI8ZLpH4Yp3PQ&maxResults=5&order=date&type=video&key=AIzaSyCb2k2-FWIsgWKAFn4fa2el6Hp_hQ-Ntv0
   ```
   Should return JSON with videos

3. **Check API Quota**:
   - Google Cloud Console → APIs & Services → Dashboard
   - Check YouTube Data API v3 quota usage

**Once MongoDB IP whitelist is fixed, everything should work!** 🎉

