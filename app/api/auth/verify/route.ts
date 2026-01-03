import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Check if JWT_SECRET is configured
    if (!process.env.JWT_SECRET) {
      return NextResponse.json(
        { authenticated: false, error: 'Authentication not configured' },
        { status: 503 }
      );
    }

    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { authenticated: true, user: payload },
      { status: 200 }
    );
  } catch (error) {
    // Handle JWT_SECRET missing error gracefully
    if (error instanceof Error && error.message.includes('JWT_SECRET')) {
      return NextResponse.json(
        { authenticated: false, error: 'Authentication not configured' },
        { status: 503 }
      );
    }
    return NextResponse.json(
      { authenticated: false },
      { status: 401 }
    );
  }
}

