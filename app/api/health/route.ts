import { NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    status: 'ok',
    checks: {
      jwt: !!process.env.JWT_SECRET,
      mongodb: !!process.env.MONGODB_URI,
      supabase: {
        url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
      youtube: {
        apiKey: !!process.env.YOUTUBE_API_KEY,
        channelId: !!process.env.YOUTUBE_CHANNEL_ID,
      },
      email: {
        user: !!process.env.EMAIL_USER,
        password: !!process.env.EMAIL_PASSWORD,
        to: !!process.env.EMAIL_TO,
      },
    },
    // Don't expose actual values, just show if they're set
    env: {
      nodeEnv: process.env.NODE_ENV || 'development',
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  };

  // Check if critical vars are missing
  const criticalMissing = [];
  if (!checks.checks.jwt) criticalMissing.push('JWT_SECRET');
  if (!checks.checks.mongodb) criticalMissing.push('MONGODB_URI');
  if (!checks.checks.supabase.url) criticalMissing.push('NEXT_PUBLIC_SUPABASE_URL');
  if (!checks.checks.supabase.serviceKey) criticalMissing.push('SUPABASE_SERVICE_ROLE_KEY');

  if (criticalMissing.length > 0) {
    checks.status = 'error';
    return NextResponse.json(
      {
        ...checks,
        error: `Missing critical environment variables: ${criticalMissing.join(', ')}`,
        message: 'Please add these to your .env.local file and restart the server',
      },
      { status: 503 }
    );
  }

  return NextResponse.json(checks);
}
