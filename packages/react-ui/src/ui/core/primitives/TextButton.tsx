import clsx from 'clsx';
import React, { JSX } from 'react';
import { ClassTokens } from '../../theme';

export enum TextButtonType {
  Common = 'Common',
  Default = 'Default',
  Success = 'Success',
  Warning = 'Warning',
  Error = 'Error',
}
export interface TextButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color?: string;
}

export const TextButton = ({
  onClick,
  disabled,
  children,
  color,
}: TextButtonProps): JSX.Element => {
  return (
    <button
      style={{ color }}
      className={clsx(
        'dt-flex dt-cursor-pointer dt-items-center dt-gap-1 dt-text-subtext dt-font-semibold',
        { [ClassTokens.Text.Primary]: !color },
        'hover:dt-opacity-80 disabled:dt-opacity-50',
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
