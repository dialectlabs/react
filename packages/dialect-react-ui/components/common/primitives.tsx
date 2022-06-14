import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import clsx from 'clsx';
import { ownerFetcher } from '@dialectlabs/web3';
import { useApi } from '@dialectlabs/react';
import useSWR from 'swr';
import cs from '../../utils/classNames';
import { useTheme } from './providers/DialectThemeProvider';
import { A, ButtonBase, Label, P } from './preflighted';
import { DialectLogo } from '../Icon';

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
    <div className="dt-flex dt-justify-center dt-py-3">
      <div
        className={cs(
          'dt-px-3 dt-py-1 dt-inline-flex dt-items-center dt-justify-center dt-uppercase dt-rounded-full dt-text-[10px]',
          colors.highlightSolid
        )}
      >
        Powered by{' '}
        <A
          href="https://dialect.to"
          target="_blank"
          rel="noreferrer"
          className="hover:dt-text-inherit"
        >
          <DialectLogo className="dt-ml-[3px] -dt-mt-[1px]" />
        </A>
      </div>
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

export function Loader(props: { className?: string }) {
  const { icons } = useTheme();
  return <icons.spinner className={clsx('dt-animate-spin', props.className)} />;
}

export function ButtonLink({
  className,
  ...props
}: { className?: string } & React.ComponentPropsWithoutRef<'button'>) {
  const { linkButton } = useTheme();
  return (
    <button className={clsx(linkButton, className)} {...props}>
      {props.children}
    </button>
  );
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
  const { button, buttonLoading, disabledButton, textStyles } = useTheme();
  const defaultClassName = props.defaultStyle || button;
  const loadingClassName = props.loadingStyle || buttonLoading;

  return (
    <ButtonBase
      className={cs(
        'dt-min-w-120 dt-px-4 dt-py-2 dt-rounded-lg dt-transition-all dt-flex dt-flex-row dt-items-center dt-justify-center',
        textStyles.buttonText,
        props.disabled ? disabledButton : defaultClassName,
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
    <Label
      className={clsx(
        props.disabled ? 'dt-cursor-not-allowed' : 'dt-cursor-pointer',
        'dt-flex dt-items-center dt-relative dt-h-5 dt-w-10'
      )}
    >
      <input
        type="checkbox"
        className="dt-input dt-appearance-none dt-opacity-0 dt-w-0 dt-h-0"
        checked={checked}
        onChange={async () => {
          const nextValue = !checked;
          await onClick();
          setChecked(nextValue);
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
          'dt-absolute dt-top-1 dt-left-1 dt-rounded-full dt-h-3 dt-w-3 dt-transition dt-shadow-sm',
          colors.toggleThumb,
          isChecked ? 'dt-translate-x-[160%]' : ''
        )}
      />
    </Label>
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
