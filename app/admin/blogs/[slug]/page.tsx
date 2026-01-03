'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  // Safely get slug with null checks
  const slug = (params && params.slug ? (params.slug as string) : '') || '';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const featuredImageInputRef = useRef<HTMLInputElement>(null);
  const quillRef = useRef<any>(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    published: false,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [externalLinks, setExternalLinks] = useState<Array<{ title: string; url: string }>>([]);
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  useEffect(() => {
    // Check if params and slug are available
    const currentSlug = params && params.slug ? (params.slug as string) : '';
    
    if (!currentSlug || currentSlug.trim() === '') {
      // If no slug, wait a moment in case params is still loading, then redirect
      const timer = setTimeout(() => {
        const retrySlug = params && params.slug ? (params.slug as string) : '';
        if (!retrySlug || retrySlug.trim() === '') {
          toast.error('Invalid blog slug');
          setIsLoading(false);
          router.push('/admin/blogs');
        }
      }, 200);
      return () => clearTimeout(timer);
    }

    // Only fetch if slug is available - fetchBlog uses slug from closure
    if (currentSlug && currentSlug.trim()) {
      fetchBlog();
    }
  }, [slug, params, router]);

  const fetchBlog = async () => {
    if (!slug || slug.trim() === '') {
      toast.error('Invalid blog slug');
      setIsLoading(false);
      router.push('/admin/blogs');
      return;
    }

    try {
      // Next.js already decodes URL params, but we need to handle special characters
      // Try to decode first in case it's double-encoded, then encode for API
      let processedSlug = slug.trim();
      try {
        // If slug is already decoded, this won't change it
        processedSlug = decodeURIComponent(processedSlug);
      } catch {
        // If decode fails, use slug as-is
        processedSlug = processedSlug;
      }
      
      // Encode for API call
      const encodedSlug = encodeURIComponent(processedSlug);
      const res = await axios.get(`/api/admin/blogs/${encodedSlug}`);
      
      if (!res.data || !res.data.title) {
        throw new Error('Blog data not found or incomplete');
      }
      
      setFormData({
        title: res.data.title || '',
        content: res.data.content || '',
        excerpt: res.data.excerpt || '',
        featuredImage: res.data.featuredImage || '',
        published: res.data.published || false,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error fetching blog';
      toast.error(errorMessage);
      
      // Log error for debugging
      console.error('Error fetching blog for edit:', {
        slug,
        params: params,
        error: error.message,
        status: error.response?.status,
        responseData: error.response?.data,
      });
      
      setIsLoading(false);
      // Don't redirect immediately - let user see the error
      setTimeout(() => {
        router.push('/admin/blogs');
      }, 2000);
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axios.post('/api/upload', uploadFormData);
      const imageUrl = response.data.url;

      // Insert image into Quill editor
      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', imageUrl);
        quill.setSelection(range.index + 1);
      }

      toast.success('Image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error uploading image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await axios.post('/api/upload', uploadFormData);
      setFormData({ ...formData, featuredImage: response.data.url });
      toast.success('Featured image uploaded successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Error uploading image');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addExternalLink = () => {
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error('Please enter both title and URL');
      return;
    }

    // Validate URL
    try {
      new URL(newLinkUrl);
    } catch {
      toast.error('Please enter a valid URL (e.g., https://example.com)');
      return;
    }

    setExternalLinks([...externalLinks, { title: newLinkTitle, url: newLinkUrl }]);
    
    // Add link to content
    const linkHtml = `<p><a href="${newLinkUrl}" target="_blank" rel="noopener noreferrer"><strong>${newLinkTitle}</strong></a> - <a href="${newLinkUrl}" target="_blank" rel="noopener noreferrer">${newLinkUrl}</a></p>`;
    setFormData({ ...formData, content: formData.content + linkHtml });
    
    setNewLinkTitle('');
    setNewLinkUrl('');
    toast.success('Link added to content!');
  };

  const removeExternalLink = (index: number) => {
    setExternalLinks(externalLinks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Include featuredImage - if published, save it; if not published but image exists, keep it for preview
      const submitData = {
        ...formData,
        featuredImage: formData.featuredImage || '',
      };
      
      // Handle slug encoding for PUT request
      if (!slug || slug.trim() === '') {
        throw new Error('Invalid slug for update');
      }
      
      let processedSlug = slug.trim();
      try {
        processedSlug = decodeURIComponent(processedSlug);
      } catch {
        processedSlug = processedSlug;
      }
      const encodedSlug = encodeURIComponent(processedSlug);
      
      const res = await axios.put(`/api/blogs/${encodedSlug}`, submitData);
      toast.success('Blog updated successfully!');
      router.push('/admin/blogs');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Error updating blog';
      toast.error(errorMessage);
      
      // Log error for debugging
      if (process.env.NODE_ENV === 'development') {
        console.error('Update error:', {
          slug,
          error: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
      
      // If unauthorized, redirect to login
      if (error.response?.status === 401) {
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading or error if slug is missing
  if (!slug || slug.trim() === '') {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Invalid blog slug. Redirecting...</p>
      </div>
    );
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Blog</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            id="title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-2">
            Excerpt (Short Description)
          </label>
          <textarea
            id="excerpt"
            rows={3}
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700 mb-2">
            Featured Image (Main Image for Blog)
          </label>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => featuredImageInputRef.current?.click()}
                disabled={isUploadingImage}
                className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{isUploadingImage ? 'Uploading...' : 'Upload Image'}</span>
              </button>
              <input
                ref={featuredImageInputRef}
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageUpload}
                className="hidden"
              />
            </div>
            {formData.featuredImage && (
              <div className="mt-2">
                <img
                  src={formData.featuredImage}
                  alt="Featured preview"
                  className="max-w-md h-48 object-cover rounded-lg border border-gray-300"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, featuredImage: '' })}
                  className="mt-2 text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove Image
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Optional:</span> Upload an image from your computer. Max size: 5MB (JPEG, PNG, GIF, WebP). Image will only be saved when you publish the blog.
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            Content * (Write your article here)
          </label>
          <div className="mb-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingImage}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center space-x-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{isUploadingImage ? 'Uploading...' : 'Upload Image to Content'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-1">
              Click to upload images directly into your article content
            </p>
          </div>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={formData.content}
            onChange={(value) => setFormData({ ...formData, content: value })}
            className="bg-white"
            modules={{
              toolbar: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['link', 'image'],
                [{ align: [] }],
                ['clean'],
              ],
            }}
          />
          <p className="text-sm text-gray-500 mt-2">
            💡 Tip: Use the toolbar to format text, add links, and insert images. You can also paste image URLs directly.
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span>Add External Links (YouTube, Websites, etc.)</span>
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Add links to YouTube videos, websites, or any external URLs. These will be automatically added to your article content.
          </p>
          
          <div className="space-y-3 mb-4">
            {externalLinks.map((link, index) => (
              <div key={index} className="bg-white p-3 rounded border border-gray-200 flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{link.title}</p>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                    {link.url}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => removeExternalLink(index)}
                  className="text-red-600 hover:text-red-800 ml-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              placeholder="Link Title (e.g., Watch on YouTube)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <input
              type="url"
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              placeholder="URL (e.g., https://youtube.com/watch?v=...)"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={addExternalLink}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Link</span>
          </button>
          <p className="text-xs text-gray-500 mt-2">
            Examples: YouTube videos, news websites, social media profiles, etc.
          </p>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
            Published
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Updating...' : 'Update Blog'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

