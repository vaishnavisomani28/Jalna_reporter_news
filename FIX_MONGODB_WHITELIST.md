# 🔧 Fix MongoDB IP Whitelist Issue

## Problem
Videos are not showing because MongoDB Atlas is blocking connections from Vercel.

Error: `Could not connect to any servers in your MongoDB Atlas cluster. One common reason is that you're trying to access the database from an IP that isn't whitelisted.`

## Solution: Add Vercel IPs to MongoDB Atlas Whitelist

### Step 1: Go to MongoDB Atlas

1. Login to MongoDB Atlas: https://cloud.mongodb.com/
2. Select your cluster
3. Click on **"Network Access"** (left sidebar, under Security)

### Step 2: Add IP Address

1. Click **"Add IP Address"** button
2. Two options:

#### Option A: Allow All IPs (Easiest - Recommended for Development)
- Click **"Allow Access from Anywhere"** button
- OR manually add: `0.0.0.0/0`
- Click **"Confirm"**

#### Option B: Add Specific Vercel IPs (More Secure)
- Vercel uses dynamic IPs, so you'll need to add `0.0.0.0/0` anyway
- Or check Vercel docs for current IP ranges (not recommended as they change)

### Step 3: Wait for Changes to Apply

- Changes usually apply within 1-2 minutes
- You'll see a yellow "Updating..." status while it applies

### Step 4: Test

After adding IP whitelist:
1. Wait 1-2 minutes
2. Visit: `https://jalna-reporter-news.vercel.app/api/videos`
3. Should see videos data (not empty array)

## Important Notes

⚠️ **Security**: Allowing `0.0.0.0/0` allows connections from ANY IP address. This is fine for development, but for production:
- Make sure your MongoDB user has strong password
- Use MongoDB Atlas built-in authentication
- Consider using MongoDB Atlas VPC peering for more security (advanced)

✅ **For Vercel**: Since Vercel uses dynamic IPs, `0.0.0.0/0` is the practical solution.

## After Fixing

Once IP whitelist is added:
- Videos should start loading
- YouTube videos will fetch automatically
- No need to redeploy Vercel (just wait for changes to apply)

