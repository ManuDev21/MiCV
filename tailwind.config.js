/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: 'rgb(var(--nexus-void-rgb) / <alpha-value>)',
        deep: 'rgb(var(--nexus-abyss-rgb) / <alpha-value>)',
        panel: 'rgb(var(--nexus-surface-rgb) / <alpha-value>)',
        nexus: {
          void: 'rgb(var(--nexus-void-rgb) / <alpha-value>)',
          abyss: 'rgb(var(--nexus-abyss-rgb) / <alpha-value>)',
          surface: 'rgb(var(--nexus-surface-rgb) / <alpha-value>)',
          violet: 'rgb(var(--nexus-violet-rgb) / <alpha-value>)',
          cyan: 'rgb(var(--nexus-cyan-rgb) / <alpha-value>)',
          plasma: 'rgb(var(--nexus-plasma-rgb) / <alpha-value>)',
          magenta: 'rgb(var(--nexus-magenta-rgb) / <alpha-value>)',
          white: 'rgb(var(--nexus-white-rgb) / <alpha-value>)',
          muted: 'rgb(var(--nexus-muted-rgb) / <alpha-value>)',
          border: 'rgb(var(--nexus-border-rgb) / <alpha-value>)',
        },
        neon: {
          purple: 'rgb(var(--nexus-violet-rgb) / <alpha-value>)',
          violet: 'rgb(var(--nexus-violet-rgb) / <alpha-value>)',
          cyan: 'rgb(var(--nexus-cyan-rgb) / <alpha-value>)',
          blue: 'rgb(var(--nexus-plasma-rgb) / <alpha-value>)',
          pink: 'rgb(var(--nexus-magenta-rgb) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'system-ui', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        display: ['Orbitron', '"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 22px rgba(139,92,246,0.38), 0 0 42px rgba(0,229,255,0.2)',
        'neon-cyan': '0 0 24px rgba(0,229,255,0.45)',
        'neon-purple': '0 0 24px rgba(139,92,246,0.45)',
        'neon-magenta': '0 0 24px rgba(236,72,153,0.42)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translate3d(0, 0, 0)' },
          '50%': { transform: 'translate3d(0, -8px, 0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSlow: {
          '0%,100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.75', transform: 'scale(1.03)' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
        'pulse-slow': 'pulseSlow 4s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
