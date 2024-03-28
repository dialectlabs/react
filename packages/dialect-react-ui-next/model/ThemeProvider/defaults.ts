import { Theme } from './types';

export const defaultTheme: Theme = {
  light: {
    text: {
      colors: {
        primary: 'dt-dark-100',
        secondary: 'dt-dark-80',
        tertiary: 'dt-dark-60',
        inverse: 'dt-light-100',
      },
    },
    bg: {
      colors: {
        primary: 'dt-light-100',
        secondary: 'dt-light-80',
        tertiary: 'dt-light-60',
        brand: 'dt-light-60',
      },
    },
    input: {
      colors: {
        primary: 'dt-light-50',
        secondary: 'dt-light-100',
        tertiary: 'dt-light-60',
        disabled: 'dt-light-30',
        checked: 'dt-accent-success',
        unchecked: 'dt-light-30',
      },
    },
    stroke: {
      colors: {
        primary: 'dt-light-50',
      },
    },
    icon: {
      colors: {
        primary: 'dt-dark-90',
        secondary: 'dt-dark-60',
        inverse: 'dt-light-100',
      },
    },
    accent: {
      colors: {
        brand: 'dt-accent-success',
        success: 'dt-accent-success',
        warning: 'dt-accent-warning',
        error: 'dt-accent-error',
      },
    },
  },
  dark: {
    text: {
      colors: {
        primary: '',
        secondary: '',
        tertiary: '',
        inverse: '',
      },
    },
    bg: {
      colors: {
        primary: '',
        secondary: '',
        tertiary: '',
        brand: '',
      },
    },
    input: {
      colors: {
        primary: '',
        secondary: '',
        tertiary: '',
        disabled: '',
        checked: '',
        unchecked: '',
      },
    },
    stroke: {
      colors: {
        primary: '',
      },
    },
    icon: {
      colors: {
        primary: '',
        secondary: '',
        inverse: '',
      },
    },
    accent: {
      colors: {
        brand: '',
        success: '',
        warning: '',
        error: '',
      },
    },
  },
  common: {
    icons: {},
  },
};
