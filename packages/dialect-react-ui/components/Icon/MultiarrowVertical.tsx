import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path d="M17 14L11 20L5 14" stroke="currentColor" strokeWidth="2" />
    <path d="M17 8L11 14L5 8" stroke="currentColor" strokeWidth="2" />
    <path d="M17 2L11 8L5 2" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default SvgComponent;
