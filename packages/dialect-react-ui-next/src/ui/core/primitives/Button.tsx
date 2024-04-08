import clsx from 'clsx';
import React from 'react';
import { ClassTokens, Icons } from '../../theme';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Button = ({
  variant = 'secondary',
  ...props
}: ButtonProps): JSX.Element => {
  const backgroundTokens =
    variant === 'primary'
      ? ClassTokens.Background.Button.Primary
      : ClassTokens.Background.Button.Secondary;
  const textTokens =
    variant === 'primary'
      ? ClassTokens.Text.Button.Primary
      : ClassTokens.Text.Button.Secondary;
  const styles =
    variant === 'primary'
      ? 'dt-px-6 dt-py-4 dt-text-text dt-font-semibold dt-rounded-xl'
      : 'dt-px-2 dt-py-1.5 dt-text-subtext dt-font-semibold dt-rounded-lg';
  return (
    <button
      className={clsx(
        'dt-flex dt-items-center dt-justify-center dt-gap-1.5',
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
