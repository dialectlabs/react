import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useDialect } from '@dialectlabs/react';
import { useApi } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import { Button, ValueRow } from '../../../../../common';
import { getDialectAddressWithOtherMember } from '@dialectlabs/react';
import clsx from 'clsx';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

interface CreateThreadProps {
  onNewThreadCreated?: (addr: string) => void;
  onCloseRequest?: () => void;
}

export default function CreateThread({
  onNewThreadCreated,
  onCloseRequest,
}: CreateThreadProps) {
  const { createDialect, isDialectCreating, creationError, setDialectAddress } =
    useDialect();
  const { program } = useApi();
  const { colors, input, textStyles, icons } = useTheme();
  const [address, setAddress] = useState('');

  return (
    <div className="dt-flex dt-flex-col dt-flex-1">
      <div className="dt-px-4 dt-py-4 dt-mb-2 dt-flex dt-justify-between dt-border-b dt-border-neutral-600 dt-font-bold">
        <div
          className="dt-cursor-pointer md:dt-hidden"
          onClick={() => {
            onCloseRequest?.();
          }}
        >
          <icons.back />
        </div>
        New thread
        <div />
      </div>

      <div className="dt-h-full dt-pb-8 dt-max-w-sm dt-m-auto dt-flex dt-flex-col dt-items-center dt-justify-center">
        <h1 className={clsx(textStyles.h1, colors.primary, 'dt-text-center')}>
          Create thread
        </h1>
        <span className="dt-text-xs dt-mb-4 dt-opacity-50">unencrypted</span>
        <input
          className={clsx(input, 'dt-w-full')}
          placeholder="Recipient address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <div className="dt-h-4" />
        <ValueRow
          label="Rent Deposit (recoverable)"
          className={clsx('dt-w-full dt-mb-4')}
        >
          0.058 SOL
        </ValueRow>
        <p className={clsx(textStyles.body, 'dt-text-center dt-mb-3')}>
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
                onNewThreadCreated?.(da.toBase58());
                onCloseRequest?.();
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
          <p
            className={clsx(
              textStyles.small,
              'dt-text-red-500 dt-text-center dt-mt-2'
            )}
          >
            {creationError.message}
          </p>
        )}
      </div>
    </div>
  );
}
