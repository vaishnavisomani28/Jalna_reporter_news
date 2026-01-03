# 🚀 Vercel Par Environment Variables Setup

## 📍 Kahan Add Karein?

1. Vercel Dashboard → **Your Project** → **Settings** → **Environment Variables**
2. Ya phir deploy ke time bhi add kar sakte ho

---

## ✅ REQUIRED Variables (Zaroori)

Ye variables **must** add karne honge, warna app run nahi hogi:

### 1. **JWT_SECRET** ⚠️ CRITICAL
```
JWT_SECRET=your-super-secret-random-key-minimum-32-characters-long
```
- **Kya hai**: Authentication ke liye secret key
- **Kaise generate karein**: 
  - Online: https://randomkeygen.com/
  - Terminal: `openssl rand -base64 32`
- **Important**: Strong random string honi chahiye (min 32 characters)

### 2. **NEXT_PUBLIC_SUPABASE_URL** ⚠️ CRITICAL
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```
- **Kahan se milega**: Supabase Dashboard → Project Settings → API → Project URL

### 3. **SUPABASE_SERVICE_ROLE_KEY** ⚠️ CRITICAL
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- **Kahan se milega**: Supabase Dashboard → Project Settings → API → Service Role Key
- **⚠️ Warning**: Ye key secret hai, kabhi expose mat karo!

### 4. **MONGODB_URI** ⚠️ CRITICAL (Agar MongoDB use kar rahe ho)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```
- **Ya phir**: Agar sirf Supabase use kar rahe ho, to ye optional hai

---

## 🔧 RECOMMENDED Variables (Optional but Recommended)

Ye add karne se features better kaam karenge:

### 5. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- **Kahan se milega**: Supabase Dashboard → Project Settings → API → Anon Public Key

### 6. **NEXT_PUBLIC_SITE_URL**
```
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```
- **Ya phir**: Agar custom domain hai to: `https://yourdomain.com`
- **Important**: Production URL honi chahiye

### 7. **YOUTUBE_API_KEY** (YouTube videos ke liye)
```
YOUTUBE_API_KEY=AIzaSyCb2k2-FWIsgWKAFn4fa2el6Hp_hQ-Ntv0
```
- **Kahan se milega**: Google Cloud Console → APIs & Services → Credentials

### 8. **YOUTUBE_CHANNEL_ID** (YouTube videos ke liye)
```
YOUTUBE_CHANNEL_ID=UCyour-channel-id-here
```
- **Kahan se milega**: YouTube channel page se, ya script se: `node scripts/get-channel-id.js`

---

## 📧 OPTIONAL Variables (Email Features)

Agar contact form email bhejna hai:

### 9. **EMAIL_USER**
```
EMAIL_USER=your-email@gmail.com
```

### 10. **EMAIL_PASSWORD**
```
EMAIL_PASSWORD=your-app-password
```
- **Gmail ke liye**: App Password use karo (regular password nahi)
- **Kaise banaye**: https://myaccount.google.com/apppasswords

### 11. **EMAIL_TO**
```
EMAIL_TO=contact@yourdomain.com
```
- Contact form ki emails yahan jayengi

---

## ⚡ ADVANCED Variables (Optional - Performance)

Rate limiting ke liye (agar Upstash Redis use karna ho):

### 12. **UPSTASH_REDIS_REST_URL**
```
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
```

### 13. **UPSTASH_REDIS_REST_TOKEN**
```
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```
- **Note**: Agar nahi add karte, to in-memory rate limiting use hogi (default)

---

## 📋 Complete List (Copy-Paste Ready)

Vercel dashboard mein ye sab add karo:

```env
# ============================================
# REQUIRED (Must Add)
# ============================================
JWT_SECRET=your-super-secret-random-key-min-32-chars
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname

# ============================================
# RECOMMENDED (Add for Better Features)
# ============================================
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=UCyour-channel-id

# ============================================
# OPTIONAL (Email Features)
# ============================================
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=contact@yourdomain.com

# ============================================
# ADVANCED (Rate Limiting - Optional)
# ============================================
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token
```

---

## 🎯 Step-by-Step: Vercel Par Add Kaise Karein

### Method 1: Dashboard Se (Recommended)

1. **Vercel Dashboard** → Project select karo
2. **Settings** tab click karo
3. **Environment Variables** section mein jao
4. **Add New** button click karo
5. Har variable add karo:
   - **Key**: `JWT_SECRET`
   - **Value**: `your-actual-secret-key`
   - **Environment**: Select karo (Production, Preview, Development)
6. **Save** karo
7. Repeat karo sab variables ke liye

### Method 2: Deploy Time

1. Deploy ke time **Environment Variables** section dikhega
2. Wahan directly add kar sakte ho

---

## ✅ Verification: Kaise Check Karein?

Deploy ke baad, ye URL visit karo:
```
https://your-project.vercel.app/api/health
```

Response mein dikhega ki kaunse variables set hain aur kaunse missing hain.

---

## 🚨 Important Notes

1. **Environment Selection**: 
   - **Production**: Live site ke liye
   - **Preview**: Pull requests ke liye
   - **Development**: Local development ke liye
   - **Tip**: Sab environments ke liye same values add karo

2. **After Adding Variables**:
   - **Redeploy** karna zaroori hai
   - Vercel automatically redeploy kar deta hai, ya manually **Redeploy** button click karo

3. **Security**:
   - ✅ Values ko kabhi expose mat karo
   - ✅ GitHub mein commit mat karo
   - ✅ `.env.local` file git ignore mein hai (✅ Done!)

4. **JWT_SECRET**:
   - Production mein strong random key use karo
   - Development se different honi chahiye

---

## 📝 Quick Checklist

- [ ] JWT_SECRET (min 32 chars, strong random)
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] MONGODB_URI (agar MongoDB use kar rahe ho)
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY (recommended)
- [ ] NEXT_PUBLIC_SITE_URL (production URL)
- [ ] YOUTUBE_API_KEY (agar YouTube videos chahiye)
- [ ] YOUTUBE_CHANNEL_ID (agar YouTube videos chahiye)
- [ ] Email variables (agar contact form chahiye)
- [ ] Redeploy kiya

---

## 🆘 Help

Agar koi variable missing hai, to:
1. `/api/health` endpoint check karo
2. Vercel logs check karo (Deployments → View Function Logs)
3. Error messages read karo

**Sab set karne ke baad, app perfectly run hogi!** ✅

