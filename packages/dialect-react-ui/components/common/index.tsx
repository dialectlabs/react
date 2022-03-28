import React, { useEffect, useState } from 'react';
import { ownerFetcher } from '@dialectlabs/web3';
import { useApi } from '@dialectlabs/react';
import useSWR from 'swr';
import cs from '../../utils/classNames';
import IconButton from '../IconButton';
import { DialectLogo } from '../Icon';
import { useTheme } from './ThemeProvider';

export function Divider(props: { className?: string }): JSX.Element {
  const { divider } = useTheme();

  return <div className={cs(divider, props.className)} />;
}

export function ValueRow(props: {
  label: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const { colors, textStyles, highlighted } = useTheme();

  return (
    <p
      className={cs(
        'flex flex-row justify-between',
        colors.highlight,
        highlighted,
        props.className
      )}
    >
      <span className={cs(textStyles.body)}>{props.label}</span>
      <span className={cs(textStyles.body)}>{props.children}</span>
    </p>
  );
}

export function Footer(): JSX.Element {
  const { colors } = useTheme();

  return (
    <div
      className={cs(
        'w-[8.5rem] py-1 inline-flex items-center justify-center absolute bottom-3 left-0 right-0 mx-auto uppercase rounded-full',
        colors.highlight
      )}
      style={{ fontSize: '10px' }}
    >
      Powered by{' '}
      <a href="https://dialect.to" target="_blank" rel="noreferrer">
        <DialectLogo className="-mr-1 ml-[3px]" />
      </a>
    </div>
  );
}

export function Centered(props: { children: React.ReactNode }): JSX.Element {
  const { textStyles } = useTheme();

  return (
    <div
      className={cs(
        'h-full flex flex-col items-center justify-center',
        textStyles.body
      )}
    >
      {props.children}
    </div>
  );
}

export function Loader() {
  const { icons } = useTheme();
  return <icons.spinner className="animate-spin" />;
}

export function Button(props: {
  defaultStyle?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  const { button, buttonLoading, textStyles } = useTheme();
  const defaultStyle = props.defaultStyle || button;

  return (
    <button
      className={cs(
        'min-w-120 px-4 py-2 rounded-lg transition-all flex flex-row items-center justify-center',
        textStyles.buttonText,
        !props.loading ? defaultStyle : buttonLoading,
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
  const { bigButton, bigButtonLoading, textStyles } = useTheme();

  return (
    <button
      className={cs(
        'w-full px-4 py-3 rounded-lg transition-all',
        !props.loading ? bigButton : bigButtonLoading,
        props.className
      )}
      style={{ borderColor: 'currentColor' }}
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
    >
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-col items-start">
          <p className={textStyles.bigButtonText}>{props.heading}</p>
          <p className={textStyles.bigButtonSubtle}>{props.description}</p>
        </div>
        <div>{!props.loading ? props.icon : <Loader />}</div>
      </div>
    </button>
  );
}

export function Toggle({ checked, onClick, ...props }) {
  const [isChecked, setChecked] = useState<boolean>(checked);
  const { colors } = useTheme();

  useEffect(() => setChecked(checked), [checked]);

  return (
    <label className="flex items-center cursor-pointer relative h-5 w-10">
      <input
        type="checkbox"
        className="appearance-none opacity-0 w-0 h-0"
        checked={checked}
        onChange={() => {
          setChecked((prev) => !prev);
          onClick();
        }}
        {...props}
      />
      {/* Background */}
      <span
        className={cs(
          'h-5 w-10 rounded-full',
          isChecked ? colors.toggleBackgroundActive : colors.toggleBackground
        )}
      ></span>
      {/* Thumb */}
      <span
        className={cs(
          'absolute top-0.5 left-0.5 rounded-full h-4 w-4 transition shadow-sm',
          colors.toggleThumb,
          isChecked ? 'translate-x-[120%]' : ''
        )}
      ></span>
    </label>
  );
}

export function Accordion(props: {
  title: React.ReactNode | string;
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
}) {
  const { textStyles, colors, icons } = useTheme();
  const [isExpanded, setExpanded] = useState(props.defaultExpanded);

  return (
    <div className={props?.className}>
      <div
        // onClick={() => setExpanded((prev) => !prev)}
        className={cs(textStyles.bigText, 'w-full flex justify-between mb-1')}
      >
        {props.title}
        {/* <IconButton
          icon={<icons.chevron />}
          className={cs(
            'rounded-full w-6 h-6 flex items-center justify-center',
            colors.highlight,
            !isExpanded && 'rotate-180'
          )}
        /> */}
      </div>
      <Divider className="mb-2" />
      {isExpanded ? props.children : null}
    </div>
  );
}

export const useBalance = () => {
  const { wallet, program } = useApi();

  const { data, error } = useSWR(
    program?.provider.connection && wallet
      ? ['/owner', wallet, program?.provider.connection]
      : null,
    ownerFetcher
  );
  const balance = data?.lamports ? (data.lamports / 1e9).toFixed(2) : null;

  return { balance, error };
};
