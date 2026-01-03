import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWriteButton from '@/components/FloatingWriteButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jalna Reporter News - Latest News & Updates',
  description: 'Stay updated with the latest news, videos, and articles from Jalna Reporter News',
  keywords: 'news, jalna, reporter, latest news, videos, articles',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Jalna Reporter News',
    description: 'Latest news, videos, and articles',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <FloatingWriteButton />
          <Toaster position="top-right" />
        </ErrorBoundary>
      </body>
    </html>
  );
}

