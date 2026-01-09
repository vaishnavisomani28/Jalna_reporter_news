import { NextRequest, NextResponse } from 'next/server';
import { blogDb } from '@/lib/supabase-db';
import { getAuthUser } from '@/lib/auth';
import { blogSchema, sanitizeInput } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';
import { requireCSRF } from '@/lib/csrf';
import { generateSlug } from '@/lib/utils';

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
    let decodedSlug = params.slug;
    try {
      decodedSlug = decodeURIComponent(params.slug);
    } catch {
      // If decode fails, use slug as-is (might already be decoded)
      decodedSlug = params.slug;
    }
    
    // Validate slug is not empty
    if (!decodedSlug || decodedSlug.trim() === '' || decodedSlug.toLowerCase() === 'empty') {
      logger.error('Invalid slug in GET request', undefined, { slug: params.slug, decodedSlug });
      return NextResponse.json(
        { error: 'Invalid blog URL. Blog slug is missing or invalid.' },
        { status: 404 }
      );
    }
    
    let blog;
    try {
      // First try to get published blog
      blog = await blogDb.getBySlug(decodedSlug, true);
      
      // If not found and slug might be empty, try to find by ID or check for empty slugs
      if (!blog) {
        // Try without published filter to see if blog exists but is unpublished
        blog = await blogDb.getBySlug(decodedSlug, false);
        if (blog && !blog.published) {
          return NextResponse.json(
            { error: 'Blog not found or not published yet.' },
            { status: 404 }
          );
        }
      }
    } catch (dbError) {
      logger.error('Supabase connection error in blog GET', dbError instanceof Error ? dbError : undefined);
      // Return 404 instead of 503 to prevent frontend errors
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }

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
    
    // Check if it's a database connection error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('Supabase') || errorMessage.includes('supabase') || errorMessage.includes('connection')) {
      // Return 404 instead of 503 to prevent frontend errors
      return NextResponse.json(
        { error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // For other errors, return 404 to prevent frontend crashes
    return NextResponse.json(
      { error: 'Blog not found' },
      { status: 404 }
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
      
      // Generate new slug with collision handling using improved slug generation
      let baseSlug = generateSlug(sanitizedTitle);
      
      // Ensure slug is not empty
      if (!baseSlug || baseSlug.trim() === '') {
        baseSlug = `blog-${Date.now()}`;
      }
      
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
      
      // Final validation: ensure slug is not empty
      if (!newSlug || newSlug.trim() === '') {
        logger.error('Generated slug is empty', undefined, { title: sanitizedTitle });
        return NextResponse.json(
          { error: 'Unable to generate a valid slug from the title. Please use a title with at least some English characters or numbers.' },
          { status: 400 }
        );
      }
      
      updates.slug = newSlug;
    }

    if (content) updates.content = content;
    if (excerpt !== undefined) {
      updates.excerpt = excerpt ? sanitizeInput(excerpt) : undefined;
    }
    
    // Only update featuredImage if provided
    if (sanitizedFeaturedImage !== undefined) {
      updates.featured_image = published ? sanitizedFeaturedImage : (existingBlog.featured_image || undefined);
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
    
    // Return 400 instead of 500 for better error handling
    return NextResponse.json(
      { error: 'Failed to update blog. Please try again.' },
      { status: 400 }
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
    // Return 400 instead of 500 for better error handling
    return NextResponse.json(
      { error: 'Failed to delete blog. Please try again.' },
      { status: 400 }
    );
  }
}

