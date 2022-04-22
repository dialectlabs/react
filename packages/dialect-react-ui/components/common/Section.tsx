import React, { useState } from 'react';
import { Toggle, ValueRow } from '../common';

type PropsType = {
  title: string | React.ReactNode;
  enabled: boolean;
  onChange?: (nextValue: boolean) => void;
  children: React.ReactNode;
};

export default function Section({
  title,
  enabled,
  children,
  onChange,
}: PropsType) {
  const [isEnabled, setEnabled] = useState(enabled);

  return (
    <div>
      <ValueRow className="dt-mb-2" label={title}>
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
