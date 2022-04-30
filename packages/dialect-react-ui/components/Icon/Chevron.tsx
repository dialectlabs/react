import type { SVGProps } from 'react';

const SvgChevron = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={7}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M11 6 6 1 1 6" stroke="currentColor" />
  </svg>
);

export default SvgChevron;
