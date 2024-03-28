import type { Config } from 'tailwindcss';

export default {
  content: [
    './ui/**/*.{js,ts,jsx,tsx}',
    './utils/**/*.{js,ts,jsx,tsx}',
    './model/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  prefix: 'dt-',
} satisfies Config;
