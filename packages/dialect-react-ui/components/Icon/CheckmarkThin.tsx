import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path
      d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7.00003L19.59 5.59003L9 16.17Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgComponent;