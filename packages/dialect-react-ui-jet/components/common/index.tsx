import React from 'react';
import { DialectLogo, Spinner as SpinnerIcon } from '../Icon';
import cs from '../../utils/classNames';

export type ThemeType = 'dark' | 'night' | 'light' | undefined;

export const JET_BOX_SHADOW = '-2px -2px 2px #FFFFFF, 2px 2px 4px #C2CBE1';

export const BG_COLOR_MAPPING = {
  dark: 'bg-black',
  night: 'bg-night',
  light: 'bg-[#E5EBF4]',
};

export const TEXT_COLOR_MAPPING = {
  dark: 'text-white',
  night: 'text-white',
  light: 'text-black',
};

export const TEXT_STYLES = {
  regular11: 'font-inter text-xs font-normal',
  regular13: 'font-inter text-sm font-normal',
  regular24: 'font-poppins text-2xl font-normal',
  medium13: 'font-inter text-sm font-medium',
  medium15: 'font-inter text-base font-medium',
  bold30: 'font-inter text-3xl font-bold',

  h1: 'font-poppins text-xl font-normal',
  body: 'font-sans text-sm leading-snug text-[#444444]',
  small: 'font-sans text-[13px] leading-snug text-[#444444]',
  bigText: 'text-base font-medium leading-snug text-[#444444]',
  header: 'font-poppins text-lg text-[#5895B9]',
  button: 'text-[#E6EBF3]',
  buttonText: 'text-xs uppercase tracking-[1.5px] text-[#E6EBF3]',
};

export function Divider(props: { className?: string }): JSX.Element {
  return (
    <div
      className={cs('h-[4px] rounded-lg', props.className)}
      style={{
        backgroundImage: 'linear-gradient(180deg, #C3CADE 0%, #F8F9FB 100%)',
      }}
    />
  );
}

export function ValueRow(props: {
  label: string;
  children: React.ReactNode;
  forTheme?: 'dark' | 'light';
  highlighted?: boolean;
  className?: string;
}) {
  const bgColor = props.forTheme === 'dark' ? 'bg-white/5' : 'bg-white/30';

  return (
    <p
      className={cs(
        'flex flex-row justify-between',
        props.highlighted && bgColor,
        props.highlighted && 'px-2 py-1 rounded-lg',

        props.className
      )}
    >
      <span className={cs(TEXT_STYLES.body)}>{props.label}:</span>
      <span className={cs(TEXT_STYLES.body)}>{props.children}</span>
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
      Powered by <DialectLogo className="-mr-1 -mt-px" />
    </div>
  );
}

export function Centered(props: { children: React.ReactNode }): JSX.Element {
  return (
    <div
      className={cs(
        'h-full flex flex-col items-center justify-center',
        TEXT_STYLES.body
      )}
    >
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
  forTheme?: 'dark' | 'light';
  children: React.ReactNode;
}): JSX.Element {
  return (
    <button
      className={cs(
        'min-w-120 px-4 py-2 rounded-lg transition-all flex flex-row justify-center bg-gradient',
        !props.loading && 'hover:opacity-60',
        props.loading && 'opacity-20 bg-transparent',
        props.forTheme === 'dark' &&
          !props.loading &&
          'bg-white text-black border-white',
        props.forTheme === 'light' &&
          !props.loading &&
          'bg-black text-white border-black',
        TEXT_STYLES.buttonText,
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
        'w-full px-4 py-3 rounded-lg transition-all',
        !props.loading && 'hover:opacity-60',
        props.loading && 'opacity-20',
        TEXT_STYLES.button,
        props.className
      )}
      style={{ borderColor: 'currentColor' }}
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col items-start">
          <p className={TEXT_STYLES.buttonText}>{props.heading}</p>
          <p className={TEXT_STYLES.buttonText}>{props.description}</p>
        </div>
        <div>{!props.loading ? props.icon : <Loader />}</div>
      </div>
    </button>
  );
}
