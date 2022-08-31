import type { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import { DialectLogo } from '../Icon';
import { A, ButtonBase, Label } from './preflighted';
import { useTheme } from './providers/DialectThemeProvider';
import { UI_VERSION } from '../../version';
import { SDK_VERSION } from '@dialectlabs/react-sdk';

// TODO: TBD separate these components to separate files
export function Divider(props: { className?: string }): JSX.Element {
  const { divider } = useTheme();

  return <div className={clsx(divider, props.className)} />;
}

export function ValueRow(props: {
  label: string | React.ReactNode;
  children: React.ReactNode;
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

export function Footer(): JSX.Element {
  const { colors, textStyles } = useTheme();

  return (
    <div>
      <div className="dt-flex dt-justify-center dt-py-3">
        <div
          className={clsx(
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
      <div className="dt-px-4 dt-py-2 dt-flex dt-items-center dt-justify-center">
        <span className={clsx('dt-opacity-40', textStyles.small)}>
          {UI_VERSION} / {SDK_VERSION}
        </span>
      </div>
    </div>
  );
}

export function Centered(props: {
  children: React.ReactNode;
  className?: string;
}): JSX.Element {
  const { textStyles } = useTheme();

  return (
    <div
      className={clsx(
        'dt-h-full dt-flex dt-flex-col dt-items-center dt-justify-center',
        textStyles.body,
        props?.className
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
      className={clsx(
        'dt-min-w-120 dt-px-4 dt-py-2 dt-rounded-lg dt-flex dt-flex-row dt-items-center dt-justify-center',
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

type SIZE = 'S' | 'M';

export function Toggle({
  checked,
  onChange,
  toggleSize,
  ...props // TODO: adjust the styles for a disabled toggle
}: {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  toggleSize?: SIZE;
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange'
>) {
  const { colors } = useTheme();

  const size = toggleSize || 'M';
  const translate =
    size === 'M' ? 'dt-translate-x-[160%]' : 'dt-translate-x-3/4';

  return (
    <Label
      className={clsx(
        props.disabled ? 'dt-cursor-not-allowed' : 'dt-cursor-pointer',
        'dt-flex dt-items-center dt-relative dt-h-5 dt-w-10',
        size === 'M'
          ? 'dt-h-5 dt-w-10 dt-rounded-full'
          : 'dt-h-4 dt-w-7 dt-rounded-full'
      )}
    >
      <input
        type="checkbox"
        className="dt-input dt-appearance-none dt-opacity-0 !dt-w-0 !dt-h-0"
        {...props}
        checked={checked}
        onChange={() => onChange?.(!checked)}
      />
      {/* Background */}
      <span
        className={clsx(
          checked ? colors.toggleBackgroundActive : colors.toggleBackground,
          size === 'M'
            ? 'dt-h-5 dt-w-10 dt-rounded-full'
            : 'dt-h-4 dt-w-7 dt-rounded-full'
        )}
      />
      {/* Thumb */}
      <span
        className={clsx(
          'dt-absolute dt-top-1 dt-left-1 dt-rounded-full dt-h-3 dt-w-3 dt-transition dt-shadow-sm',
          colors.toggleThumb,
          checked ? translate : ''
        )}
      />
    </Label>
  );
}
