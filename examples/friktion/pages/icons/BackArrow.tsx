import * as React from 'react';
import { SVGProps } from 'react';

const SvgBackArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={20}
    height={20}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M18 10H2m0 0 6-6m-6 6 6 6"
      stroke="url(#back-arrow_svg__a)"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="back-arrow_svg__a"
        x1={2}
        y1={10.45}
        x2={18}
        y2={10.45}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#70BBA0" />
        <stop offset={1} stopColor="#56A2CE" />
      </linearGradient>
    </defs>
  </svg>
);

export default SvgBackArrow;
