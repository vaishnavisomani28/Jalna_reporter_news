import { Metadata } from 'next';
import dynamicImport from 'next/dynamic';
import ShareButtons from '@/components/ShareButtons';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import SanitizedContent from '@/components/SanitizedContent';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const SafeImage = dynamicImport(() => import('@/components/SafeImage'), { ssr: false });

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    // Encode the slug for URL
    const encodedSlug = encodeURIComponent(params.slug);
    // Cache metadata for 5 minutes
    const res = await fetch(`${baseUrl}/api/blogs/${encodedSlug}`, { 
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      // Return default metadata if blog not found
      return {
        title: 'Article Not Found - Jalna Reporter News',
        description: 'The article you are looking for could not be found.',
      };
    }
    const blog = await res.json();

    return {
      title: `${blog.title} - Jalna Reporter News`,
      description: blog.excerpt || blog.title,
      openGraph: {
        title: blog.title,
        description: blog.excerpt || blog.title,
        images: blog.featuredImage ? [blog.featuredImage] : [],
      },
    };
  } catch (error) {
    // Return default metadata on any error
    return {
      title: 'Article - Jalna Reporter News',
      description: 'Read our latest articles and news.',
    };
  }
}

async function getBlog(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    // Decode the slug first (Next.js params are already decoded, but double-encode might happen)
    let decodedSlug = slug;
    try {
      decodedSlug = decodeURIComponent(slug);
    } catch {
      // If decode fails, use slug as-is
      decodedSlug = slug;
    }
    // Then encode for the API call
    const encodedSlug = encodeURIComponent(decodedSlug);
    // Cache for 5 minutes to improve performance (blog content doesn't change frequently)
    const res = await fetch(`${baseUrl}/api/blogs/${encodedSlug}`, { 
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error('Blog API error:', res.status, res.statusText);
      // Try to get error message from response
      try {
        const errorData = await res.json();
        console.error('Blog API error details:', errorData.error);
      } catch {
        // Ignore JSON parse errors
      }
      return null;
    }
    const blog = await res.json();
    return blog;
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10 lg:py-12">
        <article className="article-container">
          {/* Article Header */}
          <header className="mb-8 md:mb-10 lg:mb-12">
            <h1 className="article-title" lang="mr">
              {blog.title}
            </h1>

            <div className="article-meta">
              <time className="block mb-1.5" dateTime={blog.createdAt}>
                {formatDate(blog.createdAt)}
              </time>
              {blog.author && (
                <span className="block text-sm md:text-base text-gray-600">
                  By <span className="font-medium text-gray-900">{blog.author}</span>
                </span>
              )}
            </div>
          </header>

          {/* Featured Image */}
          {blog.featuredImage && 
           (blog.featuredImage.startsWith('http') || 
            blog.featuredImage.startsWith('/uploads/') || 
            blog.featuredImage.startsWith('/') ||
            blog.featuredImage.includes('supabase.co')) && (
            <div className="relative w-full mb-10 md:mb-12 lg:mb-16 rounded-lg overflow-hidden shadow-xl">
              <div className="relative aspect-video md:aspect-[16/9] bg-gray-100">
                <SafeImage
                  src={blog.featuredImage}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 800px"
                />
              </div>
            </div>
          )}

          {/* Article Content */}
          <div className="article-content">
            <SanitizedContent
              html={blog.content}
              className=""
            />
          </div>

          {/* Share Buttons */}
          <div className="mt-12 md:mt-16 lg:mt-20 pt-8 md:pt-10 border-t border-gray-200">
            <ShareButtons url={`/blogs/${blog.slug}`} title={blog.title} />
          </div>
        </article>
      </div>
    </div>
  );
}

