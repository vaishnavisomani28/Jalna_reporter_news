import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateSlug(title: string): string {
  if (!title || title.trim() === '') {
    // Fallback: use timestamp if title is empty
    return `blog-${Date.now()}`;
  }

  // Normalize Unicode characters (handles accented characters, etc.)
  let slug = title
    .normalize('NFD') // Decompose characters
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .toLowerCase()
    .trim();

  // Replace spaces and special characters with hyphens
  slug = slug
    .replace(/[^\w\s-]/g, '') // Remove non-word characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

  // If slug is empty after processing (e.g., all non-ASCII characters),
  // use a fallback based on timestamp and a hash of the title
  if (!slug || slug.length === 0) {
    // Create a simple hash from the title
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
      const char = title.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    slug = `blog-${Math.abs(hash)}-${Date.now().toString().slice(-6)}`;
  }

  return slug;
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
}

