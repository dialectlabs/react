import clsx from 'clsx';
import { JSX } from 'react';

interface Props {
  icon: JSX.Element;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}
export const IconButton = ({ icon, onClick, className, disabled, type = 'button' }: Props) => {
  return (
    <button
      className={clsx(className, 'dt-transition-opacity hover:dt-opacity-70', disabled && 'dt-opacity-50')}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {icon}
    </button>
  );
};
