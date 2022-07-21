import { useTheme } from '../providers/DialectThemeProvider';
import clsx from 'clsx';
import type { ReactNode } from 'react';

export default function ValueRow(props: {
  label: string | ReactNode;
  children: ReactNode;
  className?: string;
}) {
  const { colors, textStyles, highlighted } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-row dt-justify-between',
        colors.highlight,
        highlighted,
        props.className
      )}
    >
      <span className={clsx(textStyles.body)}>{props.label}</span>
      <span className={clsx(textStyles.body)}>{props.children}</span>
    </div>
  );
}
