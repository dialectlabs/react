import React from 'react';
import clsx from 'clsx';
import { useTheme } from './ThemeProvider';
import { Divider } from './primitives';

export default function Section(props: {
  title: React.ReactNode | string;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}) {
  const { textStyles, xPaddedText } = useTheme();

  return (
    <div className={props?.className}>
      <Divider className="dt-mb-2" />
      <div
        className={clsx(
          textStyles.bigText,
          'dt-w-full dt-flex dt-justify-between dt-py-2 dt-px-4 dt-mb-1'
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
