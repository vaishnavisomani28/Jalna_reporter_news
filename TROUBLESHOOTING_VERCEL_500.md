# 🔧 Troubleshooting Vercel 500 Errors

## Current Issues

1. **Blogs showing 500 error** - `/blogs/[slug]` routes failing
2. **YouTube videos not showing** - Videos API might be failing
3. **Live button not working** - Live stream not loading
4. **RSC payload fetch failures** - Server-side rendering errors

## Debugging Steps

### Step 1: Check Vercel Logs

1. Go to Vercel Dashboard → Your Project
2. Click on **"Logs"** tab (or **"Deployments"** → Latest deployment → **"Functions"** tab)
3. Look for error messages when accessing:
   - `/api/blogs/[slug]`
   - `/api/videos`
   - `/api/blogs`

### Step 2: Test API Endpoints Directly

Test these URLs directly in browser or Postman:

```
https://jalna-reporter-news.vercel.app/api/health
https://jalna-reporter-news.vercel.app/api/blogs
https://jalna-reporter-news.vercel.app/api/videos
https://jalna-reporter-news.vercel.app/api/blogs/test-2
```

### Step 3: Common Causes

#### A. Database Connection Issues

**Symptoms**: 500 errors on blog/video routes

**Check**:
- MongoDB Atlas IP whitelist includes `0.0.0.0/0` (all IPs) or Vercel IPs
- MongoDB connection string is correct in Vercel environment variables
- Database user has proper permissions

**Fix**: 
1. MongoDB Atlas → Network Access → Add IP Address → `0.0.0.0/0`
2. Verify `MONGODB_URI` in Vercel environment variables

#### B. Supabase Connection Issues

**Symptoms**: Blog routes returning 500

**Check**:
- Supabase project is active
- `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are correct
- Supabase tables exist (`blogs`, `users`)

**Fix**:
1. Verify Supabase credentials in Vercel
2. Check Supabase Dashboard → Table Editor to confirm tables exist
3. Test connection: `https://your-project.supabase.co/rest/v1/` (should return API info)

#### C. YouTube API Issues

**Symptoms**: Videos not loading

**Check**:
- YouTube API key is valid
- YouTube Data API v3 is enabled
- Channel ID is correct
- API quota not exceeded

**Fix**:
1. Google Cloud Console → APIs & Services → Credentials
2. Verify API key is enabled
3. Check quotas: APIs & Services → Dashboard → YouTube Data API v3

#### D. Environment Variable Issues

**Symptoms**: Various 500 errors

**Fix**:
1. Vercel Dashboard → Settings → Environment Variables
2. Verify ALL variables are set for **Production** environment
3. After adding/changing variables, **Redeploy**

### Step 4: Check Function Logs

1. Vercel Dashboard → Your Project → **Observability** → **Functions**
2. Look for error rates, timeouts, or failed invocations
3. Click on individual functions to see detailed logs

### Step 5: Check Build Logs

1. Vercel Dashboard → **Deployments**
2. Click on latest deployment
3. Check **Build Logs** for compilation errors

## Quick Fixes

### Fix 1: Redeploy After Environment Variable Changes

If you just added environment variables:
1. Go to Deployments
2. Click **"..."** on latest deployment
3. Select **"Redeploy"**

### Fix 2: Clear Cache

Sometimes cached builds cause issues:
1. Vercel Dashboard → Settings → General
2. Scroll to "Deployment Protection"
3. Redeploy with "Clear Build Cache" option

### Fix 3: Check Database Status

**MongoDB Atlas**:
- Verify cluster is running (not paused)
- Check connection string format
- Ensure database name is correct in URI

**Supabase**:
- Verify project is active (not paused)
- Check API keys are from correct project
- Verify tables are created

## Getting Detailed Error Messages

The "Z" error in console is minified. To see real errors:

1. **Vercel Logs** (best source):
   - Dashboard → Logs tab
   - Filter by function name (e.g., `api/blogs/[slug]`)

2. **Network Tab**:
   - Open browser DevTools → Network
   - Click on failed request
   - Check "Response" tab for error message

3. **Add Error Logging**:
   - Check if errors are being logged properly
   - Vercel automatically logs `console.error()` and thrown errors

## Next Steps

1. Check Vercel logs first (most important!)
2. Test API endpoints directly
3. Verify all environment variables are set
4. Check database connections
5. Redeploy if needed

## Contact Points

If issues persist:
- Share Vercel function logs
- Share API endpoint test results
- Share environment variable status (from `/api/health`)

