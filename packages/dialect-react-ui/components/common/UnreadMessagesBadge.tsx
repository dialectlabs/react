import { useTheme } from './providers/DialectThemeProvider';
import clsx from 'clsx';

interface Props {
  amount: number;
  className?: string;
}

export default function UnreadMessagesBadge({ amount, className }: Props) {
  const { textStyles, colors } = useTheme();

  return amount > 0 ? (
    <div
      className={clsx(
        'dt-w-5 dt-h-5 dt-rounded-full dt-flex dt-items-center dt-justify-center',
        textStyles.small,
        colors.notificationBadgeColor,
        className
      )}
    >
      {amount}
    </div>
  ) : null;
}
