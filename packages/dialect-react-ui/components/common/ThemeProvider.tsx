import React, { useEffect, useContext, useState } from 'react';
import deepMerge from '../../utils/deepMerge';
import { BellIcon } from '@heroicons/react/outline';
import {
  BackArrow,
  Gear,
  NotConnected,
  NoNotifications,
  Spinner,
  Trash,
  Offline,
} from '../Icon';

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
  | 'bigButtonText'
  | 'bigButtonSubtle';

export type ThemeIcons =
  | 'bell'
  | 'back'
  | 'settings'
  | 'notConnected'
  | 'noNotifications'
  | 'spinner'
  | 'trash'
  | 'offline';

export type IncomingThemeValues = {
  colors?: {
    [key in ThemeColors]?: string;
  };
  textStyles?: {
    [key in ThemeTextStyles]?: string;
  };
  icons?: {
    [key in ThemeIcons]?: React.ReactNode;
  };
  header?: string;
  bellButton?: string;
  popup?: string;
  button?: string;
  buttonLoading?: string;
  bigButton?: string;
  divider?: string;
  highlighted?: string;
};

export type IncomingThemeVariables = Partial<
  Record<ThemeType, IncomingThemeValues>
>;

export type ThemeValues = Required<
  Omit<IncomingThemeValues, 'colors' | 'textStyles' | 'icons'> & {
    colors: Record<ThemeColors, string>;
    textStyles: Record<ThemeTextStyles, string>;
    icons: Record<ThemeIcons, React.ReactNode>;
  }
>;

export const defaultVariables: Record<ThemeType, ThemeValues> = {
  light: {
    colors: {
      bg: 'bg-white',
      secondary: '',
      brand: '',
      errorBg: 'bg-transparent',
      primary: 'text-black',
      accent: 'text-black',
      accentSolid: 'text-[#5895B9]',
    },
    textStyles: {
      h1: 'font-inter text-3xl font-bold',
      body: 'font-inter text-sm font-normal',
      small: 'font-inter text-xs font-normal',
      bigText: 'font-inter text-base font-medium',
      header: 'font-inter text-base font-medium',
      buttonText: 'font-inter text-base',
      bigButtonText: 'font-inter font-medium text-base text-black',
      bigButtonSubtle: 'font-inter font-medium text-sm text-black',
    },
    icons: {
      bell: BellIcon,
      back: BackArrow,
      settings: Gear,
      notConnected: NotConnected,
      noNotifications: NoNotifications,
      spinner: Spinner,
      trash: Trash,
      offline: Offline,
    },
    bellButton: 'w-12 h-12 focus:outline-none border border-gray-200 shadow-md',
    header: 'px-4 py-3',
    popup: 'rounded-lg',
    button: 'bg-black text-white border border-black hover:opacity-60',
    bigButton: 'text-black border border-black hover:opacity-60',
    buttonLoading: 'min-h-[42px] border border-black opacity-20 bg-transparent',
    divider: 'h-px opacity-10 bg-current',
    highlighted: 'px-4 py-3 rounded-lg bg-black/5',
  },
  dark: {
    colors: {
      bg: 'bg-black',
      secondary: '',
      brand: '',
      errorBg: 'bg-transparent',
      primary: 'text-white',
      accent: 'text-white',
      accentSolid: 'text-white',
    },
    textStyles: {
      h1: 'font-inter text-3xl font-bold',
      body: 'font-inter text-sm font-normal',
      small: 'font-inter text-xs font-normal',
      bigText: 'font-inter text-base font-medium',
      header: 'font-inter text-base font-medium',
      buttonText: 'font-inter text-base',
      bigButtonText: 'font-inter font-medium text-base text-white',
      bigButtonSubtle: 'font-inter font-medium text-sm text-white',
    },
    icons: {
      bell: BellIcon,
      back: BackArrow,
      settings: Gear,
      notConnected: NotConnected,
      noNotifications: NoNotifications,
      spinner: Spinner,
      trash: Trash,
      offline: Offline,
    },
    bellButton: 'w-12 h-12 focus:outline-none border border-gray-200 shadow-md',
    header: 'px-6 py-4',
    popup: 'rounded-lg',
    button: 'bg-white text-black border border-white hover:opacity-60',
    buttonLoading: 'min-h-[42px] border border-white opacity-20 bg-transparent',
    bigButton: 'text-white border border-white hover:opacity-60',
    divider: 'h-px opacity-10 bg-current',
    highlighted: 'px-4 py-3 rounded-lg bg-white/10',
  },
};

function mergeWithDefault(
  values: IncomingThemeVariables,
  theme: ThemeType
): ThemeValues {
  const defaultThemeValues: IncomingThemeValues = defaultVariables[theme];
  const currentThemeValues: IncomingThemeValues = values[theme] ?? {};

  const result = deepMerge(defaultThemeValues, currentThemeValues);

  return (result ?? {}) as ThemeValues;
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
    mergeWithDefault(variables, theme)
  );

  useEffect(() => {
    setVariables(mergeWithDefault(variables, theme));
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
