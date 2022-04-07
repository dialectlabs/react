import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import {
  useApi,
  ParsedErrorData,
  useDialect,
  getDialectAddressWithOtherMember,
} from '@dialectlabs/react';
import { H1, Input, P } from '../../../../../common/preflighted';
import { useTheme } from '../../../../../common/ThemeProvider';
import {
  Button,
  NetworkBadge,
  Toggle,
  useBalance,
  ValueRow,
} from '../../../../../common';
import clsx from 'clsx';
import { display } from '@dialectlabs/web3';
import { Lock, NoLock } from '../../../../../Icon';

interface CreateThreadProps {
  onNewThreadCreated?: (addr: string) => void;
  onCloseRequest?: () => void;
}

function ActionCaption({
  creationError,
  encrypted,
}: {
  encrypted: boolean;
  creationError: ParsedErrorData | null;
}) {
  const { textStyles } = useTheme();

  if (creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN') {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-2 dt-px-2')}>
        {creationError.message}
      </P>
    );
  }

  if (encrypted) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-left dt-mt-2 dt-px-2')}>
        ⚠️ Do not use a wallet with significant funds on it
      </P>
    );
  }

  return null;
}

export default function CreateThread({
  onNewThreadCreated,
  onCloseRequest,
}: CreateThreadProps) {
  const { createDialect, isDialectCreating, creationError, setDialectAddress } =
    useDialect();
  const { program, network, wallet } = useApi();
  const { balance } = useBalance();
  const { colors, outlinedInput, textStyles, icons } = useTheme();

  const [address, setAddress] = useState('');
  const [encrypted, setEncrypted] = useState(false);

  const createThread = async () => {
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
      });
  };

  return (
    <div className="dt-flex dt-flex-col dt-flex-1">
      <div className="dt-px-4 dt-py-4 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-font-bold dt-items-center">
        <div
          className="dt-cursor-pointer"
          onClick={() => {
            onCloseRequest?.();
          }}
        >
          <icons.back />
        </div>
        Send Message
        <div />
      </div>

      <div className="dt-h-full dt-pb-8 dt-max-w-sm dt-m-auto dt-flex dt-flex-col">
        <H1
          className={clsx(
            textStyles.h1,
            colors.primary,
            'dt-text-center dt-mb-4 dt-mt-4'
          )}
        >
          Create thread
        </H1>
        <Input
          className={clsx(outlinedInput, 'dt-w-full dt-mb-2')}
          placeholder="Enter recipient address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <ValueRow
          label={
            <>
              Balance ({wallet?.publicKey ? display(wallet?.publicKey) : ''}){' '}
              <NetworkBadge network={network} />
            </>
          }
          className={clsx('dt-w-full dt-mb-2')}
        >
          <span className="dt-text-right">{balance || 0} SOL</span>
        </ValueRow>
        <ValueRow
          label="Rent Deposit (recoverable)"
          className={clsx('dt-w-full')}
        >
          0.058 SOL
        </ValueRow>
        <P className={clsx(textStyles.body, 'dt-text-center dt-my-4')}>
          All messages are stored on chain, so to start this message thread,
          you&apos;ll need to deposit a small amount of rent. This rent is
          recoverable.
        </P>
        <div className="dt-flex dt-flex-row dt-gap-x-2 dt-w-full">
          <ValueRow
            label={
              encrypted ? (
                <span className="dt-flex dt-items-center">
                  <Lock className="dt-mr-1 dt-opacity-60" />
                  encrypted
                </span>
              ) : (
                <span className="dt-flex dt-items-center">
                  <NoLock className="dt-mr-1 dt-opacity-60" />
                  unencrypted
                </span>
              )
            }
            className="dt-flex-1"
          >
            <span className="dt-flex dt-items-center">
              <Toggle
                checked={encrypted}
                onClick={() => setEncrypted((enc) => !enc)}
              />
            </span>
          </ValueRow>
          <Button onClick={createThread} loading={isDialectCreating}>
            {isDialectCreating ? 'Creating...' : 'Create thread'}
          </Button>
        </div>
        <ActionCaption encrypted={encrypted} creationError={creationError} />
      </div>
    </div>
  );
}
