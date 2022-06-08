import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={8}
    height={8}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 8 8"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path d="m1 1 6 6M1 7l6-6" stroke="#DE5454" strokeWidth={2} />
  </svg>
);

export default SvgComponent;
