'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function WritePage() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    try {
      const res = await axios.get('/api/auth/verify');
      if (res.data.authenticated) {
        // User is authenticated, redirect to admin blog creation
        router.push('/admin/blogs/new');
      } else {
        // Not authenticated, redirect to login
        router.push('/admin/login?redirect=/admin/blogs/new');
      }
    } catch (error) {
      // Not authenticated, redirect to login
      router.push('/admin/login?redirect=/admin/blogs/new');
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="text-gray-600">Redirecting...</div>
    </div>
  );
}

