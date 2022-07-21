import { useTheme } from '../providers/DialectThemeProvider';
import clsx from 'clsx';
import type { ComponentPropsWithoutRef } from 'react';

export default function ButtonLink({
  className,
  ...props
}: { className?: string } & ComponentPropsWithoutRef<'button'>) {
  const { linkButton } = useTheme();
  return (
    <button className={clsx(linkButton, className)} {...props}>
      {props.children}
    </button>
  );
}
