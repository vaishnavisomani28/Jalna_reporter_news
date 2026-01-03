'use client';

import Link from 'next/link';

export default function HomeWriteButton() {
  return (
    <div className="mb-8 bg-gradient-to-r from-primary to-primary-dark rounded-lg p-6 text-white shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-bold mb-2">✏️ Create New Article</h3>
          <p className="text-white/90">Add new blogs and articles directly from the website</p>
          <p className="text-white/70 text-sm mt-2">Login required to create articles</p>
        </div>
        <Link
          href="/write"
          className="flex items-center space-x-2 bg-white text-primary px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-bold shadow-xl text-lg whitespace-nowrap"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span>+ Write New Article</span>
        </Link>
      </div>
    </div>
  );
}

