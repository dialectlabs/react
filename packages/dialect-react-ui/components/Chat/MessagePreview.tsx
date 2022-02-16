import React from 'react';
import { useApi } from '../../../dialect-react/components/ApiContext';
import { DialectAccount, formatTimestamp } from '@dialectlabs/react';
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
  console.log('dialect.dialect.members', dialect.dialect.members);
  const otherMembers = dialect?.dialect.members.filter(
    (member) => member.publicKey.toString() !== wallet?.publicKey?.toString()
  );
  const otherMembersStrs = otherMembers.map((member) =>
    display(member.publicKey)
  );
  const otherMemberStr = otherMembersStrs[0];

  const messages = dialect.dialect.messages || [];
  console.log('othermemberstr', otherMemberStr);
  console.log('messages', messages);

  return (
    <div className="flex space-x-2 items-center w-full cursor-pointer" onClick={onClick}>
      <Avatar publicKey={otherMembers[0].publicKey} size="regular" />
      <div
        className="flex grow border-b border-neutral-600 justify-between"
      >
        <div className="flex flex-col">
          {dialect?.dialect.members.length > 0 && <div>{otherMemberStr}</div>}
          {messages && messages?.length > 0 ? (
            <div className="text-sm text-gray-600 dark:text-black truncate overflow-ellipsis mb-2">
              <span className="opacity-50">
                {messages[0].owner.toString() === wallet?.publicKey?.toString()
                  ? 'You'
                  : display(messages[0].owner)}
                :
              </span>{' '}
              {messages[0].text}
            </div>
          ) : (
            <div className="opacity-30 italic mb-2">No messages yet</div>
          )}
        </div>
        <div className="text-xs text-neutral-600">{formatTimestamp(dialect.dialect.lastMessageTimestamp)}</div>
      </div>
    </div>
  );
}
