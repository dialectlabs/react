import type { SVGProps } from 'react';

const SvgTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio='xMidYMid'
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      d="M4 7h16m-1 0-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7h14Zm-9 4v6-6Zm4 0v6-6Zm1-4V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3h6Z"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SvgTrash;
