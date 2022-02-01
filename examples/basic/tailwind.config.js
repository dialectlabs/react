module.exports = {
  purge: [
    './{components,pages}/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@dialectlabs/react-ui/**/*.{js,ts,jsx,tsx}', // In development taking into account workspace files too
    '../../packages/dialect-react-ui/**/*.{js,ts,jsx,tsx}', // In development taking into account workspace files too
  ],
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
