import { formatTimestamp } from '@dialectlabs/react';
import {
  useDialectSdk,
  useThread,
  useThreadMessages,
} from '@dialectlabs/react-sdk';
import type { Message, ThreadId } from '@dialectlabs/sdk';
import { Backend } from '@dialectlabs/sdk';
import clsx from 'clsx';
import { useMemo } from 'react';
import serializeThreadId from '../../../../../utils/serializeThreadId';
import Avatar from '../../../../Avatar';
import { useTheme } from '../../../../common/providers/DialectThemeProvider';
import { DisplayAddress } from '../../../../DisplayAddress';
import MessageStatus from '../../../MessageStatus';

type PropsType = {
  dialectId: ThreadId;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
};

function FirstMessage({
  isEncrypted,
  firstMessage,
}: {
  isEncrypted: boolean;
  firstMessage?: Message;
}) {
  const {
    info: { wallet },
  } = useDialectSdk();

  if (isEncrypted) {
    return (
      <div className="dt-text-sm dt-opacity-30 dt-italic dt-mb-2">
        Encrypted message
      </div>
    );
  }

  return firstMessage ? (
    <div className="dt-max-w-full dt-text-sm dt-opacity-50 dt-mb-2 dt-truncate">
      <span className="dt-opacity-50">
        {firstMessage.author.publicKey.equals(wallet.publicKey!) && 'You:'}
      </span>{' '}
      {firstMessage.text}
    </div>
  ) : (
    <div className="dt-text-sm dt-opacity-30 dt-italic dt-mb-2">
      No messages yet
    </div>
  );
}

export default function MessagePreview({
  dialectId,
  onClick,
  disabled = false,
  selected = false,
}: PropsType): JSX.Element | null {
  const {
    info: {
      solana: { dialectProgram },
    },
  } = useDialectSdk();
  // TODO: improve using of useMemo
  const findParams = useMemo(
    () => ({ id: dialectId }),
    [serializeThreadId(dialectId)]
  );
  const { thread } = useThread({ findParams });
  const { messages } = useThreadMessages(findParams);
  const { colors, textStyles } = useTheme();
  const [firstMessage] = messages ?? [];
  const connection = dialectProgram?.provider.connection;
  const recipient = thread?.otherMembers[0];

  if (!thread || !recipient) return null;

  const timestamp = formatTimestamp(thread.updatedAt.getTime());

  return (
    <div
      className={clsx(
        disabled ? 'dt-cursor-not-allowed' : 'dt-cursor-pointer',
        'dt-flex dt-space-x-2 dt-items-center dt-w-full dt-px-4 dt-py-2 dt-border-b dt-border-neutral-800 dt-select-none',
        selected ? colors.highlight : ' '
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="dt-flex">
        <Avatar publicKey={recipient.publicKey} size="regular" />
      </div>
      <div className="dt-flex dt-items-baseline dt-grow dt-justify-between dt-truncate dt-pr-2">
        <div className="dt-flex dt-flex-col dt-max-w-full dt-truncate">
          {connection && thread.otherMembers ? (
            <DisplayAddress
              connection={connection}
              otherMembers={thread.otherMembers}
            />
          ) : null}
          <FirstMessage
            isEncrypted={thread.encryptionEnabled}
            firstMessage={firstMessage}
          />
        </div>
        <div className="dt-flex dt-flex-col dt-space-y-1 dt-items-end dt-text-xs">
          <span className="dt-opacity-30">
            {timestamp ? (
              timestamp
            ) : (
              <MessageStatus
                isSending={firstMessage?.isSending}
                error={firstMessage?.error?.message}
              />
            )}
          </span>
          {thread.backend === Backend.Solana ? (
            <span
              className={clsx(
                textStyles.small,
                'dt-bg-green-900 dt-text-white dt-rounded-full dt-inline-flex dt-grow-0 dt-px-1.5 dt-py-0.5'
              )}
            >
              On-chain
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
