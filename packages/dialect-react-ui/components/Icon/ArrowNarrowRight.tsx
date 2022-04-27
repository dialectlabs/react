import type { SVGProps } from 'react';

const SvgArrowNarrowRight = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="arrow-narrow-right_svg__h-6 arrow-narrow-right_svg__w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m17 8 4 4m0 0-4 4m4-4H3"
    />
  </svg>
);

export default SvgArrowNarrowRight;
