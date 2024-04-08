import clsx from 'clsx';
import { ClassTokens } from '../../theme';
import { CheckIcon } from '../icons';

export interface CheckboxProps {
  children?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (newValue: boolean) => void;
}

export const Checkbox = ({
  children,
  checked = false,
  disabled = false,
  onChange,
}: CheckboxProps) => {
  const onClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <label
      className="dt-label dt-inline-flex dt-items-center dt-gap-2 dt-text-subtext dt-font-semibold"
      onClick={onClick}
    >
      <input type="hidden" checked={checked} onChange={onClick} />
      <span
        className={clsx(
          'dt-flex dt-h-5 dt-w-5 dt-items-center dt-justify-center dt-rounded-sm dt-border-2 dt-transition-colors dt-ease-in-out',
          checked
            ? ClassTokens.Background.Input.Checked
            : ClassTokens.Background.Primary,
          checked
            ? ClassTokens.Stroke.Input.Checked
            : ClassTokens.Stroke.Input.Primary,
          ClassTokens.Icon.Inverse,
          { 'dt-opacity-50': disabled },
        )}
      >
        {checked && <CheckIcon />}
      </span>
      {children}
    </label>
  );
};
