import { Meta, StoryObj } from '@storybook/react';
import { SVGProps } from 'react';
import { Button } from '../src/ui/core/primitives';
import { Icons } from '../src/ui/theme';

const MyLoaderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 100 100" width="1em" height="1em" {...props}>
    <circle
      cx={50}
      cy={50}
      r={48}
      fill="none"
      stroke="currentColor"
      strokeMiterlimit={10}
      strokeWidth={4}
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={4}
      d="m50 50 35 .5"
    >
      <animateTransform
        attributeName="transform"
        dur="2s"
        from="0 50 50"
        repeatCount="indefinite"
        to="360 50 50"
        type="rotate"
      />
    </path>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeMiterlimit={10}
      strokeWidth={4}
      d="m50 50-.5 24"
    >
      <animateTransform
        attributeName="transform"
        dur="15s"
        from="0 50 50"
        repeatCount="indefinite"
        to="360 50 50"
        type="rotate"
      />
    </path>
  </svg>
);

Icons.Loader = MyLoaderIcon;

export const Main: StoryObj<typeof Button> = {
  args: {
    children: 'Press me',
    loading: true,
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
