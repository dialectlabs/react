import React from 'react';
import { useApi, DialectAccount, formatTimestamp } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import { useTheme } from '../../../../common/ThemeProvider';
import Avatar from '../../../../Avatar';

type PropsType = {
  dialect: DialectAccount;
  onClick: () => void;
};

export default function MessagePreview({
  dialect,
  onClick,
}: PropsType): JSX.Element {
  const { divider } = useTheme();
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
      className="flex space-x-2 items-center w-full cursor-pointer"
      onClick={onClick}
    >
      <div className="flex">
        <Avatar publicKey={otherMembers[0].publicKey} size="regular" />
      </div>
      <div className="flex grow border-b border-neutral-600 justify-between truncate pr-2">
        <div className="flex flex-col max-w-full truncate">
          {dialect?.dialect.members.length > 0 && <div>{otherMemberStr}</div>}
          {messages && messages?.length > 0 ? (
            <div className="max-w-full text-sm opacity-50 mb-2 truncate">
              <span className="opacity-50">
                {messages[0].owner.toString() ===
                  wallet?.publicKey?.toString() && 'You:'}
              </span>{' '}
              {messages[0].text}
            </div>
          ) : (
            <div className="text-sm opacity-30 italic mb-2">
              No messages yet
            </div>
          )}
        </div>
        <div className="text-xs opacity-30">
          {formatTimestamp(dialect.dialect.lastMessageTimestamp)}
        </div>
      </div>
    </div>
  );
}
