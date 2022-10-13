module.exports = {
  content: ['./{components,pages}/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
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
      colors: {
        pink: '#B852DC',
        teal: '#59C29D',
        dark: '#353535',
        light: '#F6F6F6',
        'border-light': '#F0F0F0',
        blue: '#448EF7',
      },
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
