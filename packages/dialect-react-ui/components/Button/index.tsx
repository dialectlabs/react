import React from 'react';

type IconButtonPropsType = {
  icon: JSX.Element;
  onClick: () => void;
};

export function IconButton(props: IconButtonPropsType): JSX.Element {
  return (
    <button
      className="hover:opacity-60"
      onClick={(event) => {
        event.preventDefault();
        props?.onClick();
      }}
    >
      {props.icon}
    </button>
  );
}
