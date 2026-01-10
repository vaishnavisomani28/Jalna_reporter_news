import Link from 'next/link';
import SafeImage from './SafeImage';
import { formatDate } from '@/lib/utils';

interface BlogCardProps {
  blog: {
    _id: string;
    slug: string;
    title: string;
    excerpt?: string;
    featuredImage?: string;
    createdAt: string | Date;
  };
}

export default function BlogCard({ blog }: BlogCardProps) {
  // Validate featured image URL
  const isValidImage = blog.featuredImage && 
    (blog.featuredImage.startsWith('http') || 
     blog.featuredImage.startsWith('/uploads/') || 
     blog.featuredImage.startsWith('/') ||
     blog.featuredImage.includes('supabase.co'));

  return (
    <Link href={`/blogs/${encodeURIComponent(blog.slug)}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {isValidImage && (
          <div className="relative h-48 overflow-hidden">
            <SafeImage
              src={blog.featuredImage!}
              alt={blog.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-5 md:p-6">
          <h3 className="font-semibold text-base md:text-lg text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-3 leading-tight">
            {blog.title}
          </h3>
          {blog.excerpt && (
            <p className="text-sm md:text-base text-gray-600 line-clamp-3 mb-4 leading-relaxed">
              {blog.excerpt}
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <p className="text-xs md:text-sm text-gray-500">
              {formatDate(blog.createdAt)}
            </p>
            <span className="text-primary text-xs md:text-sm font-medium group-hover:underline">
              Read More →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

