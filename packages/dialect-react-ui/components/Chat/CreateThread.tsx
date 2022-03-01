import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useDialect } from '@dialectlabs/react';
import { useApi } from '@dialectlabs/react';
import { useTheme } from '../common/ThemeProvider';
import { Button, ValueRow } from '../common';
import { getDialectAddressWithOtherMember } from '@dialectlabs/react';
import cs from '../../utils/classNames';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export default function CreateThread({
  toggleCreate,
}: {
  toggleCreate: () => void;
}) {
  const { createDialect, isDialectCreating, creationError, setDialectAddress } =
    useDialect();
  const { program } = useApi();
  const { colors, input, textStyles } = useTheme();
  const [address, setAddress] = useState('');

  return (
    <div className="h-full pb-8 max-w-sm m-auto flex flex-col items-center justify-center">
      <h1 className={cs(textStyles.h1, colors.primary, 'text-center')}>
        Create thread
      </h1>
      <span className="text-xs mb-4 opacity-50">unencrypted</span>
      <input
        className={cs(input, 'w-full')}
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
              const [da, _] = await getDialectAddressWithOtherMember(
                program,
                new anchor.web3.PublicKey(address)
              );
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
