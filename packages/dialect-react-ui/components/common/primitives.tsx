import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import { ownerFetcher } from '@dialectlabs/web3';
import { useApi } from '@dialectlabs/react';
import useSWR from 'swr';
import cs from '../../utils/classNames';
import { DialectLogo } from '../Icon';
import { useTheme } from './ThemeProvider';
import { A, ButtonBase, P } from './preflighted';
import clsx from 'clsx';

// TODO: separate these components to separate files
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
    <div
      className={cs(
        'dt-flex dt-flex-row dt-justify-between',
        colors.highlight,
        highlighted,
        props.className
      )}
    >
      <span className={cs(textStyles.body)}>{props.label}</span>
      <span className={cs(textStyles.body)}>{props.children}</span>
    </div>
  );
}

export function Footer(): JSX.Element {
  const { colors } = useTheme();

  return (
    <div
      className={cs(
        'dt-w-[8.5rem] dt-py-1 dt-inline-flex dt-items-center dt-justify-center dt-absolute dt-bottom-3 dt-left-0 dt-right-0 dt-mx-auto dt-uppercase dt-rounded-full',
        colors.highlightSolid
      )}
      style={{ fontSize: '10px' }}
    >
      Powered by{' '}
      <A
        href="https://dialect.to"
        target="_blank"
        rel="noreferrer"
        className="hover:dt-text-inherit"
      >
        <DialectLogo className="-dt-mr-1 -dt-mt-1 dt-ml-[3px]" />
      </A>
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
  defaultStyle?: string;
  loadingStyle?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}): JSX.Element {
  const { button, buttonLoading, textStyles } = useTheme();
  const defaultClassName = props.defaultStyle || button;
  const loadingClassName = props.loadingStyle || buttonLoading;

  return (
    <ButtonBase
      className={cs(
        'dt-min-w-120 dt-px-4 dt-py-2 dt-rounded-lg dt-transition-all dt-flex dt-flex-row dt-items-center dt-justify-center',
        textStyles.buttonText,
        defaultClassName,
        props.loading && loadingClassName,
        props.className
      )}
      onClick={props.onClick}
      disabled={props.loading || props.disabled}
    >
      {!props.loading ? props.children : <Loader />}
    </ButtonBase>
  );
}

// TODO: Deprecate BigButton
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
    <ButtonBase
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
          <P className={textStyles.bigButtonText}>{props.heading}</P>
          <P className={textStyles.bigButtonSubtle}>{props.description}</P>
        </div>
        <div>{!props.loading ? props.icon : <Loader />}</div>
      </div>
    </ButtonBase>
  );
}

export function Toggle({
  checked,
  onClick,
  ...props
}: { checked: boolean; onClick: () => void } & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) {
  const [isChecked, setChecked] = useState<boolean>(checked);
  const { colors } = useTheme();

  useEffect(() => setChecked(checked), [checked]);

  return (
    <label
      className={clsx(
        props.disabled ? 'dt-cursor-not-allowed' : 'dt-cursor-pointer',
        'dt-flex dt-items-center dt-relative dt-h-5 dt-w-10'
      )}
    >
      <input
        type="checkbox"
        className="dt-input dt-appearance-none dt-opacity-0 dt-w-0 dt-h-0"
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
          'dt-h-5 dt-w-10 dt-rounded-full',
          isChecked ? colors.toggleBackgroundActive : colors.toggleBackground
        )}
      />
      {/* Thumb */}
      <span
        className={cs(
          'dt-absolute dt-top-0.5 dt-left-0.5 dt-rounded-full dt-h-4 dt-w-4 dt-transition dt-shadow-sm',
          colors.toggleThumb,
          isChecked ? 'dt-translate-x-[120%]' : ''
        )}
      />
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
        className={cs(
          textStyles.bigText,
          'dt-w-full dt-flex dt-justify-between dt-mb-1'
        )}
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
      <Divider className="dt-mb-2" />
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
