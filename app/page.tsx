import { Metadata } from 'next';
import Link from 'next/link';
import VideoCard from '@/components/VideoCard';
import BlogCard from '@/components/BlogCard';
import LiveStreamBanner from '@/components/LiveStreamBanner';
import TopCarousel from '@/components/TopCarousel';

// Force dynamic rendering to avoid build timeout
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Jalna Reporter News - Latest News & Updates',
  description: 'Stay updated with the latest news, videos, and articles from Jalna Reporter News',
  openGraph: {
    title: 'Jalna Reporter News',
    description: 'Latest news, videos, and articles',
    type: 'website',
  },
};

async function getVideos() {
  try {
    // Use absolute URL for server-side fetch in production
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    // Allow auto-refresh if database is empty, cache for 2 minutes otherwise
    const res = await fetch(`${baseUrl}/api/videos?limit=6&autoRefresh=true`, { 
      next: { revalidate: 120 },
    });
    if (!res.ok) {
      console.error('Videos API error:', res.status, res.statusText);
      // Even if there's an error, try to parse the response for error message
      try {
        const errorData = await res.json();
        return { videos: [], liveStream: null, error: errorData.error };
      } catch {
        return { videos: [], liveStream: null };
      }
    }
    const data = await res.json();
    // Always return videos array even if there's an error in the response
    return {
      videos: data.videos || [],
      liveStream: data.liveStream || null,
      error: data.error,
    };
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], liveStream: null };
  }
}

async function getBlogs() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    // Cache for 2 minutes to improve performance (blogs don't change frequently)
    const res = await fetch(`${baseUrl}/api/blogs?limit=6`, { 
      next: { revalidate: 120 },
    });
    if (!res.ok) {
      console.error('Blogs API error:', res.status, res.statusText);
      return { blogs: [] };
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [] };
  }
}

export default async function HomePage() {
  const { videos, liveStream } = await getVideos();
  const { blogs } = await getBlogs();

  return (
    <div>
      {/* Top Carousel - Below Header, Above Content */}
      <TopCarousel />
      
      <div className="container mx-auto px-4 py-8">
        {/* Live Stream Banner - Always show if live stream is available */}
        {liveStream && liveStream.videoId && (
          <LiveStreamBanner video={liveStream} />
        )}

        <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Latest Articles</h2>
            <p className="text-base md:text-lg text-gray-600">Read our latest news and articles</p>
          </div>
          <Link
            href="/blogs"
            className="hidden md:flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>
        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 6).map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-base md:text-lg">No articles available at the moment.</p>
            <p className="text-gray-500 text-sm md:text-base mt-2">Check back soon for new articles!</p>
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/blogs"
            className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <span>View All Articles</span>
            <span>→</span>
          </Link>
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Latest Videos</h2>
            <p className="text-base md:text-lg text-gray-600">Watch our latest content from YouTube</p>
          </div>
          <Link
            href="/videos"
            className="hidden md:flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <span>View All</span>
            <span>→</span>
          </Link>
        </div>
        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.slice(0, 6).map((video: any) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-12 text-center">
            <p className="text-gray-600 text-base md:text-lg">No videos available at the moment.</p>
            <p className="text-gray-500 text-sm md:text-base mt-2">Videos will appear here once fetched from YouTube.</p>
          </div>
        )}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/videos"
            className="inline-flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <span>View All Videos</span>
            <span>→</span>
          </Link>
        </div>
      </section>
      </div>
    </div>
  );
}

