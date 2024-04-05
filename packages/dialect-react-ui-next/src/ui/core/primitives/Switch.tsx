import clsx from 'clsx';
import { ClassTokens } from '../../theme';

export interface SwitchProps {
  children?: string;
  checked: boolean;
  onChange?: (newValue: boolean) => void;
}

export const Switch = ({
  children,
  checked = false,
  onChange,
}: SwitchProps) => {
  return (
    <label
      className="dt-label dt-inline-flex dt-items-center dt-gap-2 dt-text-subtext dt-font-semibold"
      onClick={() => onChange?.(!checked)}
    >
      <input
        type="hidden"
        checked={checked}
        onChange={() => onChange?.(!checked)}
      />
      <span
        className={clsx(
          'dt-block dt-h-5 dt-w-8 dt-rounded-full dt-p-0.5 dt-transition-colors dt-ease-in-out',
          checked
            ? ClassTokens.Background.Input.Checked
            : ClassTokens.Background.Input.Unchecked,
        )}
      >
        <span
          className={clsx(
            'dt-block dt-h-4 dt-w-4 dt-transform dt-rounded-full dt-transition-transform dt-ease-in-out',
            ClassTokens.Background.Input.Secondary,
            checked ? 'dt-translate-x-3' : 'dt-translate-x-0',
          )}
        />
      </span>
      {children}
    </label>
  );
};
