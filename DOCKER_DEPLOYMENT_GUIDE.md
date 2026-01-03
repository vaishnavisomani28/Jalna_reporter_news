# 🐳 Docker Deployment Guide - Complete Step-by-Step

## 📋 Prerequisites

- Docker installed on your system
- GitHub account
- Environment variables ready

---

## 🚀 Method 1: Railway (Easiest - Recommended)

### **Step 1: Railway Account**
1. Visit: **https://railway.app/**
2. **Sign up** with GitHub (easiest)
3. Free tier available ✅

### **Step 2: Create New Project**
1. Dashboard → **"New Project"**
2. **"Deploy from GitHub repo"** select karo
3. Apna repo select karo: `vaishnavisomani28/Jalna_reporter_news`
4. Branch: `main`

### **Step 3: Railway Auto-Detects Docker**
- Railway automatically `Dockerfile` detect karega ✅
- Kuch configure karne ki zarurat nahi

### **Step 4: Environment Variables**
1. Project → **Variables** tab
2. Sab variables add karo:

```
JWT_SECRET=your-super-secret-key-min-32-chars
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_SITE_URL=https://your-project.railway.app
YOUTUBE_API_KEY=your-youtube-api-key
YOUTUBE_CHANNEL_ID=UCyour-channel-id
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_TO=contact@yourdomain.com
```

### **Step 5: Deploy**
- Railway automatically deploy start karega
- 2-3 minutes mein deploy ho jayega
- URL mil jayega: `https://your-project.railway.app`

### **Step 6: Custom Domain (Optional)**
1. Project → **Settings** → **Domains**
2. Custom domain add karo
3. DNS settings follow karo

---

## 🐳 Method 2: Docker Hub + Any Platform

### **Step 1: Build Docker Image Locally**
```bash
# Build image
docker build -t jalna-reporter --build-arg DOCKER_BUILD=true .

# Test locally
docker run -p 3000:3000 --env-file .env.local jalna-reporter
```

### **Step 2: Push to Docker Hub**
```bash
# Login to Docker Hub
docker login

# Tag image
docker tag jalna-reporter yourusername/jalna-reporter:latest

# Push to Docker Hub
docker push yourusername/jalna-reporter:latest
```

### **Step 3: Deploy on Any Platform**

**A. DigitalOcean App Platform**
1. Visit: https://www.digitalocean.com/products/app-platform
2. Create App → Docker Hub image select
3. Image: `yourusername/jalna-reporter:latest`
4. Environment variables add karo
5. Deploy!

**B. AWS ECS/Fargate**
1. Create ECS cluster
2. Create task definition
3. Docker Hub image use karo
4. Environment variables add karo
5. Deploy!

**C. Google Cloud Run**
1. Visit: https://cloud.google.com/run
2. Create service
3. Docker Hub image use karo
4. Environment variables add karo
5. Deploy!

---

## 🚂 Method 3: Railway CLI (Advanced)

### **Step 1: Install Railway CLI**
```bash
# Windows (PowerShell)
iwr https://railway.app/install.sh | iex

# Mac/Linux
curl -fsSL https://railway.app/install.sh | sh
```

### **Step 2: Login**
```bash
railway login
```

### **Step 3: Initialize Project**
```bash
railway init
```

### **Step 4: Link to Existing Project**
```bash
railway link
```

### **Step 5: Set Environment Variables**
```bash
railway variables set JWT_SECRET=your-secret
railway variables set NEXT_PUBLIC_SUPABASE_URL=https://...
# ... sab variables add karo
```

### **Step 6: Deploy**
```bash
railway up
```

---

## 📝 Dockerfile Already Configured ✅

Project mein `Dockerfile` already hai aur properly configured hai:

```dockerfile
FROM node:18-alpine AS base
# ... multi-stage build
# Production optimized
```

**Kuch change karne ki zarurat nahi!**

---

## 🔧 Environment Variables Checklist

Sab platforms par ye variables add karo:

### **Required:**
- ✅ `JWT_SECRET` (min 32 chars)
- ✅ `NEXT_PUBLIC_SUPABASE_URL`
- ✅ `SUPABASE_SERVICE_ROLE_KEY`
- ✅ `MONGODB_URI` (agar MongoDB use kar rahe ho)

### **Recommended:**
- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- ✅ `NEXT_PUBLIC_SITE_URL`
- ✅ `YOUTUBE_API_KEY`
- ✅ `YOUTUBE_CHANNEL_ID`

### **Optional:**
- ✅ `EMAIL_USER`, `EMAIL_PASSWORD`, `EMAIL_TO`
- ✅ `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

---

## 🎯 Quick Start: Railway (5 Minutes)

1. **Railway.app** par sign up
2. **New Project** → GitHub repo select
3. **Variables** tab → Sab environment variables add
4. **Deploy** (automatic)
5. **Done!** ✅

---

## 🆘 Troubleshooting

### **Issue: Build Fails**
**Solution:**
- Check environment variables
- Verify Dockerfile syntax
- Check build logs

### **Issue: App Not Starting**
**Solution:**
- Check environment variables
- Verify port 3000 is exposed
- Check application logs

### **Issue: Database Connection Error**
**Solution:**
- Verify `MONGODB_URI` or Supabase credentials
- Check network connectivity
- Verify database is accessible

---

## 📊 Platform Comparison

| Platform | Difficulty | Free Tier | Docker | Best For |
|----------|-----------|-----------|--------|----------|
| **Railway** | ⭐⭐ Easy | ✅ Yes | ✅ Yes | **Recommended** |
| **DigitalOcean** | ⭐⭐⭐ Medium | ❌ No | ✅ Yes | Production |
| **AWS ECS** | ⭐⭐⭐⭐ Hard | ❌ No | ✅ Yes | Enterprise |
| **Google Cloud Run** | ⭐⭐⭐ Medium | ✅ Yes | ✅ Yes | Serverless |

---

## ✅ Recommended: Railway

**Kyun?**
- ✅ Easiest setup
- ✅ Free tier available
- ✅ Automatic Docker detection
- ✅ GitHub integration
- ✅ Environment variables easy
- ✅ Custom domains
- ✅ Automatic SSL

**Quick Deploy:**
1. Railway.app → Sign up
2. New Project → GitHub repo
3. Variables add
4. Deploy!

**5 minutes mein deploy ho jayega!** 🚀

---

## 📚 Additional Resources

- Railway Docs: https://docs.railway.app/
- Docker Docs: https://docs.docker.com/
- Next.js Docker: https://nextjs.org/docs/deployment#docker-image

**Docker deployment ab ready hai!** ✅

