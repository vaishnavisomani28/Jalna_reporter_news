# 🚀 How to Run the Application

## Quick Start

### Step 1: Install Dependencies (Already Done ✅)
```powershell
npm install
```

### Step 2: Check MongoDB is Running
```powershell
Get-Service MongoDB
```

Agar running nahi hai:
```powershell
Start-Service MongoDB
```

### Step 3: Start Development Server
```powershell
npm run dev
```

### Step 4: Open Browser
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin/login

---

## 📋 Complete Run Commands

### **Start Server:**
```powershell
npm run dev
```

### **Stop Server:**
- Press `Ctrl + C` in terminal

### **Check if Server is Running:**
- Open browser: http://localhost:3000
- Agar page load ho, toh server running hai ✅

---

## ⚙️ Optional: Email Setup (For Contact Form)

Agar contact form use karna hai:

1. **Gmail App Password banao:**
   - Visit: https://myaccount.google.com/apppasswords
   - Generate app password
   - Copy 16-character password

2. **`.env.local` mein add karo:**
   ```env
   EMAIL_USER=rekhab.parshapogu@gmail.com
   EMAIL_PASSWORD=your-16-character-app-password
   ```

3. **Server restart karo:**
   - Stop: `Ctrl + C`
   - Start: `npm run dev`

---

## 🎯 What You'll See

### **Homepage:**
- ✅ Top carousel with latest content
- ✅ Logo in header
- ✅ Live indicator (if streaming)
- ✅ Latest videos
- ✅ Latest blogs

### **Admin Panel:**
- ✅ Dashboard with stats
- ✅ Prominent "Create Blog" button
- ✅ Blog management
- ✅ Video refresh

---

## 🆘 Troubleshooting

### **Port Already in Use:**
```powershell
# Check what's using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### **MongoDB Not Running:**
```powershell
Start-Service MongoDB
```

### **Dependencies Error:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

### **Server Not Starting:**
- Check `.env.local` file exists
- Check MongoDB is running
- Check all dependencies installed

---

## 📝 Quick Reference

```powershell
# Start server
npm run dev

# Stop server
Ctrl + C

# Check MongoDB
Get-Service MongoDB

# Start MongoDB
Start-Service MongoDB

# Install dependencies
npm install
```

---

**Server start ho gaya? Browser mein http://localhost:3000 open karo! 🚀**

