# 🔧 Blog Slug Fix Guide

## Problem
Blogs with Marathi or other non-English text were getting empty slugs, making them inaccessible on the production site.

## What Was Fixed

### 1. **Improved Slug Generation**
- Updated `generateSlug()` function in `lib/utils.ts` to handle non-ASCII characters (Marathi, Hindi, etc.)
- Uses Unicode normalization to convert accented characters
- Falls back to hash-based slug if all characters are removed

### 2. **Empty Slug Prevention**
- Added validation to prevent empty slugs when creating/updating blogs
- Added filtering to exclude blogs with empty slugs from listings
- Better error messages when slug generation fails

### 3. **Better Error Handling**
- Improved error messages for invalid slugs
- Better handling of empty or "EMPTY" slugs in API routes

## How to Fix Existing Blogs

### Option 1: Run the Fix Script (Recommended)

```bash
npm run fix-empty-slugs
```

This script will:
- Find all blogs with empty or invalid slugs
- Generate new slugs based on their titles
- Update them in the database
- Show you the new URLs

### Option 2: Manual Fix via Supabase Dashboard

1. Go to Supabase Dashboard → Table Editor → `blogs` table
2. Find blogs with empty slugs (slug column is empty or shows "EMPTY")
3. For each blog:
   - Copy the title
   - Generate a slug manually (lowercase, replace spaces with hyphens)
   - Update the slug field
   - **Important**: Make sure `published` is set to `true` if you want it visible on the site

### Option 3: Fix via Admin Panel

1. Go to `/admin/blogs`
2. Click "Edit" on the blog with empty slug
3. The system will automatically generate a new slug when you save
4. Make sure "Published" checkbox is checked
5. Click "Update Blog"

## Important Notes

### Publishing Blogs
- **Blogs must have `published = true` to appear on the site**
- Check the "Published" checkbox when creating/editing blogs
- Draft blogs (`published = false`) won't show up on the frontend

### Slug Requirements
- Slugs must be unique
- Slugs are auto-generated from titles
- For Marathi/Hindi titles, the system will create a hash-based slug
- You can manually edit slugs if needed

## Testing

After fixing slugs:

1. **Check Blog List**: Go to `/blogs` - all published blogs should appear
2. **Check Individual Blog**: Click on a blog - it should open correctly
3. **Check Admin Panel**: Go to `/admin/blogs` - verify slugs are not empty

## Common Issues

### "Blog not found" Error
- **Cause**: Blog is not published OR slug is empty/invalid
- **Fix**: 
  1. Check `published` field in Supabase (should be `true`)
  2. Run `npm run fix-empty-slugs` to fix empty slugs
  3. Try accessing the blog again

### Blog Shows in Database but Not on Site
- **Cause**: Blog is not published (`published = false`)
- **Fix**: 
  1. Go to Supabase Dashboard
  2. Find the blog
  3. Set `published` to `true`
  4. Or edit via Admin Panel and check "Published" checkbox

### Empty Slug Error
- **Cause**: Title contains only non-ASCII characters that can't be converted to slug
- **Fix**: 
  1. Run `npm run fix-empty-slugs` - it will generate a hash-based slug
  2. Or manually add a slug in Supabase Dashboard

## Prevention

To prevent this issue in the future:

1. **Always check "Published"** when creating blogs
2. **Verify slug is generated** before saving
3. **Use titles with some English characters** if possible (helps with SEO too)
4. **Test blog URLs** after creating them

## Support

If you still have issues:
1. Check Supabase logs for errors
2. Verify environment variables are set correctly
3. Make sure Supabase RLS policies allow reading published blogs
4. Check browser console for frontend errors
