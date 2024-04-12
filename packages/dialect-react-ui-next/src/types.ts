import type { ReactNode } from 'react';

export type ChannelType = 'wallet' | 'email' | 'telegram';

export type NotificationStyleToggleColor = { dark: string; light: string };

export interface NotificationStyle {
  Icon: ReactNode;
  iconColor?: string | NotificationStyleToggleColor;
  iconBackgroundColor?: string | NotificationStyleToggleColor;
  iconBackgroundBackdropColor?: string | NotificationStyleToggleColor;
  linkColor?: string | NotificationStyleToggleColor;
  actionGradientStartColor?: string | NotificationStyleToggleColor;
}

export interface NotificationStyleMap {
  [notificationTypeId: string]: NotificationStyle;
}
