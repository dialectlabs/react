import { useTheme } from '../providers/DialectThemeProvider';
import { ButtonBase } from '../preflighted';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import Loader from './Loader';

export default function Button(props: {
  defaultStyle?: string;
  loadingStyle?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
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
