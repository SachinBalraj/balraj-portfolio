/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        foreground: '#fafafa',
        card: {
          DEFAULT: '#111111',
          foreground: '#fafafa',
        },
        secondary: {
          DEFAULT: '#1e293b',
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#262626',
          foreground: '#a3a3a3',
        },
        accent: {
          DEFAULT: '#2d2d2d',
          foreground: '#fafafa',
        },
        border: '#333333',
        ring: '#22C55E',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'counter': 'counter 2s ease-out',
        'marquee': 'marquee 40s linear infinite',
        'pulse-ring': 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '0.2' },
          '100%': { transform: 'scale(0.8)', opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(34,197,94,0.15), 0 0 40px rgba(34,197,94,0.05)' },
          '50%': { boxShadow: '0 0 30px rgba(34,197,94,0.25), 0 0 60px rgba(34,197,94,0.1)' },
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
