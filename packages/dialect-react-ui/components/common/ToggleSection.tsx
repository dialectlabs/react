import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { Toggle, ValueRow } from '../common';
import { useTheme } from './providers/DialectThemeProvider';

type PropsType = {
  title: string | React.ReactNode;
  className?: string;
  enabled: boolean;
  noBorder?: boolean;
  onChange?: (nextValue: boolean) => void;
  children?: React.ReactNode;
};

export default function ToggleSection({
  title,
  enabled,
  noBorder,
  children,
  onChange,
}: PropsType) {
  const [isEnabled, setEnabled] = useState(enabled);
  const { section } = useTheme();

  useEffect(() => {
    setEnabled(enabled);
  }, [enabled]);

  const inner = (
    <>
      <ValueRow
        className={clsx(isEnabled && children && 'dt-mb-2')}
        label={title}
      >
        <Toggle
          type="checkbox"
          checked={isEnabled}
          onClick={async () => {
            const nextValue = !isEnabled;
            await onChange?.(nextValue);
            setEnabled(nextValue);
          }}
        />
      </ValueRow>
      {isEnabled && children}
    </>
  );

  if (noBorder) {
    return inner;
  }

  return <div className={clsx(section)}>{inner}</div>;
}
