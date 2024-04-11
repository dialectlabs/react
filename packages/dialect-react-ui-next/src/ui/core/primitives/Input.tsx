import clsx from 'clsx';
import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useMemo,
} from 'react';
import { generateIdRandom } from '../../../utils';
import { ClassTokens } from '../../theme';

export interface InputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
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
  const inputId = useMemo(() => id || `dt-input-${generateIdRandom()}`, [id]);

  return (
    <div className="dt-flex dt-flex-col dt-gap-2">
      {label && (
        <label
          htmlFor={inputId}
          className={clsx(
            'dt-label dt-text-subtext dt-font-semibold',
            ClassTokens.Text.Tertiary,
          )}
        >
          {label}
        </label>
      )}
      <div
        role="textbox"
        className={clsx(
          'dt-flex dt-h-[42px] dt-items-center dt-gap-2 dt-border dt-pl-2 dt-pr-1.5',
          ClassTokens.Radius.Small,
          error
            ? ClassTokens.Stroke.Input.Error
            : ClassTokens.Stroke.Input.Primary,
          !error && ClassTokens.Stroke.Input.Focused,
          ClassTokens.Background.Input.Secondary,
        )}
      >
        <input
          id={inputId}
          type="text"
          className={clsx(
            'dt-input dt-ml-1 dt-w-full dt-bg-transparent dt-text-text dt-font-medium dt-outline-none',
            ClassTokens.Text.Primary,
          )}
          {...inputProps}
        />
        {rightAdornment && (
          <div className="dt-flex dt-items-center">{rightAdornment}</div>
        )}
      </div>
    </div>
  );
};
