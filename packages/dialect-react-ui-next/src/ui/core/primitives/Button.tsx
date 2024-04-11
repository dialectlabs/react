import clsx from 'clsx';
import React from 'react';
import { ClassTokens, Icons } from '../../theme';

export enum ButtonType {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Destructive = 'Destructive',
}
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  type?: ButtonType;
  destructive?: boolean;
  size?: 'medium' | 'large';
  stretch?: boolean;
}

export const Button = ({
  type = ButtonType.Secondary,
  size = 'medium',
  stretch = false,
  ...props
}: ButtonProps): JSX.Element => {
  const backgroundTokens = ClassTokens.Background.Button[type];
  const textTokens = ClassTokens.Text.Button[type];
  const styles =
    size === 'large'
      ? 'dt-px-6 dt-py-4 dt-text-text dt-font-semibold ' +
        ClassTokens.Radius.Medium
      : 'dt-px-2.5 dt-py-1.5 dt-text-subtext dt-font-semibold ' +
        ClassTokens.Radius.XSmall;
  return (
    <button
      className={clsx(
        'dt-flex dt-items-center dt-justify-center dt-gap-1.5',
        { 'dt-w-full': stretch },
        backgroundTokens.Default,
        backgroundTokens.Hover,
        backgroundTokens.Pressed,
        backgroundTokens.Disabled,
        textTokens.Default,
        textTokens.Disabled,
        styles,
      )}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <>
          Loading <Icons.Loader />
        </>
      ) : (
        props.children
      )}
    </button>
  );
};
