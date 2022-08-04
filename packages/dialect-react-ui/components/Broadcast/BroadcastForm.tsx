import {
  AddressType,
  Dapp,
  DappAddress,
  DappNotificationSubscription,
  useDappAddresses,
  useDappNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Button, Loader, ValueRow } from '../common';
import { H1, Input, P, Textarea } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';
import ToastMessage from '../common/ToastMessage';

// utf8 bytes
const MESSAGE_BYTES_LIMIT = 800;
const TITLE_BYTES_LIMIT = 100;
const ADDRESSES_REFRESH_INTERVAL = 10000;

interface BroadcastFormProps {
  dapp: Dapp;
  headless?: boolean;
}

const getUsersCount = (
  addresses: DappAddress[],
  subscriptions: DappNotificationSubscription[],
  notificationTypeId?: string | null,
  addressTypePredicate: (addressType: AddressType) => boolean = () => true
) => {
  const enabledAndVerifiedAddresses = addresses
    .filter((address) => address.enabled)
    .filter((address) => address.address.verified)
    .filter((address) => addressTypePredicate(address.address.type));
  const enabledSubscriptionsPKs = subscriptions
    .filter(
      (sub) =>
        (sub.notificationType.id === notificationTypeId ||
          !notificationTypeId) &&
        sub.subscriptions.find((subscription) => subscription.config.enabled)
    )
    .flatMap((it) => it.subscriptions);
  const filtered = enabledSubscriptionsPKs.filter((subscription) =>
    enabledAndVerifiedAddresses.find((address) =>
      address.address.wallet.publicKey.equals(subscription.wallet.publicKey)
    )
  );
  return [...new Set(filtered.map((it) => it.wallet.publicKey.toBase58()))]
    .length;
};

const getAddressesCounts = (
  addresses: DappAddress[],
  subscriptions: DappNotificationSubscription[],
  notificationTypeId?: string | null
) => {
  const wallets = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (it) => it === AddressType.Wallet
  );
  const emails = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (it) => it === AddressType.Email
  );
  const phones = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (it) => it === AddressType.PhoneNumber
  );
  const telegrams = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (it) => it === AddressType.Telegram
  );
  return {
    wallets,
    emails,
    phones,
    telegrams,
  };
};

const getAddressesSummary = (
  addresses: DappAddress[],
  subscriptions: DappNotificationSubscription[],
  notificationTypeId?: string | null
) => {
  const { wallets, emails, phones, telegrams } = getAddressesCounts(
    addresses,
    subscriptions,
    notificationTypeId
  );
  return [
    wallets && `${wallets} wallet${wallets > 1 ? 's' : ''} (off-chain)`,
    emails && `${emails} email${emails > 1 ? 's' : ''}`,
    phones && `${phones} phone${phones > 1 ? 's' : ''}`,
    telegrams && `${telegrams} telegram account${telegrams > 1 ? 's' : ''}`,
  ]
    .filter(Boolean)
    .join(', ');
};

function BroadcastForm({ dapp, headless }: BroadcastFormProps) {
  const {
    subscriptions: notificationsSubscriptions,
    // isFetching: isFetchingNotificationSubscriptions,
    // errorFetching: errorFetchingNotificationSubscriptions,
  } = useDappNotificationSubscriptions();
  const [notificationTypeId, setNotificationTypeId] = useState<string | null>(
    notificationsSubscriptions[0]?.notificationType.id ?? null
  );
  const { addresses, isFetching: isFetchingAddresses } = useDappAddresses({
    refreshInterval: ADDRESSES_REFRESH_INTERVAL,
  });
  const { textStyles, colors, outlinedInput } = useTheme();
  // Consider moving error handling to the useDapp context
  const [error, setError] = useState<Error | null>(null);
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

  useEffect(() => {
    !notificationTypeId &&
      notificationsSubscriptions.length > 0 &&
      setNotificationTypeId(
        notificationsSubscriptions[0]?.notificationType.id ?? null
      );
  }, [notificationTypeId, notificationsSubscriptions]);

  const usersCount = useMemo(
    () =>
      getUsersCount(addresses, notificationsSubscriptions, notificationTypeId),
    [addresses, notificationTypeId, notificationsSubscriptions]
  );

  const addressesSummary = useMemo(
    () =>
      getAddressesSummary(
        addresses,
        notificationsSubscriptions,
        notificationTypeId
      ),
    [addresses, notificationsSubscriptions, notificationTypeId]
  );
  const noUsers = usersCount === 0;
  const isSubmitDisabled =
    !title ||
    !message ||
    messageLength > MESSAGE_BYTES_LIMIT ||
    titleLength > TITLE_BYTES_LIMIT ||
    noUsers;
  let usersInfo: ReactNode = `${usersCount} user${usersCount > 1 ? 's' : ''}`;

  if (isFetchingAddresses) {
    usersInfo = <Loader />;
  } else if (noUsers) {
    usersInfo = 'No users yet';
  }

  const sendBroadcastMessage = async () => {
    if (noUsers) {
      setError(new Error('No users in the audience for this broadcast'));
      return;
    }

    setIsSending(true);
    try {
      await dapp.messages.send({
        title,
        message,
        ...(notificationTypeId && { notificationTypeId }),
      });
      setTitle('');
      setMessage('');
      setError(null);
      setStatusMessage(
        'Broadcast successfully sent and will be delivered soon'
      );
    } catch (error) {
      setError(error as Error);
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
          <H1 className={clsx(textStyles.h1, colors.primary, 'dt-mb-4')}>
            Create broadcast
          </H1>
          <ValueRow label="Category" className="dt-w-full">
            <span>{renderNotificationTypeSelect()}</span>
          </ValueRow>
          <ValueRow label="📢 Broadcast users coverage" className="dt-w-full">
            <span title={addressesSummary}>{usersInfo}</span>
          </ValueRow>
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
        readOnly={isSubmitDisabled}
      >
        {isSending ? 'Sending...' : 'Send'}
      </Button>

      <P>
        On-chain messages not currently supported by this dashboard. Please use
        the CLI to send broadcast messages on-chain.
      </P>

      <ToastMessage
        message={
          error ? `Error sending broadcast: ${error.message}` : statusMessage
        }
        isError={Boolean(error)}
        isSuccess={Boolean(statusMessage)}
        onClose={() => {
          error ? setError(null) : setStatusMessage('');
        }}
      />
    </div>
  );
}

export default BroadcastForm;
