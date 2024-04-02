import { Meta, StoryObj } from '@storybook/react';
import { Input } from '../src/ui/core/primitives';

export const Main: StoryObj<typeof Input> = {
  args: {
    label: 'Input',
    value: undefined,
    placeholder: 'Type here...',
  },
  argTypes: {
    value: {
      type: 'string',
    },
  },
};

export const WithRightAdornment: StoryObj<typeof Input> = {
  args: {
    label: 'Input',
    value: undefined,
    placeholder: 'Type here...',
    rightAdornment: <span>👋</span>,
  },
  argTypes: {
    value: {
      type: 'string',
    },
  },
};

export default {
  component: Input,
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;
