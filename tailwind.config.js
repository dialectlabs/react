module.exports = {
  mode: 'jit',
  purge: ['./{components,pages}/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // or 'media' or 'class'},
  variants: {
    extend: {},
  },
  plugins: [],
};
