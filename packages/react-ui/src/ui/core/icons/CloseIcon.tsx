import { SVGProps } from 'react';

export const CloseIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={17}
    height={16}
    viewBox="0 0 17 16"
    fill="none"
    {...props}
  >
    <path
      d="M13.646 3.9L9.524 8.02l4.088 4.088a.752.752 0 010 1.133.752.752 0 01-1.134 0L8.356 9.155 4.27 13.242a.752.752 0 01-1.133 0c-.344-.309-.344-.824 0-1.167l4.087-4.088L3.136 3.9c-.344-.31-.344-.825 0-1.168.309-.31.824-.31 1.167 0l4.088 4.122 4.087-4.088c.31-.343.825-.343 1.168 0 .31.31.31.825 0 1.134z"
      fill="currentColor"
    />
  </svg>
);
