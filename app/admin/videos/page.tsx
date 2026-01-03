'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get('/api/videos?limit=50');
      setVideos(res.data.videos || []);
    } catch (error) {
      toast.error('Error fetching videos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await axios.get('/api/videos?refresh=true');
      toast.success('Videos refreshed successfully!');
      fetchVideos();
    } catch (error) {
      toast.error('Error refreshing videos');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Videos</h1>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
        >
          {isRefreshing ? 'Refreshing...' : '🔄 Refresh from YouTube'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-gray-600 mb-4">
          Videos are automatically fetched from your YouTube channel. Click &quot;Refresh from YouTube&quot;
          to update the list with the latest videos.
        </p>

        {videos.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No videos found. Try refreshing.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div key={video._id} className="border border-gray-200 rounded-lg p-4">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full aspect-video object-cover rounded mb-2"
                />
                <h3 className="font-semibold text-sm line-clamp-2 mb-2">{video.title}</h3>
                <p className="text-xs text-gray-500">
                  {new Date(video.publishedAt).toLocaleDateString()}
                </p>
                {video.isLive && (
                  <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                    LIVE
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

