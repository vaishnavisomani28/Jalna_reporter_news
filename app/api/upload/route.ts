import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { uploadImage, initializeStorage } from '@/lib/supabase-storage';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export const POST = requireAuth(async (request: NextRequest) => {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await checkRateLimit(`upload:${ip}`);
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many upload requests. Please try again later.' },
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

    // Initialize storage bucket if needed
    await initializeStorage();

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type by MIME type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPEG, PNG, GIF, WebP) are allowed.' },
        { status: 400 }
      );
    }

    // Validate file content by magic bytes (file signature)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileSignature = buffer.toString('hex', 0, 12).toUpperCase();
    
    // Magic bytes for common image formats (more comprehensive)
    const validSignatures = [
      'FFD8FF',      // JPEG
      '89504E47',    // PNG
      '47494638',    // GIF
      '52494646',    // WEBP (RIFF)
      '424D',        // BMP
      '49492A00',    // TIFF (little-endian)
      '4D4D002A',    // TIFF (big-endian)
    ];
    
    // Check if file starts with valid image signature
    const isValidImage = validSignatures.some(sig => fileSignature.startsWith(sig));
    
    if (!isValidImage) {
      logger.warn('Invalid file signature detected', { 
        signature: fileSignature.substring(0, 8),
        filename: file.name,
        mimeType: file.type,
      });
      return NextResponse.json(
        { error: 'Invalid file content. File does not appear to be a valid image.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Sanitize filename
    const sanitizedFilename = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .substring(0, 100); // Limit filename length

    // Upload to Supabase Storage
    const publicUrl = await uploadImage(file, 'featured');

    logger.info('File uploaded successfully', { 
      filename: sanitizedFilename,
      size: file.size,
      type: file.type,
    });

    return NextResponse.json({
      url: publicUrl,
      filename: publicUrl.split('/').pop() || 'upload',
    });
  } catch (error: unknown) {
    logger.error('Error uploading file', error instanceof Error ? error : undefined);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
});

