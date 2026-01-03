'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get('/api/admin/blogs/all');
      setBlogs(res.data);
    } catch (error) {
      toast.error('Error fetching blogs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return;

    try {
      const res = await axios.delete(`/api/blogs/${slug}`);
      toast.success('Blog deleted successfully');
      fetchBlogs();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error deleting blog';
      toast.error(errorMessage);
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
        <Link
          href="/admin/blogs/new"
          className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
        >
          + New Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-600 mb-4">No blogs yet.</p>
          <Link
            href="/admin/blogs/new"
            className="text-primary hover:underline font-semibold"
          >
            Create your first blog →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.map((blog) => (
                <tr key={blog._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    <div className="text-sm text-gray-500">{blog.slug}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        blog.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {blog.slug ? (
                      <Link
                        href={`/admin/blogs/${encodeURIComponent(blog.slug)}`}
                        className="text-primary hover:text-primary-dark mr-4 font-semibold hover:underline"
                      >
                        ✏️ Edit
                      </Link>
                    ) : (
                      <span className="text-gray-400 mr-4" title="Slug missing - cannot edit">
                        ✏️ Edit
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        if (blog.slug) {
                          handleDelete(blog.slug, blog.title);
                        } else {
                          toast.error('Cannot delete: Blog slug is missing');
                        }
                      }}
                      className="text-red-600 hover:text-red-900 font-semibold ml-4"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

