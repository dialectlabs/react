import type { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6.4 1.458a2.93 2.93 0 1 1 4.142 4.143L8.895 7.248a2.93 2.93 0 0 1-4.143 0 .6.6 0 0 1 .849-.849 1.73 1.73 0 0 0 2.445 0l1.647-1.647a1.73 1.73 0 0 0-2.445-2.445l-.824.823a.6.6 0 1 1-.848-.848l.823-.824ZM3.104 4.752a2.93 2.93 0 0 1 4.143 0 .6.6 0 0 1-.849.849 1.73 1.73 0 0 0-2.445 0L2.307 7.248a1.73 1.73 0 0 0 2.445 2.446l.824-.824a.6.6 0 0 1 .848.849l-.823.823A2.93 2.93 0 1 1 1.458 6.4l1.647-1.647Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgComponent;
