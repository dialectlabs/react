import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/ui/core/primitives';

export const Main: StoryObj<typeof Button> = {
  args: {
    children: 'Press me',
    // label: 'Input',
    // value: undefined,
    // placeholder: 'Type here...',
  },
};

export default {
  component: Button,
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Button>;
