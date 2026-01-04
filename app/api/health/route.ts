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

  // Check optional but recommended vars for features
  const recommendedMissing = [];
  if (!checks.checks.youtube.apiKey) recommendedMissing.push('YOUTUBE_API_KEY (YouTube videos won\'t work)');
  if (!checks.checks.youtube.channelId) recommendedMissing.push('YOUTUBE_CHANNEL_ID (YouTube videos won\'t work)');
  if (!checks.checks.supabase.anonKey) recommendedMissing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY (recommended)');

  if (criticalMissing.length > 0) {
    checks.status = 'error';
    return NextResponse.json(
      {
        ...checks,
        error: `Missing critical environment variables: ${criticalMissing.join(', ')}`,
        message: process.env.VERCEL 
          ? 'Please add these environment variables in Vercel Dashboard → Settings → Environment Variables'
          : 'Please add these to your .env.local file and restart the server',
        recommendedMissing: recommendedMissing.length > 0 ? recommendedMissing : undefined,
        vercelHint: process.env.VERCEL ? 'You are on Vercel. Add variables in Dashboard → Settings → Environment Variables, then redeploy.' : undefined,
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ...checks,
    recommendedMissing: recommendedMissing.length > 0 ? recommendedMissing : undefined,
    message: recommendedMissing.length > 0 
      ? 'Some recommended variables are missing. Check recommendedMissing array for details.'
      : 'All critical environment variables are set!',
  });
}
