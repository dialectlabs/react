/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      dark: {
        100: '#1b1b1c',
        90: '#2a2a2b',
        80: '#434445',
        70: '#656564',
        60: '#888989',
        50: '#b3b3b3',
      },
      light: {
        100: '#ffffff',
        90: '#f9f9f9',
        80: '#f2f3f5',
        60: '#ebebeb',
        50: '#dee1e7',
        30: '#d7d7d7',
      },
      accent: {
        brand: '#5169e2',
        success: '#09cbbf',
        warning: '#ff9900',
        error: '#f62d2d',
      },
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
