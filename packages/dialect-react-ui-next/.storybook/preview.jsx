import * as React from 'react';
import '../index.css';

/** @type { import('@storybook/react').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="dialect">
        <Story />
      </div>
    ),
  ],
};

export default preview;
