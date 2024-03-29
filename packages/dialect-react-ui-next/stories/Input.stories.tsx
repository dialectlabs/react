import { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../model';
import { Input } from '../ui/core/primitives';

export const Main: StoryObj<typeof Input> = {
  args: {
    label: 'Input',
    value: '',
    placeholder: 'Type here...',
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
      <ThemeProvider theme={{}}>
        <div style={{ width: 400 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof Input>;
