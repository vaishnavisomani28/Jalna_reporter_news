# 📍 MongoDB Network Access - Step by Step (Hindi/English)

## Network Access Kahan Hai?

### Method 1: Left Sidebar Se (Easiest)

1. **MongoDB Atlas Dashboard** mein aap ho (jo screenshot dikhaya)
2. **Left Sidebar** dekho (screen ke left side pe)
3. **"Security"** section mein dekho
4. **"Network Access"** option mil jayega

### Method 2: Direct Link Se (Fastest)

Agar left sidebar se nahi mil raha, to ye steps follow karo:

1. Browser mein **URL bar** mein click karo
2. Current URL hoga kuch aisa: `cloud.mongodb.com/v2/.../clusters/detail/jalna-reporter-news`
3. URL ko change karo to: `cloud.mongodb.com/v2/.../network-access`
4. Ya phir direct ye URL open karo (apni project ID ke saath)

### Method 3: Top Navigation Se

1. Screen ke **top** pe navigation bar dekho
2. **"Security"** tab/button dikhega
3. Click karo
4. Dropdown mein **"Network Access"** dikhega

## Visual Guide

**Left Sidebar Structure:**
```
📊 Overview (current page - green highlight)
🔗 Database Access
🔒 Network Access  ← YEH YAHAN HAI!
⚙️  Database
📈 Metrics
... (other options)
```

**Agar "Network Access" directly nahi dikh raha:**
- "Security" section expand karo (click karo)
- Uske andar "Network Access" mil jayega

## Step-by-Step: IP Address Add Kaise Karein

Jab "Network Access" page pe pahunche:

1. **"Add IP Address"** button dikhega (green/blue button, top right ya middle mein)
2. Click karo
3. **Modal/Dialog box** open hoga
4. **Two options honge:**
   - **Option A**: "Allow Access from Anywhere" button (RECOMMENDED)
   - **Option B**: Manually IP address enter karo
5. **"Allow Access from Anywhere"** button click karo
   - Ya phir manually `0.0.0.0/0` enter karo
6. **Comment** add karo (optional): "Vercel deployment"
7. **"Confirm"** ya **"Add"** button click karo
8. **1-2 minutes wait** karo

## Screenshots Kahan Dekhne Hain?

Agar phir bhi nahi mil raha:

1. **Browser ki left sidebar** scroll karo (up/down)
2. **"Security"** section ko expand/collapse karo
3. **Search box** use karo (agar hai) - type "Network"
4. **Help icon** click karo (top right pe ? mark)

## Alternative: MongoDB Atlas Search

1. Top right pe **search icon** (🔍) dikh raha hoga
2. Click karo
3. Type: "Network Access"
4. Result click karo

## Still Not Found?

Agar phir bhi nahi mil raha, to:

1. **MongoDB Atlas Homepage** pe jao: https://cloud.mongodb.com/
2. **Left sidebar** pe **"Network Access"** directly dikhega (top level menu item)
3. Click karo

Ya phir direct URL:
```
https://cloud.mongodb.com/v2/[YOUR_PROJECT_ID]/security/network/whitelist
```

## Quick Checklist

- [ ] Left sidebar scroll kiya (up/down)
- [ ] "Security" section check kiya
- [ ] Top navigation check kiya
- [ ] Search box use kiya
- [ ] Direct URL try kiya

**Usually "Network Access" left sidebar mein top ke kareeb hota hai, "Database Access" ke neeche!** 📍

