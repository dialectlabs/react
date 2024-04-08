import { Meta, StoryObj } from '@storybook/react';
import { NotificationsFeed } from '../src/ui/notifications/NotificationsFeed';

export const Main: StoryObj<typeof NotificationsFeed> = {
  args: {},
};

export default {
  component: NotificationsFeed,
} satisfies Meta<typeof NotificationsFeed>;
