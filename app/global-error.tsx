'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">Error</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-8">
            {error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={reset}
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-dark transition-colors"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}

