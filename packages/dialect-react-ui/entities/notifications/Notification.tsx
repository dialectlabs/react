import { AccountAddress, useIdentity } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { LinkifiedText } from '../../components/common';
import { Img, P } from '../../components/common/preflighted';
import { useTheme } from '../../components/common/providers/DialectThemeProvider';
import { shortenAddress } from '../../utils/displayUtils';

type Props = {
  author?: AccountAddress;
  message: string;
  timestamp: number | Date;
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const NotificationAuthor = ({ author }: { author: AccountAddress }) => {
  const { textStyles, notificationAuthor } = useTheme();
  const { identity } = useIdentity({ address: author });

  return (
    <div className={notificationAuthor}>
      <P
        className={clsx(
          'dt-flex dt-flex-row dt-items-center',
          textStyles.label
        )}
      >
        {identity?.additionals?.avatarUrl && (
          <Img
            className="dt-rounded-full dt-w-[1em] dt-h-[1em] dt-mr-1"
            alt={`dapp-${identity.name}`}
            src={identity.additionals.avatarUrl}
          />
        )}
        <span>{identity?.name || shortenAddress(author.toString())}</span>
      </P>
    </div>
  );
};

export const Notification = ({ author, message, timestamp }: Props) => {
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
      {author && <NotificationAuthor author={author} />}
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
