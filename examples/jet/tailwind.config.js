module.exports = {
  content: [
    './{components,pages}/**/*.{js,ts,jsx,tsx}',
    // For local development uncomment next two lines for tailwind to take into account workspace files too
    // '../../node_modules/@dialectlabs/react-ui/**/*.{js,ts,jsx,tsx}',
    // '../../packages/dialect-react-ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Lato, sans-serif'],
        body: ['Lato, sans-serif'],
        sans: ['Helvetica Neue, sans-serif'],
        poppins: ['Poppins, sans-serif'],
      },
      minWidth: {
        0: '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%',
        120: '120px',
      },
      backgroundColor: (theme) => ({
        ...theme('colors'),
        night: '#252525',
      }),
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
