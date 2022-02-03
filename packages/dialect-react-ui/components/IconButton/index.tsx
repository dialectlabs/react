import React from 'react';

type IconButtonPropsType = {
  icon: JSX.Element;
  className?: string;
  onClick: () => void;
};

export default function IconButton(props: IconButtonPropsType): JSX.Element {
  return (
    <div className={props.className}>
      <button
        className="w-9 w-9 -m-2 flex items-center justify-center transition-all hover:opacity-60"
        onClick={(event) => {
          event.preventDefault();
          props?.onClick();
        }}
      >
        {props.icon}
      </button>
    </div>
  );
}
