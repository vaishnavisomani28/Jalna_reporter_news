# 🚨 Quick Fix for Vercel 500 Errors

## Immediate Actions

### Step 1: Check Vercel Function Logs (MOST IMPORTANT!)

1. Go to: https://vercel.com/dashboard
2. Select your project: **jalna-reporter-news**
3. Click on **"Logs"** tab (left sidebar)
4. OR go to **"Deployments"** → Click latest deployment → **"Functions"** tab
5. Look for error messages when you access:
   - `/api/blogs/test-2`
   - `/api/videos`
   - `/api/blogs`

**Copy and share the error messages you see here!**

### Step 2: Test API Endpoints Directly

Open these URLs directly in your browser:

```
https://jalna-reporter-news.vercel.app/api/health
https://jalna-reporter-news.vercel.app/api/videos
https://jalna-reporter-news.vercel.app/api/blogs
https://jalna-reporter-news.vercel.app/api/blogs/test-2
```

**Check what error messages you see!**

### Step 3: Common Fixes

#### Fix A: MongoDB Connection
If errors mention "MongoDB" or "connection":

1. **MongoDB Atlas IP Whitelist**:
   - Go to MongoDB Atlas → **Network Access**
   - Click **"Add IP Address"**
   - Add: `0.0.0.0/0` (allows all IPs) OR `0.0.0.0/0` with description "Vercel"
   - Save

2. **Verify Connection String**:
   - Vercel Dashboard → Settings → Environment Variables
   - Check `MONGODB_URI` format:
     ```
     mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
     ```
   - Make sure database name is included (e.g., `/jalnareporternews`)

#### Fix B: Supabase Connection
If errors mention "Supabase" or "Postgres":

1. **Verify Supabase Credentials**:
   - Vercel Dashboard → Settings → Environment Variables
   - Check `NEXT_PUBLIC_SUPABASE_URL` format: `https://xxxxx.supabase.co`
   - Check `SUPABASE_SERVICE_ROLE_KEY` is correct

2. **Test Supabase Connection**:
   - Go to: `https://your-project-id.supabase.co/rest/v1/`
   - Should show API information (not error)

#### Fix C: Redeploy After Variable Changes

If you just added/changed environment variables:

1. Vercel Dashboard → **Deployments**
2. Click **"..."** (three dots) on latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete

### Step 4: Check Build Status

1. Vercel Dashboard → **Deployments**
2. Check if latest deployment status is **"Ready"** (green) or **"Error"** (red)
3. If Error, click on it and check build logs

## What to Share

If issues persist, please share:

1. **Vercel Function Logs** (from Step 1) - Screenshot or copy error text
2. **API Endpoint Test Results** (from Step 2) - What error you see
3. **Deployment Status** - Is it "Ready" or "Error"?

## Quick Checklist

- [ ] Checked Vercel Logs
- [ ] Tested `/api/health` endpoint
- [ ] Tested `/api/videos` endpoint  
- [ ] Tested `/api/blogs` endpoint
- [ ] MongoDB IP whitelist includes `0.0.0.0/0`
- [ ] All environment variables are set in Vercel
- [ ] Redeployed after adding variables
- [ ] Latest deployment status is "Ready"

