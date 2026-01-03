import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/supabase-db';
import { getAuthUser } from '@/lib/auth';
import { blogSchema, sanitizeInput } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { requireCSRF } from '@/lib/csrf';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await checkRateLimit(`blog:${ip}`);
    
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

    // Decode the slug in case it's URL encoded
    const decodedSlug = decodeURIComponent(params.slug);
    
    const blog = await blogDb.getBySlug(decodedSlug, true);

    if (!blog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(formattedBlog);
  } catch (error) {
    logger.error('Error fetching blog', error instanceof Error ? error : undefined, {
      slug: params.slug,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
    const rateLimitResult = await checkRateLimit(`blog:update:${ip}`);
    
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

    // Handle slug decoding
    let decodedSlug = params.slug;
    try {
      decodedSlug = decodeURIComponent(params.slug);
    } catch {
      decodedSlug = params.slug; // Use as-is if decode fails
    }
    
    const body = await request.json();

    // Validate input using Zod schema (partial validation for updates)
    const validationResult = blogSchema.partial().safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { title, content, excerpt, featuredImage, published } = validationResult.data;
    
    // Handle featuredImage - convert empty string to undefined
    const sanitizedFeaturedImage = featuredImage && featuredImage.trim() !== '' 
      ? featuredImage.trim() 
      : undefined;

    const existingBlog = await blogDb.getBySlug(decodedSlug, false);

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    const updates: any = {};

    if (title) {
      const sanitizedTitle = sanitizeInput(title);
      updates.title = sanitizedTitle;
      
      // Generate new slug with collision handling
      let baseSlug = sanitizedTitle
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      
      let newSlug = baseSlug;
      let counter = 1;
      let slugExists = await blogDb.checkSlugExists(newSlug);
      
      // Only check collision if slug is different from current
      if (slugExists && newSlug !== decodedSlug) {
        while (slugExists && counter <= 100) {
          newSlug = `${baseSlug}-${counter}`;
          slugExists = await blogDb.checkSlugExists(newSlug);
          if (newSlug === decodedSlug) {
            slugExists = false; // Current blog's slug is fine
          }
          counter++;
        }
        
        if (counter > 100) {
          return NextResponse.json(
            { error: 'Unable to generate unique slug. Please try a different title.' },
            { status: 400 }
          );
        }
      }
      
      updates.slug = newSlug;
    }

    if (content) updates.content = content;
    if (excerpt !== undefined) {
      updates.excerpt = excerpt ? sanitizeInput(excerpt) : undefined;
    }
    
    // Only update featuredImage if blog is being published
    if (featuredImage !== undefined) {
      updates.featured_image = published ? (featuredImage || undefined) : (existingBlog.featured_image || undefined);
    }
    
    if (published !== undefined) updates.published = published;

    const blog = await blogDb.update(decodedSlug, updates);

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

    logger.info('Blog updated successfully', { slug: decodedSlug, newSlug: updates.slug });
    return NextResponse.json(formattedBlog);
  } catch (error: unknown) {
    logger.error('Error updating blog', error instanceof Error ? error : undefined, {
      slug: params.slug,
    });
    
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
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const user = await getAuthUser(request);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // CSRF protection
    if (!requireCSRF(request)) {
      return NextResponse.json(
        { error: 'Invalid request origin' },
        { status: 403 }
      );
    }

    // Handle slug decoding
    let decodedSlug = params.slug;
    try {
      decodedSlug = decodeURIComponent(params.slug);
    } catch {
      decodedSlug = params.slug; // Use as-is if decode fails
    }
    
    const existingBlog = await blogDb.getBySlug(decodedSlug, false);

    if (!existingBlog) {
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

    await blogDb.delete(decodedSlug);

    logger.info('Blog deleted successfully', { slug: decodedSlug });
    return NextResponse.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    logger.error('Error deleting blog', error instanceof Error ? error : undefined, {
      slug: params.slug,
    });
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

