import React from 'react';
import { DialectLogo } from '../Icon';
import cs from '../../utils/classNames';

export const TEXT_STYLES = {
  regular13: 'text-sm font-normal',
  medium13: 'text-sm font-medium',
  medium15: 'text-base font-medium',
  bold30: 'text-3xl font-bold',
};

export function Divider(): JSX.Element {
  return <div className="h-px bg-gray-200" />;
}

export function ValueRow(props: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cs('flex flex-row justify-between', props.className)}>
      <span className={cs(TEXT_STYLES.regular13)}>{props.label}:</span>
      <span className={cs(TEXT_STYLES.medium13)}>{props.children}</span>
    </p>
  );
}

export function Footer(props: { showBackground: boolean }): JSX.Element {
  return (
    <div
      className={cs(
        'w-40 py-1 inline-flex items-center justify-center absolute bottom-3 left-0 right-0 mx-auto uppercase rounded-full',
        props.showBackground && 'bg-black/5'
      )}
      style={{ fontSize: '10px' }}
    >
      Powered by <DialectLogo className="ml-px -mr-1" />
    </div>
  );
}

export function Centered(props: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      {props.children}
    </div>
  );
}
