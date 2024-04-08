import { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../src/ui/core/primitives';

export const Main: StoryObj<typeof Checkbox> = {
  args: {
    children: 'Notifications',
    checked: true,
  },
};

export default {
  component: Checkbox,
  decorators: [(Story) => <Story />],
} satisfies Meta<typeof Checkbox>;
