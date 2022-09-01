import clsx from 'clsx';
import { useTheme } from './providers/DialectThemeProvider';
import { Divider } from './primitives';
import type { ReactNode } from 'react';

export default function Section(props: {
  title: ReactNode | string;
  children: ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}) {
  const { textStyles, sectionHeader, xPaddedText } = useTheme();

  return (
    <div className={props?.className}>
      <Divider className="dt-mb-2" />
      <div
        className={clsx(
          textStyles.bigText,
          sectionHeader,
          'dt-w-full dt-flex dt-justify-between dt-py-2 dt-mb-1'
        )}
      >
        {props.title}
      </div>
      <Divider className="dt-mb-2" />
      {/* TODO: use unified classname for padded  */}
      <div className={clsx('dt-py-2', xPaddedText)}>{props.children}</div>
    </div>
  );
}
