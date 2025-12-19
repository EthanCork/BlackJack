import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        casino: {
          gold: '#D4AF37',
          'gold-light': '#F0D98D',
          'gold-dark': '#B8941E',
          felt: '#0B5D1E',
          'felt-dark': '#063814',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'flip': 'flip 0.4s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-green': 'pulseGreen 0.5s ease-in-out',
        'shimmer': 'shimmer 1s ease-in-out',
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100px) translateY(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0) translateY(0)', opacity: '1' },
        },
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)' },
          '50%': { boxShadow: '0 0 20px 10px rgba(34, 197, 94, 0.4)' },
        },
        shimmer: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212, 175, 55, 0)' },
          '50%': { boxShadow: '0 0 30px 15px rgba(212, 175, 55, 0.6)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
