/**
 * Script to check if all required environment variables are set
 * Useful for verifying Vercel deployment configuration
 * 
 * Run: node scripts/check-vercel-env.js
 */

const requiredVars = [
  {
    name: 'JWT_SECRET',
    description: 'JWT authentication secret (min 32 characters)',
    critical: true,
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    description: 'Supabase project URL (for blogs)',
    critical: true,
  },
  {
    name: 'SUPABASE_SERVICE_ROLE_KEY',
    description: 'Supabase service role key (for blogs)',
    critical: true,
  },
  {
    name: 'MONGODB_URI',
    description: 'MongoDB connection string (for videos)',
    critical: true,
  },
  {
    name: 'YOUTUBE_API_KEY',
    description: 'YouTube Data API v3 key (for videos)',
    critical: false,
  },
  {
    name: 'YOUTUBE_CHANNEL_ID',
    description: 'YouTube channel ID (for videos)',
    critical: false,
  },
  {
    name: 'NEXT_PUBLIC_SITE_URL',
    description: 'Production site URL',
    critical: false,
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    description: 'Supabase anonymous key (recommended)',
    critical: false,
  },
];

console.log('\n🔍 Checking Environment Variables...\n');

let hasErrors = false;
let hasWarnings = false;

requiredVars.forEach(({ name, description, critical }) => {
  const value = process.env[name];
  const isSet = !!value;
  const length = value ? value.length : 0;

  if (!isSet) {
    if (critical) {
      console.log(`❌ ${name} - MISSING (CRITICAL)`);
      console.log(`   ${description}`);
      console.log(`   ⚠️  This will cause errors in production!\n`);
      hasErrors = true;
    } else {
      console.log(`⚠️  ${name} - MISSING (Optional)`);
      console.log(`   ${description}\n`);
      hasWarnings = true;
    }
  } else {
    // Validate JWT_SECRET length
    if (name === 'JWT_SECRET' && length < 32) {
      console.log(`⚠️  ${name} - SET but too short (${length} chars, min 32 recommended)`);
      console.log(`   ${description}\n`);
      hasWarnings = true;
    } else {
      // Don't show full value for security
      const displayValue = length > 20 
        ? `${value.substring(0, 10)}...${value.substring(value.length - 4)} (${length} chars)`
        : '***';
      console.log(`✅ ${name} - SET`);
      if (name === 'JWT_SECRET' || name.includes('KEY') || name.includes('SECRET')) {
        console.log(`   Length: ${length} characters`);
      } else {
        console.log(`   Value: ${displayValue}`);
      }
      console.log(`   ${description}\n`);
    }
  }
});

console.log('\n' + '='.repeat(60));
if (hasErrors) {
  console.log('\n❌ CRITICAL ERRORS FOUND!');
  console.log('Please add the missing critical variables before deploying.\n');
  process.exit(1);
} else if (hasWarnings) {
  console.log('\n⚠️  WARNINGS: Some optional variables are missing.');
  console.log('Your app will work, but some features may not function properly.\n');
  process.exit(0);
} else {
  console.log('\n✅ All environment variables are set correctly!\n');
  process.exit(0);
}

