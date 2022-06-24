import clsx from 'clsx';
import { LinkifiedText } from '../../../common';
import { P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';

type Props = {
  message: string;
  timestamp: number;
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export const Notification = ({ message, timestamp }: Props) => {
  const { colors, textStyles, notificationMessage, notificationTimestamp } =
    useTheme();
  return (
    <div
      className={clsx(
        'dt-flex dt-flex-col',
        colors.highlight,
        notificationMessage
      )}
    >
      <div className="dt-flex-1 dt-mb-2">
        <P
          className={clsx(
            textStyles.body,
            'dt-break-words dt-whitespace-pre-wrap dt-font-medium dt-text-base'
          )}
        >
          <LinkifiedText>{message}</LinkifiedText>
        </P>
      </div>
      <div className={notificationTimestamp}>
        <P className={clsx(textStyles.small, 'dt-opacity-60')}>
          {timeFormatter.format(timestamp)}
        </P>
      </div>
    </div>
  );
};
