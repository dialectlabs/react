import React from 'react';
import cs from '../../utils/classNames';
import { ButtonBase } from '../common/preflighted';
import { useTheme } from '../common/ThemeProvider';

type IconButtonPropsType = {
  icon: JSX.Element;
  className?: string;
  style?: object;
  onClick: () => void;
};

type ButtonProps = React.HTMLProps<HTMLButtonElement> & IconButtonPropsType;

export default React.forwardRef<HTMLButtonElement, ButtonProps>(
  function IconButton(props, ref): JSX.Element {
    const { iconButton } = useTheme();
    return (
      <div className={cs('dt-relative', props.className)} style={props.style}>
        <ButtonBase
          ref={ref}
          className={iconButton}
          onClick={(event) => {
            event.preventDefault();
            props?.onClick?.();
          }}
        >
          {props.icon}
        </ButtonBase>
      </div>
    );
  }
);
