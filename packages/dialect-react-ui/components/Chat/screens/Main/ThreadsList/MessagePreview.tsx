import {
  Backend,
  LocalThreadMessage,
  ThreadId,
  useDialectSdk,
  useThread as useThreadInternal,
  useThreadMessages,
  useUnreadMessages,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { formatTimestamp } from '../../../../../utils/timeUtils';
import Avatar from '../../../../Avatar';
import { useTheme } from '../../../../common/providers/DialectThemeProvider';
import { DisplayAddress } from '../../../../DisplayAddress';
import MessageStatus from '../../../MessageStatus';
import { OnChainIndicator, UnreadMessagesBadge } from '../../../../common';
import { Encrypted } from '../../../../Icon';

type PropsType = {
  threadId: ThreadId;
  onClick: () => void;
  disabled?: boolean;
  selected?: boolean;
};

function FirstMessage({
  firstMessage,
  isEncrypted,
}: {
  firstMessage?: LocalThreadMessage;
  isEncrypted: boolean;
}) {
  const {
    info: { wallet },
  } = useDialectSdk();

  if (isEncrypted) {
    return (
      <div className="dt-text-sm dt-opacity-30 dt-italic dt-mb-2 dt-flex dt-items-center dt-space-x-1">
        <Encrypted className="dt-shrink-0" />
        <span className="dt-min-w-0 dt-truncate">Encrypted message</span>
      </div>
    );
  }

  return firstMessage ? (
    <div className="dt-max-w-full dt-text-sm dt-opacity-50 dt-mb-2 dt-flex dt-items-center dt-space-x-1">
      <span className="dt-min-w-0 dt-truncate">
        {firstMessage.author.publicKey.equals(wallet.publicKey!) && 'You: '}
        {firstMessage.text}
      </span>
    </div>
  ) : (
    <div className="dt-text-sm dt-opacity-30 dt-italic dt-mb-2 dt-flex dt-items-center dt-space-x-1">
      <span className="dt-min-w-0 dt-truncate">No messages yet</span>
    </div>
  );
}

export default function MessagePreview({
  threadId,
  onClick,
  disabled = false,
  selected = false,
}: PropsType): JSX.Element | null {
  const {
    info: {
      solana: { dialectProgram },
    },
  } = useDialectSdk();
  // TODO: ensure there is no re-renders
  const { thread } = useThreadInternal({ findParams: { id: threadId } });
  const { messages } = useThreadMessages({ id: threadId });
  const { unreadCount } = useUnreadMessages({
    otherMembers: thread?.otherMembers.map((m) => m.publicKey) ?? [],
  });
  const { colors } = useTheme();
  const [firstMessage] = messages ?? [];
  const connection = dialectProgram?.provider.connection;
  const recipient = thread?.otherMembers[0];
  const isOnChain = thread?.backend === Backend.Solana;

  if (!thread || !recipient) return null;

  const timestamp = !firstMessage?.isSending
    ? formatTimestamp(thread.updatedAt.getTime())
    : null;

  const otherMemberPk =
    thread.otherMembers[0] && thread.otherMembers[0].publicKey;

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
          {connection && otherMemberPk ? (
            <div className="dt-flex dt-items-center">
              <DisplayAddress publicKey={otherMemberPk} />
              {isOnChain && <OnChainIndicator />}
            </div>
          ) : null}
          <FirstMessage
            firstMessage={firstMessage}
            isEncrypted={thread.encryptionEnabled}
          />
        </div>
        <div className="dt-flex dt-flex-col dt-items-end dt-text-xs">
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
          <UnreadMessagesBadge amount={unreadCount} className="dt-mt-1" />
        </div>
      </div>
    </div>
  );
}
