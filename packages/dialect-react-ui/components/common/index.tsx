import React from 'react';
import { DialectLogo } from '../Icon';
import cs from '../../utils/classNames';
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
        'dt-flex dt-flex-row dt-justify-between',
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
        'dt-w-[8.5rem] dt-py-1 dt-inline-flex dt-items-center dt-justify-center dt-absolute dt-bottom-3 dt-left-0 dt-right-0 dt-mx-auto dt-uppercase dt-rounded-full',
        colors.highlight
      )}
      style={{ fontSize: '10px' }}
    >
      Powered by{' '}
      <a href="https://dialect.to" target="_blank" rel="noreferrer">
        <DialectLogo className="-dt-mr-1 ml-[3px]" />
      </a>
    </div>
  );
}

export function Centered(props: { children: React.ReactNode }): JSX.Element {
  const { textStyles } = useTheme();

  return (
    <div
      className={cs(
        'dt-h-full dt-flex dt-flex-col dt-items-center dt-justify-center',
        textStyles.body
      )}
    >
      {props.children}
    </div>
  );
}

export function Loader() {
  const { icons } = useTheme();
  return <icons.spinner className="dt-animate-spin" />;
}

export function Button(props: {
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  const { button, buttonLoading, textStyles } = useTheme();

  return (
    <button
      className={cs(
        'min-w-120 dt-px-4 dt-py-2 dt-rounded-lg dt-transition-all dt-flex dt-flex-row dt-items-center dt-justify-center',
        textStyles.buttonText,
        !props.loading ? button : buttonLoading,
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
        'dt-w-full dt-px-4 dt-py-3 dt-rounded-lg dt-transition-all',
        !props.loading ? bigButton : bigButtonLoading,
        props.className
      )}
      style={{ borderColor: 'currentColor' }}
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
    >
      <div className="dt-flex dt-flex-row dt-justify-between dt-items-center">
        <div className="dt-flex dt-flex-col dt-items-start">
          <p className={textStyles.bigButtonText}>{props.heading}</p>
          <p className={textStyles.bigButtonSubtle}>{props.description}</p>
        </div>
        <div>{!props.loading ? props.icon : <Loader />}</div>
      </div>
    </button>
  );
}
