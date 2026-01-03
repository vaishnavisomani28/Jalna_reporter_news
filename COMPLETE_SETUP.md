# 🚀 Complete Setup Guide - JalnaReporterNews

## ✅ Step 1: MongoDB Setup (Pehle ye karo)

### Option A: Local MongoDB (Windows) - Easy Method

#### 1. MongoDB Download & Install

1. **Download karo:**
   - Link: https://www.mongodb.com/try/download/community
   - Select: Windows, MSI package
   - Click **Download**

2. **Install karo:**
   - Downloaded file run karo
   - **Complete** installation select karo
   - ✅ **Install MongoDB as a Service** check karo
   - ✅ **Install MongoDB Compass** check karo (optional)
   - **Install** click karo

3. **Verify:**
   ```powershell
   Get-Service MongoDB
   ```
   Agar "Running" dikhe, toh perfect! ✅

#### 2. MongoDB Start karo (agar running nahi hai)

```powershell
Start-Service MongoDB
```

---

### Option B: MongoDB Atlas (Cloud) - Production ke liye

1. **Account banao:**
   - https://www.mongodb.com/cloud/atlas/register
   - Free account create karo

2. **Free Cluster banao:**
   - M0 FREE select karo
   - Region: Mumbai (or closest)
   - Create karo

3. **Database User:**
   - Security → Database Access
   - Add user: username + password (save karo!)

4. **Network Access:**
   - Security → Network Access
   - "Add Current IP Address" ya "Allow from Anywhere" (0.0.0.0/0)

5. **Connection String:**
   - Cluster → Connect → Connect your application
   - Connection string copy karo
   - Password replace karo: `<password>` ko apne password se

6. **.env.local update:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/jalnareporternews?retryWrites=true&w=majority
   ```

---

## ✅ Step 2: MongoDB Connection Test

```powershell
node test-mongodb.js
```

Agar "✅ MongoDB Connected Successfully!" dikhe, toh next step par jao.

---

## ✅ Step 3: Admin User Create

```powershell
npm run create-admin
```

**Default:**
- Username: `admin`
- Password: `admin123`

**Custom:**
```powershell
npm run create-admin myusername mypassword
```

---

## ✅ Step 4: Server Start

```powershell
npm run dev
```

Agar sab sahi hai, toh ye dikhega:
```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

---

## ✅ Step 5: Website Access

1. **Website:** http://localhost:3000
2. **Admin Panel:** http://localhost:3000/admin/login
   - Username: `admin`
   - Password: `admin123`

---

## ✅ Step 6: First Actions

### 1. Videos Refresh karo:
- Admin Panel → Videos
- "🔄 Refresh from YouTube" click karo
- Videos automatically fetch ho jayenge

### 2. First Blog Create karo:
- Admin Panel → Blogs → New Blog
- Title, content fill karo
- "Publish immediately" check karo
- Create karo

### 3. Password Change karo:
- New admin user create karo with strong password
- Old admin delete karo (database se)

---

## 🔧 Troubleshooting

### MongoDB Connection Error

**Problem:** `ECONNREFUSED` error

**Solution:**
```powershell
# Check MongoDB service
Get-Service MongoDB

# Start MongoDB
Start-Service MongoDB

# Test again
node test-mongodb.js
```

### MongoDB Service Not Found

**Solution:**
- MongoDB install karo: https://www.mongodb.com/try/download/community
- Ya MongoDB Atlas use karo (cloud)

### Admin User Create Error

**Problem:** "Cannot connect to MongoDB"

**Solution:**
1. MongoDB running hai ya nahi check karo
2. `.env.local` file sahi hai ya nahi
3. `MONGODB_URI` correct format mein hai ya nahi

### Videos Not Showing

**Solution:**
1. Admin Panel → Videos
2. "Refresh from YouTube" click karo
3. YouTube API key check karo
4. Channel ID check karo

---

## 📋 Quick Checklist

- [ ] MongoDB installed/running
- [ ] `.env.local` file created with all variables
- [ ] MongoDB connection test successful
- [ ] Admin user created
- [ ] Server started successfully
- [ ] Website accessible at localhost:3000
- [ ] Admin panel login working
- [ ] Videos refreshed from YouTube
- [ ] First blog created

---

## 🎯 Complete Setup Commands (Copy-Paste)

```powershell
# 1. MongoDB test
node test-mongodb.js

# 2. Admin user create
npm run create-admin

# 3. Server start
npm run dev
```

---

## 📚 Additional Guides

- **MongoDB Setup:** `MONGODB_SETUP.md`
- **Quick Start:** `QUICK_START.md`
- **Detailed Setup:** `SETUP_GUIDE.md`

---

**Sab ready hai! MongoDB setup karo aur app start karo! 🚀**

