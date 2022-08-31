import { useTheme } from './providers/DialectThemeProvider';
import clsx from 'clsx';

interface Props {
  amount: number;
  className?: string;
}

export default function UnreadMessagesBadge({ amount, className }: Props) {
  const { textStyles } = useTheme();

  return amount > 0 ? (
    <div
      className={clsx(
        'dt-min-w-[1.25rem] dt-h-[1.25rem] dt-bg-white dt-text-black dt-rounded-full dt-flex dt-items-center dt-justify-center',
        textStyles.small,
        className
      )}
    >
      {amount}
    </div>
  ) : null;
}
