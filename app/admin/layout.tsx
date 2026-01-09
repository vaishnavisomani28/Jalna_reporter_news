'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get('/api/auth/verify');
      if (res.data.authenticated) {
        setIsAuthenticated(true);
      } else {
        router.push('/admin/login');
      }
    } catch {
      router.push('/admin/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      // Redirect to homepage so user can view the site
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to homepage
      window.location.href = '/';
    }
  };

  // Auto-logout after 5 minutes of inactivity
  useInactivityLogout(isAuthenticated, handleLogout);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin" className="text-xl font-bold text-primary">
                Admin Dashboard
              </Link>
              <div className="flex space-x-4">
                <Link
                  href="/admin"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === '/admin'
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/admin/blogs"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/admin/blogs')
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Blogs
                </Link>
                <Link
                  href="/admin/videos"
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname.startsWith('/admin/videos')
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Videos
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

