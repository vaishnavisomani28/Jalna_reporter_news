/**
 * Script to fix blogs with empty or invalid slugs
 * Run: node scripts/fix-empty-slugs.js
 */

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

function generateSlug(title) {
  if (!title || title.trim() === '') {
    return `blog-${Date.now()}`;
  }

  // Normalize Unicode characters
  let slug = title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // If slug is empty after processing, use fallback
  if (!slug || slug.length === 0) {
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    slug = `blog-${Math.abs(hash)}-${Date.now().toString().slice(-6)}`;
  }

  return slug;
}

async function fixEmptySlugs() {
  try {
    console.log('🔍 Fetching all blogs...');
    
    // Get all blogs (including unpublished)
    const { data: blogs, error } = await supabase
      .from('blogs')
      .select('*');

    if (error) {
      console.error('❌ Error fetching blogs:', error);
      process.exit(1);
    }

    if (!blogs || blogs.length === 0) {
      console.log('✅ No blogs found.');
      return;
    }

    console.log(`📝 Found ${blogs.length} blog(s)`);

    let fixedCount = 0;
    let skippedCount = 0;

    for (const blog of blogs) {
      const needsFix = !blog.slug || 
                       blog.slug.trim() === '' || 
                       blog.slug.toLowerCase() === 'empty';

      if (needsFix) {
        console.log(`\n🔧 Fixing blog: "${blog.title}"`);
        console.log(`   Current slug: "${blog.slug || '(empty)'}"`);

        const newSlug = generateSlug(blog.title);
        console.log(`   New slug: "${newSlug}"`);

        // Check if slug already exists
        const { data: existing } = await supabase
          .from('blogs')
          .select('id')
          .eq('slug', newSlug)
          .neq('id', blog.id)
          .single();

        let finalSlug = newSlug;
        if (existing) {
          // Add timestamp to make it unique
          finalSlug = `${newSlug}-${Date.now().toString().slice(-6)}`;
          console.log(`   ⚠️  Slug exists, using: "${finalSlug}"`);
        }

        // Update the blog
        const { error: updateError } = await supabase
          .from('blogs')
          .update({ 
            slug: finalSlug,
            updated_at: new Date().toISOString()
          })
          .eq('id', blog.id);

        if (updateError) {
          console.error(`   ❌ Error updating blog:`, updateError);
        } else {
          console.log(`   ✅ Fixed! New URL: /blogs/${finalSlug}`);
          fixedCount++;
        }
      } else {
        skippedCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Fixed: ${fixedCount} blog(s)`);
    console.log(`⏭️  Skipped: ${skippedCount} blog(s) (already have valid slugs)`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Run the script
fixEmptySlugs()
  .then(() => {
    console.log('\n✅ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
