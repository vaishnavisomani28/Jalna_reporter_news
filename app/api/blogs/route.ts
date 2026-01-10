import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/supabase-db';
import { requireAuth } from '@/lib/auth';
import { blogSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { sanitizeInput } from '@/lib/validation';
import { requireCSRF } from '@/lib/csrf';
import { generateSlug, normalizeAuthorName } from '@/lib/utils';

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
    let result;
    try {
      result = await blogDb.getAll(true, page, limit);
    } catch (dbError) {
      logger.error('Supabase connection error in blog GET', dbError instanceof Error ? dbError : undefined);
      // Return 200 with empty data to prevent frontend crashes
      return NextResponse.json({
        blogs: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        },
        error: 'Database connection failed. Please check Supabase configuration.',
      }, { status: 200 });
    }
    
    const blogsData = result.data || [];
    const total = result.count || 0;

    // Transform to match expected format and auto-fix blogs with empty/invalid slugs
    const formattedBlogs = await Promise.all(
      blogsData.map(async (blog: any) => {
        // Auto-fix empty or "EMPTY" slugs
        let slug = blog.slug;
        const needsFix = !slug || slug.trim() === '' || slug.toLowerCase() === 'empty';
        
        if (needsFix && blog.title) {
          // Generate new slug from title
          const { generateSlug } = await import('@/lib/utils');
          slug = generateSlug(blog.title);
          
          // Ensure slug is not empty
          if (!slug || slug.trim() === '') {
            slug = `blog-${Date.now()}-${Math.random().toString(36).substring(7)}`;
          }
          
          // Update slug in database by ID (async, don't wait)
          blogDb.updateById(blog.id, { slug }).catch((err) => {
            logger.error('Failed to auto-fix slug', err instanceof Error ? err : undefined, { blogId: blog.id });
          });
        }
        
        // Normalize author name - replace "Admin" with correct name
        return {
          _id: blog.id,
          title: blog.title,
          slug: slug || `blog-${blog.id}`,
          content: blog.content,
          excerpt: blog.excerpt,
          featuredImage: blog.featured_image,
          published: blog.published,
          author: normalizeAuthorName(blog.author),
          createdAt: blog.created_at,
          updatedAt: blog.updated_at,
        };
      })
    );

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

    // Generate slug with collision handling using improved slug generation
    let baseSlug = generateSlug(sanitizedTitle);
    
    // Ensure slug is not empty
    if (!baseSlug || baseSlug.trim() === '') {
      baseSlug = `blog-${Date.now()}`;
    }

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

    // Final validation: ensure slug is not empty
    if (!slug || slug.trim() === '') {
      logger.error('Generated slug is empty', undefined, { title: sanitizedTitle });
      return NextResponse.json(
        { error: 'Unable to generate a valid slug from the title. Please use a title with at least some English characters or numbers.' },
        { status: 400 }
      );
    }

    const blog = await blogDb.create({
      title: sanitizedTitle,
      slug,
      content,
      excerpt: sanitizedExcerpt,
      featured_image: published ? sanitizedFeaturedImage : undefined,
      published: published || false,
      author: 'P. Ravikant Danam (Jalna)',
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
    return NextResponse.json(
      { message: 'Blog created successfully', blog: formattedBlog },
      { status: 201 }
    );
  } catch (error: unknown) {
    logger.error('Error creating blog', error instanceof Error ? error : undefined);
    
    if (error && typeof error === 'object' && 'code' in error && error.code === '23505') {
      // PostgreSQL unique violation
      return NextResponse.json(
        { error: 'A blog with this slug already exists' },
        { status: 400 }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for specific errors
    if (errorMessage.includes('Supabase') || errorMessage.includes('supabase')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check Supabase configuration.' },
        { status: 400 }
      );
    }
    
    // Return 400 instead of 500 for better error handling
    return NextResponse.json(
      { error: `Failed to create blog: ${errorMessage}` },
      { status: 400 }
    );
  }
});

