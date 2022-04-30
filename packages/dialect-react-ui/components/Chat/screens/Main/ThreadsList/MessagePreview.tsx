import { useApi, DialectAccount, formatTimestamp } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import Avatar from '../../../../Avatar';
import clsx from 'clsx';
import { DisplayAddress } from '../../../../DisplayAddress';

type PropsType = {
  dialect: DialectAccount;
  onClick: () => void;
  disabled?: boolean;
};

function FirstMessage({ dialect }: { dialect: DialectAccount }) {
  const { wallet } = useApi();
  const messages = dialect.dialect.messages || [];

  if (dialect.dialect.encrypted) {
    return (
      <div className="dt-text-sm dt-opacity-30 dt-italic dt-mb-2">
        Encrypted message
      </div>
    );
  }

  return messages && messages?.length > 0 ? (
    <div className="dt-max-w-full dt-text-sm dt-opacity-50 dt-mb-2 dt-truncate">
      <span className="dt-opacity-50">
        {messages[0].owner.toString() === wallet?.publicKey?.toString() &&
          'You:'}
      </span>{' '}
      {messages[0].text}
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
}: PropsType): JSX.Element {
  const { wallet, program } = useApi();
  const otherMembers = dialect?.dialect.members.filter(
    (member) => member.publicKey.toString() !== wallet?.publicKey?.toString()
  );

  return (
    <div
      className={clsx(
        disabled ? 'dt-cursor-not-allowed' : 'dt-cursor-pointer',
        'dt-flex dt-space-x-2 dt-items-center dt-w-full'
      )}
      onClick={!disabled ? onClick : undefined}
    >
      <div className="dt-flex">
        <Avatar publicKey={otherMembers[0].publicKey} size="regular" />
      </div>
      <div className="dt-flex dt-grow dt-border-b dt-border-neutral-600 dt-justify-between dt-truncate dt-pr-2">
        <div className="dt-flex dt-flex-col dt-max-w-full dt-truncate">
          {
            <DisplayAddress
              connection={program?.provider.connection}
              dialectMembers={dialect?.dialect.members}
            />
          }
          <FirstMessage dialect={dialect} />
        </div>
        <div className="dt-text-xs dt-opacity-30">
          {formatTimestamp(dialect.dialect.lastMessageTimestamp)}
        </div>
      </div>
    </div>
  );
}
