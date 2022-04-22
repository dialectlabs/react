import React, { useState } from 'react';
import clsx from 'clsx';
import { Toggle, ValueRow } from '../common';
import { useTheme } from './ThemeProvider';

type PropsType = {
  title: string | React.ReactNode;
  className?: string;
  enabled: boolean;
  onChange?: (nextValue: boolean) => void;
  children: React.ReactNode;
};

export default function ToggleSection({
  title,
  enabled,
  children,
  onChange,
}: PropsType) {
  const [isEnabled, setEnabled] = useState(enabled);
  const { section } = useTheme();

  return (
    <div className={clsx(section)}>
      <ValueRow className={clsx(isEnabled && 'dt-mb-2')} label={title}>
        <Toggle
          type="checkbox"
          checked={isEnabled}
          onClick={async () => {
            const nextValue = !isEnabled;
            await onChange?.(nextValue);
            setEnabled(!isEnabled);
          }}
        />
      </ValueRow>
      {isEnabled && children}
    </div>
  );
}
