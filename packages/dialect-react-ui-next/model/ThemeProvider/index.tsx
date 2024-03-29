import { createContext, PropsWithChildren, useContext, useMemo } from 'react';
import { deepMerge } from '../../utils';
import { defaultTheme } from './defaults';
import { IncomingTheme, Theme, ThemeType, TypedTheme } from './types';

const ThemeContext = createContext<TypedTheme>({
  type: 'light',
  common: defaultTheme.common,
});

interface ThemeProviderProps {
  theme: IncomingTheme;
  themeType?: ThemeType;
}

const mergeWithDefaultTheme = (theme: IncomingTheme) => {
  return deepMerge({}, theme, defaultTheme) as Theme;
};

const ThemeProvider = ({
  theme,
  themeType = 'light',
  children,
}: PropsWithChildren<ThemeProviderProps>) => {
  const mergedTheme = useMemo(() => mergeWithDefaultTheme(theme), [theme]);

  const typedTheme = useMemo(() => {
    return { type: themeType, common: mergedTheme.common } satisfies TypedTheme;
  }, [mergedTheme, themeType]);

  return (
    <ThemeContext.Provider value={typedTheme}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};

export default ThemeProvider;
