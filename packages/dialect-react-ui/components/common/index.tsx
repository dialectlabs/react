import React from 'react';
import { DialectLogo, SpinnerIcon } from '../Icon';
import cs from '../../utils/classNames';

export const TEXT_STYLES = {
  regular13: 'font-inter text-sm font-normal',
  medium13: 'font-inter text-sm font-medium',
  medium15: 'font-inter text-base font-medium',
  bold30: 'font-inter text-3xl font-bold',
};

export function Divider(props: { className?: string }): JSX.Element {
  return (
    <div
      className={cs('h-px opacity-10', props.className)}
      style={{ backgroundColor: 'currentColor' }}
    />
  );
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

export function Loader() {
  return <SpinnerIcon className="animate-spin" />;
}

export function Button(props: {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <button
      className={cs(
        'min-w-120 px-4 py-2 rounded-lg transition-all border border-black flex flex-row justify-center',
        !props.loading && 'bg-black text-white hover:opacity-60',
        props.loading && 'opacity-20 bg-transparent text-black',
        props.className
      )}
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
    >
      {!props.loading ? props.children : <Loader />}
    </button>
  );
}

export function BigButton(props: {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  heading: React.ReactNode;
  description: React.ReactNode;
}): JSX.Element {
  return (
    <button
      className={cs(
        'w-full px-4 py-2 rounded-lg border transition-all',
        !props.loading && 'hover:opacity-60',
        props.loading && 'opacity-20',
        props.className
      )}
      style={{ borderColor: 'currentColor' }}
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col items-start">
          <p className={TEXT_STYLES.medium15}>{props.heading}</p>
          <p className={TEXT_STYLES.medium13}>{props.description}</p>
        </div>
        <div>{!props.loading ? props.icon : <Loader />}</div>
      </div>
    </button>
  );
}
