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
    },
  },
  plugins: [],
}

