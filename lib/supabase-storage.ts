import { supabaseAdmin } from './supabase';

const BUCKET_NAME = 'blog-images';

// Initialize bucket if it doesn't exist (run this once)
export async function initializeStorage() {
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    
    if (listError) throw listError;
    
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      // Create bucket
      const { error: createError } = await supabaseAdmin.storage.createBucket(BUCKET_NAME, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
      });
      
      if (createError) throw createError;
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Upload image to Supabase Storage
export async function uploadImage(file: File, folder: string = 'featured'): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/\.\./g, '_')
      .substring(0, 100);
    const extension = sanitizedName.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${timestamp}-${sanitizedName.replace(/\.[^/.]+$/, '')}.${extension}`;
    const filePath = `${folder}/${filename}`;

    // Upload file
    const { data, error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

// Delete image from Supabase Storage
export async function deleteImage(filePath: string): Promise<void> {
  try {
    // Extract path from full URL
    const path = filePath.split(`${BUCKET_NAME}/`)[1];
    if (!path) return;

    const { error } = await supabaseAdmin.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    // Don't throw - image deletion is not critical
  }
}

