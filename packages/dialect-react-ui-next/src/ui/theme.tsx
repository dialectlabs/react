import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellButtonIcon,
  BellIcon,
  CloseIcon,
  LoaderIcon,
  ResendIcon,
  SettingsIcon,
  TrashIcon,
  XmarkIcon,
} from './core/icons';

export const Icons = {
  Loader: LoaderIcon,
  Settings: SettingsIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  Close: CloseIcon,
  Bell: BellIcon,
  BellButton: BellButtonIcon,
  Trash: TrashIcon,
  Xmark: XmarkIcon,
  Resend: ResendIcon,
};

export const ClassTokens = {
  Text: {
    Primary: 'dt-text-[--dt-text-primary]',
    Secondary: 'dt-text-[--dt-text-secondary]',
    Tertiary: 'dt-text-[--dt-text-tertiary]',
    Brand: 'dt-text-[--dt-accent-brand]',
    Error: 'dt-text-[--dt-accent-error]',
    Inverse: 'dt-text-[--dt-text-inverse]',
    Button: {
      Primary: {
        Default: 'dt-text-[--dt-text-inverse]',
        Disabled: 'disabled:dt-text-[--dt-text-tertiary]',
      },
      Secondary: {
        Default: 'dt-text-[--dt-text-primary]',
        Disabled: 'disabled:dt-text-[--dt-text-tertiary]',
      },
    },
  },
  Icon: {
    Primary: 'dt-text-[--dt-icon-primary]',
    Secondary: 'dt-text-[--dt-icon-secondary]',
    Tertiary: 'dt-text-[--dt-icon-tertiary]',
    Inverse: 'dt-text-[--dt-icon-inverse]',
  },
  Background: {
    Button: {
      Primary: {
        //TODO how to use gradient here???
        Default: 'dt-bg-[--dt-input-inverse]',
        Hover: 'hover:dt-bg-[--dt-input-inverse]',
        Pressed: 'active:dt-bg-[--dt-input-inverse]',
        Disabled: 'disabled:dt-bg-[--dt-input-inverse]',
      },
      Secondary: {
        Default: 'dt-bg-[--dt-bg-tertiary]',
        Hover: 'hover:dt-bg-[--dt-input-primary]',
        Pressed: 'active:dt-bg-[--dt-input-tertiary]',
        Disabled: 'disabled:dt-bg-[--dt-bg-tertiary]',
      },
    },
    Input: {
      Secondary: 'dt-bg-[--dt-input-secondary]',
      Checked: 'dt-bg-[--dt-input-checked]',
      Unchecked: 'dt-bg-[--dt-input-unchecked]',
    },
    Primary: 'dt-bg-[--dt-bg-primary]',
    Secondary: 'dt-bg-[--dt-bg-secondary]',
  },
  Stroke: {
    Input: {
      Primary: 'dt-border-[--dt-input-primary]',
      Checked: 'dt-border-[--dt-input-checked]',
    },
    Primary: 'dt-border-[--dt-stroke-primary]',
    Error: 'dt-border-[--dt-accent-error]',
  },
};
