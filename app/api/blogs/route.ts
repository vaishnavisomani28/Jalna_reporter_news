import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/supabase-db';
import { requireAuth } from '@/lib/auth';
import { blogSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { sanitizeInput } from '@/lib/validation';
import { requireCSRF } from '@/lib/csrf';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await checkRateLimit(`blogs:${ip}`);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')));

    // Get published blogs with pagination
    const result = await blogDb.getAll(true, page, limit);
    const blogsData = result.data || [];
    const total = result.count || 0;

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

    return NextResponse.json({
      blogs: formattedBlogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    logger.error('Error fetching blogs', error instanceof Error ? error : undefined);
    // Return empty data instead of error to prevent page crashes
    return NextResponse.json({
      blogs: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      },
    });
  }
}

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    // CSRF protection
    if (!requireCSRF(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await checkRateLimit(`blogs:post:${ip}`);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.reset).toISOString(),
          },
        }
      );
    }

    const body = await request.json();
    
    // Validate input using Zod schema
    const validationResult = blogSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, content, excerpt, featuredImage, published } = validationResult.data;

    // Sanitize inputs
    const sanitizedTitle = sanitizeInput(title);
    const sanitizedExcerpt = excerpt ? sanitizeInput(excerpt) : undefined;
    
    // Handle featuredImage - convert empty string to undefined
    const sanitizedFeaturedImage = featuredImage && featuredImage.trim() !== '' 
      ? featuredImage.trim() 
      : undefined;

    // Generate slug with collision handling
    let baseSlug = sanitizedTitle
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let slug = baseSlug;
    let counter = 1;
    let slugExists = await blogDb.checkSlugExists(slug);

    // Handle slug collisions by appending a number
    while (slugExists) {
      slug = `${baseSlug}-${counter}`;
      slugExists = await blogDb.checkSlugExists(slug);
      counter++;
      
      // Prevent infinite loop
      if (counter > 100) {
        return NextResponse.json(
          { error: 'Unable to generate unique slug. Please try a different title.' },
          { status: 400 }
        );
      }
    }

    try {
      const blog = await blogDb.create({
        title: sanitizedTitle,
        slug,
        content,
        excerpt: sanitizedExcerpt,
        featured_image: published ? sanitizedFeaturedImage : undefined,
        published: published || false,
        author: 'Admin',
      });

    // Transform to match expected format
    const formattedBlog = {
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
    };

    logger.info('Blog created successfully', { slug, title: sanitizedTitle });
    return NextResponse.json(formattedBlog, { status: 201 });
  } catch (error: unknown) {
    logger.error('Error creating blog', error instanceof Error ? error : undefined);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      // PostgreSQL unique violation
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

