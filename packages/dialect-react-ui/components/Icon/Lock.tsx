import type { SVGProps } from 'react';

const SvgLock = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7.746 20.1h8.5c1.177 0 1.757-.58 1.757-1.854v-6.565c0-1.152-.483-1.75-1.45-1.846v-2.17c0-3.34-2.224-4.95-4.562-4.95-2.329 0-4.553 1.61-4.553 4.95V9.87c-.905.14-1.45.72-1.45 1.81v6.566c0 1.274.58 1.855 1.758 1.855ZM9.108 7.498c0-2.065 1.31-3.182 2.883-3.182 1.574 0 2.892 1.117 2.892 3.182v2.33l-5.775.008V7.497Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgLock;
