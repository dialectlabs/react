import { SVGProps } from 'react';

export const ExclamationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.127 1.714v8.135c0 .624-.52 1.11-1.11 1.11-.624 0-1.109-.486-1.109-1.11V1.714c0-.59.485-1.11 1.11-1.11.589 0 1.109.52 1.109 1.11zm-1.11 13.681c-.52 0-.97-.242-1.213-.693-.243-.416-.243-.936 0-1.387a1.398 1.398 0 011.213-.693c.486 0 .936.277 1.179.693.243.451.243.971 0 1.387-.243.45-.693.693-1.179.693z"
      fill="#2A2A2B"
    />
  </svg>
);
