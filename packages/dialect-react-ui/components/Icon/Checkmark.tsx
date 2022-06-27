import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={10}
    height={8}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 10 8"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path
      d="m4 6-.707.707.707.707.707-.707L4 6ZM.793 4.207l2.5 2.5 1.414-1.414-2.5-2.5L.793 4.207Zm3.914 2.5 4.5-4.5L7.793.793l-4.5 4.5 1.414 1.414Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgComponent;
