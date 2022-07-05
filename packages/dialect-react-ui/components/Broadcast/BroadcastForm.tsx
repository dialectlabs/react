import { useDappAddresses } from '@dialectlabs/react-sdk';
import { useDapp } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useState } from 'react';
import { Button, Centered, ValueRow } from '../common';
import { A, H1, Input, P, Textarea } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';

function BroadcastForm() {
  const {
    dapp,
    isFetching: isFetchingDapp,
    errorFetching: errorFetchingDapp,
  } = useDapp();
  const { addresses, isFetching: isFetchingAddresses } = useDappAddresses();
  const { textStyles, colors, outlinedInput, textArea } = useTheme();
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  if (errorFetchingDapp) {
    return <Centered>Failed to load your dapps {errorFetchingDapp}</Centered>;
  }

  console.log(addresses, isFetchingAddresses);

  if (isFetchingDapp) {
    return <Centered>Loading your dapps...</Centered>;
  }

  if (!dapp) {
    return (
      <Centered>
        This wallet is not eligible for broadcasting, contact us through twitter
        <A href="https://twitter.com/saydialect" target="_blank">
          @saydialect
        </A>
      </Centered>
    );
  }

  const usersCount = addresses?.length || 0;
  const noUsers = usersCount === 0;
  const disabled = !title || !message || noUsers;
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
    } catch (error) {
      // TODO: setError
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="dt-flex dt-flex-col dt-space-y-2">
      <H1 className={clsx(textStyles.h1, colors.primary, 'dt-mb-4')}>
        Create broadcast {dapp.name}
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
          Limit: {message.length}/500
        </div>
      </div>

      <Button
        onClick={sendBroadcastMessage}
        loading={isSending}
        disabled={disabled}
      >
        {isSending ? 'Sending...' : 'Send'}
      </Button>
      <P>
        On-chain messages not currently supported by this dashboard. Please use
        the CLI to send broadcast messages on-chain.
      </P>
    </div>
  );
}

export default BroadcastForm;
