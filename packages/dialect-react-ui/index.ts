import 'focus-visible'; // https://css-tricks.com/keyboard-only-focus-styles/
import Chat from './components/Chat';
import ChatButton from './components/ChatButton';
import BottomChat from './components/BottomChat';
import Notifications from './components/Notifications';
import NotificationsButton from './components/NotificationsButton';
import NotificationsModal from './components/NotificationsModal';
import { NotificationsSingleFeed } from './components/NotificationsSingleFeed';
import SubscribeButton from './components/SubscribeButton';
import Inbox from './components/Inbox';

import * as PrimitivesInternal from './components/common/primitives';
import * as Preflighted from './components/common/preflighted';

import {
  defaultVariables,
  DialectThemeProvider,
} from './components/common/providers/DialectThemeProvider';
import {
  DialectUiManagementProvider,
  useDialectUi,
  useDialectUiId,
} from './components/common/providers/DialectUiManagementProvider';
import {
  RouteName as ChatRouteName,
  MainRouteName as ChatMainRouteName,
  ThreadRouteName as ChatThreadRouteName,
} from './components/Chat/constants';

import type {
  ThemeType,
  ThemeIcons,
  ThemeColors,
  ThemeTextStyles,
  IncomingThemeVariables,
  IncomingThemeValues,
} from './components/common/providers/DialectThemeProvider';
import type { ChatNavigationHelpers } from './components/Chat/types';
import type { ChannelCountsType } from './utils/addressesUtils';
import WalletStatesWrapper from './entities/wrappers/WalletStatesWrapper';
import ConnectionWrapper from './entities/wrappers/ConnectionWrapper';
import DashboardWrapper from './entities/wrappers/DashboardWrapper';
import ThreadEncyprionWrapper from './entities/wrappers/ThreadEncryptionWrapper';

import Email from './components/Notifications/screens/NewSettings/Email';
import Telegram from './components/Notifications/screens/NewSettings/Telegram';
import Wallet from './components/Notifications/screens/NewSettings/Wallet';
import { NotificationToggle } from './components/Notifications/screens/Settings';
import { Notification } from './entities/notifications/Notification';
import ToastMessage from './components/common/ToastMessage';
import * as Icons from './components/Icon';

import { useTheme } from './components/common/providers/DialectThemeProvider';
import { LinkifiedText } from './components/common';
const ThemeProvider = DialectThemeProvider;

const Primitives = {
  ...PrimitivesInternal,
  ...Preflighted,
  LinkifiedText,
  ToastMessage,
};

export {
  Chat,
  ChatButton,
  BottomChat,
  NotificationsButton,
  NotificationsModal,
  Notifications,
  NotificationsSingleFeed,
  Inbox,
  defaultVariables,
  ThemeProvider,
  DialectThemeProvider,
  DialectUiManagementProvider,
  useTheme,
  useDialectUi,
  useDialectUiId,
  ChatRouteName,
  ChatThreadRouteName,
  ChatMainRouteName,

  // etc for building custom components
  WalletStatesWrapper,
  ConnectionWrapper,
  DashboardWrapper,
  ThreadEncyprionWrapper,
  // UI components
  SubscribeButton,
  Email,
  Telegram,
  Wallet,
  NotificationToggle,
  Notification,
  Primitives,
  Icons,
};

export type {
  ThemeType,
  ThemeIcons,
  ThemeColors,
  ThemeTextStyles,
  IncomingThemeVariables,
  IncomingThemeValues,
  ChatNavigationHelpers,
  ChannelCountsType,
};

export * from '@dialectlabs/react-sdk';

// Generated
export * from './version';
