'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useInactivityLogout } from '@/hooks/useInactivityLogout';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/verify');
        if (res.data.authenticated) {
          setIsAuthenticated(true);
        }
      } catch {
        // Not authenticated, ignore
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      setIsAuthenticated(false);
      toast.success('Logged out due to inactivity');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      setIsAuthenticated(false);
      window.location.href = '/';
    }
  };

  // Auto-logout after 5 minutes of inactivity (only if already logged in)
  useInactivityLogout(isAuthenticated, handleLogout);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post('/api/auth/login', formData);
      toast.success('Login successful!');
      
      // Check for redirect parameter
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect');
      
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/admin');
      }
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              required
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}

