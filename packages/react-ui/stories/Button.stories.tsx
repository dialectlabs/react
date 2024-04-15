import { Meta, StoryObj } from '@storybook/react';
import { Button, ButtonType } from '../src/ui/core';

export const Main: StoryObj<typeof Button> = {
  args: {
    children: 'Press me',
    type: ButtonType.Secondary,
    // label: 'Input',
    // value: undefined,
    // placeholder: 'Type here...',
  },
};

export const Primary: StoryObj<typeof Button> = {
  args: {
    children: 'Press me',
    type: ButtonType.Primary,
    size: 'large',
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
