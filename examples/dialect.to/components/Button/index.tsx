import React from 'react';

export default function Button(props: any): JSX.Element {
  return (
    <button className="flex items-center transition ease-in-out duration-300 uppercase text-white text-lg border border-white rounded-full py-2 px-6 font-semibold hover:text-black hover:bg-white">
      {props.children}
    </button>
  );
}
