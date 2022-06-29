import type { SVGProps } from 'react';

const SvgEncrypted = (props: SVGProps<SVGSVGElement>) => (
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
      d="M3.333 5.25V4c0-1.38 1.194-2.5 2.667-2.5 1.473 0 2.667 1.12 2.667 2.5v1.25H10v6.25H2V5.25h1.333ZM4.667 4c0-.69.597-1.25 1.333-1.25S7.333 3.31 7.333 4v1.25H4.667V4Zm.666 5.625v-2.5h1.334v2.5H5.333Z"
      fill="currentColor"
    />
  </svg>
);

export default SvgEncrypted;
