import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/supabase-db';
import { requireAuth } from '@/lib/auth';

export const GET = requireAuth(async (request: NextRequest) => {
  try {
    const result = await blogDb.getAll(false, 1, 1000);
    const blogsData = result.data || [];

    // Transform to match expected format
    const formattedBlogs = blogsData.map((blog: any) => ({
      _id: blog.id,
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featured_image,
      published: blog.published,
      author: blog.author,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at,
    }));

    return NextResponse.json(formattedBlogs);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

