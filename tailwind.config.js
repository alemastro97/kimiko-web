/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        kawaii: ['"Bagel Fat One"', 'cursive'],
      },
      colors: {
        sakura: {
          50:  '#fef2f5',
          100: '#fcc5d8',
          200: '#f5a0be',
          300: '#ec7aa3',
          400: '#e25888',
          500: '#cc3d6e',
          600: '#a82e58',
        },
        gold: {
          300: '#ffe066',
          400: '#ffd700',
          500: '#f4c430',
          600: '#e0a800',
        },
      },
      animation: {
        float:    'float 3s ease-in-out infinite',
        'float-slow': 'float 5s ease-in-out infinite',
        sparkle:  'sparkle 2s ease-in-out infinite',
        shimmer:  'shimmer 2.5s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'spin-slow':  'spin 8s linear infinite',
        wiggle:   'wiggle 1s ease-in-out infinite',
        'bounce-slow': 'bounce 3s infinite',
        peek:     'peek 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        peek: {
          '0%, 40%, 100%': { transform: 'translateY(100%)' },
          '50%, 90%':      { transform: 'translateY(30%)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%':      { opacity: '0.4', transform: 'scale(1.3)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,215,0,0.4)' },
          '50%':      { boxShadow: '0 0 20px 8px rgba(255,215,0,0.2)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%':      { transform: 'rotate(5deg)' },
        },
      },
    },
  },
  plugins: [],
}
