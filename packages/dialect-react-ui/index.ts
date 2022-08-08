import 'focus-visible'; // https://css-tricks.com/keyboard-only-focus-styles/
import Chat from './components/Chat';
import ChatButton from './components/ChatButton';
import BottomChat from './components/BottomChat';
import Notifications from './components/Notifications';
import NotificationsButton from './components/NotificationsButton';
import NotificationsModal from './components/NotificationsModal';
import Inbox from './components/Inbox';

import Broadcast from './components/Broadcast';
import BroadcastForm from './components/Broadcast/BroadcastForm';

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
import WalletStatesWrapper from './entities/wrappers/WalletStatesWrapper';
import ConnectionWrapper from './entities/wrappers/ConnectionWrapper';
import DashboardWrapper from './entities/wrappers/DashboardWrapper';
import ThreadEncyprionWrapper from './entities/wrappers/ThreadEncryptionWrapper';

const ThemeProvider = DialectThemeProvider;

export {
  Chat,
  ChatButton,
  BottomChat,
  NotificationsButton,
  NotificationsModal,
  Notifications,
  Inbox,
  defaultVariables,
  ThemeProvider,
  DialectThemeProvider,
  DialectUiManagementProvider,
  useDialectUi,
  useDialectUiId,
  ChatRouteName,
  ChatThreadRouteName,
  ChatMainRouteName,
  Broadcast,
  BroadcastForm,
  // etc for building custom components
  WalletStatesWrapper,
  ConnectionWrapper,
  DashboardWrapper,
  ThreadEncyprionWrapper,
};

export type {
  ThemeType,
  ThemeIcons,
  ThemeColors,
  ThemeTextStyles,
  IncomingThemeVariables,
  IncomingThemeValues,
  ChatNavigationHelpers,
};

export * from '@dialectlabs/react-sdk';
