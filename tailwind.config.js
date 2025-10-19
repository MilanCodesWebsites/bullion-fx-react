/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // BullionFX brand palette
        'bullionfx-blue': '#3b82f6',
        'bullionfx-blue-500': '#3b82f6',
        'bullionfx-blue-600': '#2563eb',
        'bullionfx-blue-700': '#1d4ed8',
        'bullionfx-cyan': '#06b6d4',
        // Back-compat aliases
        'vertex-blue': '#3b82f6',
        'vertex-blue-500': '#3b82f6',
        'vertex-blue-600': '#2563eb',
        'vertex-blue-700': '#1d4ed8',
        'vertex-cyan': '#06b6d4',
        'neon-green': '#3b82f6',
        'dark-green': '#2563eb',
        'deep-black': '#0A0A0A',
        'rich-black': '#111111',
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6, 0 0 15px #3b82f6' },
          '100%': { boxShadow: '0 0 10px #2563eb, 0 0 20px #2563eb, 0 0 30px #2563eb' },
        },
      },
    },
  },
  plugins: [],
};