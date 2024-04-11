import clsx from 'clsx';
import { JSX } from 'react';

interface Props {
  icon: JSX.Element;
  className: string;
  onClick: () => void;
}
export const IconButton = ({ icon, onClick, className }: Props) => {
  return (
    <button
      className={clsx(className, 'dt-transition-opacity hover:dt-opacity-70')}
      onClick={onClick}
    >
      {icon}
    </button>
  );
};
