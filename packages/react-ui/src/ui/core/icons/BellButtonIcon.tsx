import { SVGProps } from 'react';
export const BellButtonIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    viewBox="0 0 18 18"
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#a)">
      <path d="M10.14 1.925a1.3 1.3 0 1 0-2.279.006c-2.532.504-4.436 2.766-4.436 5.445v.664c0 1.642-.629 3.25-1.712 4.473l-.245.28c-.314.35-.384.803-.21 1.223.175.384.595.629 1.05.629h13.42c.419 0 .838-.245 1.013-.63.175-.419.105-.873-.21-1.222l-.244-.28a6.768 6.768 0 0 1-1.678-4.473v-.664c0-2.69-1.92-4.96-4.468-5.451ZM9.017 18c.594 0 1.154-.21 1.573-.63.42-.419.664-1.013.664-1.607H6.781c0 .594.21 1.188.629 1.608.419.42 1.013.629 1.607.629Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h18v18H0z" />
      </clipPath>
    </defs>
  </svg>
);
