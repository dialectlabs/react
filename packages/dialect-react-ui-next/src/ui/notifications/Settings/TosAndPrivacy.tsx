import clsx from 'clsx';
import { ClassTokens } from '../../theme';

export const TosAndPrivacy = () => (
  <div>
    <p className={clsx(ClassTokens.Text.Tertiary, 'dt-text-caption')}>
      By enabling notifications you agree to Dialect&apos;s{' '}
      <a
        className={clsx(ClassTokens.Text.Brand, 'dt-underline')}
        target="_blank"
        rel="noreferrer"
        href="https://www.dialect.to/tos"
      >
        Terms of Service
      </a>{' '}
      and{' '}
      <a
        className={clsx(ClassTokens.Text.Brand, 'dt-underline')}
        target="_blank"
        rel="noreferrer"
        href="https://www.dialect.to/privacy"
      >
        Privacy Policy
      </a>
    </p>
  </div>
);
