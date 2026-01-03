const axios = require('axios');

// Try to load .env.local, fallback to .env
try {
  require('dotenv').config({ path: '.env.local' });
} catch {
  require('dotenv').config();
}

async function getChannelId() {
  // Extract handle from URL or use default
  const url = process.argv[2] || 'www.youtube.com/@jalnareporternewsnews';
  let channelHandle = url.includes('@') ? url.split('@')[1].split('/')[0] : 'jalnareporternewsnews';
  if (!channelHandle.startsWith('@')) {
    channelHandle = '@' + channelHandle;
  }

  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!apiKey) {
    console.error('\n❌ YOUTUBE_API_KEY not found in .env.local');
    console.log('\n⚠️  IMPORTANT: You provided an OpenAI API key, but you need a YouTube Data API v3 key!');
    console.log('\nTo get YouTube API key:');
    console.log('1. Go to https://console.cloud.google.com/');
    console.log('2. Create a project or select existing');
    console.log('3. Enable "YouTube Data API v3"');
    console.log('4. Create API Key credentials');
    console.log('5. Add YOUTUBE_API_KEY to .env.local\n');
    process.exit(1);
  }

  console.log(`\n🔍 Looking for Channel ID for: ${channelHandle}\n`);

  try {
    // Method 1: Use channels.list with forHandle (newer API)
    try {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', {
        params: {
          part: 'id',
          forHandle: channelHandle.replace('@', ''),
          key: apiKey,
        },
      });

      if (response.data.items && response.data.items.length > 0) {
        const channelId = response.data.items[0].id;
        console.log(`✅ Channel ID found: ${channelId}`);
        console.log(`\n📝 Add this to your .env.local file:`);
        console.log(`YOUTUBE_CHANNEL_ID=${channelId}\n`);
        return;
      }
    } catch (err) {
      // Fallback to search method
    }

    // Method 2: Use search API as fallback
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: channelHandle,
        type: 'channel',
        maxResults: 1,
        key: apiKey,
      },
    });

    if (response.data.items && response.data.items.length > 0) {
      const channelId = response.data.items[0].id.channelId;
      console.log(`✅ Channel ID found: ${channelId}`);
      console.log(`\n📝 Add this to your .env.local file:`);
      console.log(`YOUTUBE_CHANNEL_ID=${channelId}\n`);
    } else {
      console.log('❌ Channel not found.');
      console.log('\n📌 Manual method:');
      console.log('1. Visit https://www.youtube.com/@jalnareporternewsnews');
      console.log('2. View page source (Ctrl+U) and search for "channelId"');
      console.log('3. Or use: https://commentpicker.com/youtube-channel-id.php');
    }
  } catch (error) {
    if (error.response?.status === 403) {
      console.error('❌ API Error: Access denied. Check your YouTube API key.');
      console.error('   Make sure YouTube Data API v3 is enabled in Google Cloud Console.');
    } else if (error.response?.status === 400) {
      console.error('❌ API Error: Invalid request. Check your API key format.');
    } else {
      console.error('❌ Error:', error.response?.data?.error?.message || error.message);
    }
    console.log('\n📌 You can manually get the Channel ID:');
    console.log('1. Visit https://www.youtube.com/@jalnareporternewsnews');
    console.log('2. View page source and search for "channelId"');
    console.log('3. Or use: https://commentpicker.com/youtube-channel-id.php');
  }
}

getChannelId();

