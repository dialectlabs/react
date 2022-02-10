import React, { useEffect, useContext, useState } from 'react';

export type ThemeType = 'dark' | 'light';

export type ThemeColors =
  | 'bg'
  | 'errorBg'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'accentSolid'
  | 'brand';

export type ThemeTextStyles =
  | 'h1'
  | 'body'
  | 'small'
  | 'bigText'
  | 'header'
  | 'buttonText'
  | 'bigButtonText';

export type ThemeValues = {
  colors: Record<ThemeColors, string>;
  textStyles: Record<ThemeTextStyles, string>;
  bellButton: string;
  popup: string;
  button: string;
  divider: string;
  highlighted: string;
};

export type ThemeVariables = Record<ThemeType, ThemeValues>;

export const ThemeContext = React.createContext<
  | (ThemeValues & {
      theme: ThemeType;
      setTheme: (theme: ThemeType) => void;
    })
  | null
>(null);

type PropsType = {
  theme: ThemeType;
  variables: ThemeVariables;
  children: JSX.Element;
};

export const ThemeProvider = ({
  theme = 'light',
  variables,
  children,
}: PropsType): JSX.Element => {
  const [themeSetting, setTheme] = useState<ThemeType>(theme);
  const [selectedVariables, setVariables] = useState<ThemeValues>(
    variables[themeSetting]
  );

  useEffect(() => {
    setTheme(theme);
    setVariables(variables[theme]);
  }, [theme, variables]);

  const value = {
    theme,
    setTheme,
    ...selectedVariables,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider');
  }
  return context;
}
