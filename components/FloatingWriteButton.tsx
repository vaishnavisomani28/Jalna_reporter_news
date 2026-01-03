'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function FloatingWriteButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show button after page load
    setTimeout(() => setIsVisible(true), 500);
  }, []);

  return (
    <Link
      href="/write"
      className={`fixed bottom-8 right-8 bg-primary text-white px-6 py-4 rounded-full shadow-2xl hover:bg-primary-dark transition-all z-50 flex items-center space-x-2 group animate-bounce ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ animation: 'bounce 2s infinite' }}
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span className="font-bold text-lg">Write Article</span>
      <span className="group-hover:translate-x-1 transition-transform">→</span>
    </Link>
  );
}

