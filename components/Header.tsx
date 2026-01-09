'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getYouTubeWatchUrl } from '@/lib/youtube';
import Logo from './Logo';

export default function Header() {
  const pathname = usePathname();
  const [isLive, setIsLive] = useState(false);
  const [liveVideo, setLiveVideo] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    checkLiveStream();
    checkAdminStatus();
    const interval = setInterval(checkLiveStream, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkAdminStatus = async () => {
    try {
      const res = await axios.get('/api/auth/verify');
      if (res.data && res.data.authenticated) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      // Silently fail - user is just not admin, this is not an error
      setIsAdmin(false);
    }
  };

  const checkLiveStream = async () => {
    try {
      const res = await axios.get('/api/videos?limit=1');
      if (res.data.liveStream) {
        setIsLive(true);
        setLiveVideo(res.data.liveStream);
      } else {
        setIsLive(false);
        setLiveVideo(null);
      }
    } catch (error) {
      // Silently fail - live stream check is not critical
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/live', label: 'Live' },
    { href: '/videos', label: 'Videos' },
    { href: '/blogs', label: 'Blogs & Articles' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Logo />
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-700 hover:text-primary'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLive && liveVideo && (
              <Link
                href={getYouTubeWatchUrl(liveVideo.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors animate-pulse"
              >
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span className="text-sm font-semibold">LIVE</span>
              </Link>
            )}
            <Link
              href="/write"
              className="flex items-center space-x-2 bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors font-semibold shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Write Article</span>
            </Link>
          </nav>
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 p-2"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-2 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-sm font-medium px-4 py-2 rounded-md transition-colors ${
                    pathname === link.href
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              {isLive && liveVideo && (
                <Link
                  href={getYouTubeWatchUrl(liveVideo.videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors animate-pulse mx-4"
                >
                  <span className="w-2 h-2 bg-white rounded-full"></span>
                  <span className="text-sm font-semibold">LIVE</span>
                </Link>
              )}
              <Link
                href="/write"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors font-semibold mx-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Write Article</span>
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

