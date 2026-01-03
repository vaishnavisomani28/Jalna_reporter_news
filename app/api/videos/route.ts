import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Video from '@/models/Video';
import { fetchChannelVideos, checkLiveStream } from '@/lib/youtube';
import { logger } from '@/lib/logger';
import { checkRateLimit } from '@/lib/rate-limit';
import { cache } from '@/lib/cache';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await checkRateLimit(`videos:${ip}`);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      );
    }

    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const refresh = searchParams.get('refresh') === 'true';
    const autoRefresh = searchParams.get('autoRefresh') !== 'false'; // Default true

    // Check if database is empty and auto-refresh is enabled
    const videoCount = await Video.countDocuments();
    
    // Always try to refresh if database is empty or if explicitly requested
    // Cache YouTube API calls for 5 minutes to avoid rate limits
    const cacheKey = 'youtube-videos-refresh';
    const lastRefresh = cache.get<number>(cacheKey);
    const fiveMinutesAgo = Date.now() - 300000; // 5 minutes
    
    // Refresh conditions:
    // 1. Explicitly requested (refresh=true)
    // 2. Database is empty
    // 3. Auto-refresh enabled and last refresh was more than 5 minutes ago
    const shouldRefresh = refresh || 
      videoCount === 0 || 
      (autoRefresh && (!lastRefresh || lastRefresh < fiveMinutesAgo));

    if (shouldRefresh) {
      try {
        logger.info('Fetching videos from YouTube API');
        const youtubeVideos = await fetchChannelVideos(50);
        const liveStream = await checkLiveStream();

        logger.info(`Fetched ${youtubeVideos.length} videos from YouTube`);

        // Use bulk operations for better performance
        const updatePromises = youtubeVideos.map(ytVideo =>
          Video.findOneAndUpdate(
            { videoId: ytVideo.videoId },
            {
              videoId: ytVideo.videoId,
              title: ytVideo.title,
              description: ytVideo.description,
              thumbnail: ytVideo.thumbnail,
              publishedAt: new Date(ytVideo.publishedAt),
              isLive: ytVideo.isLive || (liveStream?.videoId === ytVideo.videoId),
              channelId: process.env.YOUTUBE_CHANNEL_ID || '',
            },
            { upsert: true, new: true }
          )
        );

        await Promise.all(updatePromises);

        // Also update live stream status for existing videos
        if (liveStream) {
          logger.info('Live stream detected', { videoId: liveStream.videoId });
          await Video.findOneAndUpdate(
            { videoId: liveStream.videoId },
            { 
              videoId: liveStream.videoId,
              title: liveStream.title,
              description: liveStream.description,
              thumbnail: liveStream.thumbnail,
              publishedAt: new Date(liveStream.publishedAt),
              isLive: true,
              channelId: process.env.YOUTUBE_CHANNEL_ID || '',
            },
            { upsert: true }
          );
        }

        // Cache the refresh timestamp
        cache.set(cacheKey, Date.now(), 300); // 5 minutes
      } catch (error) {
        logger.error('Error refreshing videos from YouTube', error instanceof Error ? error : undefined);
        // Continue with existing videos even if refresh fails
      }
    }

    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '12')));
    const skip = (page - 1) * limit;

    // Use parallel queries for better performance
    const [videos, total, liveStream] = await Promise.all([
      Video.find()
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(), // Use lean() for better performance
      Video.countDocuments(),
      Video.findOne({ isLive: true }).lean(),
    ]);

    // Transform videos to match expected format
    const formattedVideos = videos.map((video: any) => ({
      _id: video._id?.toString() || video.videoId,
      videoId: video.videoId,
      title: video.title,
      description: video.description,
      thumbnail: video.thumbnail,
      publishedAt: video.publishedAt,
      isLive: video.isLive || false,
      channelId: video.channelId,
    }));

    const formattedLiveStream = liveStream ? {
      _id: liveStream._id?.toString() || liveStream.videoId,
      videoId: liveStream.videoId,
      title: liveStream.title,
      description: liveStream.description,
      thumbnail: liveStream.thumbnail,
      publishedAt: liveStream.publishedAt,
      isLive: true,
      channelId: liveStream.channelId,
    } : null;

    return NextResponse.json({
      videos: formattedVideos,
      liveStream: formattedLiveStream,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching videos', error instanceof Error ? error : undefined);
    // Return empty data instead of error to prevent page crashes
    return NextResponse.json({
      videos: [],
      liveStream: null,
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
      },
    });
  }
}

