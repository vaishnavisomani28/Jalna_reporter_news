import axios from 'axios';
import { env } from './env-validation';
import { logger } from './logger';

const YOUTUBE_API_KEY = env.YOUTUBE_API_KEY;
const YOUTUBE_CHANNEL_ID = env.YOUTUBE_CHANNEL_ID;

if (!YOUTUBE_API_KEY && typeof window === 'undefined') {
  logger.warn('YOUTUBE_API_KEY is not set. YouTube features will not work.');
}

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  isLive: boolean;
}

export async function fetchChannelVideos(maxResults: number = 10): Promise<YouTubeVideo[]> {
  // Check if API key and channel ID are configured
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    logger.warn('YouTube API not configured. Please add YOUTUBE_API_KEY and YOUTUBE_CHANNEL_ID to .env.local');
    return [];
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: YOUTUBE_CHANNEL_ID,
        maxResults,
        order: 'date',
        type: 'video',
        key: YOUTUBE_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    if (!response.data || !response.data.items) {
      logger.warn('YouTube API returned no items', { channelId: YOUTUBE_CHANNEL_ID });
      return [];
    }

    const videos: YouTubeVideo[] = response.data.items.map((item: any) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      isLive: item.snippet.liveBroadcastContent === 'live',
    }));

    logger.info(`Successfully fetched ${videos.length} videos from YouTube`);
    return videos;
  } catch (error: any) {
    const errorMessage = error?.response?.data?.error?.message || error?.message || 'Unknown error';
    logger.error(
      'Error fetching YouTube videos',
      error instanceof Error ? error : undefined,
      { 
        channelId: YOUTUBE_CHANNEL_ID,
        errorMessage,
        statusCode: error?.response?.status,
      }
    );
    
    // Log specific error messages
    if (error?.response?.status === 403) {
      logger.error('YouTube API quota exceeded or API key invalid');
    } else if (error?.response?.status === 400) {
      logger.error('Invalid YouTube Channel ID or API key');
    }
    
    return [];
  }
}

export async function checkLiveStream(): Promise<YouTubeVideo | null> {
  // Check if API key and channel ID are configured
  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return null;
  }

  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        channelId: YOUTUBE_CHANNEL_ID,
        maxResults: 1,
        order: 'date',
        type: 'video',
        eventType: 'live',
        key: YOUTUBE_API_KEY,
      },
      timeout: 10000, // 10 second timeout
    });

    if (response.data.items && response.data.items.length > 0) {
      const item = response.data.items[0];
      return {
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
        publishedAt: item.snippet.publishedAt,
        isLive: true,
      };
    }

    return null;
  } catch (error) {
    // Silently fail for live stream check - it's not critical
    return null;
  }
}

export function getYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

