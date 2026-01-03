/**
 * Environment variable validation utility
 * Ensures all required environment variables are set before the app starts
 * Server-only vars are only validated on the server side
 */

const isServer = typeof window === 'undefined';

function getEnvVar(name: string, required: boolean = true, serverOnly: boolean = false): string {
  // Server-only vars should not be accessed on client - return empty string immediately
  if (serverOnly && !isServer) {
    return '';
  }
  
  // On client side, never throw errors - just return empty string
  if (!isServer) {
    return process.env[name] || '';
  }
  
  // Server-side validation
  const value = process.env[name];
  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${name}. Please add it to your .env.local file.`
    );
  }
  
  return value || '';
}

export const env = {
  // JWT (server-only)
  get JWT_SECRET() {
    if (!isServer) return ''; // Never expose on client
    return getEnvVar('JWT_SECRET', true, true);
  },
  
  // Database (server-only)
  get MONGODB_URI() {
    if (!isServer) return ''; // Never expose on client
    return getEnvVar('MONGODB_URI', true, true);
  },
  
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
  get SUPABASE_SERVICE_ROLE_KEY() {
    if (!isServer) return ''; // Never expose on client
    return getEnvVar('SUPABASE_SERVICE_ROLE_KEY', true, true);
  },
  NEXT_PUBLIC_SUPABASE_ANON_KEY: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', false),
  
  // YouTube (optional, can be used on both client and server)
  YOUTUBE_API_KEY: getEnvVar('YOUTUBE_API_KEY', false),
  YOUTUBE_CHANNEL_ID: getEnvVar('YOUTUBE_CHANNEL_ID', false),
  
  // Email (server-only)
  get EMAIL_USER() {
    if (!isServer) return '';
    return getEnvVar('EMAIL_USER', false, true);
  },
  get EMAIL_PASSWORD() {
    if (!isServer) return '';
    return getEnvVar('EMAIL_PASSWORD', false, true);
  },
  get EMAIL_TO() {
    if (!isServer) return '';
    return getEnvVar('EMAIL_TO', false, true);
  },
  
  // App
  NODE_ENV: getEnvVar('NODE_ENV', false) || 'development',
  NEXT_PUBLIC_SITE_URL: getEnvVar('NEXT_PUBLIC_SITE_URL', false) || 'http://localhost:3000',
  
  // Rate Limiting (optional, uses in-memory if not set, server-only)
  get UPSTASH_REDIS_REST_URL() {
    if (!isServer) return '';
    return getEnvVar('UPSTASH_REDIS_REST_URL', false, true);
  },
  get UPSTASH_REDIS_REST_TOKEN() {
    if (!isServer) return '';
    return getEnvVar('UPSTASH_REDIS_REST_TOKEN', false, true);
  },
};

// Validation happens lazily when server-only vars are accessed
// This prevents errors during client-side bundling

