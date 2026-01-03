'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SafeImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  [key: string]: any;
}

export default function SafeImage({ src, alt, fill, width, height, className, ...props }: SafeImageProps) {
  const [useFallback, setUseFallback] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Check if src is a valid URL or relative path
  const isValidImageSrc = (src: string): boolean => {
    if (!src) return false;
    
    // Check if it's a local file path (Windows or Unix)
    if (src.includes(':\\') || src.startsWith('/') && !src.startsWith('/uploads') && !src.startsWith('/')) {
      return false;
    }
    
    // Check if it's a valid URL
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return true;
    }
    
    // Check if it's a relative path from public folder
    if (src.startsWith('/uploads/') || src.startsWith('/')) {
      return true;
    }
    
    return false;
  };

  // If invalid src or error, use fallback
  if (!isValidImageSrc(src) || useFallback || imgError) {
    return (
      <div 
        className={`bg-gray-200 flex items-center justify-center ${className || ''}`}
        style={fill ? { position: 'absolute', inset: 0 } : { width, height }}
      >
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  // Try to use Next.js Image component
  try {
    if (fill) {
      return (
        <Image
          src={src}
          alt={alt}
          fill
          className={className}
          onError={() => {
            setUseFallback(true);
            setImgError(true);
          }}
          {...props}
        />
      );
    } else {
      return (
        <Image
          src={src}
          alt={alt}
          width={width || 400}
          height={height || 300}
          className={className}
          onError={() => {
            setUseFallback(true);
            setImgError(true);
          }}
          {...props}
        />
      );
    }
  } catch (error) {
    // Fallback to regular img tag
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={() => setImgError(true)}
        style={fill ? { width: '100%', height: '100%', objectFit: 'cover' } : {}}
        {...props}
      />
    );
  }
}

