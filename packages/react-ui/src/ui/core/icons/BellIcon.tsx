import { SVGProps } from 'react';
export const BellIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    fill="none"
    {...props}
  >
    <g fill="currentColor" clipPath="url(#a)">
      <path d="M6.76 1.283a.867.867 0 1 0-1.519.004 3.702 3.702 0 0 0-2.957 3.63v.443c0 1.095-.42 2.167-1.142 2.982l-.163.186a.754.754 0 0 0-.14.816c.117.256.396.42.7.42h8.946c.28 0 .56-.164.676-.42a.754.754 0 0 0-.14-.816l-.163-.186A4.512 4.512 0 0 1 9.74 5.36v-.443a3.702 3.702 0 0 0-2.98-3.634ZM6.012 12c.396 0 .769-.14 1.048-.42.28-.279.443-.675.443-1.071H4.52c0 .396.14.792.42 1.072.28.28.676.419 1.072.419Z" />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
);
