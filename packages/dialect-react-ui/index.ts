import 'focus-visible'; // https://css-tricks.com/keyboard-only-focus-styles/
import Chat from './components/Chat';
import ChatButton from './components/ChatButton';
import Notifications from './components/Notifications';
import NotificationsButton from './components/NotificationsButton';
import Inbox from './components/Inbox';
import {
  defaultVariables,
  ThemeProvider,
} from './components/common/ThemeProvider';

import type {
  ThemeType,
  ThemeIcons,
  ThemeColors,
  ThemeTextStyles,
  IncomingThemeVariables,
  IncomingThemeValues,
} from './components/common/ThemeProvider';

export {
  Chat,
  ChatButton,
  NotificationsButton,
  Notifications,
  Inbox,
  defaultVariables,
  ThemeProvider,
};

export type {
  ThemeType,
  ThemeIcons,
  ThemeColors,
  ThemeTextStyles,
  IncomingThemeVariables,
  IncomingThemeValues,
};
