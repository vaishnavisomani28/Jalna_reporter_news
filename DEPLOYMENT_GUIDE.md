# 🚀 Deployment Guide - Jalna Reporter News

Is guide mein aapko different hosting options milenge. Choose karo jo aapke liye best ho.

## 📋 Table of Contents

1. [Vercel (Recommended - Easiest)](#vercel-recommended)
2. [Docker Deployment](#docker-deployment)
3. [Railway/Render](#railwayrender)
4. [AWS/GCP/Azure](#aws-gcp-azure)

---

## 🎯 Option 1: Vercel (Recommended - Easiest) {#vercel-recommended}

**Best for**: Quick deployment, automatic SSL, free tier available

### Steps:

1. **GitHub Repository Setup**
   ```bash
   # Agar GitHub repo nahi hai, to create karo
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/jalnareporternews.git
   git push -u origin main
   ```

2. **Vercel Account**
   - Visit: https://vercel.com
   - Sign up with GitHub
   - Click "New Project"
   - Import your GitHub repository

3. **Environment Variables Setup**
   
   Vercel dashboard mein "Settings" → "Environment Variables" mein add karo:
   
   ```env
   # Required
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/jalnareporternews
   JWT_SECRET=your-super-secret-random-key-min-32-chars
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   
   # Optional but Recommended
   YOUTUBE_API_KEY=your-youtube-api-key
   YOUTUBE_CHANNEL_ID=UCyour-channel-id
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_TO=contact@yourdomain.com
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-redis-token
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

5. **Custom Domain (Optional)**
   - Go to "Settings" → "Domains"
   - Add your custom domain
   - Update `NEXT_PUBLIC_SITE_URL` to your custom domain

### Advantages:
- ✅ Free tier available
- ✅ Automatic SSL
- ✅ Automatic deployments on git push
- ✅ Built-in CDN
- ✅ Easy rollback

---

## 🐳 Option 2: Docker Deployment {#docker-deployment}

**Best for**: Self-hosting, full control, any cloud provider

### Local Testing:

```bash
# Build Docker image
docker build -t jalnareporternews --build-arg DOCKER_BUILD=true .

# Run with docker-compose
docker-compose up -d

# Or run directly
docker run -p 3000:3000 --env-file .env.local jalnareporternews
```

### Deploy to Cloud:

#### A. DigitalOcean App Platform

1. **Create Dockerfile** (already created ✅)
2. **Push to GitHub**
3. **DigitalOcean Setup**:
   - Go to https://cloud.digitalocean.com
   - Create new App
   - Connect GitHub repository
   - Select Dockerfile
   - Add environment variables
   - Deploy!

#### B. AWS EC2 / Lightsail

```bash
# SSH into your server
ssh user@your-server-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone repository
git clone https://github.com/yourusername/jalnareporternews.git
cd jalnareporternews

# Create .env file
nano .env
# Add all environment variables

# Build and run
docker-compose up -d

# Setup Nginx reverse proxy (optional)
sudo apt install nginx
# Configure nginx to proxy to localhost:3000
```

#### C. Google Cloud Run

```bash
# Install gcloud CLI
# Build and push to Google Container Registry
gcloud builds submit --tag gcr.io/PROJECT-ID/jalnareporternews

# Deploy to Cloud Run
gcloud run deploy jalnareporternews \
  --image gcr.io/PROJECT-ID/jalnareporternews \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars="MONGODB_URI=...,JWT_SECRET=..."
```

#### D. Azure Container Instances

```bash
# Build and push to Azure Container Registry
az acr build --registry myregistry --image jalnareporternews:latest .

# Deploy
az container create \
  --resource-group myResourceGroup \
  --name jalnareporternews \
  --image myregistry.azurecr.io/jalnareporternews:latest \
  --dns-name-label jalnareporternews \
  --ports 3000 \
  --environment-variables MONGODB_URI=... JWT_SECRET=...
```

---

## 🚂 Option 3: Railway / Render {#railwayrender}

**Best for**: Easy deployment with database support

### Railway:

1. Visit: https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables in "Variables" tab
6. Railway automatically detects Next.js and deploys
7. Get your live URL!

### Render:

1. Visit: https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Settings:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment**: Node
6. Add environment variables
7. Deploy!

---

## ☁️ Option 4: AWS / GCP / Azure {#aws-gcp-azure}

### AWS Amplify:

1. Go to AWS Amplify Console
2. Connect GitHub repository
3. Amplify auto-detects Next.js
4. Add environment variables
5. Deploy!

### Google Cloud Platform:

1. Use Cloud Run (see Docker section above)
2. Or use App Engine:
   ```yaml
   # app.yaml
   runtime: nodejs18
   env: standard
   ```
3. Deploy: `gcloud app deploy`

### Azure App Service:

1. Create Web App in Azure Portal
2. Connect GitHub repository
3. Set Node.js version to 18
4. Add environment variables in Configuration
5. Deploy!

---

## 📝 Important Notes for Production

### 1. Environment Variables Checklist:

```env
✅ MONGODB_URI (Required)
✅ JWT_SECRET (Required - use strong random string)
✅ NEXT_PUBLIC_SUPABASE_URL (Required)
✅ SUPABASE_SERVICE_ROLE_KEY (Required)
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY (Optional but recommended)
✅ NEXT_PUBLIC_SITE_URL (Required - your production URL)
✅ YOUTUBE_API_KEY (Optional)
✅ YOUTUBE_CHANNEL_ID (Optional)
✅ EMAIL_USER, EMAIL_PASSWORD, EMAIL_TO (Optional)
✅ UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN (Optional)
```

### 2. Database Setup:

- **MongoDB Atlas** (Recommended for production):
  - Free tier: https://www.mongodb.com/cloud/atlas
  - Create cluster
  - Get connection string
  - Add to `MONGODB_URI`

### 3. Security:

- ✅ Use strong `JWT_SECRET` (min 32 characters)
- ✅ Never commit `.env` files
- ✅ Enable HTTPS (automatic on Vercel/Railway)
- ✅ Use environment variables for all secrets

### 4. Performance:

- ✅ Enable caching
- ✅ Use CDN (automatic on Vercel)
- ✅ Optimize images
- ✅ Use MongoDB Atlas for better performance

---

## 🎯 Quick Recommendation

**Agar aapko fastest deployment chahiye:**
→ **Vercel** use karo (5 minutes mein deploy!)

**Agar aapko full control chahiye:**
→ **Docker** use karo (any cloud provider)

**Agar aapko database bhi chahiye:**
→ **Railway** use karo (MongoDB included)

---

## 🆘 Troubleshooting

### Build Fails:
- Check all required environment variables are set
- Check Node.js version (should be 18+)
- Check build logs for specific errors

### Database Connection Issues:
- Verify `MONGODB_URI` is correct
- Check MongoDB Atlas IP whitelist (add `0.0.0.0/0` for all IPs)
- Verify network connectivity

### 500 Errors:
- Check server logs
- Verify all environment variables
- Check database connection
- Verify Supabase credentials

---

## 📞 Need Help?

Agar koi issue ho, to:
1. Check deployment logs
2. Verify all environment variables
3. Check database connectivity
4. Review error messages

**Happy Deploying! 🚀**

