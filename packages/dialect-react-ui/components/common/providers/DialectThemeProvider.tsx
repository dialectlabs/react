import React, { useEffect, useContext, useState, SVGProps } from 'react';
import deepMerge from '../../../utils/deepMerge';
import {
  ArrowClockwise,
  ArrowSmRight,
  Bell as BellIcon,
  BackArrow,
  ChatBubble,
  Chevron,
  Checkmark,
  Error as ErrorIcon,
  Compose,
  Gear,
  NotConnected,
  NoNotifications,
  Spinner,
  Trash,
  Offline,
  X,
  MultiarrowVertical,
  Cancel,
} from '../../Icon';

export type ThemeType = 'dark' | 'light';

export type ThemeColors =
  | 'bg'
  | 'textPrimary'
  | 'accent'
  | 'highlight'
  | 'highlightSolid'
  | 'toggleThumb'
  | 'toggleBackground'
  | 'toggleBackgroundActive'
  | 'notificationBadgeColor'
  | 'label';

export type ThemeTextStyles =
  | 'h1'
  | 'body'
  | 'small'
  | 'xsmall'
  | 'bigText'
  | 'header'
  | 'input'
  | 'subscribeRow'
  | 'buttonText'
  | 'link'
  | 'label';

export type ThemeIcons =
  | 'arrowclockwise'
  | 'arrowsmright'
  | 'arrowvertical'
  | 'bell'
  | 'back'
  | 'cancel'
  | 'chat'
  | 'chevron'
  | 'checkmark'
  | 'error'
  | 'compose'
  | 'settings'
  | 'notConnected'
  | 'noNotifications'
  | 'spinner'
  | 'trash'
  | 'offline'
  | 'x';

export type ThemeAnimations = 'popup' | 'bottomSlide' | 'toast';

export type TransitionProps = {
  enter: string;
  enterFrom: string;
  enterTo: string;
  leave: string;
  leaveFrom: string;
  leaveTo: string;
};

export type IncomingCommonThemeVariables = {
  animations?: {
    popup?: TransitionProps;
    bottomSlide?: TransitionProps;
    toast?: TransitionProps;
  };
};

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
  sectionHeader?: string;
  input?: string;
  outlinedInput?: string;
  subscribeRow?: string;
  textArea?: string;
  messageBubble?: string;
  message?: string;
  otherMessage?: string;
  messageOnChain?: string;
  otherMessageOnChain?: string;
  notificationMessage?: string;
  notificationTimestamp?: string;
  notificationsDivider?: string;
  bellButton?: string;
  iconButton?: string;
  sendButton?: string;
  linkButton?: string;
  modalWrapper?: string;
  modalBackdrop?: string;
  modal?: string;
  sliderWrapper?: string;
  slider?: string;
  button?: string;
  buttonLoading?: string;
  secondaryButton?: string;
  secondaryButtonLoading?: string;
  secondaryDangerButton?: string;
  secondaryDangerButtonLoading?: string;
  divider?: string;
  highlighted?: string;
  scrollbar?: string;
  section?: string;
  xPaddedText?: string;
  toast?: string;
  disabledButton?: string;
  notificationHeader?: string;
  adornmentButton?: string;
};

export type IncomingThemeVariables = Partial<
  Record<ThemeType, IncomingThemeValues> & IncomingCommonThemeVariables
>;

export type ThemeValues = Required<
  Omit<IncomingThemeValues, 'colors' | 'textStyles' | 'icons'> & {
    colors: Record<ThemeColors, string>;
    textStyles: Record<ThemeTextStyles, string>;
    icons: Record<ThemeIcons, (svg: SVGProps<SVGSVGElement>) => JSX.Element>;
  }
>;

// Required common values
export type CommonThemeValues = {
  animations: {
    popup: TransitionProps;
    bottomSlide: TransitionProps;
    toast: TransitionProps;
  };
};

