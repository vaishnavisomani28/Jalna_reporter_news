'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    blogs: 0,
    videos: 0,
    publishedBlogs: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [blogsRes, videosRes] = await Promise.all([
        axios.get('/api/blogs?limit=1'),
        axios.get('/api/videos?limit=1'),
      ]);

      const allBlogsRes = await axios.get('/api/admin/blogs/all');
      const publishedCount = allBlogsRes.data.filter((b: any) => b.published).length;

      setStats({
        blogs: blogsRes.data.pagination?.total || 0,
        videos: videosRes.data.pagination?.total || 0,
        publishedBlogs: publishedCount,
      });
    } catch (error) {
      // Error handled silently - stats will show 0
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Blogs</h3>
          <p className="text-3xl font-bold text-primary">{stats.blogs}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Published Blogs</h3>
          <p className="text-3xl font-bold text-green-600">{stats.publishedBlogs}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Videos</h3>
          <p className="text-3xl font-bold text-primary">{stats.videos}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/admin/blogs/new"
            className="block p-6 border-2 border-dashed border-primary rounded-lg hover:bg-primary hover:text-white transition-all text-center group"
          >
            <div className="text-4xl mb-2">📝</div>
            <span className="text-primary group-hover:text-white font-bold text-lg">+ Create New Blog</span>
            <p className="text-sm text-gray-600 group-hover:text-white/90 mt-1">Add articles and news</p>
          </Link>
          <button
            onClick={async () => {
              try {
                await axios.get('/api/videos?refresh=true');
                alert('Videos refreshed successfully!');
              } catch (error) {
                alert('Error refreshing videos');
              }
            }}
            className="p-6 border-2 border-dashed border-primary rounded-lg hover:bg-primary hover:text-white transition-all text-center group"
          >
            <div className="text-4xl mb-2">🔄</div>
            <span className="text-primary group-hover:text-white font-bold text-lg">Refresh Videos</span>
            <p className="text-sm text-gray-600 group-hover:text-white/90 mt-1">Fetch latest from YouTube</p>
          </button>
        </div>
      </div>
    </div>
  );
}

