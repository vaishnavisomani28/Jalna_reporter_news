'use client';

import { useEffect, useState } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface SanitizedContentProps {
  html: string;
  className?: string;
}

export default function SanitizedContent({ html, className = '' }: SanitizedContentProps) {
  const [sanitizedHtml, setSanitizedHtml] = useState('');

  useEffect(() => {
    // Sanitize HTML on client side
    const sanitized = DOMPurify.sanitize(html);
    setSanitizedHtml(sanitized);
  }, [html]);

  if (!sanitizedHtml) {
    return <div className={className}>Loading...</div>;
  }

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}

