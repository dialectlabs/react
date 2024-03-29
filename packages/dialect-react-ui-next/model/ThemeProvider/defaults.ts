import { Theme } from './types';

export const defaultTheme: Theme = {
  common: {
    icons: {},
  },
};

export const ClassTokens = {
  Text: {
    Primary: 'dt-text-[--dt-text-primary]',
    Tertiary: 'dt-text-[--dt-text-tertiary]',
  },
  Background: {
    Input: {
      Secondary: 'dt-bg-[--dt-input-secondary]',
      Checked: 'dt-bg-[--dt-input-checked]',
      Unchecked: 'dt-bg-[--dt-input-unchecked]',
    },
  },
  Stroke: {
    Input: {
      Primary: 'dt-border-[--dt-input-primary]',
    },
  },
};
