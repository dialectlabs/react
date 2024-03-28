import { Theme } from './types';

export const defaultTheme: Theme = {
  light: {
    text: {
      colors: {
        primary: 'dt-text-dark-100',
        secondary: 'dt-text-dark-80',
        tertiary: 'dt-text-dark-60',
        inverse: 'dt-text-light-100',
      },
    },
    bg: {
      colors: {
        primary: 'dt-bg-light-100',
        secondary: 'dt-bg-light-80',
        tertiary: 'dt-bg-light-60',
        brand: 'dt-bg-light-60',
      },
    },
    input: {
      colors: {
        primary: 'dt-bg-light-50',
        secondary: 'dt-bg-light-100',
        tertiary: 'dt-bg-light-60',
        disabled: 'dt-bg-text-light-30',
        checked: 'dt-bg-accent-success',
        unchecked: 'dt-bg-light-30',
      },
    },
    stroke: {
      colors: {
        primary: 'dt-border-light-50',
      },
    },
    icon: {
      colors: {
        primary: 'dt-text-dark-90',
        secondary: 'dt-text-dark-60',
        inverse: 'dt-text-light-100',
      },
    },
    // TODO: rethink this, since only covers background colors
    accent: {
      colors: {
        brand: 'dt-bg-accent-success',
        success: 'dt-bg-accent-success',
        warning: 'dt-bg-accent-warning',
        error: 'dt-bg-accent-error',
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
