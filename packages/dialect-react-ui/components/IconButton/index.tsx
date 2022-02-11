import React from 'react';
import cs from '../../utils/classNames';

type IconButtonPropsType = {
  icon: JSX.Element;
  className?: string;
  style?: object;
  onClick: () => void;
};

type ButtonProps = React.HTMLProps<HTMLButtonElement>;

export default React.forwardRef(function IconButton(
  props: IconButtonPropsType,
  ref: React.RefObject<HTMLInputElement> | null
): JSX.Element {
  return (
    <div className={cs(' relative', props.className)} style={props.style}>
      <button
        ref={ref}
        className={
          'w-9 h-9 -m-2 flex items-center justify-center transition-all hover:opacity-60'
        }
        onClick={(event) => {
          event.preventDefault();
          props?.onClick();
        }}
      >
        {props.icon}
      </button>
    </div>
  );
});
