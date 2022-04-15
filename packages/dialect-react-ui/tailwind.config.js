module.exports = {
  content: ['./components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      inter: ['Inter, sans-serif'],
      colors: {
        'subtle-day': '#C5C5C530',
        'secondary-back-day': '#17171710',
        'error-day': '#D62929',
        'subtle-night': '#ABABAB10',
        'secondary-back-night': '#171717',
        'error-night': '#DE5454',
      },
      keyframes: {
        'grow-and-slide': {
          '0%': {
            transform: 'translateY(100%)',
            maxHeight: 0,
          },
          '80%': {
            transform: 'translateY(0%)',
            maxHeight: '80%',
          },
          '100%': {
            transform: 'translateY(0%)',
            maxHeight: '100%',
          },
        },
      },
      animation: {
        'message-appear': 'grow-and-slide 200ms ease-in-out',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
  prefix: 'dt-',
};
