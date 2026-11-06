import colors from 'tailwindcss/colors';

/**
 * K.E.S. Kanyashala theme — "Heritage Maroon & Marigold"
 * Colours are taken from the school logo: crimson petals, marigold lamp, leaf green.
 * Neutral greys are warm (stone) instead of blue-grey, so no section looks "navy".
 */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Every `slate-*` class in the project now uses warm neutrals.
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
          primary: '#A51C30', // KES crimson
          secondary: '#5E1422', // deep maroon
          accent: '#2E7D32', // leaf green from the logo
          light: '#FBF8F4', // warm cream page background
          gold: '#F5B534', // marigold (use on dark backgrounds)
          'gold-dark': '#9C5B0D', // readable gold for light backgrounds
          cream: '#FFF8EC',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(60, 20, 20, 0.10)',
        card: '0 1px 2px rgba(60, 20, 20, 0.04), 0 8px 24px -12px rgba(60, 20, 20, 0.12)',
      },
      backgroundImage: {
        'heritage-pattern':
          "radial-gradient(circle at 1px 1px, rgba(165, 28, 48, 0.08) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
