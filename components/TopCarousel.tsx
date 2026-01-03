'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { getYouTubeWatchUrl } from '@/lib/youtube';

export default function TopCarousel() {
  const [items, setItems] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCarouselData();
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000); // Auto-rotate every 5 seconds

    return () => clearInterval(interval);
  }, [items.length]);

  const fetchCarouselData = async () => {
    try {
      const [videosRes, blogsRes] = await Promise.all([
        axios.get('/api/videos?limit=4').catch(err => {
          // Silently handle errors - videos will just be empty
          console.error('Error fetching videos for carousel:', err);
          return { data: { videos: [], liveStream: null } };
        }),
        axios.get('/api/blogs?limit=3').catch(err => {
          console.error('Error fetching blogs:', err);
          return { data: { blogs: [] } };
        }),
      ]);

      const items: any[] = [];

      // Handle videos response
      const videosData = videosRes.data || { videos: [], liveStream: null };
      
      // Add live stream first if available
      if (videosData.liveStream) {
        items.push({
          type: 'live',
          ...videosData.liveStream,
        });
      }

      // Add latest videos
      if (videosData.videos && Array.isArray(videosData.videos)) {
        videosData.videos.slice(0, 3).forEach((video: any) => {
          items.push({
            type: 'video',
            ...video,
          });
        });
      }

      // Handle blogs response
      const blogsData = blogsRes.data || { blogs: [] };
      
      // Add latest blogs
      if (blogsData.blogs && Array.isArray(blogsData.blogs)) {
        blogsData.blogs.slice(0, 2).forEach((blog: any) => {
          items.push({
            type: 'blog',
            ...blog,
          });
        });
      }

      setItems(items);
    } catch (error) {
      console.error('Error fetching carousel data:', error);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <span className="text-sm">Loading latest content...</span>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  const currentItem = items[currentIndex];

  return (
    <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-6">
      <div className="container mx-auto px-4">
        <div className="mb-4">
          <h2 className="text-xl font-bold mb-1">Latest Updates</h2>
          <p className="text-sm text-white/80">Stay updated with our latest content</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.slice(0, 4).map((item, index) => (
            <Link
              key={index}
              href={
                item.type === 'live'
                  ? getYouTubeWatchUrl(item.videoId)
                  : item.type === 'video'
                  ? `/videos/${item.videoId}`
                  : `/blogs/${encodeURIComponent(item.slug)}`
              }
              className={`block bg-white/10 hover:bg-white/20 rounded-lg p-4 transition-all ${
                index === currentIndex ? 'ring-2 ring-white' : ''
              }`}
              target={item.type === 'live' ? '_blank' : '_self'}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  {item.type === 'live' && (
                    <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🔴</span>
                    </div>
                  )}
                  {item.type === 'video' && item.thumbnail && (
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  {item.type === 'video' && !item.thumbnail && (
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📹</span>
                    </div>
                  )}
                  {item.type === 'blog' && (
                    <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📰</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {item.type === 'live' && (
                      <span className="bg-red-600 px-2 py-0.5 rounded text-xs font-bold flex items-center space-x-1">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        <span>LIVE</span>
                      </span>
                    )}
                    <span className="text-xs text-white/70">
                      {item.type === 'video' ? 'Video' : item.type === 'blog' ? 'Article' : 'Live'}
                    </span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{item.title}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {items.length > 4 && (
          <div className="flex items-center justify-center space-x-2 mt-4">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

