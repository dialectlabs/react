import clsx from 'clsx';
import { AnchorHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';

export interface LinkProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  url: string;
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { url, children, className, ...props },
  ref,
) {
  return (
    <a
      href={url}
      ref={ref}
      className={clsx('dt-underline', className)}
      {...props}
    >
      {children}
    </a>
  );
});
