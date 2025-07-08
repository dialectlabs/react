import { SVGProps } from 'react';

export const ExclamationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 14 14"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      clipPath="url(#a)"
    >
      <path d="M7 12.833A5.833 5.833 0 1 0 7 1.167a5.833 5.833 0 0 0 0 11.666ZM7 4.667V7M7 9.333h.007" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
