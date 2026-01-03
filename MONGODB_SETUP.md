# MongoDB Setup Guide (Hindi/English)

## 🗄️ MongoDB Setup - Step by Step

### Option 1: Local MongoDB (Windows) - Recommended for Development

#### Step 1: MongoDB Download & Install

1. **MongoDB Community Server Download karo:**
   - Visit: https://www.mongodb.com/try/download/community
   - Select:
     - Version: Latest (7.0+)
     - Platform: Windows
     - Package: MSI
   - Click **Download**

2. **MongoDB Install karo:**
   - Downloaded `.msi` file run karo
   - **Installation Type**: Choose "Complete"
   - **Service Configuration**: 
     - ✅ Check "Install MongoDB as a Service"
     - ✅ Check "Run service as Network Service user"
   - **Install MongoDB Compass**: ✅ Check (GUI tool - optional but helpful)
   - Click **Install**

3. **Verify Installation:**
   ```powershell
   # MongoDB service check karo
   Get-Service MongoDB
   ```
   
   Agar "Running" dikhe, toh MongoDB successfully installed hai!

#### Step 2: MongoDB Service Start/Stop

**Start MongoDB:**
```powershell
Start-Service MongoDB
```

**Stop MongoDB:**
```powershell
Stop-Service MongoDB
```

**Status Check:**
```powershell
Get-Service MongoDB
```

#### Step 3: Test MongoDB Connection

```powershell
# MongoDB shell open karo
mongosh
```

Agar connection successful hai, toh ye dikhega:
```
Current Mongosh Log ID: ...
Connecting to: mongodb://127.0.0.1:27017/...
```

Type `exit` to close.

---

### Option 2: MongoDB Atlas (Cloud) - Recommended for Production

#### Step 1: MongoDB Atlas Account

1. **Account Create karo:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Sign up with Google/Email

2. **Free Cluster Create karo:**
   - "Build a Database" click karo
   - **Deployment Type**: M0 FREE (Free tier)
   - **Cloud Provider**: AWS (or any)
   - **Region**: Choose closest (e.g., Mumbai for India)
   - **Cluster Name**: jalna-reporter-news (or any name)
   - Click **Create**

#### Step 2: Database User Create

1. **Security → Database Access** par jao
2. **Add New Database User** click karo
3. Fill:
   - **Username**: `jalnaadmin` (or any)
   - **Password**: Strong password (save karo!)
   - **Database User Privileges**: Read and write to any database
4. Click **Add User**

#### Step 3: Network Access Setup

1. **Security → Network Access** par jao
2. **Add IP Address** click karo
3. **Development**: 
   - "Add Current IP Address" click karo
   - Ya "Allow Access from Anywhere" (0.0.0.0/0) - **Only for testing!**
4. Click **Confirm**

#### Step 4: Connection String Get karo

1. **Deployments** section mein cluster par click karo
2. **Connect** button click karo
3. **Connect your application** select karo
4. **Driver**: Node.js, **Version**: 5.5 or later
5. Connection string copy karo:
   ```
   mongodb+srv://jalnaadmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

6. **Password replace karo:**
   - `<password>` ko apne database user password se replace karo
   - Example:
   ```
   mongodb+srv://jalnaadmin:MyPassword123@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

#### Step 5: .env.local Update karo

`.env.local` file mein `MONGODB_URI` update karo:

**For Atlas:**
```env
MONGODB_URI=mongodb+srv://jalnaadmin:YourPassword@cluster0.xxxxx.mongodb.net/jalnareporternews?retryWrites=true&w=majority
```

**For Local:**
```env
MONGODB_URI=mongodb://localhost:27017/jalnareporternews
```

---

## ✅ MongoDB Setup Verify karo

### Test Script Create karo:

Create file: `test-mongodb.js`

```javascript
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    await mongoose.connection.close();
    console.log('Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1);
  }
}

testConnection();
```

**Run karo:**
```powershell
node test-mongodb.js
```

Agar "✅ MongoDB Connected Successfully!" dikhe, toh sab sahi hai!

---

## 🚀 Complete App Setup

### Step 1: MongoDB Start karo

**Local MongoDB:**
```powershell
Start-Service MongoDB
```

**Atlas:** Already running (cloud hai)

### Step 2: Admin User Create karo

```powershell
npm run create-admin
```

Default credentials:
- Username: `admin`
- Password: `admin123`

**Custom credentials:**
```powershell
npm run create-admin myusername mypassword
```

### Step 3: Server Start karo

```powershell
npm run dev
```

### Step 4: Website Access karo

- **Website**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin/login

---

## 🔧 Troubleshooting

### "MongoDB service not found"
- MongoDB install nahi hua
- Reinstall karo: https://www.mongodb.com/try/download/community

### "Connection refused"
- MongoDB service running nahi hai
- Run: `Start-Service MongoDB`

### "Authentication failed" (Atlas)
- Database user password check karo
- Connection string mein password sahi hai ya nahi

### "Network access denied" (Atlas)
- Network Access mein apna IP add karo
- Ya temporarily "Allow from anywhere" enable karo

### "Cannot connect to MongoDB"
- `.env.local` file check karo
- `MONGODB_URI` sahi format mein hai ya nahi
- MongoDB service running hai ya nahi

---

## 📝 Quick Commands Reference

```powershell
# MongoDB Service
Start-Service MongoDB      # Start
Stop-Service MongoDB       # Stop
Get-Service MongoDB        # Status

# MongoDB Shell
mongosh                    # Open shell
exit                       # Close shell

# App Commands
npm run create-admin       # Create admin user
npm run dev                # Start server
npm run get-channel-id     # Get YouTube channel ID
```

---

## 🎯 Next Steps After MongoDB Setup

1. ✅ MongoDB running hai
2. ✅ `.env.local` file sahi hai
3. ✅ Admin user create karo: `npm run create-admin`
4. ✅ Server start karo: `npm run dev`
5. ✅ Admin panel login karo
6. ✅ Videos refresh karo (Admin → Videos → Refresh)

---

**Need Help?** Check `SETUP_GUIDE.md` for detailed instructions.

