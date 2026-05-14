/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#050505',
        deep: '#0a0a0f',
        panel: '#0f0f17',
        neon: {
          purple: '#a855f7',
          violet: '#8b5cf6',
          cyan: '#22d3ee',
          pink: '#ec4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        display: ['Orbitron', '"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(168,85,247,0.45), 0 0 40px rgba(34,211,238,0.25)',
        'neon-cyan': '0 0 25px rgba(34,211,238,0.55)',
        'neon-purple': '0 0 25px rgba(168,85,247,0.55)',
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(rgba(168,85,247,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.06) 1px, transparent 1px)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(168,85,247,0.45)' },
          '50%': { boxShadow: '0 0 35px rgba(34,211,238,0.55)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
};
