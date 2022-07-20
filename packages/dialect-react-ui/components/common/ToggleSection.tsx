import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Toggle, ValueRow } from '../common';
import { useTheme } from './providers/DialectThemeProvider';

type PropsType = {
  title: string | React.ReactNode;
  className?: string;
  checked: boolean;
  disabled?: boolean;
  hideToggle?: boolean;
  noBorder?: boolean;
  onChange?: (nextValue: boolean) => void;
  children?: React.ReactNode;
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
  const [isEnabled, setEnabled] = useState(checked);
  const { section } = useTheme();

  useEffect(() => {
    setEnabled(checked);
  }, [checked]);

  const inner = (
    <>
      <ValueRow
        className={clsx(isEnabled && children && 'dt-mb-2')}
        label={title}
      >
        {!hideToggle && (
          <Toggle
            type="checkbox"
            checked={isEnabled}
            disabled={disabled}
            onClick={async () => {
              const nextValue = !isEnabled;
              await onChange?.(nextValue);
              setEnabled(nextValue);
            }}
          />
        )}
      </ValueRow>
      {isEnabled && children}
    </>
  );

  if (noBorder) {
    return inner;
  }

  return <div className={clsx(section)}>{inner}</div>;
}
