import { Dapp, useDappAddresses } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useState } from 'react';
import { Button, ValueRow } from '../common';
import { H1, Input, P, Textarea } from '../common/preflighted';
import { useTheme } from '../common/providers/DialectThemeProvider';

interface BroadcastFormProps {
  dapp: Dapp;
}

function BroadcastForm({ dapp }: BroadcastFormProps) {
  const { addresses, isFetching: isFetchingAddresses } = useDappAddresses();
  const { textStyles, colors, outlinedInput, textArea } = useTheme();
  const [isSending, setIsSending] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

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
