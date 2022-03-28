import React, { useEffect, useContext, useState } from 'react';
import deepMerge from '../../utils/deepMerge';
import {
  ArrowNarrowRight,
  ArrowSmRight,
  Bell as BellIcon,
  BackArrow,
  ChatBubble,
  Chevron,
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
  | 'brand'
  | 'highlight'
  | 'toggleThumb'
  | 'toggleBackground'
  | 'toggleBackgroundActive';

export type ThemeTextStyles =
  | 'h1'
  | 'h2'
  | 'body'
  | 'small'
  | 'bigText'
  | 'header'
  | 'input'
  | 'textArea'
  | 'messageBubble'
  | 'buttonText'
  | 'bigButtonText'
  | 'bigButtonSubtle'
  | 'link';

export type ThemeIcons =
  | 'arrownarrowright'
  | 'arrowsmright'
  | 'bell'
  | 'back'
  | 'chat'
  | 'chevron'
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
  outlinedInput?: string;
  textArea?: string;
  messageBubble?: string;
  otherMessageBubble?: string;
  notificationMessage?: string;
  notificationTimestamp?: string;
  notificationsDivider?: string;
  bellButton?: string;
  iconButton?: string;
  sendButton?: string;
  modalWrapper?: string;
  modal?: string;
  button?: string;
  secondaryButton?: string;
  secondaryRemoveButton?: string;
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
      highlight: 'bg-[#ABABAB]/10',
      toggleBackground: 'bg-[#D6D6D6]',
      toggleBackgroundActive: 'bg-[#25BC3B]',
      toggleThumb: 'bg-[#EEEEEE]',
    },
    textStyles: {
      h1: 'font-inter text-3xl font-bold',
      h2: 'font-inter text-xl font-bold',
      input: 'font-inter',
      textArea: 'font-inter',
      messageBubble: 'font-inter',
      body: 'font-inter text-sm font-normal',
      small: 'font-inter text-xs font-normal',
      bigText: 'font-inter text-base font-medium',
      header: 'font-inter text-base font-medium',
      buttonText: 'font-inter text-base',
      bigButtonText: 'font-inter font-medium text-base text-[#DE5454]',
      bigButtonSubtle: 'font-inter font-medium text-sm text-[#DE5454]',
      link: 'underline decoration-1 break-words',
    },
    icons: {
      arrownarrowright: ArrowNarrowRight,
      arrowsmright: ArrowSmRight,
      bell: BellIcon,
      back: BackArrow,
      chat: ChatBubble,
      compose: Compose,
      chevron: Chevron,
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
    iconButton:
      'w-9 h-9 -m-2 flex items-center justify-center transition-all hover:opacity-60',
    sendButton: 'h-5 w-5 text-white rounded-full bg-black',
    header: 'px-4 py-3',
    input:
      'text-xs text-neutral-700 px-2 py-2 border-b border-neutral-600 focus:rounded-md focus:outline-none focus:ring focus:ring-black focus:border-0',
    outlinedInput:
      'text-sm text-black bg-[#ABABAB]/10 px-3 py-2.5 border-2 border-[#ABABAB]/10 rounded-lg focus:border-black focus:outline-none',
    textArea:
      'text-sm text-neutral-800 bg-white border rounded-2xl px-2 py-1 border-neutral-300 placeholder-neutral-400 pr-10 focus:outline-none',
    messageBubble:
      'text-black px-4 py-2 rounded-2xl bg-transparent border border-neutral-300',
    otherMessageBubble: 'px-4 py-2 rounded-2xl bg-neutral-100',
    notificationMessage: '-mx-2 rounded-2xl py-3 px-3 mb-2',
    notificationTimestamp: 'text-right',
    notificationsDivider: 'hidden',
    modalWrapper: 'absolute z-50 top-16 w-[30rem] h-[40rem]',
    modal: 'rounded-3xl',
    button: 'bg-black text-white border border-black hover:opacity-60',
    secondaryButton:
      'bg-transparent text-black border border-black hover:bg-black/10',
    // TODO: colors in the theme
    secondaryRemoveButton:
      'bg-transparent text-[#DE5454] border border-[#DE5454] hover:bg-[#DE5454]/10',
    // TODO: buttonLoading for secondary
    buttonLoading: 'min-h-[42px] border border-black opacity-20 bg-transparent',
    bigButton: 'text-black border border-black hover:opacity-60',
    bigButtonLoading:
      'min-h-[42px] border border-black opacity-20 bg-transparent',
    divider: 'h-px opacity-10 bg-current',
    highlighted: 'px-4 py-3 rounded-lg',
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
      highlight: 'bg-[#ABABAB]/10',
      toggleBackground: 'bg-[#5B5B5B]',
      toggleBackgroundActive: 'bg-[#25BC3B]',
      toggleThumb: 'bg-[#111111]',
    },
    textStyles: {
      h1: 'font-inter text-3xl font-bold',
      h2: 'font-inter text-xl font-bold',
      input: 'font-inter',
      textArea: 'font-inter',
      messageBubble: 'font-inter',
      body: 'font-inter text-sm font-normal',
      small: 'font-inter text-xs font-normal',
      bigText: 'font-inter text-base font-medium',
      header: 'font-inter text-base font-medium',
      buttonText: 'font-inter text-base',
      bigButtonText: 'font-inter font-medium text-base text-[#DE5454]',
      bigButtonSubtle: 'font-inter font-medium text-sm text-[#DE5454]',
      link: 'underline decoration-1 break-words',
    },
    icons: {
      arrownarrowright: ArrowNarrowRight,
      arrowsmright: ArrowSmRight,
      bell: BellIcon,
      back: BackArrow,
      chat: ChatBubble,
      chevron: Chevron,
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
    iconButton:
      'w-9 h-9 -m-2 flex items-center justify-center transition-all hover:opacity-60',
    sendButton: 'h-5 w-5 text-black rounded-full bg-white',
    header: 'px-4 py-4',
    input:
      'text-xs text-white bg-black px-2 py-2 border-b border-neutral-600 focus:rounded-md focus:outline-none focus:ring focus:ring-white',
    outlinedInput:
      'text-sm text-white bg-[#ABABAB]/10 px-3 py-2.5 border-2 border-neutral-600 rounded-lg focus:border-white focus:outline-none',
    textArea:
      'text-sm text-neutral-200 bg-black border rounded-2xl px-2 py-1 border-neutral-600 placeholder-neutral-600 pr-10 focus:outline-none',
    messageBubble:
      'text-white px-4 py-2 rounded-2xl bg-transparent border border-neutral-800',
    otherMessageBubble:
      'px-4 py-2 rounded-2xl border border-neutral-900 bg-neutral-900',
    notificationMessage: '-mx-2 rounded-2xl py-3 px-3 mb-2',
    notificationTimestamp: 'text-right',
    notificationsDivider: 'hidden',
    modalWrapper: 'absolute z-50 top-16 w-[30rem] h-[40rem]',
    modal: 'rounded-3xl',
    button: 'bg-white text-black border border-white hover:opacity-60',
    secondaryButton:
      'bg-transparent text-white border border-white hover:bg-white/10',
    secondaryRemoveButton:
      'bg-transparent text-[#DE5454] border border-[#DE5454] hover:bg-[#DE5454]/10',
    buttonLoading: 'min-h-[42px] border border-white opacity-20 bg-transparent',
    bigButton: 'text-white border border-white hover:opacity-60',
    bigButtonLoading:
      'min-h-[42px] border border-white opacity-20 bg-transparent',
    divider: 'h-px opacity-10 bg-current',
    highlighted: 'px-4 py-3 rounded-lg',
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
