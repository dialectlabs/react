import clsx from 'clsx';
import { ReactNode } from 'react';
import { ClassTokens } from '../../theme';

export type BadgeVariant = 'default' | 'success' | 'error';

export interface BadgeProps {
  children: ReactNode | ReactNode[];
  variant?: BadgeVariant;
}

const variantClassMap: Record<BadgeVariant, string> = {
  default: clsx(
    ClassTokens.Text.Tertiary,
    ClassTokens.Background.BrandTransparent,
  ),
  success: clsx(
    ClassTokens.Text.Success,
    ClassTokens.Background.SuccessTransparent,
  ),
  error: clsx(
    ClassTokens.Text.Warning,
    ClassTokens.Background.WarningTransparent,
  ),
};

export const Badge = ({ variant = 'default', children }: BadgeProps) => {
  return (
    <span
      className={clsx(
        variantClassMap[variant],
        'dt-rounded-full dt-px-2.5 dt-py-0.5 dt-blur-xl',
      )}
    >
      {children}
    </span>
  );
};
