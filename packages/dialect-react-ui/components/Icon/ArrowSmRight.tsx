import type { SVGProps } from 'react';

const SvgArrowSmRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="arrow-sm-right_svg__h-6 arrow-sm-right_svg__w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m13 7 5 5m0 0-5 5m5-5H6"
    />
  </svg>
);

export default SvgArrowSmRight;
