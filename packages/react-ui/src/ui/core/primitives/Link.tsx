import clsx from 'clsx';
import { AnchorHTMLAttributes, DetailedHTMLProps, forwardRef } from 'react';
import { ClassTokens } from '../../theme';

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
      className={clsx(ClassTokens.Text.Brand, 'dt-underline', className)}
      {...props}
    >
      {children}
    </a>
  );
});
