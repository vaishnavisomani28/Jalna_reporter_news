// Script to manually fetch videos from YouTube
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });
const axios = require('axios');

const VideoSchema = new mongoose.Schema({
  videoId: String,
  title: String,
  description: String,
  thumbnail: String,
  publishedAt: Date,
  isLive: Boolean,
  channelId: String,
}, { timestamps: true });

const Video = mongoose.models.Video || mongoose.model('Video', VideoSchema);

async function fetchVideos() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

    if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
      console.error('YOUTUBE_API_KEY or YOUTUBE_CHANNEL_ID not found in .env.local');
      process.exit(1);
    }

    console.log('Fetching videos from YouTube...');
    
    // Fetch videos
    const videoResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: YOUTUBE_CHANNEL_ID,
        maxResults: 50,
        order: 'date',
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
    });

    // Check for live stream
    const liveResponse = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: YOUTUBE_CHANNEL_ID,
        maxResults: 1,
        order: 'date',
        type: 'video',
        eventType: 'live',
        key: YOUTUBE_API_KEY,
      },
    });

    const liveStreamId = liveResponse.data.items?.[0]?.id?.videoId || null;

    const videos = videoResponse.data.items || [];
    console.log(`Found ${videos.length} videos`);

    let count = 0;
    for (const item of videos) {
      const videoId = item.id.videoId;
      const isLive = item.snippet.liveBroadcastContent === 'live' || videoId === liveStreamId;

      await Video.findOneAndUpdate(
        { videoId },
        {
          videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
          publishedAt: new Date(item.snippet.publishedAt),
          isLive,
          channelId: YOUTUBE_CHANNEL_ID,
        },
        { upsert: true, new: true }
      );
      count++;
    }

    console.log(`\n✅ Successfully saved ${count} videos to database!`);
    
    if (liveStreamId) {
      console.log(`🔴 Live stream detected: ${liveStreamId}`);
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error fetching videos:', error.response?.data || error.message);
    process.exit(1);
  }
}

fetchVideos();

