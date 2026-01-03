# 🔧 Troubleshooting: Videos & Blogs Not Showing

## 🎯 Problem: Videos aur Blogs Visible Nahi Ho Rahe

Agar videos aur blogs nahi dikh rahe, to ye step-by-step check karo:

---

## ✅ Step 1: Vercel Environment Variables Check Karo

### 1.1 Vercel Dashboard me Jao

1. **Vercel Dashboard:** https://vercel.com
2. **Project Select:** Apne project par click karo
3. **Settings** → **Environment Variables**

### 1.2 Required Variables List

**Ye sab variables add hone chahiye:**

#### **For Videos (MongoDB):**
```
MONGODB_URI=mongodb+srv://somanivaishnavi28_db_user:ECbyTYHbbvpmiO2i@jalna-reporter-news.ahvsaqn.mongodb.net/jalnareporternews?retryWrites=true&w=majority
```

#### **For YouTube Videos:**
```
YOUTUBE_API_KEY=your_youtube_api_key_here
YOUTUBE_CHANNEL_ID=your_channel_id_here
```

#### **For Blogs (Supabase):**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

#### **For Site URL:**
```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

### 1.3 Environment Selection

**Important:** Har variable me **sab environments** select karo:
- ✅ Production
- ✅ Preview  
- ✅ Development

---

## ✅ Step 2: YouTube API Keys Setup

### 2.1 YouTube API Key Get Karo

1. **Google Cloud Console:** https://console.cloud.google.com
2. **APIs & Services** → **Credentials**
3. **Create Credentials** → **API Key**
4. **API Key copy karo**

### 2.2 YouTube Data API v3 Enable Karo

1. **APIs & Services** → **Library**
2. **YouTube Data API v3** search karo
3. **Enable** click karo

### 2.3 Channel ID Get Karo

**Method 1: YouTube Studio**
1. YouTube Studio → **Customization** → **Basic info**
2. Channel ID copy karo

**Method 2: Channel URL se**
- Channel URL: `https://www.youtube.com/@jalnareporternewsnews`
- Channel ID: URL se extract karo ya YouTube Studio me dekho

### 2.4 Vercel me Add Karo

```
YOUTUBE_API_KEY=AIzaSy... (your API key)
YOUTUBE_CHANNEL_ID=UC... (your channel ID)
```

---

## ✅ Step 3: Videos Manually Refresh Karo

### 3.1 Admin Panel se

1. **Website:** `https://your-site.vercel.app/admin/videos`
2. **Login karo** (admin credentials se)
3. **"Refresh from YouTube"** button click karo
4. Wait karo (30-60 seconds)
5. Videos fetch ho jayenge

### 3.2 API se Direct

1. Browser me ye URL open karo:
   ```
   https://your-site.vercel.app/api/videos?refresh=true
   ```
2. Response me videos dikhne chahiye

---

## ✅ Step 4: Supabase Setup Check Karo

### 4.1 Supabase Dashboard

1. **Supabase Dashboard:** https://supabase.com/dashboard
2. **Project Select:** Apna project select karo
3. **Settings** → **API**

### 4.2 Connection Details

1. **Project URL** copy karo:
   ```
   https://xxxxx.supabase.co
   ```

2. **anon/public key** copy karo:
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Vercel me add karo:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 4.3 Database Tables Check

1. **Table Editor** me jao
2. **blogs** table exist karta hai ya nahi check karo
3. Agar nahi hai, to table create karo (guide dekh lo)

---

## ✅ Step 5: Vercel Redeploy Karo

### 5.1 Automatic Redeploy

- Environment variables add karne ke baad Vercel automatically redeploy karega
- 2-3 minutes wait karo

### 5.2 Manual Redeploy

1. **Deployments** tab
2. Latest deployment par **3 dots** (...)
3. **"Redeploy"** select karo
4. **"Redeploy"** confirm karo

---

## ✅ Step 6: Browser Console Check Karo

### 6.1 Developer Tools

1. Website open karo
2. **F12** press karo (Developer Tools)
3. **Console** tab open karo

### 6.2 Errors Check

**Agar ye errors dikhe:**

**Error 1: "Database connection failed"**
- **Solution:** MongoDB URI check karo
- Vercel environment variables me sahi hai ya nahi

