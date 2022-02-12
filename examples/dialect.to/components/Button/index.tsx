import React from 'react';

export const BUTTON_STYLES =
  'flex items-center transition ease-in-out duration-300 uppercase text-white text-lg border border-white rounded-full py-2 px-6 font-semibold hover:text-black hover:bg-white';

export default function Button(props: {
  children: React.ReactNode;
}): JSX.Element {
  return <button className={BUTTON_STYLES}>{props.children}</button>;
}
