import React, {
  KeyboardEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDialect, MessageType } from '@dialectlabs/react';
import { useApi } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import {
  BigButton,
  Button,
  Centered,
  Divider,
  Footer,
  ValueRow,
} from '../common';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';
import { getExplorerAddress } from '../../utils/getExplorerAddress';
import IconButton from '../IconButton';
import { Notification } from './Notification';
import MessageInput from './MessageInput';
import MessagePreview from './MessagePreview';
import Avatar from '../Avatar';
import * as anchor from '@project-serum/anchor';
import { formatTimestamp, getDialectAddressWithOtherMember } from '@dialectlabs/react';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function Header(props: {
  isReady: boolean;
  isCreateOpen: boolean;
  toggleCreate: () => void;
}) {
  const { colors, textStyles, header, icons } = useTheme();
  const { dialect, dialectAddress, setDialectAddress } = useDialect();
  const { wallet } = useApi();

  if (props.isCreateOpen) {
    return (
      <div className={cs('flex flex-row items-center', header)}>
        <IconButton
          icon={<icons.x />}
          onClick={props.toggleCreate}
          className="mr-2"
        />
        <span className={cs(textStyles.header, colors.accent)}></span>
      </div>
    );
  } else if (dialectAddress) {
    const otherMembers =
      dialect?.dialect.members.filter(
        (member) =>
          member.publicKey.toString() !== wallet?.publicKey?.toString()
      ) || [];
    const otherMembersStrs = otherMembers.map((member) =>
      display(member.publicKey)
    );
    const otherMemberStr = otherMembers ? otherMembersStrs[0] : '';
    return (
      <div className={cs('relative flex flex-row items-center', header)}>
        <IconButton
          icon={<icons.back />}
          onClick={() => setDialectAddress('')}
          className="mr-2 absolute"
        />
        <span className={cs(textStyles.header, colors.accent)}>
          {otherMemberStr}
        </span>
      </div>
    );
  }

  return (
    <div className={cs('flex flex-row items-center justify-between', header)}>
      <span className={cs(textStyles.header, colors.accent)}>Messages</span>
      {props.isReady ? (
        <IconButton icon={<icons.compose />} onClick={props.toggleCreate} />
      ) : null}
    </div>
  );
}

function CreateMetadata() {
  const { createMetadata, isMetadataCreating, metadataCreationError } =
    useDialect();
  const { colors, textStyles } = useTheme();

  return (
    <div className="h-full pb-8 max-w-sm m-auto flex flex-col items-center justify-center">
      <h1 className={cs(textStyles.h1, colors.accent, 'mb-4 text-center')}>
        Create messages account
      </h1>
      <ValueRow
        highlighted
        label="Rent Deposit (recoverable)"
        className={cs('w-full mb-4')}
      >
        0.058 SOL
      </ValueRow>
      <p className={cs(textStyles.body, 'text-center mb-3')}>
        To start messaging, you&apos;ll need to deposit a small amount of rent
        in an account to keep track of the threads you create with other users.
      </p>
      <Button
        onClick={() => createMetadata().catch(noop)}
        loading={isMetadataCreating}
      >
        {isMetadataCreating ? 'Creating...' : 'Create messages account'}
      </Button>
      {/* Ignoring disconnected from chain error, since we show a separate screen in this case */}
      {metadataCreationError &&
        metadataCreationError.type !== 'DISCONNECTED_FROM_CHAIN' && (
          <p className={cs(textStyles.small, 'text-red-500 text-center mt-2')}>
            {metadataCreationError.message}
          </p>
        )}
    </div>
  );
}

function CreateThread({toggleCreate}: {toggleCreate: () => void}) {
  const { createDialect, isDialectCreating, creationError, setDialectAddress } =
    useDialect();
  const { program } = useApi();
  const { colors, textStyles } = useTheme();
  const [address, setAddress] = useState('');

  return (
    <div className="h-full pb-8 max-w-sm m-auto flex flex-col items-center justify-center">
      <h1 className={cs(textStyles.h1, colors.accent, 'mb-4 text-center')}>
        Create thread
      </h1>
      <input
        className="w-full text-xs text-neutral-400 dark:text-white bg-black rounded-md px-2 py-2 border-b border-neutral-600 focus:outline-none focus:ring focus:ring-white"
        placeholder="Recipient address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div className="h-4" />
      <ValueRow
        highlighted
        label="Rent Deposit (recoverable)"
        className={cs('w-full mb-4')}
      >
        0.058 SOL
      </ValueRow>
      <p className={cs(textStyles.body, 'text-center mb-3')}>
        All messages are stored on chain, so to start this message thread,
        you&apos;ll need to deposit a small amount of rent. This rent is
        recoverable.
      </p>
      <Button
        onClick={async () => {
          createDialect(address, [true, true], [false, true])
            .then(async () => {
              const [da, _] = await getDialectAddressWithOtherMember(program, new anchor.web3.PublicKey(address));
              setDialectAddress(da.toBase58());
              toggleCreate();
            })
            .catch((err) => {
              console.log('error creating dialect', err);
              noop();
            });
        }}
        loading={isDialectCreating}
      >
        {isDialectCreating ? 'Creating...' : 'Create thread'}
      </Button>
      {/* Ignoring disconnected from chain error, since we show a separate screen in this case */}
      {creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN' && (
        <p className={cs(textStyles.small, 'text-red-500 text-center mt-2')}>
          {creationError.message}
        </p>
      )}
    </div>
  );
}

