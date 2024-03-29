import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ThemeProvider } from '../model';
import { Switch } from '../ui/core/primitives';

export const Main: StoryObj<typeof Switch> = {
  args: {
    children: 'Notifications',
    checked: false,
    onClick: fn(),
  },
};

export default {
  component: Switch,
  decorators: [
    (Story) => (
      <ThemeProvider theme={{}}>
        <Story />
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Switch>;
