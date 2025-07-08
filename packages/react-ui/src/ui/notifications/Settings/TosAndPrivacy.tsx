import clsx from 'clsx';
import { Link } from '../../core';
import { ClassTokens } from '../../theme';

export const TosAndPrivacy = () => (
  <div>
    <p className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}>
      <span className="dt-block">
        By using notifications you agree to Dialect&apos;s
      </span>
      <span className="dt-block">
        <Link
          target="_blank"
          rel="noreferrer"
          url="https://legal.dialect.to/tos"
        >
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link
          target="_blank"
          rel="noreferrer"
          url="https://legal.dialect.to/privacy"
        >
          Privacy Policy
        </Link>
      </span>
    </p>
  </div>
);
