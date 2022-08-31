import {
  Dapp,
  DialectSdkError,
  useDappNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import useDappAudience from '../../hooks/useDappAudience';
import { Button, Loader, ValueRow } from '../common';
import { H1, Input, P, Textarea } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';
import ToastMessage from '../common/ToastMessage';

// utf8 bytes
const GENERAL_BROADCAST = 'general-broadcast';
const MESSAGE_BYTES_LIMIT = 800;
const TITLE_BYTES_LIMIT = 100;

interface BroadcastFormProps {
  dapp: Dapp;
  headless?: boolean;
  notificationTypeId?: string;
}

function BroadcastForm({
  dapp,
  headless,
  notificationTypeId: notificationTypeIdExternal,
}: BroadcastFormProps) {
  const {
    subscriptions: notificationsSubscriptions,
    errorFetching: errorFetchingNotificationSubscriptions,
  } = useDappNotificationSubscriptions();
  const [notificationTypeId, setNotificationTypeId] = useState<string | null>(
    notificationsSubscriptions[0]?.notificationType.id ?? null
  );
  const { textStyles, colors, outlinedInput } = useTheme();
  // Consider moving error handling to the useDapp context
  const [errorMessage, setErrorMessage] = useState<string | undefined | null>(
    null
  );
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const textEncoder = useMemo(() => new TextEncoder(), []);
  const titleLength = useMemo(
    () => textEncoder.encode(title).length,
    [textEncoder, title]
  );
  const messageLength = useMemo(
    () => textEncoder.encode(message).length,
    [textEncoder, message]
  );

  useEffect(
    () => setErrorMessage(errorFetchingNotificationSubscriptions?.msg),
    [errorFetchingNotificationSubscriptions]
  );

  useEffect(() => {
    !notificationTypeId &&
      notificationsSubscriptions.length > 0 &&
      setNotificationTypeId(
        notificationsSubscriptions[0]?.notificationType.id ?? null
      );
  }, [notificationTypeId, notificationsSubscriptions]);

  useEffect(() => {
    setNotificationTypeId(notificationTypeIdExternal ?? null);
  }, [notificationTypeIdExternal]);

  const {
    totalCount: usersCount,
    summary: addressesSummary,
    isFetching: isLoadingAudience,
  } = useDappAudience({ notificationTypeId });

  const noUsers = usersCount === 0;
  const isSubmitDisabled =
    !title ||
    !message ||
    messageLength > MESSAGE_BYTES_LIMIT ||
    titleLength > TITLE_BYTES_LIMIT ||
    noUsers;
  let usersInfo: ReactNode = `${usersCount} user${usersCount > 1 ? 's' : ''}`;

  if (isLoadingAudience) {
    usersInfo = <Loader />;
  } else if (noUsers) {
    usersInfo = 'No users yet';
  }

  const sendBroadcastMessage = async () => {
    if (noUsers) {
      setErrorMessage('No users in the audience for this broadcast');
      return;
    }

    setIsSending(true);
    try {
      await dapp.messages.send({
        title,
        message,
        ...(notificationTypeId &&
          notificationTypeId !== GENERAL_BROADCAST && { notificationTypeId }),
      });
      setTitle('');
      setMessage('');
      setErrorMessage(null);
      setStatusMessage(
        'Broadcast successfully sent and will be delivered soon'
      );
    } catch (error) {
      const errMessage = (error as DialectSdkError)?.msg;
      setErrorMessage(errMessage);
    } finally {
      setIsSending(false);
    }
  };

  const renderNotificationTypeSelect = () => {
    if (!notificationsSubscriptions.length || !notificationTypeId) {
      return '📢 Broadcast';
    }

    if (notificationsSubscriptions.length === 1) {
      return notificationsSubscriptions[0]?.notificationType.name;
    }

    return (
      // TODO: create a preflighted version of select with :focus-visible and other default things, which is already configured for inputs and buttons
      <select
        value={notificationTypeId}
        className="dt-bg-transparent dt-text-inherit focus:dt-outline-0 dt-text-right"
        onChange={(event) => setNotificationTypeId(event.target.value)}
      >
        <option key="general-broadcast" value={GENERAL_BROADCAST}>
          📢 General broadcast
        </option>
        {notificationsSubscriptions.map(({ notificationType }) => (
          <option key={notificationType.id} value={notificationType.id}>
            {notificationType.name}
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="dt-flex dt-flex-col dt-space-y-2">
      {!headless ? (
        <>
          <H1 className={clsx(textStyles.h1, colors.textPrimary, 'dt-mb-4')}>
            Create broadcast
          </H1>
          <ValueRow label="Category" className="dt-w-full">
            <span>{renderNotificationTypeSelect()}</span>
          </ValueRow>
          <span title={addressesSummary}>
            <ValueRow label="📢 Broadcast users coverage" className="dt-w-full">
              <span>{usersInfo}</span>
            </ValueRow>
          </span>
        </>
      ) : null}
      <div>
        <Input
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          value={title}
          className={clsx(outlinedInput, 'dt-w-full dt-mb-1')}
        />
        <div className="dt-text-xs dt-pl-1 dt-opacity-50">
          Limit: {titleLength}/{TITLE_BYTES_LIMIT}
        </div>
      </div>
      <div>
        <Textarea
          placeholder="Write message..."
          onChange={(e) => {
            setMessage(e.target.value);
          }}
          value={message}
          // FIXME: add the outlined texarea class to the theme
          className={clsx(outlinedInput, 'dt-w-full dt-h-44')}
        />
        <div className="dt-text-xs dt-pl-1 dt-opacity-50">
          Limit: {messageLength}/{MESSAGE_BYTES_LIMIT}
        </div>
      </div>

      <Button
        onClick={sendBroadcastMessage}
        loading={isSending}
        disabled={isSubmitDisabled}
      >
        {isSending ? 'Sending...' : 'Send'}
      </Button>

      <P>
        On-chain messages not currently supported by this dashboard. Please use
        the CLI to send broadcast messages on-chain.
      </P>

      <ToastMessage
        message={
          errorMessage
            ? `Error sending broadcast: ${errorMessage}`
            : statusMessage
        }
        isError={Boolean(errorMessage)}
        isSuccess={Boolean(statusMessage)}
        onClose={() => {
          errorMessage ? setErrorMessage(null) : setStatusMessage('');
        }}
      />
    </div>
  );
}

export default BroadcastForm;
