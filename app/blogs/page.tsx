import { Metadata } from 'next';
import BlogCard from '@/components/BlogCard';
import WriteArticleButton from '@/components/WriteArticleButton';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blogs & Articles - Jalna Reporter News',
  description: 'Read our latest articles and blog posts',
};

async function getBlogs(page: number = 1) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    // Cache for 1 minute to improve performance
    const res = await fetch(`${baseUrl}/api/blogs?page=${page}&limit=12`, { 
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      console.error('Blogs API error:', res.status, res.statusText);
      throw new Error('Failed to fetch blogs');
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return { blogs: [], pagination: { page: 1, pages: 1 } };
  }
}

export default async function BlogsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = parseInt(searchParams.page || '1');
  const { blogs, pagination } = await getBlogs(page);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Blogs & Articles</h1>
        <WriteArticleButton />
      </div>

      {blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog: any) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {pagination.pages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              {page > 1 && (
                <a
                  href={`/blogs?page=${page - 1}`}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Previous
                </a>
              )}
              <span className="text-gray-600">
                Page {page} of {pagination.pages}
              </span>
              {page < pagination.pages && (
                <a
                  href={`/blogs?page=${page + 1}`}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  Next
                </a>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-600 text-center py-12">
          No articles available at the moment.
        </p>
      )}
    </div>
  );
}

