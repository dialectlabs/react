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
}

export const Input = ({
  id,
  label,
  rightAdornment,
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
          'dt-rounded-xl dt-border dt-px-2 dt-h-12 dt-flex dt-items-center dt-gap-2',
          ClassTokens.Stroke.Input.Primary,
          ClassTokens.Background.Input.Secondary,
        )}
      >
        <input
          id={inputId}
          type="text"
          className={clsx(
            'dt-input dt-text-text dt-font-medium dt-outline-none dt-bg-transparent dt-w-full dt-ml-1',
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
