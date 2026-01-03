import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './jwt';

export async function getAuthUser(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  return payload;
}

export function requireAuth(
  handler: (request: NextRequest, user: any, context?: any) => Promise<Response>
) {
  return async (request: NextRequest, context?: any) => {
    const user = await getAuthUser(request);

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return handler(request, user, context);
  };
}

