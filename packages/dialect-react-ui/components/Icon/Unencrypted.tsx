import type { SVGProps } from 'react';

const SvgUnecrypted = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={12}
    height={13}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 12 13"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.75 2.75a.951.951 0 0 0-.964.938V5.25h1.928v6.25H2V5.25h4.5V3.687C6.5 2.48 7.507 1.5 8.75 1.5S11 2.48 11 3.688V4H9.714v-.313a.951.951 0 0 0-.964-.937Zm-1.607 5H4.57V9h2.572V7.75Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgUnecrypted;
