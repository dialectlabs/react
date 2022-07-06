import { Dapp, DappAddress, useDappAddresses } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { Button, ValueRow } from '../common';
import { H1, Input, P, Textarea } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';
import ToastMessage from '../common/ToastMessage';

// utf8 bytes
const MESSAGE_BYTES_LIMIT = 1024;

interface BroadcastFormProps {
  dapp: Dapp;
}

const getUserCount = (addresses: DappAddress[]) => {
  // Users count = set of unique wallets, associated with enabled dapp addresses, associated with verified addresses
  const enabledAndVerified = addresses
    .filter((address) => address.enabled)
    .filter((address) => address.address.verified)
    .map((address) => address.address.wallet.publicKey.toBase58());
  return [...new Set(enabledAndVerified)].length;
};

function BroadcastForm({ dapp }: BroadcastFormProps) {
  const { addresses, isFetching: isFetchingAddresses } = useDappAddresses();
  const { textStyles, colors, outlinedInput } = useTheme();
  // Consider moving error handling to the useDapp context
  const [error, setError] = useState<Error | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const messageLength = useMemo(
    () => new TextEncoder().encode(message).length,
    [message]
  );

  const usersCount = useMemo(() => getUserCount(addresses), [addresses]);
  const noUsers = usersCount === 0;
  const isSubmitDisabled =
    !title || !message || messageLength > MESSAGE_BYTES_LIMIT || noUsers;
  let usersString = `${usersCount} user${usersCount > 1 ? 's' : ''}`;

  if (isFetchingAddresses) {
    usersString = 'Loading users...';
  } else if (noUsers) {
    usersString = 'No users yet';
  }

  const sendBroadcastMessage = async () => {
    setIsSending(true);
    try {
      await dapp.messages.send({ title, message });
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

  return (
    <div className="dt-flex dt-flex-col dt-space-y-2">
      <H1 className={clsx(textStyles.h1, colors.primary, 'dt-mb-4')}>
        Create broadcast
      </H1>
      <ValueRow label="📢 Broadcast" className="dt-w-full">
        {usersString}
      </ValueRow>
      <Input
        placeholder="Title"
        onChange={(e) => {
          setTitle(e.target.value);
        }}
        value={title}
        className={outlinedInput}
      />
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
