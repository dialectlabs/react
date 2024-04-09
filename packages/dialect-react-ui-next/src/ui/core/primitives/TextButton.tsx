import clsx from 'clsx';
import React from 'react';
import { ClassTokens } from '../../theme';

export enum TextButtonType {
  Common = 'Common',
  Default = 'Default',
  Success = 'Success',
  Warning = 'Warning',
  Error = 'Error',
}
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: TextButtonType;
}

export const TextButton = ({
  onClick,
  disabled,
  children,
  type = TextButtonType.Common,
}: ButtonProps): JSX.Element => {
  return (
    <button
      className={clsx(
        'dt-flex dt-cursor-pointer dt-items-center dt-gap-1 dt-text-subtext dt-font-semibold',
        ClassTokens.Text.TextButton[type],
        'hover:dt-opacity-80 disabled:dt-opacity-50',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
