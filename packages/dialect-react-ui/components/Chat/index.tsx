import React, { useCallback, useEffect, useState } from 'react';
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

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function Header(props: {
  isReady: boolean;
  isComposeOpen: boolean;
  toggleCompose: () => void;
}) {
  const { colors, textStyles, header, icons } = useTheme();

  if (props.isComposeOpen) {
    return (
      <div className={cs('flex flex-row items-center', header)}>
        <IconButton
          icon={<icons.back />}
          onClick={props.toggleCompose}
          className="mr-2"
        />
        <span className={cs(textStyles.header, colors.accent)}>
          New message
        </span>
      </div>
    );
  }
  return (
    <div className={cs('flex flex-row items-center justify-between', header)}>
      <span className={cs(textStyles.header, colors.accent)}>Messages</span>
      {props.isReady ? (
        <IconButton icon={<icons.compose />} onClick={props.toggleCompose} />
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

function Compose(props: { toggleCompose: () => void }) {
  const {
    notificationsThreadAddress,
    deleteDialect,
    isDialectDeleting,
    deletionError,
  } = useDialect();
  const { colors, textStyles, icons } = useTheme();

  return (
    <>
      <div className="mb-3">
        <p className={cs(textStyles.body, 'mb-1')}>Included event types</p>
        <ul className={cs(textStyles.bigText, 'list-disc pl-6')}>
          <li>Welcome message on thread creation</li>
        </ul>
      </div>
      <div>
        <ValueRow label="Deposited Rent" className={cs('mb-1')}>
          0.058 SOL
        </ValueRow>
        <Divider />
        {notificationsThreadAddress ? (
          <>
            <ValueRow
              label="Notifications thread account"
              className="mt-1 mb-4"
            >
              <a
                target="_blank"
                href={getExplorerAddress(notificationsThreadAddress)}
                rel="noreferrer"
              >
                {display(notificationsThreadAddress)}↗
              </a>
            </ValueRow>
            <BigButton
              className={colors.errorBg}
              onClick={async () => {
                await deleteDialect().catch(noop);
                // TODO: properly wait for the deletion
                props.toggleCompose();
              }}
              heading="Withdraw rent & delete history"
              description="Events history will be lost forever"
              icon={<icons.trash />}
              loading={isDialectDeleting}
            />
            {deletionError &&
              deletionError.type !== 'DISCONNECTED_FROM_CHAIN' && (
                <p
                  className={cs(
                    textStyles.small,
                    'text-red-500 text-center mt-2'
                  )}
                >
                  {deletionError.message}
                </p>
              )}
          </>
        ) : null}
      </div>
    </>
  );
}

export default function MessagesCenter(): JSX.Element {
  const {
    disconnectedFromChain,
    isWalletConnected,
    isMetadataAvailable,
    metadata,
  } = useDialect();

  const [isComposeOpen, setComposeOpen] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isNoSubscriptions, setIsNoSubscriptions] = useState(false);

  useEffect(() => {
    setSubscriptions(metadata?.subscriptions || []);
    setIsNoSubscriptions(
      metadata?.subscriptions?.length !== undefined &&
        metadata?.subscriptions?.length < 1
    );
  }, [metadata]);

  const toggleCompose = useCallback(
    () => setComposeOpen(!isComposeOpen),
    [isComposeOpen, setComposeOpen]
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
  } else if (isComposeOpen) {
    content = <Compose toggleCompose={toggleCompose} />;
  } else if (isNoSubscriptions) {
    console.log('no subs yet');
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
        isComposeOpen={isComposeOpen}
        toggleCompose={toggleCompose}
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
