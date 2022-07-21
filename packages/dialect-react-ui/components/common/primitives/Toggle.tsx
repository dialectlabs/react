import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { useTheme } from '../providers/DialectThemeProvider';
import { Label } from '../preflighted';
import clsx from 'clsx';

export default function Toggle({
  checked,
  onClick,
  ...props
}: { checked: boolean; onClick: () => void } & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const [isChecked, setChecked] = useState<boolean>(checked);
  const { colors } = useTheme();

  useEffect(() => setChecked(checked), [checked]);

  return (
    <Label
      className={clsx(
        props.disabled ? 'dt-cursor-not-allowed' : 'dt-cursor-pointer',
        'dt-flex dt-items-center dt-relative dt-h-5 dt-w-10'
      )}
    >
      <input
        type="checkbox"
        className="dt-input dt-appearance-none dt-opacity-0 dt-w-0 dt-h-0"
        checked={checked}
        onChange={async () => {
          const nextValue = !checked;
          await onClick();
          setChecked(nextValue);
        }}
        {...props}
      />
      {/* Background */}
      <span
        className={clsx(
          'dt-h-5 dt-w-10 dt-rounded-full',
          isChecked ? colors.toggleBackgroundActive : colors.toggleBackground
        )}
      />
      {/* Thumb */}
      <span
        className={clsx(
          'dt-absolute dt-top-1 dt-left-1 dt-rounded-full dt-h-3 dt-w-3 dt-transition dt-shadow-sm',
          colors.toggleThumb,
          isChecked ? 'dt-translate-x-[160%]' : ''
        )}
      />
    </Label>
  );
}
