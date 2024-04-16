/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      fontSize: {
        h2: [
          '1.0625rem',
          {
            fontWeight: 600,
            lineHeight: '1.25rem',
          },
        ],
        text: ['0.9375rem', '1.125rem'],
        subtext: ['0.8125rem', '1rem'],
        caption: ['0.6875rem', '0.875rem'],
      },
      backgroundImage: {
        'gradient-button':
          'linear-gradient(95deg, #2B2D2D 4.07%, #414445 51.31%, #2B2D2D 95.93%)',
      },
    },
  },
  plugins: [],
  prefix: 'dt-',
};
