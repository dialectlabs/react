module.exports = {
  content: [
    './components/**/*.{js,ts,jsx,tsx}',
    './entities/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      inter: ['Inter, sans-serif'],
      colors: {
        'subtle-day': '#C5C5C530',
        'secondary-back-day': '#17171710',
        'error-day': '#D62929',
        'outline-day': '#00000010',
        'solid-night': '#252525',
        'dark-night': '#1F1F1F',
        'outline-night': '#FFFFFF10',
        'subtle-night': '#ABABAB20',
        'secondary-back-night': '#171717',
        'error-night': '#DE5454',
        'utility-active': '#25BC3B',
        accent: '#6F2AFF',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  prefix: 'dt-',
};
