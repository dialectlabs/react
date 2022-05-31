import {
  useApi,
  DialectAccount,
  formatTimestamp,
  useDialect,
} from '@dialectlabs/react';
import clsx from 'clsx';
import { display } from '@dialectlabs/web3';
import type { Message } from '@dialectlabs/web3';
import Avatar from '../../../../Avatar';
import { useTheme } from '../../../../common/ThemeProvider';
import { DisplayAddress } from '../../../../DisplayAddress';
import { Divider } from '../../../../common';
import MessageStatus from '../../../MessageStatus';

type PropsType = {
  dialect: DialectAccount;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
};

function FirstMessage({
  isEncrypted,
  firstMessage,
}: {
  isEncrypted: boolean;
  firstMessage: Message;
}) {
  const { wallet } = useApi();

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
        {firstMessage.owner.toString() === wallet?.publicKey?.toString() &&
          'You:'}
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
  dialect,
  onClick,
  disabled = false,
  selected = false,
}: PropsType): JSX.Element {
  const { wallet, program } = useApi();
  const { colors } = useTheme();
  const otherMembers = dialect?.dialect.members.filter(
    (member) => member.publicKey.toString() !== wallet?.publicKey?.toString()
  );
  const { sendingMessagesMap } = useDialect();
  const sendingMessages =
    sendingMessagesMap[dialect?.publicKey.toBase58()] || [];
  const messages = [].concat(
    [...sendingMessages].reverse() || [],
    dialect.dialect.messages || []
  );
  const firstMessage = messages && messages?.length > 0 && messages[0];
  let timestamp = formatTimestamp(dialect.dialect.lastMessageTimestamp);
  if (firstMessage?.isSending || firstMessage?.error) {
    timestamp = null;
  }

  return (
    <div
      className={clsx(
        disabled ? 'dt-cursor-not-allowed' : 'dt-cursor-pointer',
        'dt-flex dt-space-x-2 dt-items-center dt-w-full dt-px-4 dt-py-2 dt-border-b dt-border-neutral-800',
        selected ? colors.highlight : ' '
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="dt-flex">
        <Avatar publicKey={otherMembers[0].publicKey} size="regular" />
      </div>
      <div className="dt-flex dt-grow dt-justify-between dt-truncate dt-pr-2">
        <div className="dt-flex dt-flex-col dt-max-w-full dt-truncate">
          {
            <DisplayAddress
              connection={program?.provider.connection}
              dialectMembers={dialect?.dialect.members}
            />
          }
          <FirstMessage
            isEncrypted={dialect.dialect.encrypted}
            firstMessage={firstMessage}
          />
        </div>
        <div className="dt-text-xs dt-opacity-30">
          {timestamp ? (
            timestamp
          ) : (
            <MessageStatus
              isSending={firstMessage?.isSending}
              error={firstMessage?.error}
            />
          )}
        </div>
      </div>
    </div>
  );
}
