import { SVGProps } from 'react';

export const TelegramIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      viewBox="0 0 14 14"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      {...props}
    >
      <g clipPath="url(#a)">
        <path
          fill="currentColor"
          d="m13.538 1.726-2.39 9.849a.74.74 0 0 1-1.058.482l-3.022-1.56-1.43 2.338c-.388.637-1.372.36-1.372-.384V9.846c0-.202.084-.394.23-.535l5.889-5.622c-.005-.07-.08-.131-.155-.08L3.202 8.501.841 7.283a.74.74 0 0 1 .042-1.336L12.526.873a.739.739 0 0 1 1.012.853Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M0 0h14v14H0z" />
        </clipPath>
      </defs>
    </svg>
  );
};
