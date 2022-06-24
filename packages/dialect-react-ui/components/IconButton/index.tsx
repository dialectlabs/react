import clsx from 'clsx';
import { forwardRef, HTMLProps } from 'react';
import { ButtonBase } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';

type IconButtonPropsType = {
  icon: JSX.Element;
  className?: string;
  style?: object;
  onClick: HTMLProps<HTMLButtonElement>['onClick'];
};

type ButtonProps = HTMLProps<HTMLButtonElement> & IconButtonPropsType;

export default forwardRef<HTMLButtonElement, ButtonProps>(function IconButton(
  props,
  ref
): JSX.Element {
  const { iconButton } = useTheme();
  return (
    <div className={clsx('dt-relative', props.className)} style={props.style}>
      <ButtonBase
        ref={ref}
        className={iconButton}
        onClick={(event) => {
          event.preventDefault();
          props?.onClick?.(event);
        }}
      >
        {props.icon}
      </ButtonBase>
    </div>
  );
});
