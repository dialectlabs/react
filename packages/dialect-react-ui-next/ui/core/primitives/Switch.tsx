import clsx from 'clsx';
import { useCallback } from 'react';
import { useTheme } from '../../../model';

export interface SwitchProps {
  children?: string;
  checked?: boolean;
  onClick?: () => void;
}

export const Switch = ({ children, checked = false, onClick }: SwitchProps) => {
  const theme = useTheme();

  const onClickHandler = useCallback(() => {
    onClick?.();
  }, [onClick]);

  return (
    <label
      className="dt-label dt-text-subtext dt-font-semibold dt-inline-flex dt-items-center dt-gap-1"
      onClick={onClickHandler}
    >
      <input type="hidden" checked={checked} />
      <span
        className={clsx(
          'dt-block dt-rounded-full dt-h-5 dt-w-8 dt-p-0.5 dt-transition-colors dt-ease-in-out',
          checked ? theme.input.colors.checked : theme.input.colors.unchecked,
        )}
      >
        <span
          className={clsx(
            'dt-w-4 dt-h-4 dt-block dt-rounded-full dt-transition-transform dt-ease-in-out dt-transform',
            theme.input.colors.secondary,
            checked ? 'dt-translate-x-3' : 'dt-translate-x-0',
          )}
        />
      </span>
      {children}
    </label>
  );
};
