import React, { useCallback, useState } from 'react';
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

export type NotificationType = {
  name: string;
  detail: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function Header(props: {
  isReady: boolean;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}) {
  const { colors, textStyles, header, icons } = useTheme();

  if (props.isSettingsOpen) {
    return (
      <div className={cs('flex flex-row items-center', header)}>
        <IconButton
          icon={<icons.back />}
          onClick={props.toggleSettings}
          className="mr-2"
        />
        <span className={cs(textStyles.header, colors.accent)}>Settings</span>
      </div>
    );
  }
  return (
    <div className={cs('flex flex-row items-center justify-between', header)}>
      <span className={cs(textStyles.header, colors.accent)}>
        Notifications
      </span>
      {props.isReady ? (
        <IconButton icon={<icons.settings />} onClick={props.toggleSettings} />
      ) : null}
    </div>
  );
}

function CreateThread() {
  const { createDialect, isDialectCreating, creationError } = useDialect();
  const { colors, textStyles } = useTheme();

  return (
    <div className="h-full pb-8 max-w-sm m-auto flex flex-col items-center justify-center">
      <h1 className={cs(textStyles.h1, colors.accent, 'mb-4 text-center')}>
        Create notifications thread
      </h1>
      <ValueRow
        label="Rent Deposit (recoverable)"
        className={cs('w-full mb-4')}
      >
        0.058 SOL
      </ValueRow>
      <p className={cs(textStyles.body, 'text-center mb-1')}>
        To start this message thread, you&apos;ll need to deposit a small amount
        of rent, since messages are stored on-chain.
      </p>
      <p className={cs(textStyles.small, 'opacity-50 text-center mb-3')}>
        By creating this thread you agree to our{' '}
        <a
          className="underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.dialect.to/tos"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          className="underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.dialect.to/privacy"
        >
          Privacy Policy
        </a>
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

function EmailForm() {
  const { textStyles, input } = useTheme();
  const [email, setEmail] = useState('');
  const [isEmailSaving, setEmailSaving] = useState(false);
  const [isEmailSaved, setEmailSaved] = useState(false);
  const [isEmailEditing, setEmailEditing] = useState(true);
  const [isEmailDeleting, setEmailDeleting] = useState(false);
  const [emailError, setEmailError] = useState('');

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="flex flex-col space-y-2 mb-2">
        <input
          className={cs(input, textStyles.body, 'w-full basis-full')}
          placeholder="Enter email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={(e) =>
            e.target.checkValidity()
              ? setEmailError('')
              : setEmailError('Please enter correct email')
          }
          onInvalid={(e) => {
            e.preventDefault();
            setEmailError('Please enter correct email');
          }}
          disabled={isEmailSaved && !isEmailEditing}
        />
        {isEmailEditing ? (
          <Button
            className="basis-full"
            onClick={async () => {
              // TODO: validate & save email
              if (emailError) return;

              setEmailSaving(true);
              setTimeout(() => {
                setEmailSaving(false);
                setEmailSaved(true);
                setEmailEditing(false);
                setEmailDeleting(false);
              }, 2000);
            }}
            loading={isEmailSaving}
          >
            {isEmailSaving ? 'Saving...' : 'Save'}
          </Button>
        ) : (
          <div className="flex flex-row space-x-2">
            <Button
              className="basis-1/2"
              onClick={async () => {
                setEmailEditing(true);
              }}
              loading={isEmailSaving}
            >
              Edit
            </Button>
            <Button
              className="basis-1/2"
              onClick={async () => {
                // TODO: delete email association
                setEmailDeleting(true);
                setTimeout(() => {
                  setEmail('');
                  setEmailSaved(false);
                  setEmailEditing(true);
                  setEmailDeleting(false);
                }, 2000);
              }}
              loading={isEmailDeleting}
            >
              {isEmailDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        )}
      </div>
      {emailError ? (
        <p className={cs(textStyles.small, 'text-red-500 mt-2')}>
          {emailError}
        </p>
      ) : null}
      {!emailError && isEmailEditing ? (
        <p className={cs(textStyles.small, 'mb-1')}>
          You will receive confirmation email
        </p>
      ) : null}
    </form>
  );
}

function Settings(props: {
  toggleSettings: () => void;
  notifications: NotificationType[];
}) {
  const { dialectAddress, deleteDialect, isDialectDeleting, deletionError } =
    useDialect();
  const { colors, textStyles, icons } = useTheme();

  return (
    <>
      <div className="mb-3">
        <h2 className={cs(textStyles.bigText, 'mb-1')}>Email Notifications</h2>
        <EmailForm />
      </div>
      <div className="mb-3">
        <h2 className={cs(textStyles.h2, 'mb-1')}>Notifications</h2>
        {props.notifications
          ? props.notifications.map((type) => (
              <ValueRow
                key={type.name}
                label={type.name}
                className={cs('mb-1')}
              >
                {type.detail}
              </ValueRow>
            ))
          : 'No notification types supplied'}
      </div>
      <div>
        <h2 className={cs(textStyles.h2, 'mb-1')}>Thread Account</h2>
        {dialectAddress ? (
          <ValueRow
            label={
              <>
                <p className={cs(textStyles.small, 'opacity-60')}>
                  Account address
                </p>
                <p>
                  <a
                    target="_blank"
                    href={getExplorerAddress(dialectAddress)}
                    rel="noreferrer"
                  >
                    {display(dialectAddress)}↗
                  </a>
                </p>
              </>
            }
            className="mt-1 mb-4"
          >
            <div className="text-right">
              <p className={cs(textStyles.small, 'opacity-60')}>
                Deposited Rent
              </p>
              <p>0.058 SOL</p>
            </div>
          </ValueRow>
        ) : null}
        {dialectAddress ? (
          <>
            <BigButton
              className={colors.errorBg}
              onClick={async () => {
                await deleteDialect().catch(noop);
                // TODO: properly wait for the deletion
                props.toggleSettings();
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

export default function Notifications(props: {
  notifications?: NotificationType[];
}): JSX.Element {
  const {
    isWalletConnected,
    isDialectAvailable,
    isNoMessages,
    messages,
    disconnectedFromChain,
    cannotDecryptDialect,
  } = useDialect();

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = useCallback(
    () => setSettingsOpen(!isSettingsOpen),
    [isSettingsOpen, setSettingsOpen]
  );

  const { colors, modal, icons, notificationsDivider } = useTheme();

  let content: JSX.Element;

  if (disconnectedFromChain) {
    content = (
      <Centered>
        <icons.offline className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Lost connection to Solana blockchain</span>
      </Centered>
    );
  } else if (cannotDecryptDialect) {
    content = (
      <Centered>
        <icons.offline className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Cannot decrypt messages</span>
      </Centered>
    );
  } else if (!isWalletConnected) {
    content = (
      <Centered>
        <icons.notConnected className="mb-6 opacity-60" />
        <span className="opacity-60">Wallet not connected</span>
      </Centered>
    );
  } else if (!isDialectAvailable) {
    content = <CreateThread />;
  } else if (isSettingsOpen) {
    content = (
      <Settings
        toggleSettings={toggleSettings}
        notifications={props.notifications}
      />
    );
  } else if (isNoMessages) {
    content = (
      <Centered>
        <icons.noNotifications className="mb-6" />
        <span className="opacity-60">No notifications yet</span>
      </Centered>
    );
  } else {
    content = (
      <>
        {messages.map((message: MessageType) => (
          <>
            <Notification
              key={message.timestamp}
              message={message.text}
              timestamp={message.timestamp}
            />
            <Divider className={notificationsDivider} />
          </>
        ))}
      </>
    );
  }

  return (
    <div className="dialect h-full">
      <div
        className={cs(
          'flex flex-col h-full shadow-md overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <Header
          isReady={isWalletConnected && isDialectAvailable}
          isSettingsOpen={isSettingsOpen}
          toggleSettings={toggleSettings}
        />
        <Divider className="mx-2" />
        <div className="h-full py-2 px-4 overflow-y-scroll">{content}</div>
        <Footer />
      </div>
    </div>
  );
}
