import { Metadata } from 'next';
import VideoCard from '@/components/VideoCard';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Videos - Jalna Reporter News',
  description: 'Watch all our latest videos and live streams',
};

async function getVideos(page: number = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    // Allow auto-refresh to ensure videos are always available
    const res = await fetch(`${baseUrl}/api/videos?page=${page}&limit=12&autoRefresh=true`, { 
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error('Videos API error:', res.status, res.statusText);
      throw new Error('Failed to fetch videos');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching videos:', error);
    return { videos: [], pagination: { page: 1, pages: 1 } };
  }
}

export default async function VideosPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { videos, pagination } = await getVideos(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">All Videos</h1>

      {videos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {videos.map((video: any) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              {page > 1 && (
                <a
                  href={`/videos?page=${page - 1}`}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Previous
                </a>
              )}
              <span className="text-gray-600">
                Page {page} of {pagination.pages}
              </span>
              {page < pagination.pages && (
                <a
                  href={`/videos?page=${page + 1}`}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-center py-12">
          No videos available at the moment.
        </p>
      )}
    </div>
  );
}

