import { DeepPartial } from '../../utils';

export type CommonThemeValues = {
  icons: {};
};

export interface Theme {
  common: CommonThemeValues;
}

export type ThemeType = 'light' | 'dark';

export type IncomingTheme = DeepPartial<Theme>;

export type TypedTheme = {
  type: ThemeType;
  common: CommonThemeValues;
};
