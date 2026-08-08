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
        darkBg: '#070a12',
        cardBg: '#0e1526',
        cardHover: '#162038',
        brandPrimary: '#6366f1',
        brandSecondary: '#06b6d4',
        brandSuccess: '#10b981',
        brandWarning: '#f59e0b',
        brandDanger: '#ef4444',
      },
      fontFamily: {
        heading: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
