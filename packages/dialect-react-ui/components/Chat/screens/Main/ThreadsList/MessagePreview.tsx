import { formatTimestamp } from '@dialectlabs/react';
import {
  useDialectSdk,
  useThread,
  useThreadMessages,
} from '@dialectlabs/react-sdk';
import type { Message } from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import { useMemo } from 'react';
import Avatar from '../../../../Avatar';
import { useTheme } from '../../../../common/providers/DialectThemeProvider';
import { DisplayAddress } from '../../../../DisplayAddress';
import MessageStatus from '../../../MessageStatus';

type PropsType = {
  dialectAddress: PublicKey;
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
  dialectAddress,
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
  const address = useMemo(() => dialectAddress, [dialectAddress?.toBase58()]);
  const findParams = useMemo(
    () => ({ address: dialectAddress }),
    [dialectAddress?.toBase58()]
  );
  const { thread } = useThread({ findParams });
  const { messages } = useThreadMessages({ address });
  const { colors } = useTheme();
  const [firstMessage] = messages ?? [];
  const connection = dialectProgram?.provider.connection;
  const recipient = thread?.otherMembers[0];

  // console.log('message preview', thread, recipient);

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
        <div className="dt-text-xs dt-opacity-30">
          {timestamp ? (
            timestamp
          ) : (
            <MessageStatus
              isSending={firstMessage?.isSending}
              error={firstMessage?.error?.message}
            />
          )}
        </div>
      </div>
    </div>
  );
}
