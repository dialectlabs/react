import React, { useEffect, useContext, useState, SVGProps } from 'react';
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
  | 'highlightSolid'
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
    [key in ThemeIcons]?: (svg: SVGProps<SVGSVGElement>) => JSX.Element;
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
  secondaryDangerButton?: string;
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
    icons: Record<ThemeIcons, (svg: SVGProps<SVGSVGElement>) => JSX.Element>;
  }
>;

export const defaultVariables: Record<ThemeType, ThemeValues> = {
  light: {
    colors: {
      bg: 'dt-bg-white',
      secondary: '',
      brand: '',
      errorBg: 'dt-bg-transparent',
      primary: 'dt-text-black',
      accent: 'dt-text-black',
      accentSolid: 'dt-text-[#5895B9]',
      highlight: 'dt-bg-[#ABABAB]/10',
      highlightSolid: 'dt-bg-[#F2F3F2]',
      toggleBackground: 'dt-bg-[#D6D6D6]',
      toggleBackgroundActive: 'dt-bg-[#25BC3B]',
      toggleThumb: 'dt-bg-[#EEEEEE]',
    },
    textStyles: {
      h1: 'dt-font-inter dt-text-3xl dt-font-bold',
      h2: 'dt-font-inter dt-text-xl dt-font-bold',
      input: 'dt-font-inter',
      textArea: 'dt-font-inter',
      messageBubble: 'dt-font-inter',
      body: 'dt-font-inter dt-text-sm dt-font-normal',
      small: 'dt-font-inter dt-text-xs dt-font-normal',
      bigText: 'dt-font-inter dt-text-lg dt-font-medium',
      header: 'dt-font-inter dt-text-base dt-font-medium',
      buttonText: 'dt-font-inter dt-text-base',
      bigButtonText: 'dt-font-inter dt-font-medium dt-text-base dt-text-black',
      bigButtonSubtle: 'dt-font-inter dt-font-medium dt-text-sm dt-text-black',
      link: 'dt-underline dt-decoration-1 dt-break-words',
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
      'dt-rounded-full dt-items-center dt-justify-center dt-text-neutral-900 bg-neutral-100',
    bellButton: 'dt-w-12 dt-h-12 dt-border dt-border-gray-200 dt-shadow-md',
    iconButton:
      'dt-w-9 dt-h-9 dt--m-2 dt-flex dt-items-center dt-justify-center dt-transition-all hover:dt-opacity-60',
    sendButton: 'dt-h-5 dt-w-5 dt-text-white dt-rounded-full dt-bg-black',
    header: 'dt-px-4 dt-py-3',
    input:
      'dt-text-xs dt-text-neutral-700 dt-px-2 dt-py-2 dt-border-b dt-border-neutral-600 focus:dt-rounded-md dt-outline-none focus:dt-ring focus:dt-ring-black focus:dt-border-0',
    outlinedInput:
      'dt-text-sm dt-text-black dt-bg-[#ABABAB]/10 dt-px-3 dt-py-2.5 dt-border-2 dt-border-[#ABABAB]/10 dt-rounded-lg dt-focus:border-black dt-focus:outline-none',
    textArea:
      'dt-text-sm dt-text-neutral-800 dt-bg-white dt-border dt-rounded-2xl dt-px-2 dt-py-1 dt-border-neutral-300 dt-placeholder-neutral-400 dt-pr-10 dt-outline-none',
    messageBubble:
      'dt-text-black dt-px-4 dt-py-2 dt-rounded-2xl dt-bg-transparent dt-border dt-border-neutral-300',
    otherMessageBubble: 'dt-px-4 dt-py-2 dt-rounded-2xl dt-bg-neutral-100',
    notificationMessage: 'dt--mx-2 dt-rounded-2xl dt-py-3 dt-px-3 dt-mb-2',
    notificationTimestamp: 'dt-text-right',
    notificationsDivider: 'dt-hidden',
    modalWrapper:
      'dt-fixed dt-z-50 dt-top-0 dt-w-full dt-h-full dt-right-0 sm:dt-absolute sm:dt-top-16 sm:dt-w-[30rem] sm:dt-h-[40rem]',
    modal: 'dt-rounded-none sm:dt-rounded-3xl',
    button:
      'dt-bg-black dt-text-white dt-border dt-border-black hover:dt-opacity-60',
    secondaryButton:
      'dt-bg-transparent dt-text-black dt-border dt-border-black hover:dt-bg-black/10',
    // TODO: colors in the theme
    secondaryDangerButton:
      'dt-bg-transparent dt-text-[#DE5454] dt-border dt-border-[#DE5454] hover:dt-bg-[#DE5454]/10',
    // TODO: buttonLoading for secondary
    buttonLoading:
      'dt-min-h-[42px] dt-border dt-border-black dt-opacity-20 dt-bg-transparent',
    bigButton: 'dt-text-black dt-border dt-border-black hover:dt-opacity-60',
    bigButtonLoading:
      'dt-min-h-[42px] dt-border dt-border-black dt-opacity-20 dt-bg-transparent',
    divider: 'dt-h-px dt-opacity-10 dt-bg-current',
    highlighted: 'dt-px-4 dt-py-3 dt-rounded-lg',
  },
  dark: {
    colors: {
      bg: 'dt-bg-black',
      secondary: '',
      brand: '',
      errorBg: 'dt-bg-transparent',
      primary: 'dt-text-white',
      accent: 'dt-text-white',
      accentSolid: 'dt-text-white',
      highlight: 'dt-bg-[#ABABAB]/20',
      highlightSolid: 'dt-bg-[#262626]',
      toggleBackground: 'dt-bg-[#5B5B5B]',
      toggleBackgroundActive: 'dt-bg-[#25BC3B]',
      toggleThumb: 'dt-bg-[#111111]',
    },
    textStyles: {
      h1: 'dt-font-inter dt-text-3xl dt-font-bold',
      h2: 'dt-font-inter dt-text-xl dt-font-bold',
      input: 'dt-font-inter',
      textArea: 'dt-font-inter',
      messageBubble: 'dt-font-inter',
      body: 'dt-font-inter dt-text-sm dt-font-normal',
      small: 'dt-font-inter dt-text-xs dt-font-normal',
      bigText: 'dt-font-inter dt-text-lg dt-font-medium',
      header: 'dt-font-inter dt-text-base dt-font-medium',
      buttonText: 'dt-font-inter dt-text-base',
      bigButtonText: 'dt-font-inter dt-font-medium dt-text-base dt-text-white',
      bigButtonSubtle: 'dt-font-inter dt-font-medium dt-text-sm dt-text-white',
      link: 'dt-underline decoration-1 dt-break-words',
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
    avatar:
      'dt-rounded-full dt-items-center dt-justify-center dt-bg-neutral-900',
    bellButton: 'dt-w-12 dt-h-12 dt-shadow-md',
    iconButton:
      'dt-w-9 dt-h-9 dt--m-2 dt-flex dt-items-center dt-justify-center dt-transition-all hover:dt-opacity-60',
    sendButton: 'dt-h-5 dt-w-5 dt-text-black dt-rounded-full dt-bg-white',
    header: 'dt-px-4 dt-py-3',
    input:
      'dt-text-xs dt-text-white dt-bg-black dt-px-2 dt-py-2 dt-border-b dt-border-neutral-600 focus:dt-rounded-md dt-outline-none focus:dt-ring focus:dt-ring-white',
    outlinedInput:
      'dt-text-sm dt-text-white dt-bg-[#ABABAB]/10 dt-px-3 dt-py-2.5 dt-border-2 dt-border-neutral-600 dt-rounded-lg focus:dt-border-white focus:dt-outline-none',
    textArea:
      'dt-text-sm dt-text-neutral-200 dt-bg-black dt-border dt-rounded-2xl dt-px-2 dt-py-1 dt-border-neutral-600 dt-placeholder-neutral-600 dt-pr-10 dt-outline-none',
    messageBubble:
      'dt-text-white dt-px-4 dt-py-2 dt-rounded-2xl dt-bg-transparent dt-border dt-border-neutral-800',
    otherMessageBubble:
      'dt-px-4 dt-py-2 dt-rounded-2xl dt-border dt-border-neutral-900 dt-bg-neutral-900',
    notificationMessage: 'dt--mx-2 dt-rounded-2xl dt-py-3 dt-px-3 dt-mb-2',
    notificationTimestamp: 'dt-text-right',
    notificationsDivider: 'dt-hidden',
    modalWrapper:
      'dt-fixed dt-z-50 dt-top-0 dt-w-full dt-h-full dt-right-0 sm:dt-absolute sm:dt-top-16 sm:dt-w-[30rem] sm:dt-h-[40rem]',
    modal: 'dt-rounded-none dt-shadow-md sm:dt-rounded-3xl',
    button:
      'dt-bg-white dt-text-black dt-border dt-border-white hover:dt-opacity-60',
    secondaryButton:
      'dt-bg-transparent dt-text-white dt-border dt-border-white hover:dt-bg-white/10',
    secondaryDangerButton:
      'dt-bg-transparent dt-text-[#DE5454] dt-border dt-border-[#DE5454] hover:dt-bg-[#DE5454]/10',
    buttonLoading:
      'dt-min-h-[42px] dt-border dt-border-white dt-opacity-20 dt-bg-transparent',
    bigButton: 'dt-text-white dt-border dt-border-white hover:dt-opacity-60',
    bigButtonLoading:
      'dt-min-h-[42px] dt-border dt-border-white dt-opacity-20 dt-bg-transparent',
    divider: 'dt-h-px dt-opacity-30 dt-bg-current',
    highlighted: 'dt-px-4 dt-py-3 dt-rounded-lg',
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
