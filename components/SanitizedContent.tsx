'use client';

import { useEffect, useState } from 'react';

interface SanitizedContentProps {
  html: string;
  className?: string;
}

// Simple client-side sanitization function
// For production, consider using a more robust solution
function sanitizeHtml(html: string): string {
  // Basic XSS protection - remove script tags and event handlers
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '');
  
  return sanitized;
}

export default function SanitizedContent({ html, className = '' }: SanitizedContentProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Sanitize HTML on client side only
    const sanitized = sanitizeHtml(html);
    setSanitizedHtml(sanitized);
  }, [html]);

  if (!isClient || !sanitizedHtml) {
    return <div className={className}>Loading...</div>;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
