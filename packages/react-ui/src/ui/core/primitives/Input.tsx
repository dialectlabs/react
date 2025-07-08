import clsx from 'clsx';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useId,
} from 'react';
import { ClassTokens } from '../../theme';
import { Label } from './Label';

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string | ((inputId: string) => ReactNode);
  rightAdornment?: ReactNode;
  error?: boolean;
}

export const Input = ({
  id,
  label,
  rightAdornment,
  error = false,
  ...inputProps
}: InputProps) => {
  const generatedId = useId();
  const inputId = id || `dt-input-${generatedId}`;

  return (
    <div className="dt-flex dt-flex-col dt-gap-2">
      {typeof label === 'string' ? (
        <Label htmlFor={inputId} className="dt-mb-2">
          {label}
        </Label>
      ) : (
        label?.(inputId)
      )}
      <div
        role="textbox"
        className={clsx(
          'dt-flex dt-h-[38px] dt-items-center dt-gap-2 dt-border dt-px-3',
          ClassTokens.Radius.Medium,
          error
            ? ClassTokens.Stroke.Input.Error
            : ClassTokens.Stroke.Input.Primary,
          !error && !inputProps.disabled && ClassTokens.Stroke.Input.Focused,
          ClassTokens.Background.Input.Secondary,
        )}
      >
        <input
          id={inputId}
          type={inputProps.type || 'text'}
          className={clsx(
            'dt-input dt-select dt-w-full dt-bg-transparent dt-text-text dt-font-normal dt-outline-none',
            ClassTokens.Text.Primary,
            ClassTokens.Text.Input.Placeholder,
          )}
          placeholder={inputProps.placeholder}
          {...inputProps}
        />
        {rightAdornment && (
          <div className="dt-flex dt-items-center">{rightAdornment}</div>
        )}
      </div>
    </div>
  );
};
