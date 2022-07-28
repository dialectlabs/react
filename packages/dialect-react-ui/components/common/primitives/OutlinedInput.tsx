import clsx from 'clsx';
import { useTheme } from '../providers/DialectThemeProvider';
import type { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';

type Props = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
> & {
  rightAdornment?: ReactNode;
};

const OutlinedInput = ({
  value,
  onChange,
  placeholder,
  rightAdornment,
  type = 'text',
  ...props
}: Props) => {
  const { textStyles, outlinedInput } = useTheme();

  return (
    <div className={clsx('dt-flex dt-items-center', outlinedInput)}>
      <input
        className={clsx(
          'dt-w-full dt-bg-transparent dt-outline-0',
          textStyles.input
        )}
        autoComplete="off"
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        {...props}
      />
      {rightAdornment && (
        <div className="dt-flex dt-gap-1 dt-pl-2">{rightAdornment}</div>
      )}
    </div>
  );
};

export default OutlinedInput;
