import Link from 'next/link';
import { getYouTubeWatchUrl } from '@/lib/youtube';

interface LiveStreamBannerProps {
  video: {
    videoId: string;
    title: string;
    thumbnail: string;
  };
}

export default function LiveStreamBanner({ video }: LiveStreamBannerProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 text-white">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
            <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
            <span className="font-bold">LIVE NOW</span>
          </div>
          <h2 className="text-xl font-bold">{video.title}</h2>
        </div>
        <Link
          href={getYouTubeWatchUrl(video.videoId)}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Watch Live →
        </Link>
      </div>
    </div>
  );
}

