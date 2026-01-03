import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { getYouTubeEmbedUrl, getYouTubeWatchUrl } from '@/lib/youtube';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Live Stream - Jalna Reporter News',
  description: 'Watch live streams from Jalna Reporter News',
};

async function getLiveStream() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/videos?limit=1`, { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    return data.liveStream;
  } catch (error) {
    return null;
  }
}

async function getRecentVideos() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/videos?limit=6`, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.videos || [];
  } catch (error) {
    return [];
  }
}

export default async function LivePage() {
  const liveStream = await getLiveStream();
  const recentVideos = await getRecentVideos();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Stream</h1>
        <p className="text-gray-600">Watch our live broadcasts and latest videos</p>
      </div>

      {liveStream ? (
        <div className="mb-12">
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 text-white mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex items-center space-x-2 bg-white/20 px-4 py-2 rounded-full">
                <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
                <span className="font-bold">LIVE NOW</span>
              </div>
              <h2 className="text-2xl font-bold">{liveStream.title}</h2>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative aspect-video bg-gray-900">
              <iframe
                src={getYouTubeEmbedUrl(liveStream.videoId)}
                title={liveStream.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{liveStream.title}</h3>
              {liveStream.description && (
                <p className="text-gray-700 mb-4 whitespace-pre-wrap">{liveStream.description}</p>
              )}
              <div className="flex items-center space-x-4">
                <a
                  href={getYouTubeWatchUrl(liveStream.videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
                >
                  <span>Watch on YouTube</span>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-12 text-center mb-12">
          <div className="text-6xl mb-4">📺</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Live Stream Currently</h2>
          <p className="text-gray-600 mb-6">
            We&apos;re not live right now. Check back later or watch our recent videos below.
          </p>
          <Link
            href="/videos"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            View All Videos
          </Link>
        </div>
      )}

      {recentVideos.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentVideos.slice(0, 6).map((video: any) => (
              <Link
                key={video._id}
                href={`/videos/${video.videoId}`}
                className="block group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="relative aspect-video">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {video.isLive && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 animate-pulse">
                        <span className="w-2 h-2 bg-white rounded-full"></span>
                        <span>LIVE</span>
                      </div>
                    )}
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
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

