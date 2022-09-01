import clsx from 'clsx';
import type { ReactNode } from 'react';
import { Toggle, ValueRow } from '../common';
import { useTheme } from './providers/DialectThemeProvider';

type PropsType = {
  title: string | ReactNode;
  className?: string;
  checked: boolean;
  disabled?: boolean;
  hideToggle?: boolean;
  noBorder?: boolean;
  onChange?: (nextValue: boolean) => void;
  children?: ReactNode;
};

export default function ToggleSection({
  title,
  checked,
  noBorder,
  children,
  onChange,
  disabled,
  hideToggle,
}: PropsType) {
  const { section } = useTheme();

  const inner = (
    <>
      <ValueRow
        className={clsx(checked && children && 'dt-mb-2')}
        label={title}
      >
        {!hideToggle && (
          <Toggle
            type="checkbox"
            checked={checked}
            disabled={disabled}
            onChange={onChange}
          />
        )}
      </ValueRow>
      {checked && children}
    </>
  );

  if (noBorder) {
    return inner;
  }

  return <div className={clsx(section)}>{inner}</div>;
}
