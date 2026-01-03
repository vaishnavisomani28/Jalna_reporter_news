# How to Add Blogs - Admin Guide

## 📝 Adding Blogs to Your Website

Only **admin users** can add blogs to the website. Blogs are stored **permanently** in the database.

---

## 🚀 Quick Steps to Add a Blog:

### Step 1: Login to Admin Panel
1. Go to: http://localhost:3000/admin/login
2. Enter credentials:
   - Username: `admin`
   - Password: `admin123` (or your custom password)

### Step 2: Create New Blog
1. Click on **"Blogs"** in the admin navigation
2. Click **"+ New Blog"** button (top right)

### Step 3: Fill in Blog Details

**Required Fields:**
- **Title** - Your blog/article title
- **Content** - Use the rich text editor to write your content

**Optional Fields:**
- **Excerpt** - Short description (appears on blog listing page)
- **Featured Image URL** - Direct image URL (e.g., from Imgur, Cloudinary, etc.)
- **Publish immediately** - Check this to make it live right away

### Step 4: Use Rich Text Editor

The editor supports:
- **Headers** (H1, H2, H3)
- **Bold, Italic, Underline**
- **Lists** (Bulleted, Numbered)
- **Links** - Add external URLs
- **Images** - Insert images via URL
- **Alignment** - Left, Center, Right

### Step 5: Publish

- **To publish immediately:** Check "Publish immediately" checkbox
- **To save as draft:** Leave unchecked (you can publish later by editing)

Click **"Create Blog"** button

---

## ✏️ Editing Existing Blogs

1. Go to **Admin Panel → Blogs**
2. Find the blog you want to edit
3. Click **"Edit"** button
4. Make your changes
5. Click **"Update Blog"**

---

## 🗑️ Deleting Blogs

1. Go to **Admin Panel → Blogs**
2. Find the blog you want to delete
3. Click **"Delete"** button
4. Confirm deletion

**⚠️ Warning:** Deleted blogs cannot be recovered!

---

## 📸 Adding Images to Blogs

### Option 1: Featured Image (Blog Cover)
- Add image URL in **"Featured Image URL"** field
- Use direct image URLs (not relative paths)
- Recommended services:
  - Imgur: https://imgur.com
  - Cloudinary: https://cloudinary.com
  - Or any image hosting service

### Option 2: Images in Content
- Use the rich text editor
- Click **Image** icon in toolbar
- Paste direct image URL
- Image will appear in the content

---

## 🔗 Adding Links

1. Select text in the editor
2. Click **Link** icon
3. Enter URL
4. Click **Save**

---

## ✅ Best Practices

1. **Write Clear Titles** - Make them descriptive and SEO-friendly
2. **Add Excerpts** - Helps readers understand what the article is about
3. **Use Featured Images** - Makes blogs more attractive
4. **Publish Regularly** - Keep your website fresh with new content
5. **Check Before Publishing** - Preview your content before making it live

---

## 🎯 Blog Features

- **Permanent Storage** - All blogs are saved in MongoDB database
- **Rich Text Editing** - Full formatting capabilities
- **SEO Friendly** - Each blog has its own URL (slug)
- **Shareable** - Each blog has share buttons (WhatsApp, Facebook, Twitter)
- **Responsive** - Blogs look great on all devices

---

## 📋 Blog Management

### View All Blogs:
- **Admin Panel → Blogs** - See all blogs (published and drafts)

### Blog Status:
- **Published** (Green badge) - Visible on website
- **Draft** (Yellow badge) - Not visible, only in admin

### Blog URLs:
- Format: `http://localhost:3000/blogs/[slug]`
- Slug is auto-generated from title
- Example: "Welcome to Jalna" → `/blogs/welcome-to-jalna`

---

## 🆘 Troubleshooting

### "Can't see blogs on homepage"
- Make sure blog is **Published** (not draft)
- Check "Publish immediately" was checked when creating

### "Image not showing"
- Use direct image URLs (starting with http:// or https://)
- Make sure image URL is publicly accessible
- Try a different image hosting service

### "Can't edit blog"
- Make sure you're logged in as admin
- Check if blog exists in the list

---

## 💡 Tips

1. **Create Categories** - Use consistent titles/formatting for similar topics
2. **Regular Updates** - Post new blogs regularly to keep visitors engaged
3. **Engaging Content** - Write interesting, informative articles
4. **Use Images** - Visual content gets more engagement
5. **Share Your Blogs** - Use share buttons to promote on social media

---

**Need Help?** Check other guides or contact support.

