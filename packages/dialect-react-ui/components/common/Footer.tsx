import { useTheme } from './providers/DialectThemeProvider';
import clsx from 'clsx';
import { A } from './preflighted';
import { DialectLogo } from '../Icon';

export default function Footer(): JSX.Element {
  const { colors } = useTheme();

  return (
    <div className="dt-flex dt-justify-center dt-py-3">
      <div
        className={clsx(
          'dt-px-3 dt-py-1 dt-inline-flex dt-items-center dt-justify-center dt-uppercase dt-rounded-full dt-text-[10px]',
          colors.highlightSolid
        )}
      >
        Powered by{' '}
        <A
          href="https://dialect.to"
          target="_blank"
          rel="noreferrer"
          className="hover:dt-text-inherit"
        >
          <DialectLogo className="dt-ml-[3px] -dt-mt-[1px]" />
        </A>
      </div>
    </div>
  );
}