function Thread() {
  const {
    dialectAddress,
    deleteDialect,
    isDialectCreating,
    creationError,
    isDialectAvailable,
    dialect,
    messages,
    sendMessage,
    sendingMessage,
  } = useDialect();
  const { wallet } = useApi();
  const { colors, textStyles, icons } = useTheme();

  const [text, setText] = useState<string>('');

  const onMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(text).then(() => setText('')).catch(noop);
  };

  const onEnterPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      await sendMessage(text).then(() => setText('')).catch(noop);
    }
  };
  const youCanWrite = dialect?.dialect.members.some(
    (m) => m.publicKey.equals(wallet?.publicKey) && m.scopes[1]
  );
  const disabled =
    text.length <= 0 ||
    text.length > 280 ||
    isDialectCreating ||
    sendingMessage;

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="py-2 overflow-y-auto flex flex-col flex-col-reverse space-y-2 space-y-reverse justify-start flex-col-reverse">
        {messages.map((message) => {

          const isYou =
            message.owner.toString() === wallet?.publicKey?.toString();

          if (isYou) {
            return (
              <div
                key={message.timestamp}
                className={'ml-10 flex flex-row items-center mb-2 justify-end'}
              >
                <div
                  className={
                    'max-w-full flex-row px-4 py-2 rounded-2xl bg-black border border-neutral-800'
                  }
                >
                  <div className={'items-end'}>
                    <div className={'break-words text-white text-sm text-right'}>
                      {message.text}
                    </div>
                    <div className={''}>
                      <div className={'text-neutral-600 text-xs'}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.timestamp}
              className={'flex flex-row mb-2'}
            >
              <div className={''}>
                <Avatar size="small" publicKey={message.owner} />
              </div>
              <div
                className={
                  'max-w-xs flex-row px-4 py-2 rounded-2xl border border-neutral-900 bg-neutral-900 flex-shrink'
                }
              >
                <div className={'text-left'}>
                  <div className={'text-white text-sm break-words'}>{message.text}</div>
                  <div className={'items-end border-neutral-900'}>
                    <div className={'text-neutral-600 text-xs text-right'}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );

          //     return (
          //     <div key={message.timestamp} className={`flex items-start space-x-3 ${message.owner.toString() === wallet?.publicKey.toString() && 'flex-row-reverse space-x-reverse'}`}>
          //     {/* <UserIcon className='w-7 h-7 bg-neutral-200 dark:bg-neutral-700 p-2 rounded-full'/> */}
          //     <div className={`flex flex-col ${message.owner.toString() === wallet?.publicKey.toString() && 'items-end'}`}>
          //       <div className='text-xs opacity-50'>{message.owner.toString() === wallet?.publicKey.toString() ? 'You' : display(message.owner)}</div>
          //       <div className={`flex break-word space-x-2 items-center text-sm text-neutral-800 dark:text-neutral-200 ${message.owner.toString() === wallet?.publicKey.toString() ? 'text-right ml-8' : 'mr-8'}`}>
          //         {message.text}
          //       </div>
          //     </div>
          //   </div>
          //   );
        })}
      </div>
      {youCanWrite && (
        <MessageInput
          text={text}
          setText={setText}
          onSubmit={onMessageSubmit}
          onEnterPress={onEnterPress}
          disabled={disabled}
        />
      )}
    </div>
  );
}

export default function MessagesCenter(): JSX.Element {
  const {
    disconnectedFromChain,
    isWalletConnected,
    isMetadataAvailable,
    messages,
    metadata,
    dialectAddress,
    dialects,
    setDialectAddress,
  } = useDialect();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isNoSubscriptions, setIsNoSubscriptions] = useState(false);

  useEffect(() => {
    setSubscriptions(dialects || []);
    setIsNoSubscriptions(dialects.length < 1);
  }, [dialects]);

  const toggleCreate = useCallback(
    () => setCreateOpen(!isCreateOpen),
    [isCreateOpen, setCreateOpen]
  );

  const { colors, popup, icons } = useTheme();

  let content: JSX.Element;

  if (disconnectedFromChain) {
    content = (
      <Centered>
        <icons.offline className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Lost connection to Solana blockchain</span>
      </Centered>
    );
  } else if (!isWalletConnected) {
    content = (
      <Centered>
        <icons.notConnected className="mb-6 opacity-60" />
        <span className="opacity-60">Wallet not connected</span>
      </Centered>
    );
  } else if (isCreateOpen) {
    content = <CreateThread toggleCreate={toggleCreate} />;
  } else if (isNoSubscriptions) {
    content = (
      <Centered>
        {/* <icons.noNotifications className="mb-6" /> */}
        <span className="opacity-60">No messages yet</span>
      </Centered>
    );
  } else if (dialectAddress) {
    content = <Thread />;
  } else {
    content = (
      <div className="flex flex-col space-y-2">
        {subscriptions.map((subscription: any) => (
          <MessagePreview
            key={subscription.publicKey.toBase58()}
            dialect={subscription}
            onClick={() => {
              console.log(
                'setting dialect address',
                subscription.publicKey.toBase58()
              );
              setDialectAddress(subscription.publicKey.toBase58());
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cs(
        'flex flex-col h-full shadow-md overflow-hidden',
        colors.primary,
        colors.bg,
        popup
      )}
    >
      <Header
        isReady={isWalletConnected}
        isCreateOpen={isCreateOpen}
        toggleCreate={toggleCreate}
      />
      <Divider className="mx-2" />
      <div className="h-full py-2 px-4 overflow-y-scroll">{content}</div>
      <Footer
        showBackground={Boolean(
          metadata?.subscriptions?.length && metadata?.subscriptions?.length > 4
        )}
      />
    </div>
  );
}
