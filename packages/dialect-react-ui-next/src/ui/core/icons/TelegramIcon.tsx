import { SVGProps } from 'react';

export const TelegramIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M14.866 2.462l-2.51 10.342a.778.778 0 01-1.111.506L8.07 11.672l-1.5 2.455c-.409.67-1.442.379-1.442-.403v-2.736c0-.211.088-.413.24-.56l6.186-5.905c-.005-.074-.084-.138-.163-.084l-7.38 5.137-2.48-1.28a.777.777 0 01.045-1.401l12.226-5.329a.776.776 0 011.063.896z"
        fill="currentColor"
      />
    </svg>
  );
};
