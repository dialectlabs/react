import React, { useEffect, useContext, useState } from 'react';

export type ThemeType = 'dark' | 'light' | undefined;

export const THEMES = {
  light: {
    colors: {
      bg: 'bg-[#E5EBF4]',
      errorBg: 'bg-[#DC726D]',
      primary: 'text-[#444444]',
      secondary: 'text-[#E6EBF3]',
      accent: 'text-gradient',
      accentSolid: 'text-[#5895B9]',
      brand: 'text-[#E5EBF4]',
    },
    textStyles: {
      h1: 'font-poppins text-xl font-normal',
      body: 'font-sans text-sm leading-snug ',
      small: 'font-sans text-[13px] leading-snug',
      bigText: 'text-base font-medium leading-snug',
      header: 'font-poppins text-lg',
      buttonText: 'text-xs uppercase tracking-[1.5px] text-[#E6EBF3]',
      bigButtonText: 'text-xs uppercase tracking-[1.5px] text-white',
    },
    bellButton: 'jet-shadow-light',
    popup: 'jet-shadow',
    button: 'text-[#E6EBF3]',
    divider: 'bg-gradient-to-b from-[#C3CADE] to-[#F8F9FB]',
    highlighted: 'bg-white/30',
  },
  dark: {
    colors: {
      bg: 'bg-[#444444]',
      errorBg: 'bg-[#DC726D]',
      primary: 'text-white',
      secondary: 'text-[#E6EBF3]',
      accent: 'text-gradient',
      accentSolid: 'text-[#5895B9]',
      brand: 'text-[#E5EBF4]',
    },
    textStyles: {
      h1: 'font-poppins text-xl font-normal',
      body: 'font-sans text-sm leading-snug ',
      small: 'font-sans text-[13px] leading-snug',
      bigText: 'text-base font-medium leading-snug',
      header: 'font-poppins text-lg',
      buttonText: 'text-xs uppercase tracking-[1.5px] text-[#444]',
      bigButtonText: 'text-xs uppercase tracking-[1.5px] text-white',
    },
    bellButton: 'jet-shadow-dark',
    popup: 'jet-shadow',
    button: 'text-[#E6EBF3]',
    divider: 'bg-gradient-to-b from-[#3C3C3C] to-[#505050]',
    highlighted: 'bg-[#ABABAB]/10',
  },
};

export const ThemeContext = React.createContext(THEMES.dark);

type PropsType = {
  theme: ThemeType;
  children: JSX.Element;
};

export const ThemeProvider = ({
  theme = 'light',
  children,
}: PropsType): JSX.Element => {
  const [themeSetting, setTheme] = useState<ThemeType>(theme);
  const [variables, setVariables] = useState<ThemeType>(THEMES[themeSetting]);

  useEffect(() => {
    setTheme(theme);
    setVariables(THEMES[theme]);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    ...variables,
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
