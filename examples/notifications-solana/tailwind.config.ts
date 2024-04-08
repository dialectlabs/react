import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      dark: {
        100: '#1B1B1C',
        90: '#2A2A2B',
        80: '#434445',
        70: '#656564',
        50: '#B3B3B3',
      },
      light: {
        100: '#FFFFFF',
        90: '#F9F9F9',
        80: '#F2F3F5',
        60: '#EBEBEB',
        50: '#DEE1E7',
        30: '#D7D7D7',
      },
      accent: {
        cyan: '#09CBBF',
        red: '#F62D2D',
      },
      primary: '#FFFFFF',
      transparent: 'transparent',
      current: 'currentColor',
    },
    extend: {
      backgroundImage: {
        'gradient-button':
          'linear-gradient(95deg, #2B2D2D 4.07%, #414445 51.31%, #2B2D2D 95.93%)',
      },
      fontSize: {
        button: [
          '0.938rem',
          {
            fontWeight: 400,
            lineHeight: '1.25rem',
          },
        ],
      },
    },
  },
  plugins: [],
};
export default config;
