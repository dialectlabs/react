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
}: Props) => {
  const { outlinedInput } = useTheme();

  return (
    <div className={clsx('dt-flex', outlinedInput)}>
      <input
        className={clsx('dt-w-full dt-bg-transparent dt-outline-0')}
        placeholder={placeholder}
        type="text"
        value={value}
        onChange={onChange}
      />
      {rightAdornment && (
        <div className="dt-flex dt-gap-1 dt-pl-2">{rightAdornment}</div>
      )}
    </div>
  );
};

export default OutlinedInput;
