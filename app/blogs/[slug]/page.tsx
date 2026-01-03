import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import ShareButtons from '@/components/ShareButtons';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';
import DOMPurify from 'isomorphic-dompurify';

const SafeImage = dynamic(() => import('@/components/SafeImage'), { ssr: false });

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
    if (!res.ok) throw new Error('Blog not found');
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
  } catch {
    return {
      title: 'Article Not Found - Jalna Reporter News',
    };
  }
}

async function getBlog(slug: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    // Decode the slug first (Next.js params are already decoded, but double-encode might happen)
    const decodedSlug = decodeURIComponent(slug);
    // Then encode for the API call
    const encodedSlug = encodeURIComponent(decodedSlug);
    // Cache for 5 minutes to improve performance (blog content doesn't change frequently)
    const res = await fetch(`${baseUrl}/api/blogs/${encodedSlug}`, { 
      next: { revalidate: 300 },
    });
    if (!res.ok) {
      console.error('Blog API error:', res.status, res.statusText);
      return null;
    }
    return await res.json();
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
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {blog.title}
        </h1>

        <div className="mb-6 text-gray-600">
          <p>{formatDate(blog.createdAt)}</p>
          {blog.author && <p>By {blog.author}</p>}
        </div>

        {blog.featuredImage && 
         (blog.featuredImage.startsWith('http') || 
          blog.featuredImage.startsWith('/uploads/') || 
          blog.featuredImage.startsWith('/') ||
          blog.featuredImage.includes('supabase.co')) && (
          <div className="relative h-96 mb-8 rounded-lg overflow-hidden">
            <SafeImage
              src={blog.featuredImage}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div
          className="prose max-w-none mb-8"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }}
        />

        <ShareButtons url={`/blogs/${blog.slug}`} title={blog.title} />
      </article>
    </div>
  );
}