**Error 2: "YouTube API not configured"**
- **Solution:** YOUTUBE_API_KEY aur YOUTUBE_CHANNEL_ID add karo

**Error 3: "Supabase connection failed"**
- **Solution:** Supabase URL aur ANON_KEY check karo

**Error 4: "403 Forbidden" (YouTube API)**
- **Solution:** YouTube API key me restrictions check karo
- API key me "Don't restrict key" select karo (testing ke liye)

---

## ✅ Step 7: Test APIs Directly

### 7.1 Videos API Test

Browser me ye URL open karo:
```
https://your-site.vercel.app/api/videos?limit=5
```

**Expected Response:**
```json
{
  "videos": [...],
  "liveStream": null,
  "pagination": {...}
}
```

**Agar empty array dikhe:**
- MongoDB connection check karo
- YouTube API keys check karo
- Admin panel se manually refresh karo

### 7.2 Blogs API Test

Browser me ye URL open karo:
```
https://your-site.vercel.app/api/blogs?limit=5
```

**Expected Response:**
```json
{
  "blogs": [...],
  "pagination": {...}
}
```

**Agar empty array dikhe:**
- Supabase connection check karo
- Blogs table me data hai ya nahi check karo

---

## 🔍 Common Issues & Solutions

### Issue 1: Videos Empty Array Return Ho Raha Hai

**Possible Causes:**
1. MongoDB connection string wrong hai
2. YouTube API keys missing hain
3. Database empty hai (pehli baar)

**Solutions:**
1. MongoDB URI verify karo
2. YouTube API keys add karo
3. Admin panel → Videos → "Refresh from YouTube" click karo

### Issue 2: Blogs 500 Error

**Possible Causes:**
1. Supabase credentials wrong hain
2. Blogs table exist nahi karta
3. Network access issue

**Solutions:**
1. Supabase URL aur ANON_KEY verify karo
2. Supabase dashboard me blogs table check karo
3. Vercel logs check karo (Deployments → Latest → Functions)

### Issue 3: Environment Variables Not Working

**Possible Causes:**
1. Wrong environment selected
2. Variable name typo
3. Redeploy nahi hua

**Solutions:**
1. Sab environments me add karo (Production, Preview, Development)
2. Variable names exactly match karo (case-sensitive)
3. Manual redeploy karo

### Issue 4: YouTube API Quota Exceeded

**Possible Causes:**
1. Too many API calls
2. Free tier limit reached

**Solutions:**
1. Wait karo (quota reset hota hai daily)
2. API calls reduce karo (cache use karo)
3. YouTube API billing enable karo (agar needed)

---

## 📝 Quick Checklist

Setup complete hone ke baad verify karo:

**Environment Variables:**
- [ ] MONGODB_URI added (with database name)
- [ ] YOUTUBE_API_KEY added
- [ ] YOUTUBE_CHANNEL_ID added
- [ ] NEXT_PUBLIC_SUPABASE_URL added
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY added
- [ ] NEXT_PUBLIC_SITE_URL added
- [ ] All environments selected (Production, Preview, Development)

**MongoDB:**
- [ ] Connection string correct format
- [ ] Database name included
- [ ] Network access configured (0.0.0.0/0)

**YouTube:**
- [ ] API key valid
- [ ] YouTube Data API v3 enabled
- [ ] Channel ID correct
- [ ] Admin panel se videos refresh kiya

**Supabase:**
- [ ] Project URL correct
- [ ] ANON_KEY correct
- [ ] Blogs table exists
- [ ] At least one blog published

**Vercel:**
- [ ] All variables added
- [ ] Redeployed after adding variables
- [ ] No build errors
- [ ] Functions logs check kiye

---

## 🚀 Quick Fix Commands

### Videos Manually Refresh:
```
https://your-site.vercel.app/api/videos?refresh=true
```

### Test Videos API:
```
https://your-site.vercel.app/api/videos?limit=5
```

### Test Blogs API:
```
https://your-site.vercel.app/api/blogs?limit=5
```

---

## 📞 Still Not Working?

Agar abhi bhi problem hai, to ye information share karo:

1. **Browser Console Errors:** Screenshot ya error messages
2. **Vercel Logs:** Deployments → Latest → Functions → Error logs
3. **API Responses:** Direct API URLs ka response
4. **Environment Variables:** Names (values mat share karo - security)

**Main help karunga! 🚀**

