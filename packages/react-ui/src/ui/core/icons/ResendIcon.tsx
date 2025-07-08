import { SVGProps } from 'react';

export const ResendIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    fill="none"
    viewBox="0 0 14 14"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.96}
      strokeWidth={1.5}
      d="M12.5 4v3.5H9"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeOpacity={0.96}
      strokeWidth={1.5}
      d="M2 9.833a5.25 5.25 0 0 1 5.25-5.25 5.25 5.25 0 0 1 3.5 1.342L12.5 7.5"
    />
  </svg>
);
