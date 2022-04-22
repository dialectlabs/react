module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      inter: ['Inter, sans-serif'],
      colors: {
        'subtle-day': '#C5C5C530',
        'secondary-back-day': '#17171710',
        'error-day': '#D62929',

        'dark-night': '#1A1A1A',
        'solid-night': '#252525',
        'outline-night': '#FFFFFF20',
        'subtle-night': '#ABABAB20',
        'secondary-back-night': '#171717',
        'error-night': '#DE5454',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  prefix: 'dt-',
};
