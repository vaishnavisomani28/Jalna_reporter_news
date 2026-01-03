import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';
import { getYouTubeWatchUrl } from '@/lib/youtube';

interface VideoCardProps {
  video: {
    _id: string;
    videoId: string;
    title: string;
    thumbnail: string;
    publishedAt: string | Date;
    isLive?: boolean;
  };
}

export default function VideoCard({ video }: VideoCardProps) {
  const youtubeUrl = getYouTubeWatchUrl(video.videoId);
  
  return (
    <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {video.isLive && (
            <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 animate-pulse shadow-lg">
              <span className="w-2 h-2 bg-white rounded-full"></span>
              <span>LIVE</span>
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-white/90 rounded-full p-3">
                <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {video.title}
          </h3>
          <p className="text-sm text-gray-600">
            {formatDate(video.publishedAt)}
          </p>
        </div>
      </div>
    </a>
  );
}

