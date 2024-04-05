import clsx from 'clsx';
import { SVGProps } from 'react';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  BellIcon,
  CloseIcon,
  SettingsIcon,
  TrashIcon,
  XmarkIcon,
} from './core/icons';

export const Icons = {
  Loader: (props: SVGProps<SVGSVGElement>) => (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 16 16"
      className={clsx('dt-animate-spin', props.className)}
      {...props}
    >
      <path
        fill="currentColor"
        d="M9.404 1.95c0 .522-.29.957-.697 1.218-.435.262-.986.262-1.393 0a1.39 1.39 0 0 1-.696-1.218c0-.494.261-.929.696-1.19.407-.261.958-.261 1.393 0 .407.261.697.696.697 1.19Zm0 12.071c0 .522-.29.958-.697 1.219-.435.261-.986.261-1.393 0a1.39 1.39 0 0 1-.696-1.219c0-.493.261-.928.696-1.19.407-.26.958-.26 1.393 0 .407.262.697.697.697 1.19ZM1.975 9.378a1.39 1.39 0 0 1-1.219-.696c-.26-.406-.26-.958 0-1.393.262-.406.697-.696 1.22-.696.492 0 .928.29 1.189.696.261.435.261.987 0 1.393-.261.435-.697.696-1.19.696ZM15.44 7.985c0 .523-.29.958-.697 1.22-.435.26-.987.26-1.393 0a1.39 1.39 0 0 1-.696-1.22c0-.493.26-.928.696-1.19.406-.26.958-.26 1.393 0 .406.262.697.697.697 1.19ZM4.703 13.238c-.348.377-.842.493-1.335.377a1.41 1.41 0 0 1-.987-.987c-.116-.493 0-.986.378-1.335.348-.377.841-.493 1.334-.377.465.145.842.523.987.987.116.493 0 .986-.377 1.335Zm0-8.532c-.348.378-.842.494-1.335.378a1.463 1.463 0 0 1-.987-.987c-.116-.493 0-.987.378-1.364.319-.348.841-.493 1.334-.377.494.116.9.493 1.016.987a1.41 1.41 0 0 1-.406 1.363Zm6.587 8.532c-.377-.348-.493-.842-.377-1.335.145-.464.522-.842.986-.987.494-.116.987 0 1.364.377.348.349.464.842.348 1.335a1.41 1.41 0 0 1-.986.987c-.494.116-.987 0-1.335-.377Z"
      />
    </svg>
  ),
  Settings: SettingsIcon,
  ArrowLeft: ArrowLeftIcon,
  ArrowRight: ArrowRightIcon,
  Close: CloseIcon,
  Bell: BellIcon,
  Trash: TrashIcon,
  Xmark: XmarkIcon,
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
      Checked: 'focus-within:dt-border-[--dt-input-checked]',
    },
    Primary: 'dt-border-[--dt-stroke-primary]',
    Error: 'dt-border-[--dt-accent-error]',
  },
};
