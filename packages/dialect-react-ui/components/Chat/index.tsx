import React, {
  KeyboardEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useDialect, MessageType } from '@dialectlabs/react';
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function Header(props: {
  isReady: boolean;
  isCreateOpen: boolean;
  toggleCreate: () => void;
}) {
  const { colors, textStyles, header, icons } = useTheme();

  if (props.isCreateOpen) {
    return (
      <div className={cs('flex flex-row items-center', header)}>
        <IconButton
          icon={<icons.x />}
          onClick={props.toggleCreate}
          className="mr-2"
        />
        <span className={cs(textStyles.header, colors.accent)}>
          New thread
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

function CreateThread() {
  const { createDialect, isDialectCreating, creationError } = useDialect();
  const { colors, textStyles } = useTheme();

  return (
    <div className="h-full pb-8 max-w-sm m-auto flex flex-col items-center justify-center">
      <h1 className={cs(textStyles.h1, colors.accent, 'mb-4 text-center')}>
        Create thread
      </h1>
      <ValueRow
        highlighted
        label="Rent Deposit (recoverable)"
        className={cs('w-full mb-4')}
      >
        0.058 SOL
      </ValueRow>
      <p className={cs(textStyles.body, 'text-center mb-3')}>
        All messages are stored on chain, so to start this message thread, you&apos;ll need to deposit a small amount of rent. This rent is recoverable.
      </p>
      <Button
        onClick={() => createDialect().catch(noop)}
        loading={isDialectCreating}
      >
        {isDialectCreating ? 'Enabling...' : 'Enable notifications'}
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

function Compose(props: { toggleCreate: () => void }) {
  const {
    dialectAddress,
    deleteDialect,
    isDialectCreating,
    creationError,
    isDialectAvailable,
  } = useDialect();
  const { colors, textStyles, icons } = useTheme();

  const [text, setText] = useState<string>('');

  const onMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setCreating(true);
  };

  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      // setCreating(true);
    }
  };

  const disabled =
    text.length <= 0 ||
    text.length > 280 ||
    isDialectCreating ||
    isDialectAvailable;

  return (
    <div className="flex flex-col justify-between">
      <div className="mb-3">
        <p className={cs(textStyles.body, 'mb-1')}>Recipient address:</p>
      </div>
      <div>
        <MessageInput
          text={text}
          setText={setText}
          onSubmit={onMessageSubmit}
          onEnterPress={onEnterPress}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default function MessagesCenter(): JSX.Element {
  const {
    disconnectedFromChain,
    isWalletConnected,
    isMetadataAvailable,
    metadata,
  } = useDialect();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isNoSubscriptions, setIsNoSubscriptions] = useState(false);

  useEffect(() => {
    setSubscriptions(metadata?.subscriptions || []);
    setIsNoSubscriptions(
      metadata?.subscriptions?.length !== undefined &&
        metadata?.subscriptions?.length < 1
    );
  }, [metadata]);

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
  } else if (!isMetadataAvailable) {
    content = <CreateMetadata />;
  } else if (isCreateOpen) {
    content = <Compose toggleCreate={toggleCreate} />;
  } else if (isNoSubscriptions) {
    content = (
      <Centered>
        <icons.noNotifications className="mb-6" />
        <span className="opacity-60">No messages yet</span>
      </Centered>
    );
  } else {
    content = (
      <>
        {subscriptions.map((subscription: any) => JSON.stringify(subscription))}
      </>
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
        isReady={isWalletConnected && isMetadataAvailable}
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
