import React, { useState } from 'react';
import * as anchor from '@project-serum/anchor';
import {
  useApi,
  ParsedErrorData,
  useDialect,
  getDialectAddressWithOtherMember,
  WalletName,
} from '@dialectlabs/react';
import clsx from 'clsx';
import IconButton from '../../../../../IconButton';
import { A, H1, Input, P } from '../../../../../common/preflighted';
import { useTheme } from '../../../../../common/ThemeProvider';
import {
  Button,
  NetworkBadge,
  Toggle,
  useBalance,
  ValueRow,
} from '../../../../../common';
import { display } from '@dialectlabs/web3';
import { Lock, NoLock } from '../../../../../Icon';

interface CreateThreadProps {
  inbox?: boolean;
  onNewThreadCreated?: (addr: string) => void;
  onCloseRequest?: () => void;
  onModalClose?: () => void;
}

function ActionCaption({
  creationError,
  encrypted,
}: {
  encrypted: boolean;
  creationError: ParsedErrorData | null;
}) {
  const { textStyles } = useTheme();
  const { walletName } = useApi();

  if (creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN') {
    return (
      <P className={clsx(textStyles.small, 'dt-text-red-500 dt-mt-2 dt-px-2')}>
        {creationError.message}
      </P>
    );
  }

  if (walletName !== WalletName.Sollet) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-left dt-mt-2 dt-px-2')}>
        Use{' '}
        <A
          href="https://www.sollet.io/"
          target="_blank"
          className="dt-underline"
        >
          Sollet.io
        </A>{' '}
        wallet to send encrypted messages.
      </P>
    );
  }

  if (encrypted) {
    return (
      <P className={clsx(textStyles.small, 'dt-text-left dt-mt-2 dt-px-2')}>
        ⚠️ Sollet.io encryption standards in the browser are experimental. Do
        not connect a wallet with significant funds in it.
      </P>
    );
  }

  return null;
}

export default function CreateThread({
  inbox,
  onNewThreadCreated,
  onCloseRequest,
  onModalClose,
}: CreateThreadProps) {
  const { createDialect, isDialectCreating, creationError, setDialectAddress } =
    useDialect();
  const { program, network, wallet, walletName } = useApi();
  const { balance } = useBalance();
  const { colors, outlinedInput, textStyles, icons } = useTheme();

  const [address, setAddress] = useState('');
  const [encrypted, setEncrypted] = useState(false);

  const createThread = async () => {
    createDialect(address, [true, true], [false, true], encrypted)
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
      <div className="dt-px-4 dt-pt-2 dt-pb-4 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-font-bold dt-items-center">
        <div
          className="dt-cursor-pointer"
          onClick={() => {
            onCloseRequest?.();
          }}
        >
          <icons.back />
        </div>
        Send Message
        <div>
          {!inbox && onModalClose && (
            <div className="sm:dt-hidden dt-ml-3">
              <IconButton icon={<icons.x />} onClick={onModalClose} />
            </div>
          )}
        </div>
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
                disabled={walletName !== WalletName.Sollet}
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
