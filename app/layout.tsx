import type { Metadata } from 'next';
import { Inter, Noto_Serif_Devanagari, Mukta } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FloatingWriteButton from '@/components/FloatingWriteButton';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const notoSerifDevanagari = Noto_Serif_Devanagari({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-devanagari',
  display: 'swap',
});

const mukta = Mukta({
  subsets: ['latin', 'devanagari'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-mukta',
  display: 'swap',
});

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
  other: {
    'google-adsense-account': 'ca-pub-5818301035943442',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className={`${inter.variable} ${notoSerifDevanagari.variable} ${mukta.variable}`}>
      <body className={`${inter.className} font-sans`}>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5818301035943442"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
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

