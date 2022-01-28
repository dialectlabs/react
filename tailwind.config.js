module.exports = {
  mode: 'jit',
  purge: ['./{components,pages}/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      display: ['Lato, sans-serif'],
      body: ['Lato, sans-serif'],
      inter: ['Inter, sans-serif'],
    },
  },
  variants: {
    extend: {
      cursor: ['hover', 'focus', 'disabled'],
      opacity: ['disabled'],
      backgroundColor: ['disabled'],
      textColor: ['disabled'],
    },
  },
  plugins: [],
};
