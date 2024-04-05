import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Switch } from '../src/ui/core/primitives';

export const Main: StoryObj<typeof Switch> = {
  args: {
    children: 'Notifications',
    checked: false,
    onChange: fn(),
  },
};

export default {
  component: Switch,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Switch>;
