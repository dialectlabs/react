import Chat from './components/Chat';
import ChatButton from './components/ChatButton';
import Notifications from './components/Notifications';
import NotificationsButton from './components/NotificationsButton';
import MessageInput from './components/Chat/MessageInput';
import Inbox from './components/Inbox';
import { defaultVariables } from './components/common/ThemeProvider';

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
  MessageInput,
  NotificationsButton,
  Notifications,
  Inbox,
  defaultVariables,
};

export type {
  ThemeType,
  ThemeIcons,
  ThemeColors,
  ThemeTextStyles,
  IncomingThemeVariables,
  IncomingThemeValues,
};
