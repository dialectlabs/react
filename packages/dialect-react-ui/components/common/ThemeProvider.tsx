import React, { useEffect, useContext, useState } from 'react';
import deepMerge from '../../utils/deepMerge';
import {
  ArrowNarrowRight,
  ArrowSmRight,
  Bell as BellIcon,
  BackArrow,
  ChatBubble,
  Compose,
  Gear,
  NotConnected,
  NoNotifications,
  Spinner,
  Trash,
  Offline,
  X,
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
  | 'input'
  | 'textArea'
  | 'messageBubble'
  | 'buttonText'
  | 'bigButtonText'
  | 'bigButtonSubtle';

export type ThemeIcons =
  | 'arrownarrowright'
  | 'arrowsmright'
  | 'bell'
  | 'back'
  | 'chat'
  | 'compose'
  | 'settings'
  | 'notConnected'
  | 'noNotifications'
  | 'spinner'
  | 'trash'
  | 'offline'
  | 'x';

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
  avatar?: string;
  header?: string;
  input?: string;
  textArea?: string;
  messageBubble?: string;
  otherMessageBubble?: string;
  bellButton?: string;
  sendButton?: string;
  popup?: string;
  button?: string;
  buttonLoading?: string;
  bigButton?: string;
  bigButtonLoading?: string;
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
      input: 'font-inter',
      textArea: 'font-inter',
      messageBubble: 'font-inter',
      body: 'font-inter text-sm font-normal',
      small: 'font-inter text-xs font-normal',
      bigText: 'font-inter text-base font-medium',
      header: 'font-inter text-base font-medium',
      buttonText: 'font-inter text-base',
      bigButtonText: 'font-inter font-medium text-base text-black',
      bigButtonSubtle: 'font-inter font-medium text-sm text-black',
    },
    icons: {
      arrownarrowright: ArrowNarrowRight,
      arrowsmright: ArrowSmRight,
      bell: BellIcon,
      back: BackArrow,
      chat: ChatBubble,
      compose: Compose,
      settings: Gear,
      notConnected: NotConnected,
      noNotifications: NoNotifications,
      spinner: Spinner,
      trash: Trash,
      offline: Offline,
      x: X,
    },
    avatar:
      'rounded-full items-center justify-center text-neutral-900 bg-neutral-100',
    bellButton: 'w-12 h-12 focus:outline-none border border-gray-200 shadow-md',
    sendButton: 'h-5 w-5 text-white rounded-full bg-black',
    header: 'px-4 py-3',
    input:
      'text-xs text-neutral-700 px-2 py-2 border-b border-neutral-600 focus:rounded-md focus:outline-none focus:ring focus:ring-black focus:border-0',
    textArea:
      'text-sm text-neutral-800 bg-white border rounded-2xl px-2 py-1 border-neutral-300 placeholder-neutral-400 pr-10 focus:outline-none',
    messageBubble:
      'text-black px-4 py-2 rounded-2xl bg-transparent border border-neutral-300',
    otherMessageBubble: 'px-4 py-2 rounded-2xl bg-neutral-100',
    popup: 'rounded-3xl',
    button: 'bg-black text-white border border-black hover:opacity-60',
    buttonLoading: 'min-h-[42px] border border-black opacity-20 bg-transparent',
    bigButton: 'text-black border border-black hover:opacity-60',
    bigButtonLoading:
      'min-h-[42px] border border-black opacity-20 bg-transparent',
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
      input: 'font-inter',
      textArea: 'font-inter',
      messageBubble: 'font-inter',
      body: 'font-inter text-sm font-normal',
      small: 'font-inter text-xs font-normal',
      bigText: 'font-inter text-base font-medium',
      header: 'font-inter text-base font-medium',
      buttonText: 'font-inter text-base',
      bigButtonText: 'font-inter font-medium text-base text-white',
      bigButtonSubtle: 'font-inter font-medium text-sm text-white',
    },
    icons: {
      arrownarrowright: ArrowNarrowRight,
      arrowsmright: ArrowSmRight,
      bell: BellIcon,
      back: BackArrow,
      chat: ChatBubble,
      compose: Compose,
      settings: Gear,
      notConnected: NotConnected,
      noNotifications: NoNotifications,
      spinner: Spinner,
      trash: Trash,
      offline: Offline,
      x: X,
    },
    avatar: 'rounded-full items-center justify-center bg-neutral-900',
    bellButton: 'w-12 h-12 focus:outline-none shadow-md',
    sendButton: 'h-5 w-5 text-black rounded-full bg-white',
    header: 'px-4 py-4',
    input:
      'text-xs text-white bg-black px-2 py-2 border-b border-neutral-600 focus:rounded-md focus:outline-none focus:ring focus:ring-white',
    textArea:
      'text-sm text-neutral-200 bg-black border rounded-2xl px-2 py-1 border-neutral-600 placeholder-neutral-600 pr-10 focus:outline-none',
    messageBubble:
      'text-white px-4 py-2 rounded-2xl bg-transparent border border-neutral-800',
    otherMessageBubble:
      'px-4 py-2 rounded-2xl border border-neutral-900 bg-neutral-900',
    popup: 'rounded-3xl',
    button: 'bg-white text-black border border-white hover:opacity-60',
    buttonLoading: 'min-h-[42px] border border-white opacity-20 bg-transparent',
    bigButton: 'text-white border border-white hover:opacity-60',
    bigButtonLoading:
      'min-h-[42px] border border-white opacity-20 bg-transparent',
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
