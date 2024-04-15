import { SVGProps } from 'react';

export const BellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={16}
    height={16}
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.013 2.14a1.28 1.28 0 10-1.896 0h-.012c-2.19.36-3.84 2.25-3.84 4.5v1.02c0 1.35-.48 2.67-1.32 3.75l-.45.54c-.18.24-.21.54-.09.78s.36.39.66.39h12a.7.7 0 00.63-.39c.12-.24.09-.54-.09-.78l-.45-.54a6.108 6.108 0 01-1.29-3.75V6.64c0-2.25-1.68-4.14-3.84-4.5h-.012zM7.825 3.52h.48c1.71 0 3.12 1.41 3.12 3.12v1.02c0 1.44.39 2.82 1.17 4.02h-9.09c.78-1.2 1.2-2.58 1.2-4.02V6.64c0-1.71 1.38-3.12 3.12-3.12z"
      fill="currentColor"
    />
    <path
      d="M9.415 15.46c.36-.36.57-.87.57-1.38h-3.84c0 .51.18 1.02.54 1.38.36.36.87.54 1.38.54.51 0 .99-.18 1.35-.54z"
      fill="currentColor"
    />
  </svg>
);
