import { NextRequest, NextResponse } from 'next/server';
import { userDb } from '@/lib/supabase-db';
import bcrypt from 'bcryptjs';
import { generateToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (stricter for login)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const rateLimitResult = await checkRateLimit(`login:${ip}`);
    
    if (!rateLimitResult.success) {
      logger.warn('Login rate limit exceeded', { ip });
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
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
    
    // Validate input
    const validationResult = loginSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { username, password } = validationResult.data;

    let user;
    try {
      user = await userDb.findByUsername(username);

      if (!user) {
        logger.warn('Login attempt with non-existent user', { username });
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        logger.warn('Login attempt with invalid password', { username });
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }
    } catch (dbError) {
      logger.error('Database error during login', dbError instanceof Error ? dbError : undefined);
      return NextResponse.json(
        { error: 'Database connection error. Please check Supabase configuration in .env.local' },
        { status: 500 }
      );
    }

    const token = generateToken({
      userId: user.id!,
      username: user.username,
    });

    const response = NextResponse.json(
      { message: 'Login successful' },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    logger.info('User logged in successfully', { username });
    return response;
  } catch (error) {
    logger.error('Login error', error instanceof Error ? error : undefined);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Check for specific errors
    if (errorMessage.includes('Supabase') || errorMessage.includes('supabase')) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check Supabase configuration in .env.local' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: `Login failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}

