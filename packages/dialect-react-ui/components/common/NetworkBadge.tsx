import clsx from 'clsx';
import { useTheme } from './providers/DialectThemeProvider';

export default function NetworkBadge({
  network = 'devnet',
}: {
  network?: string | null;
}) {
  const { textStyles, colors } = useTheme();
  let color = 'dt-text-green-600';
  if (network === 'devnet') {
    color = 'dt-text-yellow-600';
  }
  if (network === 'localnet') {
    color = 'dt-text-red-600';
  }
  return (
    <span
      className={clsx(
        'dt-py-0.5 dt-px-1 dt-rounded-sm',
        textStyles.small,
        colors.highlight,
        color
      )}
    >
      {network}
    </span>
  );
}
