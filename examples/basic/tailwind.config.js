module.exports = {
  content: [
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
      // TODO: remove after update to tailwind v3
      'white/5': 'rgba(255,255,255,.05)',
      'night/5': 'rgba(37,37,37,.05)',
    }),
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
