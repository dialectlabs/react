import type { SVGProps } from 'react';

const SvgSpinner = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.6 8A5.6 5.6 0 1 1 8 2.4"
      stroke="currentColor"
      strokeWidth={2.8}
      strokeLinecap="round"
    />
  </svg>
);

export default SvgSpinner;
