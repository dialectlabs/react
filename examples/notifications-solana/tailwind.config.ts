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
        100: '#1b1b1c',
        90: '#232324',
        80: '#2a2a2b',
        70: '#323335',
        60: '#383a3c',
        50: '#434445',
        40: '#656564',
        30: '#737373',
        20: '#888989',
      },
      light: {
        100: '#ffffff',
        90: '#f9f9f9',
        80: '#f2f3f5',
        70: '#ebebeb',
        60: '#dee1e7',
        50: '#d7d7d7',
        40: '#c4c6c8',
        30: '#b3b3b3',
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
