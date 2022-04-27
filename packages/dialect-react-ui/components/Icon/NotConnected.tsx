import type { SVGProps } from 'react';

const SvgNotConnected = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={38}
    height={39}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path stroke="currentColor" strokeWidth={2} d="m.707 2 34 34" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M22.243 20.707H27v-2h-6.757l2 2Zm-4.243 0-2-2h-5v2h7Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M38 19.707a9.004 9.004 0 0 1-6.984 8.774l-1.777-1.778A7 7 0 0 0 29 12.707h-7v-2h7a9 9 0 0 1 9 9Zm-25 7H9a7 7 0 1 1 0-14h2l-2-2a9 9 0 0 0 0 18h4v-2Zm9 0v2h5l-2-2h-3Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgNotConnected;
