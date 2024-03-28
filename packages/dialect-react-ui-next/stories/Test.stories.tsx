import { Meta, StoryObj } from '@storybook/react';
import { Test } from '../ui/core/Test';

export const Main: StoryObj<typeof Test> = {
  render: () => <Test />,
};

export default {
  component: Test,
} satisfies Meta<typeof Test>;
