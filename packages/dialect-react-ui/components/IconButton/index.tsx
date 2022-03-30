import React from 'react';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';

type IconButtonPropsType = {
  icon: JSX.Element;
  className?: string;
  style?: object;
  onClick: () => void;
};

export default React.forwardRef(function IconButton(
  props: IconButtonPropsType,
  ref: React.ForwardedRef<HTMLButtonElement>
): JSX.Element {
  const { iconButton } = useTheme();
  return (
    <div className={cs(' relative', props.className)} style={props.style}>
      <button
        ref={ref}
        className={iconButton}
        onClick={(event) => {
          event.preventDefault();
          props?.onClick && props?.onClick();
        }}
      >
        {props.icon}
      </button>
    </div>
  );
});
