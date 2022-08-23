import clsx from 'clsx';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';

export default function LinkingCTA() {
  const { textStyles } = useTheme();
  return (
    <P
      className={clsx(
        textStyles.small,
        'dt-opacity-60 dt-text-white dt-text dt-mt-1 dt-px-2'
      )}
    >
      {'Link twitter '}
      <A
        href={'https://twitter.cardinal.so'}
        target="_blank"
        rel="noreferrer"
        className="dt-underline"
      >
        twitter.cardinal.so
      </A>
      {' and domain '}
      <A
        href={'https://naming.bonfida.org'}
        target="_blank"
        rel="noreferrer"
        className="dt-underline"
      >
        naming.bonfida.org
      </A>
    </P>
  );
}
