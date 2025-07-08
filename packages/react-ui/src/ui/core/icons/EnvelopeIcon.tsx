import { SVGProps } from 'react';

export const EnvelopeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 14 14"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M1.313 2h11.374C13.399 2 14 2.602 14 3.313c0 .437-.219.82-.547 1.066L7.52 8.836a.862.862 0 0 1-1.067 0L.52 4.379A1.309 1.309 0 0 1 0 3.313C0 2.602.574 2 1.313 2ZM0 5.063l5.934 4.484a1.764 1.764 0 0 0 2.105 0L14 5.062v5.688c0 .984-.793 1.75-1.75 1.75H1.75C.766 12.5 0 11.734 0 10.75V5.062Z"
    />
  </svg>
);
