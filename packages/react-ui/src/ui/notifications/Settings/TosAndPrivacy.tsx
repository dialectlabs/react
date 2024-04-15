import clsx from 'clsx';
import { Link } from '../../core';
import { ClassTokens } from '../../theme';

export const TosAndPrivacy = () => (
  <div>
    <p
      className={clsx(
        ClassTokens.Text.Tertiary,
        'dt-text-center dt-text-caption',
      )}
    >
      By enabling notifications you agree to Dialect&apos;s{' '}
      <Link target="_blank" rel="noreferrer" url="https://www.dialect.to/tos">
        Terms of Service
      </Link>{' '}
      and{' '}
      <Link
        target="_blank"
        rel="noreferrer"
        url="https://www.dialect.to/privacy"
      >
        Privacy Policy
      </Link>
    </p>
  </div>
);
