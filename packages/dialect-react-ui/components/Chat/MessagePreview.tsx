import React from 'react';
import { useApi, DialectAccount, formatTimestamp } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import Avatar from '../Avatar';

type PropsType = {
  dialect: DialectAccount;
  onClick: () => void;
};

export default function MessagePreview({
  dialect,
  onClick,
}: PropsType): JSX.Element {
  const { wallet } = useApi();
  const otherMembers = dialect?.dialect.members.filter(
    (member) => member.publicKey.toString() !== wallet?.publicKey?.toString()
  );
  const otherMembersStrs = otherMembers.map((member) =>
    display(member.publicKey)
  );
  const otherMemberStr = otherMembersStrs[0];

  const messages = dialect.dialect.messages || [];

  return (
    <div
      className="dt-flex dt-space-x-2 dt-items-center dt-w-full dt-cursor-pointer"
      onClick={onClick}
    >
      <div className="dt-flex">
        <Avatar publicKey={otherMembers[0].publicKey} size="regular" />
      </div>
      <div className="dt-flex grow dt-border-b dt-border-neutral-600 dt-justify-between dt-truncate">
        <div className="dt-flex dt-flex-col dt-max-w-full dt-truncate">
          {dialect?.dialect.members.length > 0 && <div>{otherMemberStr}</div>}
          {messages && messages?.length > 0 ? (
            <div className="dt-max-w-full dt-text-sm dt-opacity-50 dt-mb-2 dt-truncate">
              <span className="dt-opacity-50">
                {messages[0].owner.toString() ===
                  wallet?.publicKey?.toString() && 'You:'}
              </span>{' '}
              {messages[0].text}
            </div>
          ) : (
            <div className="dt-text-sm dt-opacity-30 dt-italic dt-mb-2">
              No messages yet
            </div>
          )}
        </div>
        <div className="dt-text-xs dt-opacity-30">
          {formatTimestamp(dialect.dialect.lastMessageTimestamp)}
        </div>
      </div>
    </div>
  );
}
