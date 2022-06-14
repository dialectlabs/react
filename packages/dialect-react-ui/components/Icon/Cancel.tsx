import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={12}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 12"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path
      d="M9.5 3.705 8.795 3 6 5.795 3.205 3l-.705.705L5.295 6.5 2.5 9.295l.705.705L6 7.205 8.795 10l.705-.705L6.705 6.5 9.5 3.705Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgComponent;
