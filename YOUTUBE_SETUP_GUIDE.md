# YouTube Videos Setup Guide

## Required Environment Variables

Add these to your `.env.local` file:

```env
# YouTube API Configuration
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_youtube_channel_id_here
```

## How to Get YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable **YouTube Data API v3**
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key and add it to `.env.local`

## How to Get YouTube Channel ID

1. Go to your YouTube channel
2. Click on your channel name/profile picture
3. Go to "YouTube Studio"
4. Go to "Settings" → "Channel" → "Basic info"
5. Your Channel ID will be displayed there
6. Or use the script: `npm run get-channel-id`

## Features

✅ **Automatic Video Fetching**: Videos are automatically fetched from YouTube when:
   - Database is empty
   - Every 5 minutes (if auto-refresh is enabled)
   - When explicitly requested via `?refresh=true`

✅ **Live Stream Detection**: The system automatically detects and displays live streams

✅ **Video Display**: Videos are shown on:
   - Homepage (latest 6 videos)
   - `/videos` page (all videos with pagination)
   - `/live` page (live stream with embed)

## Manual Refresh

To manually refresh videos, visit:
- Admin Dashboard → Click "Refresh Videos" button
- Or call API: `/api/videos?refresh=true`

## Troubleshooting

### Videos Not Loading?

1. **Check Environment Variables**:
   ```bash
   # Verify these are set
   echo $YOUTUBE_API_KEY
   echo $YOUTUBE_CHANNEL_ID
   ```

2. **Check MongoDB Connection**:
   - Videos are stored in MongoDB
   - Ensure `MONGODB_URI` is set correctly

3. **Check API Quota**:
   - YouTube API has daily quota limits
   - Check your quota in Google Cloud Console

4. **Check Logs**:
   - Check server logs for YouTube API errors
   - Look for rate limit errors

### Live Stream Not Showing?

1. **Ensure Live Stream is Active**: The stream must be currently live on YouTube
2. **Check API Response**: The system checks for live streams every 5 minutes
3. **Manual Refresh**: Try refreshing videos manually from admin panel

## API Endpoints

- `GET /api/videos` - Get all videos (with pagination)
- `GET /api/videos?refresh=true` - Force refresh from YouTube
- `GET /api/videos?autoRefresh=false` - Disable auto-refresh
- `GET /api/videos/[id]` - Get specific video details

## Notes

- Videos are cached for 5 minutes to avoid rate limits
- Live stream status is checked every 5 minutes
- If YouTube API fails, existing videos in database are still shown
- Maximum 50 videos are fetched per refresh

