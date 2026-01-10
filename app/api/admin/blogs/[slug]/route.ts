import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/supabase-db';
import { requireAuth } from '@/lib/auth';
import { normalizeAuthorName } from '@/lib/utils';

export const GET = requireAuth(async (
  request: NextRequest,
  { params }: { params: { slug: string } }
) => {
  try {
    // Check if params and slug exist
    if (!params || !params.slug) {
      return NextResponse.json(
        { error: 'Blog slug is required' },
        { status: 400 }
      );
    }

    // Handle slug decoding - Next.js may have already decoded it
    let decodedSlug = params.slug.trim();
    if (!decodedSlug) {
      return NextResponse.json(
        { error: 'Invalid blog slug' },
        { status: 400 }
      );
    }

    try {
      // Try to decode in case it's URL encoded
      decodedSlug = decodeURIComponent(decodedSlug);
    } catch {
      // If decode fails, use slug as-is (might already be decoded)
      decodedSlug = decodedSlug;
    }
    
    const blog = await blogDb.getBySlug(decodedSlug, false);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Transform to match expected format and normalize author name
    const formattedBlog = {
      _id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featured_image,
      published: blog.published,
      author: normalizeAuthorName(blog.author), // Normalize author name
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    };

    return NextResponse.json(formattedBlog);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Error fetching blog: ${errorMessage}` },
      { status: 500 }
    );
  }
});

