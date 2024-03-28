import { DeepPartial } from '../../utils';

// todo: think about conditional gradients
export type ThemeClasses = {
  text: {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
  };
  bg: {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      brand: string;
    };
  };
  // all input types: buttons, checkboxes, switches, text fields, etc.
  input: {
    colors: {
      primary: string;
      secondary: string;
      tertiary: string;
      disabled: string;
      // switches, checkboxes
      checked: string;
      unchecked: string;
    };
  };
  // non-input borders
  stroke: {
    colors: {
      primary: string;
    };
  };
  icon: {
    colors: {
      primary: string;
      secondary: string;
      inverse: string;
    };
  };
  accent: {
    colors: {
      // todo: think about transparency
      brand: string;
      success: string;
      warning: string;
      error: string;
    };
  };
};

export type CommonThemeValues = {
  icons: {};
};

export interface Theme {
  light: ThemeClasses;
  dark: ThemeClasses;
  common: CommonThemeValues;
}

export type ThemeType = 'light' | 'dark';

export type IncomingTheme = DeepPartial<Theme>;

export type TypedTheme = ThemeClasses & {
  type: ThemeType;
  common: CommonThemeValues;
};
