import colors from 'tailwindcss/colors';

/**
 * K.E.S. Family theme — "Lamp & Lotus"
 * Copied from the Smt. J.R.H. Kanyashala site ("Heritage Maroon & Marigold") so every K.E.S. website
 * shares the same tokens. Colours come from the Society emblem: crimson lotus petals, marigold lamp, leaf green.
 * Neutral greys are warm (stone) instead of blue-grey.
 * New in the parent site: `flag` (torch-flag crimson-pink) and `cat.*` (institution-type badge colours).
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        slate: colors.stone,
        primary: {
          50: '#FDF3F4',
          100: '#FBE5E8',
          200: '#F5CBD1',
          300: '#EBA2AD',
          400: '#DC6E7F',
          500: '#C94459',
          600: '#B12C42',
          700: '#A51C30',
          800: '#7F1A2B',
          900: '#5E1422',
          950: '#3A0912',
        },
        gold: {
          50: '#FFFAEC',
          100: '#FEF1CB',
          200: '#FDE196',
          300: '#FBCB58',
          400: '#F5B534',
          500: '#E39B12',
          600: '#C47A0B',
          700: '#9C5B0D',
          800: '#7F4812',
          900: '#693C13',
        },
        brand: {
          primary: '#A51C30',
          secondary: '#5E1422',
          accent: '#2E7D32',
          light: '#FBF8F4',
          gold: '#F5B534',
          'gold-dark': '#9C5B0D',
          cream: '#FFF8EC',
        },
        // Torch-flag crimson-pink — use sparingly (flame splash ornament, one highlight).
        flag: '#E3123F',
        // Institution-type accents — small badges and icons only, never section fills.
        cat: {
          medical: '#2E7D32',
          senior: '#1E3A8A',
          secondary: '#A51C30',
          primary: '#C47A0B',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
        motto: ['"Tiro Devanagari Sanskrit"', '"Noto Sans Devanagari"', 'serif'],
        deva: ['"Noto Sans Devanagari"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(60, 20, 20, 0.10)',
        card: '0 1px 2px rgba(60, 20, 20, 0.04), 0 8px 24px -12px rgba(60, 20, 20, 0.12)',
      },
      backgroundImage: {
        'heritage-pattern': 'radial-gradient(circle at 1px 1px, rgba(165, 28, 48, 0.08) 1px, transparent 0)',
      },
      keyframes: {
        'spin-slow': { to: { transform: 'rotate(360deg)' } },
        'toast-in': { from: { opacity: '0', transform: 'translateY(20px) scale(0.96)' }, to: { opacity: '1', transform: 'none' } },
        'pop-in': { from: { opacity: '0', transform: 'translateY(-12px) scale(0.97)' }, to: { opacity: '1', transform: 'none' } },
      },
      animation: {
        'spin-slow': 'spin-slow 60s linear infinite',
        'spin-loader': 'spin-slow 2.4s linear infinite',
        'toast-in': 'toast-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
