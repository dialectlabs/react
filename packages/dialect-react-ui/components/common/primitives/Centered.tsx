import { useTheme } from '../providers/DialectThemeProvider';
import clsx from 'clsx';
import type { ReactNode } from 'react';

export default function Centered(props: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  const { textStyles } = useTheme();

  return (
    <div
      className={clsx(
        'dt-h-full dt-flex dt-flex-col dt-items-center dt-justify-center',
        textStyles.body,
        props?.className
      )}
    >
      {props.children}
    </div>
  );
}
