import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import { useDialect } from '@dialectlabs/react';
import { useApi } from '@dialectlabs/react';
import { Button, ValueRow } from '../common';
import { H1, Input, P } from '../common/preflighted';
import { useTheme } from '../common/ThemeProvider';
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
    <div className="dt-h-full dt-pb-8 dt-max-w-sm dt-m-auto dt-flex dt-flex-col dt-items-center dt-justify-center">
      <H1 className={cs(textStyles.h1, colors.primary, 'dt-text-center')}>
        Create thread
      </H1>
      <span className="dt-text-xs dt-mb-4 dt-opacity-50">unencrypted</span>
      <Input
        className={cs(input, 'dt-w-full')}
        placeholder="Recipient address"
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <div className="dt-h-4" />
      <ValueRow
        label="Rent Deposit (recoverable)"
        className={cs('dt-w-full dt-mb-4')}
      >
        0.058 SOL
      </ValueRow>
      <P className={cs('dt-text', textStyles.body, 'dt-text-center dt-mb-3')}>
        All messages are stored on chain, so to start this message thread,
        you&apos;ll need to deposit a small amount of rent. This rent is
        recoverable.
      </P>
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
        <P
          className={cs(
            textStyles.small,
            'dt-text-red-500 dt-text-center dt-mt-2'
          )}
        >
          {creationError.message}
        </P>
      )}
    </div>
  );
}
