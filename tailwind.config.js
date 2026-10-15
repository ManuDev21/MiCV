/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#030407',
        deep: '#080B13',
        panel: '#101521',
        nexus: {
          void: '#030407',
          abyss: '#080B13',
          surface: '#101521',
          violet: '#8B5CF6',
          cyan: '#00E5FF',
          plasma: '#3B82F6',
          magenta: '#EC4899',
          white: '#F5FAFF',
          muted: '#9CA8BD',
        },
        neon: {
          purple: '#8B5CF6',
          violet: '#8B5CF6',
          cyan: '#00E5FF',
          blue: '#3B82F6',
          pink: '#EC4899',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        display: ['Orbitron', '"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 24px rgba(139,92,246,0.42), 0 0 48px rgba(0,229,255,0.22)',
        'neon-cyan': '0 0 28px rgba(0,229,255,0.52)',
        'neon-purple': '0 0 28px rgba(139,92,246,0.52)',
        'neon-magenta': '0 0 28px rgba(236,72,153,0.48)',
        'neu-dark': '8px 8px 20px rgba(1, 2, 5, 0.85), -6px -6px 16px rgba(28, 38, 62, 0.35), inset 0 1px 0 rgba(245, 250, 255, 0.08)',
        'neu-inset': 'inset 5px 5px 12px rgba(1, 2, 5, 0.9), inset -4px -4px 10px rgba(28, 38, 62, 0.3)',
        'glass-depth': '0 24px 60px -12px rgba(3, 4, 7, 0.78), 0 0 1px 1px rgba(245, 250, 255, 0.07)',
      },
      backgroundImage: {
        'grid-dark':
          'linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,0.06) 1px, transparent 1px)',
        'nexus-radial':
          'radial-gradient(ellipse at 50% 0%, rgba(139,92,246,0.18) 0%, rgba(0,229,255,0.07) 40%, transparent 75%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%,100%': { boxShadow: '0 0 20px rgba(139,92,246,0.45)' },
          '50%': { boxShadow: '0 0 35px rgba(0,229,255,0.55)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSlow: {
          '0%,100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(1.04)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 3s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
        scanline: 'scanline 8s linear infinite',
      },
    },
  },
  plugins: [],
};