export const defaultVariables: Record<ThemeType, ThemeValues> &
  CommonThemeValues = {
  animations: {
    popup: {
      enter: 'dt-transition-opacity dt-duration-300',
      enterFrom: 'dt-opacity-0',
      enterTo: 'dt-opacity-100',
      leave: 'dt-transition-opacity dt-duration-100',
      leaveFrom: 'dt-opacity-100',
      leaveTo: 'dt-opacity-0',
    },
    // Uses `react-transition-group
    bottomSlide: {
      enter: 'dt-transition-transform dt-duration-300 dt-ease-in-out',
      enterFrom: 'dt-translate-y-[calc(100%-3.5rem)]',
      enterTo: '!dt-translate-y-0',
      leave: 'dt-transition-transform dt-duration-100 dt-ease-in-out',
      leaveFrom: 'dt-translate-y-0',
      leaveTo: '!dt-translate-y-[calc(100%-3.5rem)]',
    },
    toast: {
      enter: 'dt-transition dt-ease-in-out dt-duration-150',
      enterFrom: 'dt-opacity-0 dt-translate-y-[calc(100%+1rem)]',
      enterTo: 'dt-opacity-100 !dt-translate-y-0',
      leave: 'dt-transition dt-ease-in-out dt-duration-150',
      leaveFrom: 'dt-opacity-100 dt-translate-y-0',
      leaveTo: 'dt-opacity-0 !dt-translate-y-[calc(100%+1rem)]',
    },
  },
  light: {
    // TODO: either put all colors in the theme or define as css-custom-properties to simplify overriding
    colors: {
      // main background (modal)
      bg: 'dt-bg-white',
      // primary text color
      textPrimary: 'dt-text-black',
      // header color
      accent: 'dt-text-black',
      // block for use case example
      highlight: 'dt-bg-subtle-day',
      // powerd by dialect block
      highlightSolid: 'dt-bg-[#F2F3F2]',
      // toggle background off
      toggleBackground: 'dt-bg-[#D6D6D6]',
      // toggle background on
      toggleBackgroundActive: 'dt-bg-[#528E5B]',
      // circle in toggle
      toggleThumb: 'dt-bg-dark-night',
      // notification badge
      notificationBadgeColor: 'dt-bg-accent dt-text-white',
      // input label
      label: 'dt-text-black/60',
    },
    // TODO: simplify setting just font-family
    textStyles: {
      h1: 'dt-font-inter dt-text-[1.625rem] dt-font-bold',
      input: 'dt-font-inter',
      subscribeRow: 'dt-font-inter dt-text-[15px]',
      body: 'dt-font-inter dt-text-sm dt-font-normal',
      small: 'dt-font-inter dt-text-xs dt-font-normal',
      xsmall: 'dt-font-inter dt-text-[0.6875rem] dt-font-normal',
      bigText: 'dt-font-inter dt-text-lg dt-font-medium',
      header: 'dt-font-inter dt-text-base dt-font-medium',
      buttonText: 'dt-font-inter dt-text-base',
      link: 'dt-underline dt-decoration-1 dt-break-words',
      label: 'dt-font-inter dt-text-base',
    },
    icons: {
      arrowclockwise: ArrowClockwise,
      arrowsmright: ArrowSmRight,
      arrowvertical: MultiarrowVertical,
      bell: BellIcon,
      back: BackArrow,
      cancel: Cancel,
      chat: ChatBubble,
      compose: Compose,
      chevron: Chevron,
      checkmark: Checkmark,
      error: ErrorIcon,
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
      'dt-w-9 dt-h-9 dt--m-2 dt-flex dt-items-center dt-justify-center dt-transition hover:dt-opacity-60',
    sendButton: 'dt-h-5 dt-w-5 dt-text-white dt-rounded-full dt-bg-black',
    linkButton:
      'dt-inline-flex dt-items-center dt-transition-opacity dt-cursor-pointer hover:dt-opacity-50',
    header: 'dt-max-h-[3.5rem] dt-min-h-[3.5rem] dt-px-2',
    sectionHeader: 'dt-px-4',
    input:
      'dt-text-xs dt-text-neutral-700 dt-px-2 dt-py-2 dt-border-b dt-border-neutral-600 focus:dt-rounded-md dt-outline-none focus:dt-ring focus:dt-ring-black focus:dt-border-0 disabled:dt-text-neutral-700/50',
    outlinedInput:
      'dt-text-sm dt-h-[3.75rem] dt-text-white dt-bg-subtle-night dt-px-3 dt-py-2.5 dt-border-2 dt-border-neutral-600 dt-rounded-lg focus-within:dt-bg-black  focus-within:dt-border-white focus:dt-outline-none dt-rounded-2xl',
    subscribeRow:
      'dt-text-sm dt-h-[3.75rem] dt-text-white dt-bg-subtle-night dt-px-3.5 dt-py-2.5 dt-border-2 dt-border-neutral-600 dt-rounded-lg focus-within:dt-bg-black  focus-within:dt-border-white focus:dt-outline-none dt-rounded-lg',
    textArea:
      'dt-text-sm dt-text-neutral-800 dt-bg-white dt-border dt-rounded-2xl dt-px-2 dt-py-1 dt-border-neutral-300 dt-placeholder-neutral-400 dt-pr-10 dt-outline-none disabled:dt-text-neutral-800/50',
    messageBubble: 'dt-text-black dt-px-4 dt-py-2 dt-rounded-2xl dt-text-black',
    message: 'dt-bg-transparent dt-border dt-border-neutral-300',
    otherMessage: 'dt-bg-neutral-100',
    messageOnChain: 'dt-bg-accent',
    otherMessageOnChain: 'dt-bg-neutral-100',
    notificationMessage: 'dt-rounded-2xl dt-py-3 dt-px-3 dt-mb-2',
    notificationTimestamp: 'dt-text-right',
    notificationsDivider: 'dt-hidden',
    notificationHeader: 'dt-border-b dt-border-neutral-300',
    modalWrapper:
      'dt-fixed dt-z-[100] dt-top-0 dt-w-full dt-h-full dt-right-0 sm:dt-absolute sm:dt-top-16 sm:dt-w-[30rem] sm:dt-h-[40rem]',
    modalBackdrop:
      'dt-fixed dt-top-0 dt-bottom-0 dt-right-0 dt-left-0 dt-w-full dt-h-full dt-z-[99] dt-bg-black/50',
    modal: 'dt-rounded-none dt-shadow-md sm:dt-rounded-3xl',
    sliderWrapper:
      'dt-fixed dt-z-[100] dt-top-0 dt-bottom-0 dt-w-full dt-h-full sm:dt-w-[30rem] sm:dt-h-[40rem] sm:dt-right-10 sm:dt-top-auto dt-bottom-0',
    slider: 'dt-rounded-none dt-shadow-md sm:dt-rounded-t-3xl',
    button:
      'dt-bg-black dt-text-white dt-border dt-border-black hover:dt-opacity-60',
    buttonLoading:
      'dt-min-h-[42px] dt-border dt-border-black !dt-opacity-80 !dt-text-black !dt-bg-transparent',
    secondaryButton:
      'dt-bg-transparent dt-text-black dt-border dt-border-black hover:dt-bg-black/10',
    secondaryButtonLoading: '',
    secondaryDangerButton:
      'dt-bg-transparent dt-text-error-day dt-border dt-border-error-day hover:dt-bg-error-day/10',
    secondaryDangerButtonLoading:
      'dt-min-h-[42px] dt-text-error-day/40 !dt-bg-transparent',
    divider: 'dt-h-px dt-opacity-10 dt-bg-current',
    highlighted: 'dt-px-4 dt-py-3 dt-rounded-2xl',
    scrollbar: 'dt-light-scrollbar',
    section:
      'dt-p-2 dt-rounded-2xl dt-bg-dark-day dt-border dt-border-outline-day',
    xPaddedText: 'dt-px-2',
    disabledButton:
      'dt-bg-subtle-day dt-text-black/40 dt-border dt-border-outline-day',
    toast:
      'dt-border dt-rounded-lg dt-border-subtle-day dt-px-4 dt-py-2 dt-bg-dark-night',
    adornmentButton:
      'dt-bg-[#303030] dt-rounded-full dt-flex dt-items-center dt-justify-center dt-text-white dt-text-xs dt-border-0',
  },
  dark: {
    colors: {
      bg: 'dt-bg-black',
      textPrimary: 'dt-text-white',
      accent: 'dt-text-white',
      highlight: 'dt-bg-subtle-night',
      highlightSolid: 'dt-bg-[#262626]',
      toggleBackground: 'dt-bg-white/60',
      toggleBackgroundActive: 'dt-bg-[#528E5B]',
      toggleThumb: 'dt-bg-dark-night',
      notificationBadgeColor: 'dt-bg-accent dt-text-white',
      label: 'dt-text-white/60',
    },
    textStyles: {
      h1: 'dt-font-inter dt-text-[1.625rem] dt-font-bold',
      input: 'dt-font-inter',
      subscribeRow: 'dt-font-inter dt-text-[15px]',
      body: 'dt-font-inter dt-text-sm dt-font-normal',
      small: 'dt-font-inter dt-text-xs dt-font-normal',
      xsmall: 'dt-font-inter dt-text-[0.6875rem] dt-font-normal',
      bigText: 'dt-font-inter dt-text-lg dt-font-medium',
      header: 'dt-font-inter dt-text-lg dt-font-medium',
      buttonText: 'dt-font-inter dt-text-base',
      link: 'dt-underline decoration-1 dt-break-words',
      label: 'dt-font-inter dt-text-base',
    },
    icons: {
      arrowclockwise: ArrowClockwise,
      arrowsmright: ArrowSmRight,
      arrowvertical: MultiarrowVertical,
      bell: BellIcon,
      back: BackArrow,
      cancel: Cancel,
      chat: ChatBubble,
      checkmark: Checkmark,
      error: ErrorIcon,
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
      'dt-w-9 dt-h-9 dt--m-2 dt-flex dt-items-center dt-justify-center dt-transition hover:dt-opacity-60',
    sendButton: 'dt-h-5 dt-w-5 dt-text-black dt-rounded-full dt-bg-white',
    linkButton:
      'dt-inline-flex dt-items-center dt-transition-opacity dt-cursor-pointer hover:dt-opacity-50',
    header: 'dt-max-h-[3.5rem] dt-min-h-[3.5rem] dt-px-4',
    sectionHeader: 'dt-px-4',
    input:
      'dt-text-xs dt-text-white dt-bg-black dt-px-2 dt-py-2 dt-border-b dt-border-neutral-600 focus:dt-rounded-md dt-outline-none focus:dt-ring focus:dt-ring-white disabled:dt-text-white/50',
    outlinedInput:
      'dt-text-sm dt-h-[3.75rem] dt-text-white dt-bg-subtle-night dt-px-3 dt-py-2.5 dt-border-2 dt-border-neutral-600 dt-rounded-lg focus-within:dt-bg-black  focus-within:dt-border-white focus:dt-outline-none dt-rounded-2xl',
    subscribeRow:
      'dt-text-sm dt-h-[3.75rem] dt-text-white dt-bg-subtle-night dt-px-3.5 dt-py-2.5 dt-border-2 dt-border-neutral-600 dt-rounded-lg focus-within:dt-bg-black  focus-within:dt-border-white focus:dt-outline-none dt-rounded-lg',
    textArea:
      'dt-text-sm dt-text-neutral-200 dt-bg-black dt-border dt-rounded-2xl dt-px-2 dt-py-1 dt-border-neutral-600 dt-placeholder-neutral-600 dt-pr-10 dt-outline-none disabled:dt-text-neutral-200/50',
    messageBubble: 'dt-px-4 dt-py-2 dt-rounded-2xl dt-text-white',
    message: 'dt-bg-transparent dt-border dt-border-neutral-800 ',
    otherMessage: 'dt-bg-neutral-900 dt-border-neutral-900',
    messageOnChain: 'dt-bg-accent',
    otherMessageOnChain: 'dt-bg-neutral-900 dt-border-neutral-900',
    notificationMessage: 'dt-rounded-2xl dt-py-3 dt-px-3 dt-mb-2',
    notificationTimestamp: 'dt-text-right',
    notificationsDivider: 'dt-hidden',
    notificationHeader: 'dt-border-b dt-border-neutral-900',
    modalWrapper:
      'dt-fixed dt-z-[100] dt-top-0 dt-w-full dt-h-full dt-right-0 sm:dt-absolute sm:dt-top-16 sm:dt-w-[30rem] sm:dt-h-[40rem]',
    modalBackdrop:
      'dt-fixed dt-top-0 dt-bottom-0 dt-right-0 dt-left-0 dt-w-full dt-h-full dt-z-[99] dt-bg-black/50',
    modal: 'dt-rounded-none dt-shadow-md sm:dt-rounded-3xl',
    sliderWrapper:
      'dt-fixed dt-z-[100] dt-top-auto dt-bottom-0 dt-w-full dt-h-full sm:dt-w-[30rem] sm:dt-h-[40rem] sm:dt-right-10 sm:dt-top-auto',
    slider: 'dt-rounded-none dt-shadow-md sm:dt-rounded-t-3xl',
    button:
      'dt-bg-white dt-text-black dt-border dt-border-white hover:dt-opacity-60',
    buttonLoading:
      'dt-min-h-[42px] dt-border dt-border-white dt-bg-transparent !dt-opacity-80 !dt-text-white',
    secondaryButton:
      'dt-bg-transparent dt-text-white dt-border dt-border-white hover:dt-bg-white/10',
    secondaryButtonLoading: '',
    secondaryDangerButton:
      'dt-bg-transparent dt-text-error-night dt-border dt-border-error-night hover:dt-bg-error-night/10',
    secondaryDangerButtonLoading:
      'dt-min-h-[42px] dt-text-error-night dt-opacity-80 !dt-bg-transparent',
    divider: 'dt-h-px dt-opacity-30 dt-bg-current',
    highlighted: 'dt-px-4 dt-py-3 dt-rounded-2xl',
    scrollbar: 'dt-dark-scrollbar',
    section:
      'dt-p-2 dt-rounded-2xl dt-bg-dark-night dt-border dt-border-outline-night',
    xPaddedText: 'dt-px-2',
    disabledButton:
      'dt-bg-subtle-night dt-text-white/40 dt-border dt-border-outline-night',
    toast:
      'dt-border dt-rounded-lg dt-border-subtle-day dt-px-4 dt-py-2 dt-bg-dark-night',
    adornmentButton:
      'dt-bg-[#303030] dt-rounded-full dt-flex dt-items-center dt-justify-center dt-text-white dt-text-xs dt-border-0',
  },
};

const empty = Object.freeze({});

function mergeWithDefault(
  values: IncomingThemeVariables,
  theme: ThemeType
): ThemeValues & CommonThemeValues {
  const defaultThemeValues: IncomingThemeValues = defaultVariables[theme];
  const currentThemeValues: IncomingThemeValues = values[theme] ?? empty;

  // Extracting only common values
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const {
    dark: defaultDark,
    light: defaultLight,
    ...defaultCommon
  } = defaultVariables;
  const { dark, light, ...common } = values;
  /* eslint-enable */

  const result = deepMerge(
    {},
    defaultThemeValues,
    currentThemeValues,
    defaultCommon,
    common
  );

  return (result ?? empty) as ThemeValues & CommonThemeValues;
}

export const ThemeContext = React.createContext<
  | (ThemeValues &
      CommonThemeValues & {
        theme: ThemeType;
      })
  | null
>(null);

type PropsType = {
  theme?: ThemeType;
  variables?: IncomingThemeVariables;
  children: JSX.Element;
};

export const DialectThemeProvider = ({
  theme = 'light',
  variables = empty,
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
    throw new Error('useTheme must be used within an DialectThemeProvider');
  }
  return context;
}
