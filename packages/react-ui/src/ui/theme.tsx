import { NotificationStyleMap } from '../types';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellButtonIcon,
  BellButtonIconOutline,
  BellIcon,
  CloseIcon,
  ResendIcon,
  SettingsIcon,
  SpinnerDots,
  TrashIcon,
  WalletIcon,
  XmarkIcon,
} from './core/icons';

export const Icons = {
  Loader: SpinnerDots,
  Settings: SettingsIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  Close: CloseIcon,
  Bell: BellIcon,
  BellButton: BellButtonIcon,
  BellButtonOutline: BellButtonIconOutline,
  Trash: TrashIcon,
  Xmark: XmarkIcon,
  Resend: ResendIcon,
  Wallet: WalletIcon,
};

export const NotificationTypeStyles: NotificationStyleMap = {};

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
      Destructive: {
        Default: 'dt-text-[--dt-accent-error]',
        Disabled: 'disabled:dt-text-[--dt-accent-error]',
      },
    },
    TextButton: {
      //TODO naming???
      Common: 'dt-text-[--dt-text-primary]',
      Default: 'dt-text-[--dt-accent-brand]',
      Success: 'dt-text-[--dt-accent-success]',
      Warning: 'dt-text-[--dt-accent-warning]',
      Error: 'dt-text-[--dt-accent-error]',
    },
    Input: {
      Placeholder: 'placeholder:dt-text-[--dt-text-quaternary]',
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
        Default: 'dt-bg-[--dt-button-primary]',
        Hover: 'hover:dt-bg-[--dt-button-primary-hover]',
        Pressed: 'active:dt-bg-[--dt-button-primary]',
        Disabled: 'disabled:dt-bg-[--dt-button-primary-disabled]',
      },
      Secondary: {
        Default: 'dt-bg-[--dt-button-secondary]',
        Hover: 'hover:dt-bg-[--dt-button-secondary-hover]',
        Pressed: 'active:dt-bg-[--dt-button-secondary]',
        Disabled: 'disabled:dt-bg-[--dt-button-secondary-disabled]',
      },
      Destructive: {
        Default: 'dt-bg-[--dt-button-secondary]',
        Hover: 'hover:dt-bg-[--dt-button-secondary-hover]',
        Pressed: 'active:dt-bg-[--dt-button-secondary]',
        Disabled: 'disabled:dt-bg-[--dt-button-secondary-disabled]',
      },
    },
    Input: {
      Secondary: 'dt-bg-[--dt-input-secondary]',
      Checked: 'dt-bg-[--dt-input-checked]',
      Unchecked: 'dt-bg-[--dt-input-unchecked]',
    },
    Primary: 'dt-bg-[--dt-bg-primary]',
    Secondary: 'dt-bg-[--dt-bg-secondary]',
    Tertiary: 'dt-bg-[--dt-bg-tertiary]',
    Brand: 'dt-bg-[--dt-bg-brand]',
    BrandTransparent: 'dt-bg-[--dt-bg-brand-transparent]',
    Success: 'dt-bg-[--dt-accent-success]',
  },
  Stroke: {
    Input: {
      Primary: 'dt-border-[--dt-input-primary]',
      Checked: 'dt-border-[--dt-input-checked]',
      Error: 'dt-border-[--dt-accent-error]',
      Focused: 'focus-within:dt-border-[--dt-input-checked]',
    },
    Primary: 'dt-border-[--dt-stroke-primary]',
    Error: 'dt-border-[--dt-accent-error]',
  },
  Radius: {
    XSmall: 'dt-rounded-[--dt-border-radius-xs]',
    Small: 'dt-rounded-[--dt-border-radius-s]',
    Medium: 'dt-rounded-[--dt-border-radius-m]',
    Large: 'dt-rounded-[--dt-border-radius-l]',
  },
};
