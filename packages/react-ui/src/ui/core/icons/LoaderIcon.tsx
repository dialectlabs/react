import clsx from 'clsx';
import { SVGProps } from 'react';

export const LoaderIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={14}
    height={14}
    viewBox="0 0 14 14"
    preserveAspectRatio="xMidYMid meet"
    fill="none"
    {...props}
    className={clsx('dt-animate-spin', props.className)}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12.25 7a5.25 5.25 0 1 1-3.628-4.993"
    />
  </svg>
);
