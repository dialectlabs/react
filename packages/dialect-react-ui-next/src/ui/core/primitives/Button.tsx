import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export const Button = (props: ButtonProps): JSX.Element => {
  return (
    <button
      className={clsx(
        'dt-flex dt-items-center dt-justify-center dt-gap-1.5 dt-rounded-lg dt-p-2',
        ClassTokens.Background.Button.Default,
        ClassTokens.Background.Button.Hover,
        ClassTokens.Background.Button.Pressed,
        ClassTokens.Text.Button.Disabled,
        ClassTokens.Background.Button.Disabled,
      )}
      onClick={props.onClick}
      disabled={props.disabled || props.loading}
    >
      {props.loading ? (
        <>
          Loading <Icons.Loader />
        </>
      ) : (
        props.children
      )}
    </button>
  );
};
