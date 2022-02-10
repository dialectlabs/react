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

export type IncomingThemeValues = {
  colors?: {
    [key in ThemeColors]?: string;
  };
  textStyles?: {
    [key in ThemeTextStyles]?: string;
  };
  bellButton?: string;
  popup?: string;
  button?: string;
  divider?: string;
  highlighted?: string;
};

export type IncomingThemeVariables = Partial<
  Record<ThemeType, IncomingThemeValues>
>;

export type ThemeValues = Required<
  Omit<IncomingThemeValues, 'colors' | 'textStyles'> & {
    colors: Record<ThemeColors, string>;
    textStyles: Record<ThemeTextStyles, string>;
  }
>;

function mergeWithDefault(values?: IncomingThemeValues): ThemeValues {
  // TODO: implement the merge with default theme
  return (values ?? {}) as ThemeValues;
}

export const ThemeContext = React.createContext<
  | (ThemeValues & {
      theme: ThemeType;
    })
  | null
>(null);

type PropsType = {
  theme?: ThemeType;
  variables?: IncomingThemeVariables;
  children: JSX.Element;
};

export const ThemeProvider = ({
  theme = 'light',
  variables = {},
  children,
}: PropsType): JSX.Element => {
  const [selectedVariables, setVariables] = useState(
    mergeWithDefault(variables[theme])
  );

  useEffect(() => {
    setVariables(mergeWithDefault(variables[theme]));
  }, [theme, variables]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        ...selectedVariables,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider');
  }
  return context;
}
