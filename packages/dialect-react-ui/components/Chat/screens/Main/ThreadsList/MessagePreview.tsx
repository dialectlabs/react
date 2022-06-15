import {
  useApi,
  DialectAccount,
  formatTimestamp,
  useDialect,
} from '@dialectlabs/react';
import clsx from 'clsx';
import type { Message } from '@dialectlabs/web3';
import Avatar from '../../../../Avatar';
import { DisplayAddress } from '../../../../DisplayAddress';
import MessageStatus from '../../../MessageStatus';
import { useTheme } from '../../../../common/providers/DialectThemeProvider';

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
  // TODO: refactor
  const { sendingMessagesMap } = useDialect();
  const sendingMessages =
    sendingMessagesMap[dialect?.publicKey.toBase58()] || [];
  const messages = [].concat(
    [...sendingMessages].reverse() || [],
    dialect.dialect.messages || []
  );
  const [firstMessage] = messages ?? [];
  let timestamp = formatTimestamp(dialect.dialect.lastMessageTimestamp);
  if (firstMessage?.isSending || firstMessage?.error) {
    timestamp = null;
  }
  const connection = program?.provider.connection;

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
        <Avatar publicKey={otherMembers[0].publicKey} size="regular" />
      </div>
      <div className="dt-flex dt-items-baseline dt-grow dt-justify-between dt-truncate dt-pr-2">
        <div className="dt-flex dt-flex-col dt-max-w-full dt-truncate">
          {connection ? (
            <DisplayAddress
              connection={connection}
              dialectMembers={dialect?.dialect.members}
            />
          ) : null}
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
