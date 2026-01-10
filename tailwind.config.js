/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DC2626', // Vibrant red (red-600)
          dark: '#B91C1C',    // Darker red (red-700)
          light: '#EF4444',   // Lighter red (red-500)
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'var(--font-mukta)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-noto-serif-devanagari)', 'var(--font-mukta)', 'Georgia', 'serif'],
        mono: ['Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5' }],      // 12px
        'sm': ['0.875rem', { lineHeight: '1.6' }],     // 14px
        'base': ['clamp(16px, 1.125vw, 18px)', { lineHeight: '1.75' }],  // Responsive 16-18px
        'lg': ['clamp(18px, 1.25vw, 20px)', { lineHeight: '1.75' }],     // Responsive 18-20px
        'xl': ['clamp(20px, 1.5vw, 24px)', { lineHeight: '1.6' }],       // Responsive 20-24px
        '2xl': ['clamp(24px, 2vw, 30px)', { lineHeight: '1.5' }],        // Responsive 24-30px
        '3xl': ['clamp(30px, 2.5vw, 36px)', { lineHeight: '1.4' }],      // Responsive 30-36px
        '4xl': ['clamp(36px, 3vw, 42px)', { lineHeight: '1.3' }],        // Responsive 36-42px
        '5xl': ['clamp(42px, 4vw, 48px)', { lineHeight: '1.2' }],        // Responsive 42-48px
      },
      maxWidth: {
        'article': '720px',   // Optimal article width for reading
        'article-wide': '800px', // Slightly wider for desktop
      },
      lineHeight: {
        'relaxed': '1.75',
        'loose': '2',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

