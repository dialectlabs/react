import type { Config } from 'tailwindcss';

export default {
  content: [
    './ui/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './model/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
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
  },
  plugins: [],
  prefix: 'dt-',
} satisfies Config;
