import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={13}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 13"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path
      d="M1.64 7.321A4.354 4.354 0 0 0 6 11.691a4.354 4.354 0 0 0 4.36-4.37.47.47 0 0 0-.488-.493c-.278 0-.464.205-.464.493A3.4 3.4 0 0 1 6 10.734a3.396 3.396 0 0 1-3.403-3.413c0-1.904 1.504-3.413 3.388-3.413.323 0 .62.025.87.078L5.525 5.305a.446.446 0 0 0-.131.322c0 .269.2.474.463.474a.438.438 0 0 0 .332-.132l2.007-2.022a.481.481 0 0 0 0-.703L6.19 1.208a.428.428 0 0 0-.332-.142.467.467 0 0 0-.463.479c0 .127.043.24.126.327L6.703 3.04a3.656 3.656 0 0 0-.718-.068A4.331 4.331 0 0 0 1.64 7.32Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgComponent;
